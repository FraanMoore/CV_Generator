from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List

from .ai_job_parser import parse_job_offer
from .ai_bullets import tailor_bullets_ai
from .ai_summary import build_summary_ai
from .export_docx import build_cv_docx, build_cover_letter_docx
from .generate_summary import build_summary
from .index_log import ApplicationRecord, append_to_index_csv, append_to_index_jsonl
from .io_json import load_cv_master
from .job_extract import extract_keywords, JobSignals
from .match import rank_skills, select_bullets
from .models import CVMaster


def generate_application(
    job_text: str,
    job_url: str,
    company: str,
    role: str,
    cv_master_path: str,
    lang: str,
    out_dir: str,
    ai: bool,
    ai_model: str,
) -> Dict[str, Any]:
    """Function that executes the entire document generation flow.

    This function does not interact with CLI/typer and can be
    reused from an HTTP backend.
    """

    offer_text = Path(job_text).read_text(encoding="utf-8").strip()
    cv: CVMaster = load_cv_master(cv_master_path)

    # --- extractions of job signals ---
    if ai:
        parsed = parse_job_offer(ai_model, offer_text, lang_hint=lang)
        signals = JobSignals(
            all_keywords=set(parsed.must_have + parsed.nice_to_have + parsed.keywords),
            must_keywords=set(parsed.must_have),
            nice_keywords=set(parsed.nice_to_have),
            resp_keywords=set(parsed.responsibilities),
        )
    else:
        signals = extract_keywords(offer_text)

    skills_ordered = rank_skills(cv, signals)

    timestamp = datetime.now().strftime("%Y-%m-%d_%H%M")
    safe_company = company.replace(" ", "_")
    safe_role = role.replace(" ", "_")

    out_path = Path(out_dir) / f"{timestamp}_{safe_company}_{safe_role}"
    out_path.mkdir(parents=True, exist_ok=True)

    # --- summaries ---
    if lang in ("es", "both"):
        if ai:
            ai_es = build_summary_ai(cv, "es", signals, ai_model)
            (out_path / "Resumen_ES.txt").write_text(ai_es, encoding="utf-8")
            cv.summary.es = [
                line.lstrip("- ").strip()
                for line in ai_es.splitlines()
                if line.strip()
            ]
        else:
            s = build_summary(cv, "es")
            (out_path / "Resumen_ES.txt").write_text(s.text, encoding="utf-8")

    if lang in ("en", "both"):
        if ai:
            ai_en = build_summary_ai(cv, "en", signals, ai_model)
            (out_path / "Resumen_EN.txt").write_text(ai_en, encoding="utf-8")
            cv.summary.en = [
                line.lstrip("- ").strip()
                for line in ai_en.splitlines()
                if line.strip()
            ]
        else:
            s = build_summary(cv, "en")
            (out_path / "Summary_EN.txt").write_text(s.text, encoding="utf-8")

    # --- DOCX ES ---
    if lang in ("es", "both"):
        bullets_map_es: Dict[str, List[str]] = {}
        for exp in cv.experience:
            selected = select_bullets(exp, "es", signals, max_bullets=len(exp.bullets.es))
            if ai:
                selected = tailor_bullets_ai(cv, exp, "es", signals, ai_model, selected)
            bullets_map_es[exp.company] = selected

        build_cv_docx(
            cv,
            "es",
            out_path / "Francisca_Moore_CV_ES.docx",
            skills_ordered=skills_ordered,
            bullets_per_experience=bullets_map_es,
        )

        build_cover_letter_docx(
            cv,
            "es",
            company,
            role,
            out_path / "Francisca_Moore_Carta_de_Presentacion_ES.docx",
        )

    # --- DOCX EN ---
    if lang in ("en", "both"):
        bullets_map_en: Dict[str, List[str]] = {}
        for exp in cv.experience:
            selected = select_bullets(exp, "en", signals, max_bullets=len(exp.bullets.en))
            if ai:
                selected = tailor_bullets_ai(cv, exp, "en", signals, ai_model, selected)
            bullets_map_en[exp.company] = selected

        build_cv_docx(
            cv,
            "en",
            out_path / "Francisca_Moore_CV_EN.docx",
            skills_ordered=skills_ordered,
            bullets_per_experience=bullets_map_en,
        )

        build_cover_letter_docx(
            cv,
            "en",
            company,
            role,
            out_path / "Francisca_Moore_CoverLetter_EN.docx",
        )

    # --- index ---
    generated_files = sorted([p.name for p in out_path.glob("*") if p.is_file()])

    rec = ApplicationRecord(
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        company=company,
        role=role,
        lang=lang,
        job_text_path=str(Path(job_text).resolve()),
        job_url=job_url,
        output_dir=str(out_path.resolve()),
        files_generated=generated_files,
        must_keywords=sorted(list(signals.must_keywords)),
        nice_keywords=sorted(list(signals.nice_keywords)),
        resp_keywords=sorted(list(signals.resp_keywords)),
    )

    index_csv = Path(out_dir) / "index.csv"
    index_jsonl = Path(out_dir) / "index.jsonl"
    append_to_index_csv(index_csv, rec)
    append_to_index_jsonl(index_jsonl, rec)

    return {
        "output_dir": str(out_path.resolve()),
        "files_generated": generated_files,
        "must_keywords": rec.must_keywords,
        "nice_keywords": rec.nice_keywords,
        "resp_keywords": rec.resp_keywords,
    }
