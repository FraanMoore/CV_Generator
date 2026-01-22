from __future__ import annotations

import re
from typing import Any, Literal, List, Set

from src.ai_client import chat_text
from src.job_extract import JobSignals

LangMode = Literal["es", "en"]

SYSTEM = """You are an expert tech recruiter and resume writer.
Rewrite CV bullet points to better match a job posting.

HARD RULES (must follow):
- Do NOT add or invent technologies/tools/frameworks that are not in the Allowed Technologies list.
- Do NOT add experiences, projects, metrics, employers, or responsibilities not present in the original bullets.
- You may ONLY rephrase and reorder ideas already in the original bullets.
- Prefer stronger verbs and clarity, but keep meaning.

OUTPUT RULES:
- Return ONLY bullet lines.
- Each line must start with "- ".
- Return exactly the same number of bullets as the input.
"""

def _normalize_term(t: str) -> str:
    return re.sub(r"\s+", " ", t.strip().lower())

def _build_allowed_terms(cv, bullets_in: List[str]) -> Set[str]:
    allowed: Set[str] = set()

    # CV skills allowlist
    skills = getattr(cv, "skills", None)
    if skills:
        for group in ("core", "apis", "tooling"):
            for item in getattr(skills, group, []) or []:
                allowed.add(_normalize_term(str(item)))

    for b in bullets_in:
        for m in re.findall(r"[A-Za-z][A-Za-z0-9\.\+\-/]{1,30}", b):
            allowed.add(_normalize_term(m))

    return allowed

def _extract_candidate_terms(text: str) -> Set[str]:
    tokens = set(_normalize_term(t) for t in re.findall(r"[A-Za-z][A-Za-z0-9\.\+\-/]{1,30}", text))
    return tokens

def _contains_disallowed_terms(text: str, allowed: Set[str]) -> bool:
    candidates = _extract_candidate_terms(text)

    stop = {
        "and","or","the","a","an","to","of","in","for","with","on","by",
        "de","y","o","la","el","los","las","para","con","en","por","un","una"
    }

    for t in candidates:
        if t in stop:
            continue
        if t not in allowed:
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
    allowed_terms = _build_allowed_terms(cv, bullets_in)
    allowed_pretty = sorted({t for t in allowed_terms if len(t) > 1})[:200]  

    company = getattr(exp, "company", "")
    role_obj = getattr(exp, "role", None)
    role = ""
    company = getattr(exp, "company", "")
    role_obj = getattr(exp, "role", None)
    role = ""
    if role_obj is not None:
        role = getattr(role_obj, "es", "") if lang == "es" else getattr(role_obj, "en", "")

    bullets_text = "\n".join(f"- {b}" for b in bullets_in)

    user = f"""
Language: {lang}
Company: {company}
Role: {role}

Original bullets:
{bullets_text}

Job signals:
- must_keywords: {sorted(signals.must_keywords)}
- nice_keywords: {sorted(signals.nice_keywords)}
- responsibilities: {sorted(signals.resp_keywords)}

Task:
Rewrite the bullets to match the job signals BUT without adding any technology not in Allowed Technologies.
Return ONLY bullet lines.
"""

    out = chat_text(model=model, system=SYSTEM, user=user)
    lines = [ln.strip() for ln in out.splitlines() if ln.strip()]

    cleaned: List[str] = []
    for ln in lines:
        # normalize bullet
        if ln.startswith("-"):
            ln = ln[1:].strip()
        else:
            ln = ln.lstrip("•").strip()
        if ln:
            cleaned.append(ln)

    # insure same number of bullets
    if len(cleaned) < len(bullets_in):
        cleaned += bullets_in[len(cleaned):]
    cleaned = cleaned[:len(bullets_in)]

    final: List[str] = []
    for original, candidate in zip(bullets_in, cleaned):
        if _contains_disallowed_terms(candidate, allowed_terms):
            final.append(original)
        else:
            final.append(candidate)

    return final