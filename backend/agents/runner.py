"""Lightweight agent runner — Faz 1 stand-in for CrewAI.

Each agent's `run()` builds the user prompt from a Brief + upstream outputs,
calls the configured LLM, and returns an AgentOutput. The orchestration
shape (Profile → Task → Output) mirrors CrewAI so Faz 4 swap is mechanical.
"""
from __future__ import annotations

from ..llm import LLMBackend, get_llm
from ..models import AgentOutput, AgentProfile, Brief
from .profiles import get_profile


class AgentRunner:
    def __init__(self, profile: AgentProfile, llm: LLMBackend | None = None) -> None:
        self.profile = profile
        self.llm = llm or get_llm()

    @classmethod
    def for_role(cls, agent_id: str, llm: LLMBackend | None = None) -> "AgentRunner":
        return cls(get_profile(agent_id), llm)

    def run(self, brief: Brief, upstream: list[AgentOutput] | None = None) -> AgentOutput:
        user_prompt = self._build_user_prompt(brief, upstream or [])
        content = self.llm.complete(self.profile.system_prompt, user_prompt)
        return AgentOutput(
            agent_id=self.profile.id,
            brand=brief.brand,
            task=self.profile.role,
            content=content,
        )

    def _build_user_prompt(self, brief: Brief, upstream: list[AgentOutput]) -> str:
        parts: list[str] = [
            f"Marka: {brief.brand}",
            f"Başlık: {brief.title}",
            f"Brifing:\n{brief.body}",
        ]
        if brief.tone_of_voice:
            parts.append(f"Tone of voice: {brief.tone_of_voice}")
        for prev in upstream:
            parts.append(f"\n--- {prev.agent_id} çıktısı ---\n{prev.content}")
        return "\n\n".join(parts)
