import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.content_production.config import build_stage5_content_production_service


class ContentProductionSmokeTests(unittest.TestCase):
    def test_stage5_service_builds_with_empty_in_memory_repositories(self):
        service = build_stage5_content_production_service()

        self.assertEqual([], service.list_briefs())
        self.assertEqual([], service.list_packages())


if __name__ == "__main__":
    unittest.main()
