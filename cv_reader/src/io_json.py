import json
from pathlib import Path
from src.models import CVMaster


def load_cv_master(path: str) -> CVMaster:
  p = Path(path)
  if not p.exists():
    raise FileNotFoundError(f"File not found: {p}")
  data = json.loads(p.read_text(encoding="utf-8"))
  return CVMaster.model_validate(data)
