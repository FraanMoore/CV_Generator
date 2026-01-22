from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Dict, Set, Tuple

SYNONYMS: dict[str, list[str]] = {
  "react": ["react", "react.js", "reactjs"],
  "typescript": ["typescript", "ts"],
  "javascript": ["javascript", "js", "ecmascript"],
  "html": ["html", "html5"],
  "css": ["css", "css3", "scss", "sass"],
  "api": ["api", "apis", "api integration", "integración con api", "integración de api"],
  "rest": ["rest", "rest api", "restful"],
  "jwt": ["jwt", "json web token"],
  "git": ["git", "gitflow"],
  "github": ["github", "git hub"],
  "testing": ["testing", "tests", "unit tests", "integration tests", "e2e", "qa", "jest", "cypress", "playwright"],
  "performance": ["performance", "web performance", "optimización", "optimization", "lighthouse"],
  "accessibility": ["accessibility", "a11y", "wcag", "accesibilidad"],
  "state_management": ["redux", "rtk", "rtk query", "state management", "manejo de estado"],
  "hooks": ["hooks", "react hooks"],
  "frontend": ["frontend", "front end", "front-end"],
  "backend_collab": ["backend", "back-end", "api teams", "collaborate with backend", "colaboración con backend"],
  "ux_ui": ["ui", "ux", "design", "figma", "diseño"],
}

SECTION_MARKERS = {
  "must": [
    "requisitos", "requirements", "must have", "must-have", "obligatorio", "mandatory",
    "you must", "we require", "mínimo", "minimum"
  ],
  "nice": [
    "deseable", "nice to have", "nice-to-have", "plus", "bonus", "preferred", "optional"
  ],
  "resp": [
    "responsabilidades", "responsibilities", "what you will do", "you will", "tareas", "role includes"
  ],
}


@dataclass
class JobSignals:
  all_keywords: Set[str]
  must_keywords: Set[str]
  nice_keywords: Set[str]
  resp_keywords: Set[str]


def normalize(text: str) -> str:
  t = text.lower()
  t = re.sub(r"[\u2010-\u2015]", "-", t)
  t = re.sub(r"[^a-z0-9áéíóúñ\s\-\+\.]", " ", t)
  t = re.sub(r"\s+", " ", t).strip()
  return t


def _split_sections(text: str) -> tuple[str, str, str]:
  """
  Heurística:
  - intenta separar en 3 secciones por markers.
  - si no encuentra, devuelve todo en must por defecto.
  """
  t = normalize(text)

  def find_any(markers: list[str]) -> int | None:
    for m in markers:
      idx = t.find(m)
      if idx != -1:
        return idx
    return None

  i_must = find_any(SECTION_MARKERS["must"])
  i_nice = find_any(SECTION_MARKERS["nice"])
  i_resp = find_any(SECTION_MARKERS["resp"])

  if i_must is None and i_nice is None and i_resp is None:
    return (t, "", "")

  cuts: list[tuple[str, int]] = []
  if i_must is not None: cuts.append(("must", i_must))
  if i_nice is not None: cuts.append(("nice", i_nice))
  if i_resp is not None: cuts.append(("resp", i_resp))
  cuts.sort(key=lambda x: x[1])

  spans: dict[str, str] = {"must": "", "nice": "", "resp": ""}
  for idx, (name, start) in enumerate(cuts):
    end = cuts[idx + 1][1] if idx + 1 < len(cuts) else len(t)
    spans[name] = t[start:end].strip()

  if not spans["must"]:
    spans["must"] = t

  return (spans["must"], spans["nice"], spans["resp"])


def _extract_from_text(text: str) -> Set[str]:
  found: Set[str] = set()
  t = normalize(text)

  for canonical, variants in SYNONYMS.items():
    for v in variants:
      if v in t:
        found.add(canonical)
        break

  if "rest" in found:
    found.add("api")

  return found


def extract_keywords(job_text: str) -> JobSignals:
  must_text, nice_text, resp_text = _split_sections(job_text)

  must = _extract_from_text(must_text)
  nice = _extract_from_text(nice_text)
  resp = _extract_from_text(resp_text)

  resp = resp - must
  nice = nice - must - resp

  all_k = set().union(must, nice, resp)
  return JobSignals(
    all_keywords=all_k,
    must_keywords=must,
    nice_keywords=nice,
    resp_keywords=resp,
  )
