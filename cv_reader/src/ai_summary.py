from __future__ import annotations

import re
from typing import Literal, Set, Tuple, List

from src.ai_client import chat_text
from src.job_extract import JobSignals
from src.io_json import CVMaster

LangMode = Literal["es", "en"]

# El system prompt tiene UN solo trabajo: escribir bullets de experiencia probada.
# El learning bullet se construye en Python, no en el modelo.
SYSTEM = """You are an expert tech recruiter and resume writer.

Write a professional CV summary tailored to a job offer.

STRICT RULES:
- Base the summary ONLY on the CV experience and skills provided.
- Do NOT invent technologies, tools, employers, metrics, or responsibilities.
- Do NOT claim proficiency in anything not explicitly listed in the CV context.
- Do NOT write a learning or interests bullet — that will be added separately.
- Use strong action language to describe what is genuinely in the CV.

OUTPUT FORMAT:
- 3 to 5 bullet points, plain text.
- Each bullet starts with "- ".
- No headers, no JSON, no commentary.
"""


# ── Allowed tech terms (for validation only) ──────────────────────────────────

_TECH_PATTERN = re.compile(
    r"\b("
    r"[A-Z][a-z]*(?:[A-Z][a-z]*)+|"       # CamelCase: TypeScript, FastAPI
    r"[A-Z]{2,}(?:[A-Z0-9\.\-]+)?|"        # Acronyms: SQL, HIPAA, ASP.NET
    r"[a-z][a-z0-9]*(?:[\.\-][a-z0-9]+)+"  # dotted/hyphenated: react-hook-form
    r")\b"
)

def _extract_tech_terms(text: str) -> Set[str]:
    return {m.lower() for m in _TECH_PATTERN.findall(text or "")}

def _collect_cv_tech_terms(cv: CVMaster) -> Set[str]:
    """Collect only technical proper nouns from skills and experience."""
    terms: Set[str] = set()

    skills = getattr(cv, "skills", None)
    if skills:
        for group in ("core", "backend", "apis", "tooling"):
            for item in getattr(skills, group, []) or []:
                terms.update(_extract_tech_terms(str(item)))
                terms.add(str(item).strip().lower())

    for exp in getattr(cv, "experience", []) or []:
        for tag in getattr(exp, "tags", []) or []:
            terms.update(_extract_tech_terms(str(tag)))
        bullets_obj = getattr(exp, "bullets", None)
        if bullets_obj:
            for line in (getattr(bullets_obj, "es", []) or []):
                terms.update(_extract_tech_terms(line))
            for line in (getattr(bullets_obj, "en", []) or []):
                terms.update(_extract_tech_terms(line))

    return {t for t in terms if t}


# ── Keyword classification ─────────────────────────────────────────────────────

def _split_keywords_by_cv_presence(
    signals: JobSignals,
    cv_terms: Set[str],
) -> Tuple[List[str], List[str]]:
    """
    Split job keywords into present/missing using whole-word matching only.
    Avoids substring false positives (e.g. "sql" inside "consulting").
    """
    all_kw = list(dict.fromkeys(
        list(signals.must_keywords) + list(signals.nice_keywords)
    ))
    present: List[str] = []
    missing: List[str] = []

    for kw in all_kw:
        kw_terms = _extract_tech_terms(kw) or {kw.strip().lower()}
        # A keyword is "present" only if ALL its tech terms appear in cv_terms
        if kw_terms and kw_terms.issubset(cv_terms):
            present.append(kw)
        else:
            missing.append(kw)

    return present, missing


# ── Summary context builder ───────────────────────────────────────────────────

def _build_experience_context(cv: CVMaster, lang: LangMode) -> str:
    """Build a rich experience context from bullets — better source than base summary."""
    blocks = []
    for exp in (getattr(cv, "experience", []) or [])[:3]:
        role_obj = getattr(exp, "role", None)
        role = ""
        if role_obj:
            role = getattr(role_obj, "es" if lang == "es" else "en", "") or ""
        company = getattr(exp, "company", "")
        bullets_obj = getattr(exp, "bullets", None)
        bullets = []
        if bullets_obj:
            bullets = getattr(bullets_obj, lang, []) or []
        bullet_lines = "\n".join(f"  · {b}" for b in bullets[:4])
        if bullet_lines:
            blocks.append(f"{role} at {company}:\n{bullet_lines}")
    return "\n\n".join(blocks)


# ── Validation ────────────────────────────────────────────────────────────────

def _summary_invents_tech(output: str, cv_terms: Set[str]) -> bool:
    """
    Returns True only if the output introduces tech terms not found in the CV.
    Ignores general vocabulary — only validates proper technical nouns.
    """
    output_terms = _extract_tech_terms(output)
    invented = output_terms - cv_terms
    if invented:
        print(f"[build_summary] Rejected — invented terms: {invented}")
        return True
    return False


# ── Learning bullet ───────────────────────────────────────────────────────────

def _build_learning_bullet(
    missing_kw: List[str],
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


# ── Truncation ───────────────────────────────────────────────────────────────

def _truncate_summary(text: str, max_chars: int = 730) -> str:
    """Truncate summary to max_chars without cutting mid-sentence."""
    if len(text) <= max_chars:
        return text
    truncated = text[:max_chars]
    # Cut at last complete bullet (last newline before limit)
    last_newline = truncated.rfind("\n")
    if last_newline > 0:
        return truncated[:last_newline].strip()
    # Fallback: cut at last space to avoid mid-word cut
    last_space = truncated.rfind(" ")
    return truncated[:last_space].strip() if last_space > 0 else truncated.strip()


# ── Main ──────────────────────────────────────────────────────────────────────

def build_summary_ai(
    cv: CVMaster,
    lang: LangMode,
    signals: JobSignals,
    model: str,
) -> str:
    cv_terms = _collect_cv_tech_terms(cv)
    present_kw, missing_kw = _split_keywords_by_cv_presence(signals, cv_terms)
    experience_context = _build_experience_context(cv, lang)

    # Skills as structured context, not a flat dump
    skills = getattr(cv, "skills", None)
    all_skills: List[str] = []
    if skills:
        for group in ("core", "backend", "apis", "tooling"):
            all_skills += [str(s) for s in (getattr(skills, group, []) or [])]

    user = f"""Language: {lang}

=== CV SKILLS ===
{', '.join(all_skills)}

=== CV EXPERIENCE ===
{experience_context}

=== JOB KEYWORDS IN CV ===
{', '.join(present_kw) or '(none)'}

=== JOB KEYWORDS NOT IN CV (do NOT mention in bullets) ===
{', '.join(missing_kw) or '(none)'}

Task:
Write 3 to 5 bullets summarizing this candidate's profile for the job.
Focus on the job keywords that ARE present in the CV.
Do not mention or allude to: {', '.join(missing_kw[:8]) or 'nothing'}.
Keep the total summary under 700 characters (leave room for the learning bullet).
Return only bullet lines starting with "- ".
"""

    text = chat_text(model=model, system=SYSTEM, user=user)
    out = (text or "").strip()

    # Fallback to base summary if model invented tech terms
    if _summary_invents_tech(out, cv_terms):
        base_lines = getattr(cv.summary, lang, []) or []
        out = "\n".join(f"- {line}" for line in base_lines)

    learning_bullet = _build_learning_bullet(missing_kw, lang)
    result = out + "\n" + learning_bullet if learning_bullet else out
    return _truncate_summary(result)