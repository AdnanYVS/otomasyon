"""Deterministic stand-in for a real LLM call.

Returns a clearly-marked placeholder so downstream consumers can tell mock
output apart from real generations.
"""
from __future__ import annotations


class MockLLM:
    def complete(self, system_prompt: str, user_prompt: str) -> str:
        role_line = system_prompt.strip().splitlines()[0] if system_prompt.strip() else "agent"
        return (
            f"[MOCK ÇIKTI — {role_line}]\n\n"
            f"Brifing alındı:\n{user_prompt.strip()}\n\n"
            f"Bu çıktı Faz 1 mock LLM'inden geldi. Gerçek üretim Faz 4'te aktif olacak."
        )
