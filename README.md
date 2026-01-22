# CV Generator

This project was created to make the job application process easier by automating the generation of customized CVs.

It allows you to generate CVs tailored to specific job offers, with or without AI assistance, helping you keep track of your applications efficiently.

---

## 🚀 Getting Started

Before running the project, make sure you have a virtual environment set up and activated.

```bash
source .venv/bin/activate
```

Use the following command to generate CVs with AI assistance:
```
    python3 jobtailor.py \
  --job-text oferta1.txt \
  --job-url "https://link-de-la-postulacion" \
  --company "Empresa IA" \
  --role "Frontend Developer" \
  --lang both \
  --out output \
  --ai
```

If you prefer to generate CVs without AI, use this command:
```
    python3 jobtailor.py \
  --job-text oferta.txt \
  --company "Acme Corp" \
  --role "Software Developer" \
  --lang both \
  --out output
```

Once the command finishes running:

Open the generated file located in the output/ folder

Review or edit the CV as needed

## Track Your Applications
_YES! I made a csv file_
Each generated CV corresponds to a specific job application, making it easier to keep track of where and how you have applied