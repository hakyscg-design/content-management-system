import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.media_processing.config import build_stage4_media_processing_service


class MediaProcessingSmokeTests(unittest.TestCase):
    def test_stage4_service_builds_with_empty_in_memory_repositories(self):
        service = build_stage4_media_processing_service()

        self.assertEqual([], service.list_jobs())


if __name__ == "__main__":
    unittest.main()
