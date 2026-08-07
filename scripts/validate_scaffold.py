#!/usr/bin/env python3
"""Validate the RAF Phase 01 repository scaffold."""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


EXPECTED_TOP_LEVEL_FILES = [
    "AGENTS.md",
    "README.md",
    "PROJECT_CONTEXT.md",
    "FROZEN_CONTENT_POLICY.md",
    "FRAMEWORK_MANIFEST.yaml",
    "VERSION",
    "CHANGELOG.md",
    "LICENSE_NOTICE.md",
    "CONTRIBUTING.md",
]

EXPECTED_DIRECTORIES = [
    "docs",
    "docs/front-matter",
    "appendices",
    "assets/images",
    "assets/diagrams",
    "assets/styles",
    "templates",
    "prompts",
    "workbooks",
    "scripts",
    "build/interim",
    "build/reports",
    "build/validation",
    "release",
    "tests",
]

FORBIDDEN_EXTENSIONS = {".docx", ".pdf", ".xlsx"}
FORBIDDEN_RELEASE_EXTENSIONS = {".zip"}


def _strip_quotes(value: str) -> str:
    value = value.strip()
    if value.startswith('"') and value.endswith('"'):
        return value[1:-1]
    return value


def _parse_inline_mapping(line: str) -> dict[str, str]:
    body = line.strip()
    if not (body.startswith("- {") and body.endswith("}")):
        raise ValueError(f"Unsupported manifest mapping: {line}")
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

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.rstrip()
        stripped = line.strip()
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


def parse_front_matter(path: Path) -> tuple[dict[str, str], str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}, text
    front = text[4:end]
    body = text[end + 5 :]
    data = {}
    for line in front.splitlines():
        if ": " not in line:
            continue
        key, value = line.split(": ", 1)
        data[key] = _strip_quotes(value)
    return data, body


def expected_chapter_text(number: str, title: str) -> str:
    return (
        "---\n"
        "document_type: chapter\n"
        "framework: Repository Acquisition Framework\n"
        "framework_version: 1.0\n"
        f'chapter_number: "{number}"\n'
        f'chapter_title: "{title}"\n'
        "status: FROZEN\n"
        "content_state: NOT_IMPORTED\n"
        "---\n\n"
        f"# Chapter {number} 窶・{title}\n\n"
        "> Frozen content has not yet been imported.\n"
        "> Do not author or infer content in this file.\n"
    )


def expected_appendix_text(appendix_id: str, title: str) -> str:
    return (
        "---\n"
        "document_type: appendix\n"
        "framework: Repository Acquisition Framework\n"
        "framework_version: 1.0\n"
        f'appendix_id: "{appendix_id}"\n'
        f'appendix_title: "{title}"\n'
        "status: FROZEN\n"
        "content_state: NOT_IMPORTED\n"
        "---\n\n"
        f"# Appendix {appendix_id} 窶・{title}\n\n"
        "> Frozen content has not yet been imported.\n"
        "> Do not author or infer content in this file.\n"
    )


def validate(root: Path) -> dict[str, object]:
    errors = []
    manifest_path = root / "FRAMEWORK_MANIFEST.yaml"
    manifest = parse_manifest(manifest_path) if manifest_path.exists() else {"volumes": [], "appendices": []}

    for file_name in EXPECTED_TOP_LEVEL_FILES:
        if not (root / file_name).is_file():
            errors.append(f"Missing required file: {file_name}")

    for directory in EXPECTED_DIRECTORIES:
        if not (root / directory).is_dir():
            errors.append(f"Missing required directory: {directory}")

    if (root / "VERSION").exists() and (root / "VERSION").read_text(encoding="utf-8").strip() != "1.0.0":
        errors.append("VERSION must be exactly 1.0.0")

    volumes = manifest.get("volumes", [])
    appendices = manifest.get("appendices", [])
    expected_volume_ids = ["I", "II", "III", "IV", "V", "VI", "VII"]
    actual_volume_ids = [volume.get("id") for volume in volumes]
    if actual_volume_ids != expected_volume_ids:
        errors.append("Manifest volumes must be I-VII in order")

    expected_chapters = []
    for volume in volumes:
        directory = volume.get("directory", "")
        if directory and not (root / directory).is_dir():
            errors.append(f"Missing manifest volume directory: {directory}")
        if directory and not (root / directory / "index.md").is_file():
            errors.append(f"Missing volume index: {directory}/index.md")
        for chapter in volume.get("chapters", []):
            expected_chapters.append((volume, chapter))

    chapter_numbers = [chapter["number"] for _, chapter in expected_chapters]
    if len(expected_chapters) != 35:
        errors.append(f"Expected 35 manifest chapters, found {len(expected_chapters)}")
    if sorted(chapter_numbers) != [f"{number:02d}" for number in range(1, 36)]:
        errors.append("Chapters 01-35 must exist exactly once in the manifest")

    expected_chapter_paths = set()
    for volume, chapter in expected_chapters:
        path = root / volume["directory"] / chapter["filename"]
        expected_chapter_paths.add(path.resolve())
        if not path.is_file():
            errors.append(f"Missing chapter placeholder: {path.relative_to(root)}")
            continue
        text = path.read_text(encoding="utf-8")
        expected_text = expected_chapter_text(chapter["number"], chapter["title"])
        if text != expected_text:
            errors.append(f"Chapter placeholder content mismatch: {path.relative_to(root)}")
        front_matter, _ = parse_front_matter(path)
        expected_front_matter = {
            "document_type": "chapter",
            "framework": "Repository Acquisition Framework",
            "framework_version": "1.0",
            "chapter_number": chapter["number"],
            "chapter_title": chapter["title"],
            "status": "FROZEN",
            "content_state": "NOT_IMPORTED",
        }
        if front_matter != expected_front_matter:
            errors.append(f"Chapter front matter mismatch: {path.relative_to(root)}")

    actual_chapter_paths = {path.resolve() for path in (root / "docs").rglob("chapter-*.md")} if (root / "docs").exists() else set()
    for path in sorted(actual_chapter_paths - expected_chapter_paths):
        errors.append(f"Unexpected chapter source: {path.relative_to(root)}")
    if len(actual_chapter_paths) != 35:
        errors.append(f"Expected exactly 35 chapter Markdown files, found {len(actual_chapter_paths)}")

    if not (root / "appendices" / "index.md").is_file():
        errors.append("Missing appendices/index.md")

    appendix_ids = [appendix["id"] for appendix in appendices]
    if appendix_ids != ["A", "B", "C", "D", "E"]:
        errors.append("Appendices A-E must exist exactly once in the manifest")
    if len(appendices) != 5:
        errors.append(f"Expected five manifest appendices, found {len(appendices)}")

    expected_appendix_paths = set()
    for appendix in appendices:
        directory = root / appendix["directory"]
        path = directory / appendix["filename"]
        expected_appendix_paths.add(path.resolve())
        if not directory.is_dir():
            errors.append(f"Missing appendix directory: {appendix['directory']}")
        if not (directory / "index.md").is_file():
            errors.append(f"Missing appendix index: {appendix['directory']}/index.md")
        if not path.is_file():
            errors.append(f"Missing appendix placeholder: {path.relative_to(root)}")
            continue
        text = path.read_text(encoding="utf-8")
        expected_text = expected_appendix_text(appendix["id"], appendix["title"])
        if text != expected_text:
            errors.append(f"Appendix placeholder content mismatch: {path.relative_to(root)}")
        front_matter, _ = parse_front_matter(path)
        expected_front_matter = {
            "document_type": "appendix",
            "framework": "Repository Acquisition Framework",
            "framework_version": "1.0",
            "appendix_id": appendix["id"],
            "appendix_title": appendix["title"],
            "status": "FROZEN",
            "content_state": "NOT_IMPORTED",
        }
        if front_matter != expected_front_matter:
            errors.append(f"Appendix front matter mismatch: {path.relative_to(root)}")

    actual_appendix_paths = {path.resolve() for path in (root / "appendices").rglob("appendix-*.md")} if (root / "appendices").exists() else set()
    for path in sorted(actual_appendix_paths - expected_appendix_paths):
        errors.append(f"Unexpected appendix source: {path.relative_to(root)}")
    if len(actual_appendix_paths) != 5:
        errors.append(f"Expected exactly 5 appendix Markdown files, found {len(actual_appendix_paths)}")

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
        "appendix_count": len(actual_appendix_paths),
        "errors": errors,
    }
    return result


def main(argv: list[str]) -> int:
    root = Path(argv[1]).resolve() if len(argv) > 1 else Path.cwd().resolve()
    result = validate(root)
    output_path = root / "build" / "validation" / "phase-01-validation.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(result["status"])
    for error in result["errors"]:
        print(f"- {error}")
    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
