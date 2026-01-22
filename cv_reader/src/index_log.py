from __future__ import annotations

import csv
import json
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import List


@dataclass
class ApplicationRecord:
  timestamp: str
  company: str
  role: str
  lang: str
  job_text_path: str
  job_url: str
  output_dir: str
  files_generated: List[str]
  must_keywords: List[str]
  nice_keywords: List[str]
  resp_keywords: List[str]
  status: str = "draft"
  notes: str = ""


CSV_HEADERS = [
  "timestamp",
  "company",
  "role",
  "lang",
  "job_text_path",
  "job_url",
  "output_dir",
  "files_generated",
  "must_keywords",
  "nice_keywords",
  "resp_keywords",
  "status",
  "notes",
]


def append_to_index_csv(index_path: Path, rec: ApplicationRecord) -> None:
  index_path.parent.mkdir(parents=True, exist_ok=True)
  exists = index_path.exists()

  with index_path.open("a", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=CSV_HEADERS, extrasaction="ignore")

    if not exists:
      writer.writeheader()

    row = asdict(rec)
    row["files_generated"] = " | ".join(rec.files_generated)
    row["must_keywords"] = " | ".join(rec.must_keywords)
    row["nice_keywords"] = " | ".join(rec.nice_keywords)
    row["resp_keywords"] = " | ".join(rec.resp_keywords)

    writer.writerow(row)


def append_to_index_jsonl(index_path: Path, rec: ApplicationRecord) -> None:
  index_path.parent.mkdir(parents=True, exist_ok=True)
  with index_path.open("a", encoding="utf-8") as f:
    f.write(json.dumps(asdict(rec), ensure_ascii=False) + "\n")
