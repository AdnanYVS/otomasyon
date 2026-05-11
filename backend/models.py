"""Pydantic models shared across the backend.

Spec ref: yumeagency.md line 250 — "Ajanlar arası veri akışında tip güvenliği için Pydantic modelleri kullan."
"""
from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

AgentRole = Literal["writer", "seo", "visual", "ads", "lead"]
AgentStatus = Literal["idle", "working", "completed", "blocked"]


class Brief(BaseModel):
    """A brand brief loaded from /clients/<brand>/docs/."""

    brand: str
    title: str
    body: str
    tone_of_voice: str | None = None


class AgentProfile(BaseModel):
    """CrewAI-compatible agent definition.

    When the real `crewai` package is wired in (Faz 4) this maps 1:1 to
    `crewai.Agent(role=..., goal=..., backstory=...)`.
    """

    id: AgentRole
    name: str
    role: str
    goal: str
    backstory: str
    system_prompt: str


class AgentTask(BaseModel):
    agent_id: AgentRole
    description: str
    expected_output: str


class AgentOutput(BaseModel):
    agent_id: AgentRole
    brand: str
    task: str
    content: str
    artifacts: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AgentStatusSnapshot(BaseModel):
    id: AgentRole
    name: str
    status: AgentStatus
    task: str | None = None
    progress: int = 0
