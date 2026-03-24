import json
from pathlib import Path
from src.models import CVMaster


def load_cv_master(path: str) -> CVMaster:
  p = Path(path)
  if not p.exists():
    raise FileNotFoundError(f"File not found: {p}")
  data = json.loads(p.read_text(encoding="utf-8"))
  return CVMaster.model_validate(data)


def save_cv_master(path: str, cv: CVMaster) -> None:
  """Serialize and save a CVMaster instance to JSON file (utf-8)."""
  p = Path(path)
  p.parent.mkdir(parents=True, exist_ok=True)
  payload = cv.model_dump()
  p.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
