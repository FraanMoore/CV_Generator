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


SYSTEM = """You are an expert technical recruiter and software engineer.
Extract structured requirements from a job posting.

EXTRACTION RULES:
- must_have: atomic terms only — individual technologies, languages, frameworks, or tools
  that are explicitly required. One term per item. Examples: "TypeScript", "ASP.NET", "MS SQL".
- nice_to_have: same format — atomic terms explicitly listed as preferred/bonus.
- responsibilities: short action phrases (verb + object) describing what the role does.
  Examples: "design REST APIs", "review pull requests", "implement authentication flows".
  Do NOT copy full sentences from the posting.
- keywords: domain concepts, methodologies, certifications, or industry terms that appear
  in the posting but don't fit the above categories.
  Examples: "HIPAA", "Agile", "CI/CD", "fintech", "payments orchestration".
  Do NOT repeat terms already in must_have or nice_to_have.
- seniority: infer from the posting — use jr, mid, sr, or unknown.

Return ONLY valid JSON. No extra keys. No markdown. No explanation."""


def _coerce_str_list(value: object) -> List[str]:
    """Ensure a value is a flat list of non-empty strings."""
    if not isinstance(value, list):
        return []
    result = []
    for item in value:
        if isinstance(item, str) and item.strip():
            result.append(item.strip())
        elif isinstance(item, dict):
            # Model occasionally returns {"name": "X"} — extract any string value
            for v in item.values():
                if isinstance(v, str) and v.strip():
                    result.append(v.strip())
                    break
    return result


def parse_job_offer(
    model: str,
    offer_text: str,
    lang_hint: str = "both",
) -> AIJobParse:
    lang_instruction = {
        "es": "Extract and return all terms in Spanish.",
        "en": "Extract and return all terms in English.",
        "both": "Extract terms in the language they appear in the posting.",
    }.get(lang_hint, "Extract terms in the language they appear in the posting.")

    user = f"""Job posting:
---
{offer_text}
---

Language instruction: {lang_instruction}

Return JSON with exactly these keys:
{{
  "role_title": string,
  "seniority": "jr" | "mid" | "sr" | "unknown",
  "must_have": [atomic skill/tool strings],
  "nice_to_have": [atomic skill/tool strings],
  "responsibilities": [short action phrases],
  "keywords": [domain/methodology terms not in must_have or nice_to_have]
}}
"""

    data = chat_json(model=model, system=SYSTEM, user=user)

    return AIJobParse(
        role_title=str(data.get("role_title") or "").strip(),
        seniority=str(data.get("seniority") or "unknown").strip(),
        must_have=_coerce_str_list(data.get("must_have")),
        nice_to_have=_coerce_str_list(data.get("nice_to_have")),
        responsibilities=_coerce_str_list(data.get("responsibilities")),
        keywords=_coerce_str_list(data.get("keywords")),
    )