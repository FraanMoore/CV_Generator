from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Literal

import typer

from src.ai_job_parser import parse_job_offer
from src.export_docx import build_cv_docx, build_cover_letter_docx
from src.generate_summary import build_summary
from src.index_log import ApplicationRecord, append_to_index_csv, append_to_index_jsonl
from src.io_json import load_cv_master
from src.job_extract import extract_keywords
from src.match import rank_skills, select_bullets
from src.job_extract import JobSignals
from src.ai_summary import build_summary_ai
from src.ai_bullets import tailor_bullets_ai


app = typer.Typer(no_args_is_help=True)

LangMode = Literal["es", "en", "both"]


def read_text_file(path: str) -> str:
  p = Path(path)
  if not p.exists():
    raise FileNotFoundError(f"No existe el archivo: {p}")
  return p.read_text(encoding="utf-8").strip()


@app.command()
def generate(
  job_text: str = typer.Option(..., "--job-text", help="Route to .txt with the offer text"),
  job_url: str = typer.Option("", "--job-url", help="URL of the job offer"),
  company: str = typer.Option(..., "--company", help="Company name"),
  role: str = typer.Option(..., "--role", help="Role name"),
  cv_master: str = typer.Option("data/cv_master.json", "--cv-master", help="Route to cv_master.json"),
  lang: LangMode = typer.Option("both", "--lang", help="Output language: es | en | both"),
  out_dir: str = typer.Option("output", "--out", help="Output directory"),
  ai: bool = typer.Option(False, "--ai", help="Enable AI parsing/tailoring"),
  ai_model: str = typer.Option("gpt-4.1-mini", "--ai-model", help="OpenAI model"),
) -> None:

  _offer = read_text_file(job_text)
  cv = load_cv_master(cv_master)
  
  if ai:
    parsed = parse_job_offer(ai_model, _offer, lang_hint=lang)
    signals = JobSignals(
      all_keywords=set(parsed.must_have + parsed.nice_to_have + parsed.keywords),
      must_keywords=set(parsed.must_have),
      nice_keywords=set(parsed.nice_to_have),
      resp_keywords=set(parsed.responsibilities),
    )
  else:
    signals = extract_keywords(_offer)

  skills_ordered = rank_skills(cv, signals)
  
  timestamp = datetime.now().strftime("%Y-%m-%d_%H%M")
  safe_company = company.replace(" ", "_")
  safe_role = role.replace(" ", "_")

  out = Path(out_dir) / f"{timestamp}_{safe_company}_{safe_role}"
  out.mkdir(parents=True, exist_ok=True)

  if lang in ("es", "both"):
    if ai:
      print("[AI] Using build_summary_ai (es)")
      ai_es = build_summary_ai(cv, "es", signals, ai_model)
      (out / "Resumen_ES.txt").write_text(ai_es, encoding="utf-8")
      cv.summary.es = [line.lstrip("- ").strip() for line in ai_es.splitlines() if line.strip()]
    else:
      s = build_summary(cv, "es")
      (out / "Resumen_ES.txt").write_text(s.text, encoding="utf-8")

  if lang in ("en", "both"):
    if ai:
      ai_en = build_summary_ai(cv, "en", signals, ai_model)
      (out / "Resumen_EN.txt").write_text(ai_en, encoding="utf-8")
      cv.summary.en = [line.lstrip("- ").strip() for line in ai_en.splitlines() if line.strip()]
    else:
      s = build_summary(cv, "en")
      (out / "Summary_EN.txt").write_text(s.text, encoding="utf-8")

  # ----------------------------
  # DOCX outputs
  # ----------------------------

  if lang in ("es", "both"):
    bullets_map_es = {}
    for exp in cv.experience:
      selected = select_bullets(exp, "es", signals, max_bullets=len(exp.bullets.es))
      if ai:
        selected = tailor_bullets_ai(cv, exp, "es", signals, ai_model, selected)
      bullets_map_es[exp.company] = selected

    build_cv_docx(
      cv,
      "es",
      out / "Francisca_Moore_CV_ES.docx",
      skills_ordered=skills_ordered,
      bullets_per_experience=bullets_map_es
    )

    build_cover_letter_docx(
      cv,
      "es",
      company,
      role,
      out / "Francisca_Moore_Carta_de_Presentacion_ES.docx"
    )

  if lang in ("en", "both"):
    bullets_map_en = {}
    for exp in cv.experience:
      selected = select_bullets(exp, "en", signals, max_bullets=len(exp.bullets.en))
      if ai:
        selected = tailor_bullets_ai(cv, exp, "en", signals, ai_model, selected)
      bullets_map_en[exp.company] = selected


    build_cv_docx(
      cv,
      "en",
      out / "Francisca_Moore_CV_EN.docx",
      skills_ordered=skills_ordered,
      bullets_per_experience=bullets_map_en
    )

    build_cover_letter_docx(
      cv,
      "en",
      company,
      role,
      out / "Francisca_Moore_CoverLetter_EN.docx"
    )

  # ----------------------------
  # Index logging
  # ----------------------------
  generated_files = sorted([p.name for p in out.glob("*") if p.is_file()])

  rec = ApplicationRecord(
    timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    company=company,
    role=role,
    lang=lang,
    job_text_path=str(Path(job_text).resolve()),
    job_url=job_url,
    output_dir=str(out.resolve()),
    files_generated=generated_files,
    must_keywords=sorted(list(signals.must_keywords)),
    nice_keywords=sorted(list(signals.nice_keywords)),
    resp_keywords=sorted(list(signals.resp_keywords)),
  )

  index_csv = Path(out_dir) / "index.csv"
  index_jsonl = Path(out_dir) / "index.jsonl"

  append_to_index_csv(index_csv, rec)
  append_to_index_jsonl(index_jsonl, rec)


  typer.echo(f"OK file upload in: {out.resolve()}")


if __name__ == "__main__":
  app()
