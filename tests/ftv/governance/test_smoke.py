import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.governance import build_stage1_governance_service


class Stage1SmokeTests(unittest.TestCase):
    def test_stage1_service_builds(self):
        service = build_stage1_governance_service()

        self.assertEqual("FTV-SVC-09", service.ownership.owner_for("Audit event"))
        self.assertEqual("FTV-SVC-11", service.ownership.owner_for("Admin view configuration"))


if __name__ == "__main__":
    unittest.main()

