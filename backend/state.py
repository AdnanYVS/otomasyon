"""In-memory live state for agents + simple chat history.

Faz 3 için. Faz 4'te gerçek LLM/CrewAI'a bağlanınca bu basit durum makinesi
yerini gerçek görev kuyrugu ve event stream'lerine bırakır.
"""
from __future__ import annotations

import asyncio
import threading
import time
from datetime import datetime
from typing import Dict, List

from .agents import AgentRunner, get_profile
from .client_fs import save_output
from .models import AgentOutput, AgentRole, AgentStatusSnapshot, Brief


class ChatMessage:
    __slots__ = ("id", "agent_id", "role", "text", "ts")

    def __init__(self, mid: int, agent_id: AgentRole, role: str, text: str) -> None:
        self.id = mid
        self.agent_id = agent_id
        self.role = role  # "user" | "agent" | "system"
        self.text = text
        self.ts = datetime.utcnow().isoformat()

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "agent_id": self.agent_id,
            "role": self.role,
            "text": self.text,
            "ts": self.ts,
        }


class AgencyState:
    """Tek bir process içi paylaşılan durum. FastAPI tek worker'la çalışacak."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._snapshots: Dict[AgentRole, AgentStatusSnapshot] = {}
        self._messages: List[ChatMessage] = []
        self._mid = 0
        for role in ("writer", "seo", "visual", "ads", "lead"):
            profile = get_profile(role)  # type: ignore[arg-type]
            self._snapshots[profile.id] = AgentStatusSnapshot(
                id=profile.id,
                name=profile.name,
                status="idle",
                task=None,
                progress=0,
            )

    def snapshot(self, role: AgentRole) -> AgentStatusSnapshot:
        with self._lock:
            return self._snapshots[role].model_copy()

    def all_snapshots(self) -> List[AgentStatusSnapshot]:
        with self._lock:
            return [s.model_copy() for s in self._snapshots.values()]

    def update(self, role: AgentRole, **fields) -> None:
        with self._lock:
            cur = self._snapshots[role]
            updated = cur.model_copy(update=fields)
            self._snapshots[role] = updated

    def messages(self) -> List[dict]:
        with self._lock:
            return [m.to_dict() for m in self._messages[-200:]]

    def push_message(self, agent_id: AgentRole, role: str, text: str) -> dict:
        with self._lock:
            self._mid += 1
            msg = ChatMessage(self._mid, agent_id, role, text)
            self._messages.append(msg)
            return msg.to_dict()


STATE = AgencyState()


async def run_agent_task(
    agent_id: AgentRole,
    brand: str,
    user_prompt: str,
    duration_s: float = 6.0,
) -> AgentOutput:
    """Mock async iş — progress 0→100 yumuşak şekilde ilerler, sonra çıktı üretilir.

    Faz 4'te buranın içi gerçek CrewAI çağrısıyla değiştirilir.
    """
    profile = get_profile(agent_id)
    STATE.update(agent_id, status="working", task=f"{brand}: {profile.role}", progress=0)
    STATE.push_message(agent_id, "system", f"{profile.name} göreve başladı.")

    steps = 20
    for i in range(steps):
        await asyncio.sleep(duration_s / steps)
        progress = int((i + 1) / steps * 100)
        STATE.update(agent_id, progress=progress)

    # Mock LLM çıktısı üret
    runner = AgentRunner(profile)
    brief = Brief(brand=brand, title=user_prompt[:40], body=user_prompt)
    out = runner.run(brief, upstream=[])
    try:
        save_output(out)
    except OSError:
        pass

    STATE.update(agent_id, status="completed", progress=100)
    STATE.push_message(agent_id, "agent", out.content)
    return out


_BG_TASKS: Dict[AgentRole, asyncio.Task] = {}


def is_busy(agent_id: AgentRole) -> bool:
    t = _BG_TASKS.get(agent_id)
    return t is not None and not t.done()


def kick_off(agent_id: AgentRole, brand: str, user_prompt: str) -> None:
    """Schedule a non-blocking run for the agent if it's idle.

    Must be called from within a running event loop (async endpoint).
    """
    if is_busy(agent_id):
        return
    loop = asyncio.get_running_loop()
    _BG_TASKS[agent_id] = loop.create_task(
        run_agent_task(agent_id, brand, user_prompt)
    )
