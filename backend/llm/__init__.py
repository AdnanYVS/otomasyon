"""LLM backends. Phase 1 ships only the mock; real providers land in Faz 4."""
from .base import LLMBackend
from .mock import MockLLM

__all__ = ["LLMBackend", "MockLLM", "get_llm"]


def get_llm() -> LLMBackend:
    from ..config import LLM_MODE

    if LLM_MODE == "mock":
        return MockLLM()
    raise NotImplementedError(
        f"LLM mode '{LLM_MODE}' will be wired in Faz 4. "
        "Set YUME_LLM_MODE=mock for now."
    )
