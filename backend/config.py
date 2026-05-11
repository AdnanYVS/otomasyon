"""Runtime config + filesystem paths for Yume Creative Lab backend."""
from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

REPO_ROOT: Path = Path(__file__).resolve().parent.parent
CLIENTS_DIR: Path = REPO_ROOT / "clients"

LLM_MODE: str = os.getenv("YUME_LLM_MODE", "mock").lower()
