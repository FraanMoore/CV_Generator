from __future__ import annotations

import re
from typing import Literal, Set, Tuple, List

from src.ai_client import chat_text
from src.job_extract import JobSignals
from src.io_json import CVMaster

LangMode = Literal["es", "en"]

SYSTEM = """You are an expert tech recruiter and resume writer.

Write a CV professional summary tailored to a job offer.

Strict rules:
- Do NOT invent experience or claim you know tools/tech you don't.
- The summary must be based on the CV content provided.
- Job keywords are suggestions: if a keyword is NOT in the CV skills/experience, you may mention it ONLY as a learning interest, using wording like:
  "Interested in learning: X" / "Motivated to learn: X" (never "experienced with", "skilled in", "proficient in").

Output format:
- 3-6 bullet points, plain text (no JSON).
- First 2-5 bullets: proven experience (from CV only).
- Do NOT write any learning or interest bullet. 
Only rewrite the proven experience bullets.
.
"""


# ----------------------------
# Allowed terms
# ----------------------------

def _norm(s: str) -> str:
    s = str(s).strip().lower()
    s = re.sub(r"\s+", " ", s)
    return s


def _collect_cv_terms(cv: CVMaster) -> Set[str]:
    """
    Build set of allowed terms from CV:
    - skills (core/apis/tooling)
    - experience.tags
    - bullets (es/en)
    """
    terms: Set[str] = set()

    skills = getattr(cv, "skills", None)
    if skills:
        for group in ("core", "apis", "tooling"):
            for item in getattr(skills, group, []) or []:
                terms.add(_norm(item))

    for exp in getattr(cv, "experience", []) or []:
        for t in getattr(exp, "tags", []) or []:
            terms.add(_norm(t))

        bullets = getattr(exp, "bullets", None)
        if bullets:
            for line in (getattr(bullets, "es", []) or []):
                terms.add(_norm(line))
            for line in (getattr(bullets, "en", []) or []):
                terms.add(_norm(line))

    # limpia vacíos
    return {t for t in terms if t}


def _split_keywords_by_cv_presence(signals: JobSignals, cv_terms: Set[str]) -> Tuple[List[str], List[str]]:
    """
    Split job keywords into:
    - present: present in CV
    - missing: not present -> can only be mentioned as "learning interest"
    """
    all_kw = list(dict.fromkeys(list(signals.must_keywords) + list(signals.nice_keywords)))
    present: List[str] = []
    missing: List[str] = []

    for kw in all_kw:
        nkw = _norm(kw)
        is_present = any(nkw in t or t in nkw for t in cv_terms)
        (present if is_present else missing).append(kw)

    return present, missing


# ----------------------------
# Validation 
# ----------------------------

_TOKEN_RE = re.compile(r"[A-Za-z][A-Za-z0-9\.\+\-/]{1,30}")

_STOP = {
    "and", "or", "the", "a", "an", "to", "of", "in", "for", "with", "on", "by",
    "de", "y", "o", "la", "el", "los", "las", "para", "con", "en", "por", "un", "una",
    "cv", "resume", "summary", "experience", "frontend", "backend", "software",
}


def _extract_candidate_tokens(text: str) -> Set[str]:
    return {_norm(t) for t in _TOKEN_RE.findall(text or "")}


def _contains_disallowed_terms(text: str, allowed: Set[str], learning_label: str) -> bool:
    """
    Returns True if there are disallowed terms in experience bullets.

    The learning-interest bullet (the one starting with `learning_label`)
    is allowed to contain missing job keywords.
    """
    lines = [ln.strip() for ln in (text or "").splitlines() if ln.strip()]

    for ln in lines:
        if ln.lower().lstrip("- ").startswith(learning_label.lower()):
            continue

        candidates = _extract_candidate_tokens(ln)
        for tok in candidates:
            if tok in _STOP:
                continue
            if tok not in allowed:
                return True

    return False

def _build_learning_bullet(
    missing_kw: list[str],
    lang: LangMode,
    max_items: int = 5,
) -> str | None:
    if not missing_kw:
        return None

    items = missing_kw[:max_items]

    if lang == "es":
        return f"- Interesada en aprender / profundizar: {', '.join(items)}"
    else:
        return f"- Interested in learning / growing in: {', '.join(items)}"


# ----------------------------
# Main
# ----------------------------

def build_summary_ai(cv: CVMaster, lang: LangMode, signals: JobSignals, model: str) -> str:
    base_lines = cv.summary.es if lang == "es" else cv.summary.en
    base_summary = "\n".join(f"- {line}" for line in base_lines)

    allowed_terms = _collect_cv_terms(cv)
    present_kw, missing_kw = _split_keywords_by_cv_presence(signals, allowed_terms)

    learning_label = "Interesada en aprender / profundizar" if lang == "es" else "Interested in learning / growing in"
    
    allowed_pretty = ", ".join(sorted(list(allowed_terms))[:80])

    user = f"""
    Language: {lang}

    Allowed terms from CV (DO NOT claim anything outside these terms):
    {allowed_pretty}

    CV base summary (source of truth):
    {base_summary}

    Job keywords already supported by CV (can be strengths):
    {present_kw}

    Job keywords NOT supported by CV (only mention as learning interests):
    {missing_kw}

    Task:
    Write 3-5 bullets.
    - Bullets 1-6: proven experience only (must be consistent with CV base summary).
    - Do NOT add technologies to experience bullets if they are not explicitly present in the CV.
    - Optional last bullet: start with "{learning_label}:" and list 3-6 items from missing keywords.
    Return only bullets as plain text.
    """

    text = chat_text(model=model, system=SYSTEM, user=user)
    out = (text or "").strip()

    if _contains_disallowed_terms(out, allowed_terms, learning_label):
        experience_part = base_summary.strip()
    else:
        experience_part = out

    learning_bullet = _build_learning_bullet(missing_kw, lang)

    if learning_bullet:
        return experience_part + "\n" + learning_bullet

    return experience_part
