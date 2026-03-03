from __future__ import annotations

from pathlib import Path
from typing import Literal

import typer

from src.service import generate_application


app = typer.Typer(no_args_is_help=True)

LangMode = Literal["es", "en", "both"]


def read_text_file(path: str) -> str:
  p = Path(path)
  if not p.exists():
    raise FileNotFoundError(f"The file does not exist: {p}")
  return p.read_text(encoding="utf-8").strip()


@app.command()
def generate(
    job_text: str = typer.Argument(..., help="Route to file .txt with the offer"),
    job_url: str = typer.Option("", "--job-url", help="URL of the offer"),
    company: str = typer.Option(..., "--company", help="Name of the company"),
    role: str = typer.Option(..., "--role", help="Name of the role"),
    cv_master: str = typer.Option("data/cv_master.json", "--cv-master", help="Path to cv_master.json"),
    lang: str = typer.Option("both", "--lang", help="Output language: es | en | both"),
    out_dir: str = typer.Option("output", "--out", help="Output directory"),
    ai: bool = typer.Option(False, "--ai", help="Use AI to parse offer and adapt bullets"),
    ai_model: str = typer.Option("gpt-4.1-mini", "--ai-model", help="OpenAI model to use"),
) -> None:
    """Generates CV, cover letter, and summaries from a job offer."""

    result = generate_application(
        job_text=job_text,
        job_url=job_url,
        company=company,
        role=role,
        cv_master_path=cv_master,
        lang=lang,
        out_dir=out_dir,
        ai=ai,
        ai_model=ai_model,
    )

    typer.echo(f"Documents generated in: {result['output_dir']}")


if __name__ == "__main__":
  app()
