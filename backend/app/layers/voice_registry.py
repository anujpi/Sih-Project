"""
Voiceprint Registry

Stores speaker EMBEDDINGS (numeric vectors from Layer 2), never raw
audio. This is the "register your voice once" piece from VAANISHIELD's
product idea — a trusted contact or bank registers a voiceprint once,
and future calls get checked against it without needing a fresh
reference clip every time.

Storage: flat .npy files under backend/voiceprints/. Fine for an MVP/
demo — swap for a real database (with the name->embedding mapping,
never raw audio, for privacy) before any real deployment.
"""

import os
import numpy as np
import torch

REGISTRY_DIR = "voiceprints"
os.makedirs(REGISTRY_DIR, exist_ok=True)


def _path_for(name: str) -> str:
    # Basic sanitization — keep registry filenames predictable and safe.
    safe_name = "".join(c for c in name if c.isalnum() or c in ("-", "_")).strip()
    if not safe_name:
        raise ValueError("Name must contain at least one alphanumeric character.")
    return os.path.join(REGISTRY_DIR, f"{safe_name}.npy")


def save_voiceprint(name: str, embedding: torch.Tensor) -> None:
    np.save(_path_for(name), embedding.numpy())


def load_voiceprint(name: str) -> torch.Tensor | None:
    path = _path_for(name)
    if not os.path.exists(path):
        return None
    return torch.from_numpy(np.load(path))


def delete_voiceprint(name: str) -> bool:
    path = _path_for(name)
    if os.path.exists(path):
        os.remove(path)
        return True
    return False


def list_voiceprints() -> list[str]:
    if not os.path.isdir(REGISTRY_DIR):
        return []
    return sorted(
        f[:-4] for f in os.listdir(REGISTRY_DIR) if f.endswith(".npy")
    )