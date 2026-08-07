import importlib.util
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VALIDATOR_PATH = ROOT / "scripts" / "validate_scaffold.py"

spec = importlib.util.spec_from_file_location("validate_scaffold", VALIDATOR_PATH)
validate_scaffold = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validate_scaffold)


def phase_02_imported():
    chapter = ROOT / "docs" / "volume-01-foundation" / "chapter-01-introduction.md"
    if not chapter.exists():
        return False
    return "content_state: IMPORTED" in chapter.read_text(encoding="utf-8")


class ValidateScaffoldTests(unittest.TestCase):
    def test_expected_chapter_count(self):
        manifest = validate_scaffold.parse_manifest(ROOT / "FRAMEWORK_MANIFEST.yaml")
        chapters = [chapter for volume in manifest["volumes"] for chapter in volume["chapters"]]
        self.assertEqual(35, len(chapters))
        self.assertEqual([f"{number:02d}" for number in range(1, 36)], [chapter["number"] for chapter in chapters])

    def test_expected_appendix_count(self):
        manifest = validate_scaffold.parse_manifest(ROOT / "FRAMEWORK_MANIFEST.yaml")
        self.assertEqual(5, len(manifest["appendices"]))
        self.assertEqual(["A", "B", "C", "D", "E"], [appendix["id"] for appendix in manifest["appendices"]])

    def test_manifest_parsing(self):
        manifest = validate_scaffold.parse_manifest(ROOT / "FRAMEWORK_MANIFEST.yaml")
        self.assertEqual("Repository Acquisition Framework", manifest["framework"]["name"])
        self.assertEqual("Foundation", manifest["volumes"][0]["title"])
        self.assertEqual("chapter-35-continuous-re-evaluation.md", manifest["volumes"][-1]["chapters"][-1]["filename"])
        self.assertEqual("appendix-e-excel-workbook-specification.md", manifest["appendices"][-1]["filename"])

    @unittest.skipIf(phase_02_imported(), "Phase 01 scaffold validator expects NOT_IMPORTED placeholders before Phase 02 import")
    def test_validator_success(self):
        result = subprocess.run(
            [sys.executable, str(VALIDATOR_PATH), str(ROOT)],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(0, result.returncode, result.stdout + result.stderr)
        self.assertIn("PASS", result.stdout)

    def test_validator_failure_when_required_placeholder_missing(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_root = Path(temp_dir) / "raf"
            ignore = shutil.ignore_patterns(".git", "__pycache__", "*.pyc")
            shutil.copytree(ROOT, temp_root, ignore=ignore)
            missing = temp_root / "docs" / "volume-01-foundation" / "chapter-01-introduction.md"
            missing.unlink()

            result = subprocess.run(
                [sys.executable, str(temp_root / "scripts" / "validate_scaffold.py"), str(temp_root)],
                capture_output=True,
                text=True,
                check=False,
            )

            self.assertNotEqual(0, result.returncode)
            self.assertIn("FAIL", result.stdout)
            self.assertIn("Missing chapter placeholder", result.stdout)


if __name__ == "__main__":
    unittest.main()
