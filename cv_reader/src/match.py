from __future__ import annotations

from typing import List, Tuple

from src.models import CVMaster, Experience
from src.job_extract import JobSignals, normalize

WEIGHTS = {
  "react": 6,
  "typescript": 6,
  "javascript": 4,
  "state_management": 4,
  "api": 4,
  "rest": 4,
  "testing": 3,
  "performance": 3,
  "accessibility": 2,
  "html": 2,
  "css": 2,
  "git": 1,
  "github": 1,
  "hooks": 2,
  "frontend": 1,
  "backend_collab": 1,
  "ux_ui": 1,
  "jwt": 1,
}

MUST_BONUS = 4
NICE_BONUS = 1
RESP_BONUS = 2


def _score_text(text: str, signals: JobSignals) -> int:
  t = normalize(text)
  score = 0

  for kw in signals.all_keywords:
    if kw in t:
      score += WEIGHTS.get(kw, 1)

      if kw in signals.must_keywords:
        score += MUST_BONUS
      elif kw in signals.resp_keywords:
        score += RESP_BONUS
      elif kw in signals.nice_keywords:
        score += NICE_BONUS

  return score


def rank_skills(cv: CVMaster, signals: JobSignals) -> List[str]:
  skills = cv.skills.core + cv.skills.apis + cv.skills.tooling
  scored: List[Tuple[int, str]] = []

  for s in skills:
    score = _score_text(s, signals)
    scored.append((score, s))

  scored.sort(key=lambda x: x[0], reverse=True)
  return [s for _, s in scored]


def select_bullets(exp: Experience, lang: str, signals: JobSignals, max_bullets: int = 4) -> List[str]:
  bullets = exp.bullets.es if lang == "es" else exp.bullets.en

  scored: List[Tuple[int, str]] = []
  for b in bullets:
    score = _score_text(b, signals)
    scored.append((score, b))

  scored_sorted = sorted(scored, key=lambda x: x[0], reverse=True)

  top = [b for sc, b in scored_sorted[:max_bullets]]
  return top or bullets[:max_bullets]
