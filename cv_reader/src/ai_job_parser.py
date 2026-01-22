from __future__ import annotations

from dataclasses import dataclass
from typing import List

from src.ai_client import chat_json

@dataclass
class AIJobParse:
  role_title: str
  seniority: str
  must_have: List[str]
  nice_to_have: List[str]
  responsibilities: List[str]
  keywords: List[str]

SYSTEM = """You are an expert recruiter and software engineer.
Extract structured requirements from a job posting.
Return ONLY valid JSON. Do not include extra keys."""

def parse_job_offer(model: str, offer_text: str, lang_hint: str = "both") -> AIJobParse:
  user = f"""Job posting text:
---
{offer_text}
---

Language hint: {lang_hint}

Return JSON with keys:
role_title (string),
seniority (jr|mid|sr|unknown),
must_have (array of strings),
nice_to_have (array of strings),
responsibilities (array of strings),
keywords (array of strings).

Rules:
- must_have should be technologies/skills explicitly required.
- nice_to_have should be explicitly listed as a plus/preferred.
- keywords can include tools, domains, methodologies mentioned.
- Do not guess technologies that are not in the posting.
"""
  data = chat_json(model=model, system=SYSTEM, user=user)

  return AIJobParse(
    role_title=data.get("role_title", ""),
    seniority=data.get("seniority", "unknown"),
    must_have=data.get("must_have", []) or [],
    nice_to_have=data.get("nice_to_have", []) or [],
    responsibilities=data.get("responsibilities", []) or [],
    keywords=data.get("keywords", []) or [],
  )
