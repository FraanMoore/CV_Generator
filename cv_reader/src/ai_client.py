from __future__ import annotations
from dotenv import load_dotenv
load_dotenv()
load_dotenv(dotenv_path=".env.local", override=True)
try:
    import truststore
    truststore.inject_into_ssl()
except Exception:
    pass

from typing import Any, Dict
import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def require_api_key() -> None:
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError(
            "Missing OPENAI_API_KEY. Export it first: export OPENAI_API_KEY='...'"
        )

def chat_json(model: str, system: str, user: str) -> Dict[str, Any]:
    require_api_key()

    resp = client.chat.completions.create(
        model=model,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.2,
    )

    content = resp.choices[0].message.content

    if content is None:
            raise RuntimeError("OpenAI returned empty content")

    return json.loads(content)

def chat_text(model: str, system: str, user: str) -> str:
    require_api_key()
    resp = client.chat.completions.create(
        model=model,
        messages=[
        {"role": "system", "content": system},
        {"role": "user", "content": user},
        ],
        temperature=0.2,
    )
    return (resp.choices[0].message.content or "").strip()

