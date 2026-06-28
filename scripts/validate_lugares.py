#!/usr/bin/env python3
"""Validate the canonical Google My Maps CSV used by this workspace."""

from __future__ import annotations

import csv
import re
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse


REQUIRED_COLUMNS = [
    "id_lugar",
    "nombre_visible",
    "nombre_original",
    "estado",
    "direccion",
    "google_place_id",
    "capa",
    "categoria",
    "subcategoria",
    "icono_recomendado",
    "color_hex",
    "latitude",
    "longitude",
    "descripcion_breve",
    "datos_interes",
    "enlace_util",
    "image_url",
    "video_url",
    "media_credit",
    "nivel_confianza",
    "nota_desambiguacion",
    "wkt",
    "fuentes_consultadas",
]

VALID_ESTADOS = {"confirmado", "revisar", "por_confirmar"}
VALID_CONFIANZA = {"alto", "medio", "bajo"}
ID_RE = re.compile(r"^[a-z0-9]+(?:_[a-z0-9]+)*$")


def parse_decimal(value: str) -> float | None:
    value = (value or "").strip()
    if not value:
        return None
    try:
        return float(value)
    except ValueError:
        return None


def looks_private_url(value: str) -> bool:
    value = (value or "").strip()
    if not value:
        return False
    parsed = urlparse(value)
    if parsed.scheme not in {"http", "https"}:
        return True
    host = parsed.netloc.lower()
    return "localhost" in host or host.startswith("127.") or "drive.google.com/file/d/" in value and "usp=sharing" not in value


def validate(path: Path) -> int:
    errors: list[str] = []
    warnings: list[str] = []

    if not path.exists():
        print(f"ERROR: no existe el archivo: {path}")
        return 2

    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        header = reader.fieldnames or []
        rows = list(reader)

    missing = [column for column in REQUIRED_COLUMNS if column not in header]
    extra = [column for column in header if column not in REQUIRED_COLUMNS]
    if missing:
        errors.append(f"Faltan columnas: {', '.join(missing)}")
    if extra:
        warnings.append(f"Columnas no canonicas: {', '.join(extra)}")

    ids = [row.get("id_lugar", "").strip() for row in rows]
    duplicate_ids = sorted(item for item, count in Counter(ids).items() if item and count > 1)
    if duplicate_ids:
        errors.append(f"IDs duplicados: {', '.join(duplicate_ids)}")

    capas = Counter(row.get("capa", "").strip() for row in rows if row.get("capa", "").strip())
    if len(capas) > 10:
        errors.append(f"Hay {len(capas)} capas; My Maps admite hasta 10.")
    for capa, count in sorted(capas.items()):
        if count > 2000:
            errors.append(f"La capa '{capa}' tiene {count} filas; limite 2.000.")
        elif count > 1800:
            warnings.append(f"La capa '{capa}' tiene {count} filas; conviene dividirla pronto.")

    if len(rows) > 10000:
        errors.append(f"Hay {len(rows)} filas; limite operativo de My Maps: 10.000 elementos.")

    for index, row in enumerate(rows, start=2):
        row_id = row.get("id_lugar", "").strip()
        estado = row.get("estado", "").strip()
        confianza = row.get("nivel_confianza", "").strip()
        lat = parse_decimal(row.get("latitude", ""))
        lon = parse_decimal(row.get("longitude", ""))

        prefix = f"Fila {index}"
        if not row_id:
            errors.append(f"{prefix}: id_lugar vacio.")
        elif not ID_RE.match(row_id):
            errors.append(f"{prefix}: id_lugar no usa snake_case simple: {row_id}")

        if estado not in VALID_ESTADOS:
            errors.append(f"{prefix}: estado invalido: {estado!r}")
        if confianza not in VALID_CONFIANZA:
            errors.append(f"{prefix}: nivel_confianza invalido: {confianza!r}")

        if estado == "por_confirmar" and (lat is not None or lon is not None):
            warnings.append(f"{prefix}: por_confirmar contiene coordenadas; revisa que no sean inventadas.")

        if estado == "confirmado" and (lat is None or lon is None) and not row.get("wkt", "").strip():
            errors.append(f"{prefix}: confirmado sin coordenadas ni WKT.")

        if lat is not None and not -90 <= lat <= 90:
            errors.append(f"{prefix}: latitude fuera de rango: {lat}")
        if lon is not None and not -180 <= lon <= 180:
            errors.append(f"{prefix}: longitude fuera de rango: {lon}")
        if lat is not None and lon is not None and abs(lat) > 60 and abs(lon) < 60:
            warnings.append(f"{prefix}: posible inversion lat/lon; revisa {lat}, {lon}.")

        if estado != "confirmado" or confianza != "alto":
            if not row.get("nota_desambiguacion", "").strip():
                warnings.append(f"{prefix}: falta nota_desambiguacion para estado/confianza no definitivos.")

        for url_field in ("enlace_util", "image_url", "video_url"):
            value = row.get(url_field, "").strip()
            if looks_private_url(value):
                warnings.append(f"{prefix}: {url_field} parece privado o fragil: {value}")

    print(f"Archivo: {path}")
    print(f"Filas: {len(rows)}")
    print(f"Capas: {len(capas)}")

    if errors:
        print("\nERRORES")
        for error in errors:
            print(f"- {error}")
    if warnings:
        print("\nADVERTENCIAS")
        for warning in warnings:
            print(f"- {warning}")

    if errors:
        print("\nResultado: NO APTO para importar.")
        return 1

    print("\nResultado: APTO con advertencias." if warnings else "\nResultado: APTO.")
    return 0


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("Uso: python validate_lugares.py <lugares.csv>")
        return 2
    return validate(Path(argv[1]))


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
