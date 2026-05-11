"""Faz 1 acceptance test — spec line 105.

Reads a brand brief from /clients/<brand>/docs/brief.md, runs all 5 mock
agents sequentially (writer → seo → visual → ads → lead), writes each
agent's output to /clients/<brand>/outputs/.

Usage:
    python -m backend.hello_world demo_brand
"""
from __future__ import annotations

import argparse
import sys

from .agents import AGENT_PROFILES, AgentRunner
from .client_fs import load_brief, save_output
from .config import LLM_MODE


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Run the Faz 1 mock pipeline for a brand.")
    parser.add_argument("brand", help="Brand folder name under /clients/")
    args = parser.parse_args(argv)

    print(f"[hello_world] LLM mode: {LLM_MODE}")
    print(f"[hello_world] Brand: {args.brand}")

    try:
        brief = load_brief(args.brand)
    except FileNotFoundError as exc:
        print(f"[hello_world] ERROR: {exc}", file=sys.stderr)
        return 1

    print(f"[hello_world] Brief yüklendi: \"{brief.title}\"")

    pipeline = ["writer", "seo", "visual", "ads", "lead"]
    outputs = []
    for agent_id in pipeline:
        profile = AGENT_PROFILES[agent_id]
        print(f"[hello_world] → {profile.name} ({profile.role}) çalışıyor…")
        runner = AgentRunner(profile)
        result = runner.run(brief, upstream=outputs)
        path = save_output(result)
        print(f"[hello_world]   ✓ kaydedildi: {path.relative_to(path.parents[3])}")
        outputs.append(result)

    print(f"[hello_world] Tamamlandı. {len(outputs)} ajan çıktısı üretildi.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
