from __future__ import annotations
from dotenv import load_dotenv
from anthropic.types import TextBlock
import os
load_dotenv()
load_dotenv(dotenv_path=".env.local", override=True)

try:
    import truststore # pyright: ignore[reportMissingImports]
except ImportError:
    truststore = None
  
if truststore is not None:
    truststore.inject_into_ssl()

from typing import Any, Dict
import json
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def _extract_text(resp) -> str:
    """Extrae el texto del primer TextBlock de la respuesta."""
    for block in resp.content:
        if isinstance(block, TextBlock):
            return block.text
    raise RuntimeError("Claude returned no TextBlock in response")

def require_api_key() -> None:
    if not os.getenv("ANTHROPIC_API_KEY"):
        raise RuntimeError(
            "Missing ANTHROPIC_API_KEY. Export it first: export ANTHROPIC_API_KEY='sk-ant-...'"
        )

def chat_json(model: str, system: str, user: str) -> Dict[str, Any]:
    require_api_key()

    resp = client.messages.create(
        model=model,
        max_tokens=2048,          # obligatorio en Claude (OpenAI lo infería)
        system=system,            # Claude tiene system como parámetro propio, no en messages[]
        messages=[
            {"role": "user", "content": user},
        ],
        temperature=0.2,
    )

    content = _extract_text(resp)
    clean = content.strip().removeprefix("```json").removesuffix("```").strip()
    return json.loads(clean)

def chat_text(model: str, system: str, user: str) -> str:
    require_api_key()

    resp = client.messages.create(
        model=model,
        max_tokens=2048,
        system=system,
        messages=[
            {"role": "user", "content": user},
        ],
        temperature=0.2,
    )

    return _extract_text(resp).strip()