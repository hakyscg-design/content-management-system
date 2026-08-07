import importlib.util
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VALIDATOR_PATH = ROOT / "scripts" / "validate_chapter_import.py"
SOURCE_PATH = ROOT / "inputs" / "FROZEN_CHAPTERS_SOURCE.md"

spec = importlib.util.spec_from_file_location("validate_chapter_import", VALIDATOR_PATH)
validate_chapter_import = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validate_chapter_import)


class ValidateChapterImportTests(unittest.TestCase):
    def test_all_35_source_blocks_parse(self):
        blocks = validate_chapter_import.parse_source_blocks(SOURCE_PATH.read_bytes().decode("utf-8"))
        self.assertEqual(35, len(blocks))
        self.assertEqual([f"{number:02d}" for number in range(1, 36)], sorted(blocks))

    def test_duplicate_marker_is_rejected(self):
        source = SOURCE_PATH.read_bytes().decode("utf-8")
        duplicate = source.replace(
            "<!-- RAF_CHAPTER_02_START -->",
            "<!-- RAF_CHAPTER_01_START -->",
            1,
        )
        with self.assertRaises(validate_chapter_import.ValidationError):
            validate_chapter_import.parse_source_blocks(duplicate)

    def test_missing_marker_is_rejected(self):
        source = SOURCE_PATH.read_bytes().decode("utf-8")
        missing = source.replace("<!-- RAF_CHAPTER_35_END -->", "", 1)
        with self.assertRaises(validate_chapter_import.ValidationError):
            validate_chapter_import.parse_source_blocks(missing)

    def test_title_mismatch_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_root = Path(temp_dir) / "raf"
            shutil.copytree(ROOT, temp_root, ignore=shutil.ignore_patterns(".git", "__pycache__", "*.pyc"))
            source_path = temp_root / "inputs" / "FROZEN_CHAPTERS_SOURCE.md"
            source = source_path.read_bytes().decode("utf-8")
            source_path.write_bytes(source.replace("# Chapter 01 — Introduction", "# Chapter 01 — Wrong", 1).encode("utf-8"))

            with self.assertRaises(validate_chapter_import.ValidationError):
                validate_chapter_import.preflight(temp_root)

    def test_validator_success(self):
        result = subprocess.run(
            [sys.executable, str(VALIDATOR_PATH), str(ROOT)],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        self.assertIn("PASS", result.stdout)
        self.assertIn("Hash matches: 35/35", result.stdout)

    def test_validator_fails_when_destination_body_differs_by_one_character(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_root = Path(temp_dir) / "raf"
            shutil.copytree(ROOT, temp_root, ignore=shutil.ignore_patterns(".git", "__pycache__", "*.pyc"))
            chapter_path = temp_root / "docs" / "volume-01-foundation" / "chapter-01-introduction.md"
            text = chapter_path.read_bytes().decode("utf-8")
            chapter_path.write_bytes(text.replace("Cấu trúc Framework", "Cấu trúc Framework.", 1).encode("utf-8"))

            result = subprocess.run(
                [sys.executable, str(temp_root / "scripts" / "validate_chapter_import.py"), str(temp_root)],
                capture_output=True,
                text=True,
                check=False,
            )

            self.assertNotEqual(0, result.returncode)
            self.assertIn("FAIL", result.stdout)
            self.assertIn("source and destination body differ", result.stdout)


if __name__ == "__main__":
    unittest.main()
