"""Filesystem helpers for /clients/<brand>/{docs,outputs}.

Spec ref: yumeagency.md lines 24-31.
"""
from __future__ import annotations

from datetime import datetime
from pathlib import Path

from .config import CLIENTS_DIR
from .models import AgentOutput, Brief


def brand_root(brand: str) -> Path:
    return CLIENTS_DIR / brand


def docs_dir(brand: str) -> Path:
    return brand_root(brand) / "docs"


def outputs_dir(brand: str) -> Path:
    path = brand_root(brand) / "outputs"
    path.mkdir(parents=True, exist_ok=True)
    return path


def list_brands() -> list[str]:
    if not CLIENTS_DIR.exists():
        return []
    return sorted(p.name for p in CLIENTS_DIR.iterdir() if p.is_dir())


def load_brief(brand: str) -> Brief:
    docs = docs_dir(brand)
    if not docs.exists():
        raise FileNotFoundError(f"Brand '{brand}' has no docs/ folder at {docs}")
    brief_path = docs / "brief.md"
    if not brief_path.exists():
        raise FileNotFoundError(f"No brief.md under {docs}")

    raw = brief_path.read_text(encoding="utf-8")
    title, body, tone = _parse_brief(raw)
    return Brief(brand=brand, title=title or brand, body=body, tone_of_voice=tone)


def _parse_brief(raw: str) -> tuple[str, str, str | None]:
    """Very small markdown parser: first `# Heading` is title, `## Tone of voice` section is tone."""
    lines = raw.splitlines()
    title = ""
    tone: str | None = None
    body_lines: list[str] = []

    section: str | None = None
    for ln in lines:
        if ln.startswith("# ") and not title:
            title = ln[2:].strip()
            continue
        if ln.lower().startswith("## tone of voice"):
            section = "tone"
            continue
        if ln.startswith("## "):
            section = None
            body_lines.append(ln)
            continue
        if section == "tone":
            if ln.strip():
                tone = (tone + " " if tone else "") + ln.strip()
        else:
            body_lines.append(ln)

    body = "\n".join(body_lines).strip()
    return title, body, tone


def save_output(output: AgentOutput) -> Path:
    out_dir = outputs_dir(output.brand)
    stamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    path = out_dir / f"{stamp}_{output.agent_id}.md"
    path.write_text(_format_output(output), encoding="utf-8")
    return path


def _format_output(output: AgentOutput) -> str:
    return (
        f"# {output.agent_id} — {output.task}\n\n"
        f"- Marka: {output.brand}\n"
        f"- Oluşturulma: {output.created_at.isoformat()}\n\n"
        f"---\n\n{output.content}\n"
    )
