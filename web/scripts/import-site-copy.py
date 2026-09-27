#!/usr/bin/env python3
"""Convert the approved V3 copy workbook into a deterministic JSON catalog."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PACKAGE_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
HEADERS = ["key", "página", "seção", "EN", "PT", "status", "Figma", "nota"]
VALID_STATUSES = {"aprovado", "revisar", "decidir"}
KEY_PATTERN = re.compile(r"[a-z0-9]+(?:[._-][a-z0-9]+)*$")


def text_content(node: ET.Element | None) -> str:
    if node is None:
        return ""
    return "".join(part.text or "" for part in node.iter(f"{{{MAIN_NS}}}t"))


def shared_strings(archive: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    return [text_content(item) for item in root.findall(f"{{{MAIN_NS}}}si")]


def worksheet_path(archive: zipfile.ZipFile, sheet_name: str) -> str:
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    targets = {
        relationship.attrib["Id"]: relationship.attrib["Target"]
        for relationship in relationships.findall(f"{{{PACKAGE_REL_NS}}}Relationship")
    }
    for sheet in workbook.findall(f".//{{{MAIN_NS}}}sheet"):
        if sheet.attrib.get("name") == sheet_name:
            relationship_id = sheet.attrib[f"{{{REL_NS}}}id"]
            target = targets[relationship_id].lstrip("/")
            return target if target.startswith("xl/") else f"xl/{target}"
    raise ValueError(f'Aba obrigatória ausente: "{sheet_name}".')


def column_index(reference: str) -> int:
    letters = re.match(r"[A-Z]+", reference)
    if not letters:
        raise ValueError(f"Referência de célula inválida: {reference}.")
    result = 0
    for character in letters.group(0):
        result = result * 26 + ord(character) - ord("A") + 1
    return result - 1


def cell_value(cell: ET.Element, strings: list[str]) -> str | None:
    cell_type = cell.attrib.get("t")
    if cell_type == "inlineStr":
        return text_content(cell.find(f"{{{MAIN_NS}}}is"))
    value_node = cell.find(f"{{{MAIN_NS}}}v")
    if value_node is None or value_node.text is None:
        return None
    if cell_type == "s":
        return strings[int(value_node.text)]
    if cell_type == "b":
        return "true" if value_node.text == "1" else "false"
    return value_node.text


def read_rows(source: Path) -> list[tuple[int, list[str | None]]]:
    with zipfile.ZipFile(source) as archive:
        strings = shared_strings(archive)
        sheet = ET.fromstring(archive.read(worksheet_path(archive, "Conteúdo")))
        rows = []
        for row in sheet.findall(f".//{{{MAIN_NS}}}row"):
            values: list[str | None] = [None] * len(HEADERS)
            for cell in row.findall(f"{{{MAIN_NS}}}c"):
                index = column_index(cell.attrib["r"])
                if index < len(values):
                    values[index] = cell_value(cell, strings)
            rows.append((int(row.attrib["r"]), values))
        return rows


def validate_and_build(source: Path) -> dict[str, object]:
    rows = read_rows(source)
    if not rows or rows[0][1] != HEADERS:
        raise ValueError(f"Cabeçalhos inválidos. Esperado: {HEADERS}.")

    entries: dict[str, dict[str, str | None]] = {}
    ignored_rows: list[int] = []
    for row_number, values in rows[1:]:
        key, page, section, en, pt, status, figma, note = values
        if not key:
            populated = [value for value in values if value not in (None, "")]
            if populated == [figma] and figma and figma.startswith("https://www.figma.com/"):
                ignored_rows.append(row_number)
                continue
            if populated:
                raise ValueError(f"Linha {row_number} possui conteúdo sem key.")
            continue

        if not KEY_PATTERN.fullmatch(key):
            raise ValueError(f'Key inválida na linha {row_number}: "{key}".')
        if key in entries:
            raise ValueError(f'Key duplicada na linha {row_number}: "{key}".')
        if not all(isinstance(value, str) and value for value in (page, section, en, pt)):
            raise ValueError(f'Campos obrigatórios ausentes na linha {row_number} ("{key}").')
        if status not in VALID_STATUSES:
            raise ValueError(f'Status inválido na linha {row_number} ("{key}"): "{status}".')

        parts = key.split(".")
        prefixes = [".".join(parts[:index]) for index in range(1, len(parts))]
        collision = next((prefix for prefix in prefixes if prefix in entries), None)
        if collision:
            raise ValueError(f'Colisão hierárquica: "{collision}" também é pai de "{key}".')
        if any(existing.startswith(f"{key}.") for existing in entries):
            raise ValueError(f'Colisão hierárquica: "{key}" também é pai de outra key.')

        entries[key] = {
            "en": en,
            "pt": pt,
            "page": page,
            "section": section,
            "status": status,
            "figma": figma,
            "note": note,
        }

    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    return {
        "schemaVersion": 1,
        "source": {
            "file": source.name,
            "sha256": digest,
            "entryCount": len(entries),
            "ignoredRows": ignored_rows,
        },
        "entries": entries,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()

    try:
        catalog = validate_and_build(arguments.source)
        arguments.output.parent.mkdir(parents=True, exist_ok=True)
        arguments.output.write_text(
            json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        print(f"✗ {error}", file=sys.stderr)
        return 1

    counts: dict[str, int] = {}
    for entry in catalog["entries"].values():
        status = entry["status"]
        counts[status] = counts.get(status, 0) + 1
    print(
        f"✓ {catalog['source']['entryCount']} entradas exportadas; "
        + ", ".join(f"{status}: {count}" for status, count in sorted(counts.items()))
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
