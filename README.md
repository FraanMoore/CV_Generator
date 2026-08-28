# CV Generator

This project was created to make the job application process easier by automating the generation of customized CVs.

It allows you to generate CVs tailored to specific job offers, with or without AI assistance, helping you keep track of your applications efficiently.

It includes a Python API and a React/Vite frontend for creating and tracking the applications.

---

## 🚀 Getting Started

## Prerequisites
- Python 3.10 or newer
- Node.js 18 or newer and npm
- An Claude API key when using AI-assisted generation

## Installation

From the repository root, create and activate a Python virtual environment, then install the backend dependencies:

```bash
cd cv_reader
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Install the frontend dependencies ins a second terminal:

```bash
cd cv_reader/frontend
npm install
```

If you yse AI-assisted generatio, set the API key in the terminal where the backend runs (or add it to `cv_reader/.env`):

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

## Run the application

Start the backend API from `cv_reader`:

```bash
cd cv_reader
source .venv/bin/activate
uvicorn src.api:app --reaload --host 127.0.0.1 --port 8000
```

In a second terminal, start the frontend:

```bash
cd cv_reader/frontend
npm run dev
```

open the URL printed by Vite, usually `http://localhost:5173`. The frontend uses `http://localhost:8000` for the API by default.
To use another API URL, set it before starting vite:

```bash
VITE_API_BASE_URL="http://localhost:8000" npm run dev
```

## Generete documents from the command line
**Make sure to updated the variables**

Run these command from `cv_reader` with the virtual environment activated. Replace the example job file and company details with your own values:

With AI assistance:

```bash
    python3 jobtailor.py \
  --job-text oferta.txt \
  --job-url "https:/the-link-of-the-job-offer" \
  --company "Company IA" \
  --role "Frontend Developer" \
  --lang both \
  --out output \
  --ai
```

If you prefer to generate CVs without AI, use this command:
**Make sure to updated the variables**
```bash
    python3 jobtailor.py \
  --job-text oferta.txt \
  --company "Company without IA" \
  --role "Software Developer" \
  --lang both \
  --out output
```

Genereted files are written to `cv_reader/output/`. Applications history is stored in the genereted `index.csv` file.

## Optional frontend checks

```bash
cd cv_reader/frontend
npm run lint
npm run test:run
npm run build
```


## Track Your Applications
Review or edit the CV as needed

_YES! I made a csv file._

Each generated CV corresponds to a specific job application, making it easier to keep track of where and how you have applied.