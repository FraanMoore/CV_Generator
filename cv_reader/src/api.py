from __future__ import annotations

from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from .service import generate_application
from .index_log import ApplicationRecord, append_to_index_csv, append_to_index_jsonl
from datetime import datetime

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
    status: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
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

    if ai:
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
            "message": "Application generated with AI",
            "output_dir": result["output_dir"],
            "files_generated": result["files_generated"],
        }

    timestamp_folder = datetime.now().strftime("%Y-%m-%d_%H%M")
    out_path = OUTPUT_DIR / f"{timestamp_folder}_{safe_company}_{safe_role}"
    out_path.mkdir(parents=True, exist_ok=True)

    generated_files: list[str] = []

    rec = ApplicationRecord(
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        company=company,
        role=role,
        lang=lang,
        job_text_path=str(job_txt_path.resolve()),
        job_url=job_url,
        output_dir=str(out_path.resolve()),
        files_generated=generated_files,
        must_keywords=[],
        nice_keywords=[],
        resp_keywords=[],
        status=status or "draft",
        notes=notes or "",
    )

    append_to_index_csv(INDEX_CSV_PATH, rec)
    append_to_index_jsonl(OUTPUT_DIR / "index.jsonl", rec)

    return {
        "message": "Application registered without AI",
        "output_dir": str(out_path.resolve()),
        "files_generated": generated_files,
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

@app.get("/applications/{app_id}/description")
async def get_application_description(app_id: int):
    """
    Devuelve el contenido del archivo .txt de job description
    para una aplicación dada (por índice en index.csv).
    """
    rows = _read_index_rows()
    if app_id < 0 or app_id >= len(rows):
        raise HTTPException(status_code=404, detail="Application not found")

    row = rows[app_id]

    job_text_path = row.get("job_text_path")
    if not job_text_path:
        raise HTTPException(status_code=404, detail="job_text_path not found for this application")

    job_txt_path = Path(job_text_path)
    if not job_txt_path.exists():
        raise HTTPException(status_code=404, detail="Job description file not found")

    content = job_txt_path.read_text(encoding="utf-8")
    return {"job_description": content}

@app.get("/applications/{app_id}")
async def get_application(app_id: int):
    """Returns the details of a specific row from index.csv."""

    rows = _read_index_rows()
    if app_id < 0 or app_id >= len(rows):
        raise HTTPException(status_code=404, detail="Application not found")
    return rows[app_id]

@app.put("/applications/{app_id}")
async def update_application(app_id: int, data: dict = Body(...)):
    """
    Updated some fields of an application in index.csv:
    role, company, job_url, status, notes.
    """
    rows = _read_index_rows()
    if app_id < 0 or app_id >= len(rows):
        raise HTTPException(status_code=404, detail="Application not found")

    row = rows[app_id]

    for field in data:
        if field in row and data[field] is not None:
            row[field] = data[field]

    import csv

    for r in rows:
        if "id" in r:
            del r["id"]

    fieldnames = [
        "timestamp",
        "company",
        "role",
        "lang",
        "job_text_path",
        "job_url",
        "output_dir",
        "files_generated",
        "must_keywords",
        "nice_keywords",
        "resp_keywords",
        "status",
        "notes",
    ]

    with INDEX_CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return row

@app.delete("/applications/{app_id}")
async def delete_application(app_id: int):
    """Delete an application from index.csv by its id (row index)."""
    import csv

    rows = _read_index_rows()
    if app_id < 0 or app_id >= len(rows):
        raise HTTPException(status_code=404, detail="Application not found")

    deleted_row = rows.pop(app_id)

    for r in rows:
        if "id" in r:
            del r["id"]

    fieldnames = [
        "timestamp",
        "company",
        "role",
        "lang",
        "job_text_path",
        "job_url",
        "output_dir",
        "files_generated",
        "must_keywords",
        "nice_keywords",
        "resp_keywords",
        "status",
        "notes",
    ]

    with INDEX_CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return {"message": "Application deleted", "deleted": deleted_row}

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
