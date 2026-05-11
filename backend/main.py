"""FastAPI entrypoint — Faz 1 minimal surface.

Spec ref: yumeagency.md line 102 "FastAPI ile temel sunucuyu ayağa kaldır".

Endpoints:
- GET  /health                       basic liveness
- GET  /brands                       list brands under /clients/
- GET  /agents                       list the 5 agent profiles
- POST /run/{brand}                  run the full Faz 1 workflow on a brand
"""
from __future__ import annotations

from fastapi import FastAPI, HTTPException

from .agents import AGENT_PROFILES, AgentRunner
from .client_fs import list_brands, load_brief, save_output
from .config import LLM_MODE
from .models import AgentOutput, AgentProfile

app = FastAPI(title="Yume Creative Lab — Backend", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "llm_mode": LLM_MODE}


@app.get("/brands")
def brands() -> dict[str, list[str]]:
    return {"brands": list_brands()}


@app.get("/agents", response_model=list[AgentProfile])
def agents() -> list[AgentProfile]:
    return list(AGENT_PROFILES.values())


@app.post("/run/{brand}", response_model=list[AgentOutput])
def run(brand: str) -> list[AgentOutput]:
    try:
        brief = load_brief(brand)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    pipeline = ["writer", "seo", "visual", "ads", "lead"]
    outputs: list[AgentOutput] = []
    for agent_id in pipeline:
        runner = AgentRunner.for_role(agent_id)
        result = runner.run(brief, upstream=outputs)
        save_output(result)
        outputs.append(result)
    return outputs
