"""FastAPI entrypoint — Faz 3 sürümü.

Spec ref:
- yumeagency.md satır 102 (temel sunucu)
- yumeagency.md satır 114-119 (UI<->backend entegrasyonu)

Endpoints:
- GET  /health                       liveness
- GET  /brands                       list brands under /clients/
- GET  /agents                       5 ajan profili
- GET  /agents/status                tüm ajanların canlı durumu
- GET  /agents/{id}/status           tek ajan durumu
- POST /agents/{id}/chat             ajan'a mesaj at — mock async iş başlar
- GET  /messages                     son chat mesajları (toplantı odası akışı)
- POST /run/{brand}                  brand brifini al, full pipeline'ı çalıştır
"""
from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .agents import AGENT_PROFILES, AgentRunner
from .client_fs import list_brands, load_brief, save_output
from .config import LLM_MODE
from .models import AgentOutput, AgentProfile, AgentRole, AgentStatusSnapshot
from .state import STATE, is_busy, kick_off

app = FastAPI(title="Yume Creative Lab — Backend", version="0.3.0")

# Dev'de Next.js (3000) → FastAPI (8000) çağrıları için CORS açık.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "llm_mode": LLM_MODE}


@app.get("/brands")
def brands() -> dict[str, list[str]]:
    return {"brands": list_brands()}


@app.get("/agents", response_model=list[AgentProfile])
def agents() -> list[AgentProfile]:
    return list(AGENT_PROFILES.values())


@app.get("/agents/status", response_model=list[AgentStatusSnapshot])
def agents_status() -> list[AgentStatusSnapshot]:
    return STATE.all_snapshots()


@app.get("/agents/{agent_id}/status", response_model=AgentStatusSnapshot)
def agent_status(agent_id: AgentRole) -> AgentStatusSnapshot:
    if agent_id not in AGENT_PROFILES:
        raise HTTPException(status_code=404, detail=f"Unknown agent: {agent_id}")
    return STATE.snapshot(agent_id)


class ChatRequest(BaseModel):
    brand: str = "demo_brand"
    text: str


@app.post("/agents/{agent_id}/chat")
async def agent_chat(agent_id: AgentRole, req: ChatRequest) -> dict:
    if agent_id not in AGENT_PROFILES:
        raise HTTPException(status_code=404, detail=f"Unknown agent: {agent_id}")
    if is_busy(agent_id):
        raise HTTPException(status_code=409, detail="Agent meşgul, mevcut işi bekleyin.")
    STATE.push_message(agent_id, "user", req.text)
    kick_off(agent_id, req.brand, req.text)
    return {"ok": True, "agent_id": agent_id, "started": True}


@app.get("/messages")
def messages() -> dict:
    return {"messages": STATE.messages()}


@app.post("/run/{brand}", response_model=list[AgentOutput])
def run(brand: str) -> list[AgentOutput]:
    try:
        brief = load_brief(brand)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    pipeline: list[AgentRole] = ["writer", "seo", "visual", "ads", "lead"]
    outputs: list[AgentOutput] = []
    for agent_id in pipeline:
        runner = AgentRunner.for_role(agent_id)
        result = runner.run(brief, upstream=outputs)
        save_output(result)
        outputs.append(result)
    return outputs
