from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

from src.models import CVMaster

Lang = Literal["es", "en"]


@dataclass
class SummaryOutput:
  text: str


def build_summary(cv: CVMaster, lang: Lang) -> SummaryOutput:
  name = cv.profile.name
  title = cv.profile.title.es if lang == "es" else cv.profile.title.en
  contact_line = f"{cv.profile.contact.email} | {cv.profile.contact.phone}"

  summary_lines = cv.summary.es if lang == "es" else cv.summary.en

  text = "\n".join([
    f"{name} — {title}",
    contact_line,
    "",
    *summary_lines,
    "",
    "Skills:",
    ", ".join(cv.skills.core + cv.skills.apis + cv.skills.tooling),
  ])
  return SummaryOutput(text=text)
