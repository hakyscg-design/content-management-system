#!/usr/bin/env python3
"""Validate RAF Phase 02 frozen chapter import."""

from __future__ import annotations

import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


FORBIDDEN_EXTENSIONS = {".docx", ".pdf", ".xlsx"}
FORBIDDEN_RELEASE_EXTENSIONS = {".zip"}
PLACEHOLDER_TEXT = "Frozen content has not yet been imported."


class ValidationError(Exception):
    """Raised when Phase 02 validation cannot continue."""


def _read(path: Path) -> str:
    return path.read_bytes().decode("utf-8")


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(text.encode("utf-8"))


def _strip_quotes(value: str) -> str:
    value = value.strip()
    if value.startswith('"') and value.endswith('"'):
        return value[1:-1]
    return value


def _parse_inline_mapping(line: str) -> dict[str, str]:
    body = line.strip()
    if not body.startswith("- {") or not body.endswith("}"):
        raise ValidationError(f"Unsupported manifest mapping: {line}")
    body = body[3:-1]
    result = {}
    for part in body.split(", "):
        key, value = part.split(": ", 1)
        result[key] = _strip_quotes(value)
    return result


def parse_manifest(path: Path) -> dict[str, object]:
    manifest = {"framework": {}, "volumes": [], "appendices": []}
    section = None
    current_volume = None
    in_chapters = False

    for raw_line in _read(path).splitlines():
        stripped = raw_line.strip()
        if not stripped:
            continue
        if stripped in {"framework:", "volumes:", "appendices:"}:
            section = stripped[:-1]
            current_volume = None
            in_chapters = False
            continue
        if section == "framework" and raw_line.startswith("  "):
            key, value = stripped.split(": ", 1)
            manifest["framework"][key] = _strip_quotes(value)
            continue
        if section == "volumes":
            if raw_line.startswith("  - id:"):
                current_volume = {"id": _strip_quotes(stripped.split(": ", 1)[1]), "chapters": []}
                manifest["volumes"].append(current_volume)
                in_chapters = False
                continue
            if current_volume is not None and raw_line.startswith("    ") and not raw_line.startswith("      "):
                if stripped == "chapters:":
                    in_chapters = True
                    continue
                key, value = stripped.split(": ", 1)
                current_volume[key] = _strip_quotes(value)
                continue
            if current_volume is not None and in_chapters and raw_line.startswith("      - {"):
                current_volume["chapters"].append(_parse_inline_mapping(stripped))
                continue
        if section == "appendices" and raw_line.startswith("  - {"):
            manifest["appendices"].append(_parse_inline_mapping(stripped))
            continue
    return manifest


def chapter_records(manifest: dict[str, object]) -> list[dict[str, str]]:
    records = []
    for volume in manifest["volumes"]:
        for chapter in volume["chapters"]:
            records.append(
                {
                    "number": chapter["number"],
                    "title": chapter["title"],
                    "filename": chapter["filename"],
                    "directory": volume["directory"],
                    "path": f"{volume['directory']}/{chapter['filename']}",
                }
            )
    return records


def appendix_records(manifest: dict[str, object]) -> list[dict[str, str]]:
    return list(manifest["appendices"])


def normalize_final_newline(text: str) -> str:
    return text.rstrip("\r\n") + "\n"


def sha256_text(text: str) -> str:
    return hashlib.sha256(normalize_final_newline(text).encode("utf-8")).hexdigest()


def parse_source_blocks(source_text: str) -> dict[str, str]:
    start_numbers = re.findall(r"<!-- RAF_CHAPTER_(\d{2})_START -->", source_text)
    end_numbers = re.findall(r"<!-- RAF_CHAPTER_(\d{2})_END -->", source_text)
    if len(start_numbers) != 35:
        raise ValidationError(f"Expected 35 chapter start markers, found {len(start_numbers)}")
    if len(end_numbers) != 35:
        raise ValidationError(f"Expected 35 chapter end markers, found {len(end_numbers)}")
    duplicates = sorted({number for number in start_numbers if start_numbers.count(number) > 1})
    if duplicates:
        raise ValidationError(f"Duplicate chapter start marker(s): {', '.join(duplicates)}")
    duplicates = sorted({number for number in end_numbers if end_numbers.count(number) > 1})
    if duplicates:
        raise ValidationError(f"Duplicate chapter end marker(s): {', '.join(duplicates)}")

    blocks = {}
    for number in [f"{value:02d}" for value in range(1, 36)]:
        pattern = re.compile(
            rf"<!-- RAF_CHAPTER_{number}_START -->(.*?)<!-- RAF_CHAPTER_{number}_END -->",
            re.DOTALL,
        )
        matches = pattern.findall(source_text)
        if len(matches) != 1:
            raise ValidationError(f"Chapter {number} block must exist exactly once")
        blocks[number] = matches[0].strip("\r\n")

    if re.search(r"<!-- RAF_APPENDIX_[A-E]_(START|END) -->", source_text):
        raise ValidationError("Appendix markers are not allowed in the Phase 02 source")
    return blocks


def parse_front_matter(document: str) -> tuple[dict[str, str], str, str]:
    if not document.startswith("---"):
        raise ValidationError("Document is missing YAML front matter")
    line_end = "\r\n" if "\r\n" in document[:10] else "\n"
    separator = f"{line_end}---{line_end}"
    end = document.find(separator, 3)
    if end == -1:
        raise ValidationError("Document front matter is not closed")
    front_text = document[: end + len(separator)]
    body = document[end + len(separator) :]
    data = {}
    for line in front_text.splitlines()[1:-1]:
        if ": " in line:
            key, value = line.split(": ", 1)
            data[key] = _strip_quotes(value)
    return data, front_text, body


def replace_content_state(front_text: str) -> str:
    old = "content_state: NOT_IMPORTED"
    new = "content_state: IMPORTED"
    if front_text.count(old) != 1:
        raise ValidationError("Front matter must contain content_state: NOT_IMPORTED exactly once")
    return front_text.replace(old, new, 1)


def preflight(root: Path) -> tuple[dict[str, str], list[dict[str, str]]]:
    manifest = parse_manifest(root / "FRAMEWORK_MANIFEST.yaml")
    records = chapter_records(manifest)
    if len(records) != 35:
        raise ValidationError(f"Manifest must define exactly 35 chapters, found {len(records)}")
    if [record["number"] for record in records] != [f"{value:02d}" for value in range(1, 36)]:
        raise ValidationError("Manifest chapters must be 01-35 exactly once and in order")

    source_path = root / "inputs" / "FROZEN_CHAPTERS_SOURCE.md"
    if not source_path.is_file():
        raise ValidationError("Missing inputs/FROZEN_CHAPTERS_SOURCE.md")
    blocks = parse_source_blocks(_read(source_path))

    for record in records:
        number = record["number"]
        expected_h1 = f"# Chapter {number} — {record['title']}"
        first_line = blocks[number].splitlines()[0] if blocks[number].splitlines() else ""
        if first_line != expected_h1:
            raise ValidationError(f"Chapter {number} H1 mismatch: expected {expected_h1!r}, found {first_line!r}")
        destination = root / record["path"]
        if not destination.is_file():
            raise ValidationError(f"Missing destination chapter file: {record['path']}")
        front_matter, _, _ = parse_front_matter(_read(destination))
        if front_matter.get("content_state") != "NOT_IMPORTED":
            raise ValidationError(f"Destination must be NOT_IMPORTED before import: {record['path']}")
    return blocks, records


def import_chapters(root: Path) -> list[str]:
    blocks, records = preflight(root)
    changed = []
    for record in records:
        destination = root / record["path"]
        document = _read(destination)
        _, front_text, _ = parse_front_matter(document)
        new_document = replace_content_state(front_text) + normalize_final_newline(blocks[record["number"]])
        _write(destination, new_document)
        changed.append(record["path"])
    return changed


def validate(root: Path) -> tuple[dict[str, object], dict[str, object]]:
    errors = []
    hashes = {"chapters": {}}
    manifest = parse_manifest(root / "FRAMEWORK_MANIFEST.yaml")
    records = chapter_records(manifest)

    try:
        source_blocks = parse_source_blocks(_read(root / "inputs" / "FROZEN_CHAPTERS_SOURCE.md"))
    except Exception as exc:
        source_blocks = {}
        errors.append(str(exc))

    actual_chapter_paths = sorted((root / "docs").rglob("chapter-*.md")) if (root / "docs").exists() else []
    if len(actual_chapter_paths) != 35:
        errors.append(f"Expected exactly 35 destination chapter files, found {len(actual_chapter_paths)}")
    if [record["number"] for record in records] != [f"{value:02d}" for value in range(1, 36)]:
        errors.append("Manifest chapters 01-35 must exist exactly once")

    expected_paths = {str((root / record["path"]).resolve()) for record in records}
    actual_paths = {str(path.resolve()) for path in actual_chapter_paths}
    for unexpected in sorted(actual_paths - expected_paths):
        errors.append(f"Unexpected chapter file: {Path(unexpected).relative_to(root)}")

    for record in records:
        number = record["number"]
        destination = root / record["path"]
        if not destination.is_file():
            errors.append(f"Missing destination chapter file: {record['path']}")
            continue
        try:
            front_matter, _, body = parse_front_matter(_read(destination))
        except ValidationError as exc:
            errors.append(f"{record['path']}: {exc}")
            continue
        expected_h1 = f"# Chapter {number} — {record['title']}"
        first_line = body.splitlines()[0] if body.splitlines() else ""
        if front_matter.get("chapter_number") != number:
            errors.append(f"{record['path']}: chapter_number mismatch")
        if front_matter.get("chapter_title") != record["title"]:
            errors.append(f"{record['path']}: chapter_title mismatch")
        if front_matter.get("status") != "FROZEN":
            errors.append(f"{record['path']}: status must be FROZEN")
        if front_matter.get("content_state") != "IMPORTED":
            errors.append(f"{record['path']}: content_state must be IMPORTED")
        if first_line != expected_h1:
            errors.append(f"{record['path']}: H1 mismatch")
        if PLACEHOLDER_TEXT in body:
            errors.append(f"{record['path']}: placeholder warning remains")

        source_body = source_blocks.get(number)
        if source_body is None:
            errors.append(f"Missing source block for chapter {number}")
            continue
        source_hash = sha256_text(source_body)
        destination_hash = sha256_text(body)
        hashes["chapters"][number] = {
            "path": record["path"],
            "source_sha256": source_hash,
            "destination_sha256": destination_hash,
            "match": source_hash == destination_hash,
        }
        if normalize_final_newline(source_body) != normalize_final_newline(body):
            errors.append(f"{record['path']}: source and destination body differ")

    for appendix in appendix_records(manifest):
        path = root / appendix["directory"] / appendix["filename"]
        if not path.is_file():
            errors.append(f"Missing appendix file: {appendix['directory']}/{appendix['filename']}")
            continue
        try:
            front_matter, _, _ = parse_front_matter(_read(path))
        except ValidationError as exc:
            errors.append(f"{path.relative_to(root)}: {exc}")
            continue
        if front_matter.get("content_state") != "NOT_IMPORTED":
            errors.append(f"{path.relative_to(root)}: appendix must remain NOT_IMPORTED")

    for path in root.rglob("*"):
        if not path.is_file():
            continue
        relative = path.relative_to(root).as_posix()
        suffix = path.suffix.lower()
        if suffix in FORBIDDEN_EXTENSIONS:
            errors.append(f"Forbidden derived output: {relative}")
        if relative.startswith("release/") and suffix in FORBIDDEN_RELEASE_EXTENSIONS:
            errors.append(f"Forbidden release ZIP output: {relative}")

    result = {
        "status": "PASS" if not errors else "FAIL",
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "chapter_count": len(actual_chapter_paths),
        "hash_match_count": sum(1 for item in hashes["chapters"].values() if item["match"]),
        "errors": errors,
    }
    return result, hashes


def main(argv: list[str]) -> int:
    root = Path(argv[1]).resolve() if len(argv) > 1 else Path.cwd().resolve()
    result, hashes = validate(root)
    validation_path = root / "build" / "validation" / "phase-02-chapter-import.json"
    hashes_path = root / "build" / "validation" / "phase-02-chapter-hashes.json"
    _write(validation_path, json.dumps(result, indent=2, ensure_ascii=False) + "\n")
    _write(hashes_path, json.dumps(hashes, indent=2, ensure_ascii=False) + "\n")
    print(result["status"])
    print(f"Chapters checked: {result['chapter_count']}")
    print(f"Hash matches: {result['hash_match_count']}/35")
    for error in result["errors"]:
        print(f"- {error}")
    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
