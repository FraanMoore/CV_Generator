import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "src"
I18N_DIR = SRC_DIR / "i18n" / "locales"

EN_FILE = I18N_DIR / "en" / "translation.json"
ES_FILE = I18N_DIR / "es" / "translation.json"

T_CALL_PATTERN = re.compile(r"t\(\s*(['\"])(.+?)\1\s*\)")


def find_translation_strings():
    strings: set[str] = set()
    for tsx in SRC_DIR.rglob("*.tsx"):
        text = tsx.read_text(encoding="utf-8")
        for match in T_CALL_PATTERN.finditer(text):
            literal = match.group(2).strip()
            if literal:
                strings.add(literal)
    return sorted(strings)


def load_json(path: Path) -> dict:
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        return {}
    with path.open("r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}


def save_json(path: Path, data: dict):
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")


def flatten_dict(d: dict, parent_key: str = "", sep: str = ".") -> dict:
    items = {}
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.update(flatten_dict(v, new_key, sep=sep))
        else:
            items[new_key] = v
    return items


def unflatten_dict(d: dict, sep: str = ".") -> dict:
    result: dict = {}
    for flat_key, value in d.items():
        parts = flat_key.split(sep)
        cur = result
        for part in parts[:-1]:
            cur = cur.setdefault(part, {})
        cur[parts[-1]] = value
    return result


def main():
    literals = find_translation_strings()
    if not literals:
        print("No se encontraron cadenas en llamadas a t(...)")
        return

    en = load_json(EN_FILE)
    es = load_json(ES_FILE)

    flat_en = flatten_dict(en)
    flat_es = flatten_dict(es)

    added = 0
    for literal in literals:
        key = literal
        if key not in flat_en:
            flat_en[key] = literal
            added += 1
        if key not in flat_es:
            flat_es[key] = literal

    if added == 0:
        print("No hay nuevas cadenas para agregar.")
    else:
        en_out = unflatten_dict(flat_en)
        es_out = unflatten_dict(flat_es)
        save_json(EN_FILE, en_out)
        save_json(ES_FILE, es_out)
        print(f"Cadenas nuevas agregadas: {added}")
        print(f"Actualizado: {EN_FILE}")
        print(f"Actualizado: {ES_FILE}")


if __name__ == "__main__":
    main()
