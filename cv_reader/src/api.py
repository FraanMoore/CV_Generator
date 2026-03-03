from __future__ import annotations

from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from .service import generate_application

BASE_DIR = Path(__file__).resolve().parents[1]
CV_READER_DIR = BASE_DIR
OUTPUT_DIR = CV_READER_DIR / "output"
DATA_DIR = CV_READER_DIR / "data"

INDEX_CSV_PATH = OUTPUT_DIR / "index.csv"
CV_MASTER_PATH = DATA_DIR / "cv_master.json"

app = FastAPI(title="CV Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/jobs")
async def upload_job_text(
    company: str = Form(...),
    role: str = Form(...),
    lang: str = Form("both"),
    job_url: str = Form(""),
    ai: bool = Form(True),
    ai_model: str = Form("gpt-4.1-mini"),
    job_text: Optional[str] = Form(None),
    job_file: Optional[UploadFile] = File(None),
):
    """Upload the job description text and trigger the CV/Cover Letter generation.

    - Input can be provided as a job_text (string) from a frontend textarea or as a job_file (.txt).
    - The content is saved as a .txt file in the cv_reader root directory, followed by a call to the generate_application function.
    """

    if not job_text and not job_file:
        raise HTTPException(status_code=400, detail="Must provide job_text or job_file")

    if job_text:
        content = job_text.strip()
    else:
        assert job_file is not None
        content = (await job_file.read()).decode("utf-8").strip()

    if not content:
        raise HTTPException(status_code=400, detail="Job description text is empty")

    safe_company = company.replace(" ", "_")
    safe_role = role.replace(" ", "_")
    job_txt_name = f"{safe_company}_{safe_role}.txt"
    job_txt_path = CV_READER_DIR / job_txt_name
    job_txt_path.write_text(content, encoding="utf-8")

    result = generate_application(
        job_text=str(job_txt_path),
        job_url=job_url,
        company=company,
        role=role,
        cv_master_path=str(CV_MASTER_PATH),
        lang=lang,
        out_dir=str(OUTPUT_DIR),
        ai=ai,
        ai_model=ai_model,
    )

    return {
        "message": "Application generated",
        "output_dir": result["output_dir"],
        "files_generated": result["files_generated"],
    }


def _read_index_rows() -> List[dict]:
    import csv

    if not INDEX_CSV_PATH.exists():
        return []

    with INDEX_CSV_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    for i, row in enumerate(rows):
        row["id"] = i
    return rows


@app.get("/applications")
async def list_applications():
    """Returns all rows from index.csv (application history)."""

    rows = _read_index_rows()
    return rows


@app.get("/applications/{app_id}")
async def get_application(app_id: int):
    """Returns the details of a specific row from index.csv."""

    rows = _read_index_rows()
    if app_id < 0 or app_id >= len(rows):
        raise HTTPException(status_code=404, detail="Application not found")
    return rows[app_id]


@app.get("/download/{timestamp}/{company}/{role}/{filename}")
async def download_docx(
    timestamp: str,
    company: str,
    role: str,
    filename: str,
):
    """Download a generated .docx file.

    The `timestamp`, `company` and `role` must match the folder in `output`,
    for example: 2026-02-02_1601_Torc_Frontend_Engineer.
    From the frontend you can build the path with the data from `output_dir`.
    """

    folder_name = f"{timestamp}_{company}_{role}"
    file_path = OUTPUT_DIR / folder_name / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=str(file_path),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=filename,
    )
