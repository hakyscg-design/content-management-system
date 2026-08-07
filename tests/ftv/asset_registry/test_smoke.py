import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.asset_registry import build_stage3_asset_registry_service


class Stage3SmokeTests(unittest.TestCase):
    def test_stage3_service_builds(self):
        service = build_stage3_asset_registry_service()

        self.assertEqual([], service.list_assets())


if __name__ == "__main__":
    unittest.main()

