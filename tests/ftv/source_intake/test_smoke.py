import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.source_intake import build_stage2_source_intake_service


class Stage2SmokeTests(unittest.TestCase):
    def test_stage2_service_builds(self):
        service = build_stage2_source_intake_service()

        self.assertEqual([], service._sources.list_all())


if __name__ == "__main__":
    unittest.main()

