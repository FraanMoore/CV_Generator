from __future__ import annotations

import re
from typing import Any, Literal, List, Set

from src.ai_client import chat_text
from src.job_extract import JobSignals

LangMode = Literal["es", "en"]

SYSTEM = """You are an expert tech recruiter and resume writer.
Rewrite CV bullet points to better match a job posting.

HARD RULES (must follow):
- Do NOT add or invent technologies, tools, frameworks, companies, employers,
  metrics, or specific projects that are not already present in the original bullets.
- Do NOT invent responsibilities or experiences not described in the original.
- You MAY freely rephrase, reorder, and strengthen the language of ideas already present.
- Use stronger action verbs, clearer phrasing, and terminology from the job signals
  — as long as those terms describe what the original bullet already says.

OUTPUT RULES:
- Return ONLY bullet lines.
- Each line must start with "- ".
- Return exactly the same number of bullets as the input.
- Do not add headers, numbering, or commentary.
"""

_TECH_PATTERN = re.compile(
    r"\b("
    r"[A-Z][a-z]*(?:[A-Z][a-z]*)+|"
    r"[A-Z]{2,}(?:[A-Z0-9\.\-]+)?|"
    r"[a-z][a-z0-9]*(?:[\.\-][a-z0-9]+)+"
    r")\b"
)

print(_TECH_PATTERN.findall("Node.js"))

def _extract_tech_terms(text: str) -> Set[str]:
    """Extract only technical proper nouns from text."""
    return {m.lower() for m in _TECH_PATTERN.findall(text)}

def _build_allowed_tech(cv: Any, bullets_in: List[str]) -> Set[str]:
    allowed: Set[str] = set()

    # From CV skills
    skills = getattr(cv, "skills", None)
    if skills:
        for group in ("core", "apis", "tooling"):
            for item in getattr(skills, group, []) or []:
                allowed.update(_extract_tech_terms(str(item)))
                allowed.add(str(item).strip().lower())

    # From the original bullets themselves
    for b in bullets_in:
        allowed.update(_extract_tech_terms(b))

    return allowed

def _bullet_invents_tech(candidate: str, original: str, allowed: Set[str]) -> bool:
    candidate_terms = _extract_tech_terms(candidate)
    original_terms = _extract_tech_terms(original)
 
    new_terms = candidate_terms - original_terms
    
    for term in new_terms:
        if term not in allowed:
            return True
    return False

def tailor_bullets_ai(
    cv: Any,
    exp: Any,
    lang: LangMode,
    signals: JobSignals,
    model: str,
    bullets_in: List[str],
) -> List[str]:
    if not bullets_in:
        return []

    allowed_tech = _build_allowed_tech(cv, bullets_in)

    company = getattr(exp, "company", "")
    role_obj = getattr(exp, "role", None)
    role = ""
    if role_obj is not None:
        role = getattr(role_obj, "es", "") if lang == "es" else getattr(role_obj, "en", "")

    bullets_text = "\n".join(f"- {b}" for b in bullets_in)

    user = f"""Language: {lang}
Company: {company}
Role: {role}

Original bullets:
{bullets_text}

Job signals:
- must_keywords: {sorted(signals.must_keywords)}
- nice_keywords: {sorted(signals.nice_keywords)}
- responsibilities: {sorted(signals.resp_keywords)}

Task:
Rewrite the bullets to better reflect the job signals.
You may use terminology from the job signals to describe what is already in the original bullets.
Do NOT introduce technologies, tools, employers, or metrics not already present.
Return ONLY {len(bullets_in)} bullet lines starting with "- ".
"""

    out = chat_text(model=model, system=SYSTEM, user=user)
    lines = [ln.strip() for ln in out.splitlines() if ln.strip()]

    cleaned: List[str] = []
    for ln in lines:
        if ln.startswith("-"):
            ln = ln[1:].strip()
        elif ln.startswith("•"):
            ln = ln[1:].strip()
        if ln:
            cleaned.append(ln)

    # Reject response if it looks like prose/refusal rather than bullet points.
    # Heuristic: a valid response has at least half as many lines as expected.
    if len(cleaned) < max(1, len(bullets_in) // 2 + 1):
        print(
            f"[tailor_bullets] Rejected model response (got {len(cleaned)} lines, "
            f"expected {len(bullets_in)}): returning original bullets."
        )
        return bullets_in

    # Ensure same count
    if len(cleaned) < len(bullets_in):
        cleaned += bullets_in[len(cleaned):]
    cleaned = cleaned[: len(bullets_in)]

    final: List[str] = []
    for original, candidate in zip(bullets_in, cleaned):
        if _bullet_invents_tech(candidate, original, allowed_tech):
            # Fallback: keep original but log for visibility
            print(f"[tailor_bullets] Rejected (invented tech): {candidate!r}")
            final.append(original)
        else:
            final.append(candidate)

    return final