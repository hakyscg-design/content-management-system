import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.content_production.config import build_stage5_content_production_service
from ftv.governance.config import build_stage1_governance_service
from ftv.human_review.config import build_stage6_human_review_service


class HumanReviewSmokeTests(unittest.TestCase):
    def test_stage6_service_builds_with_empty_in_memory_repositories(self):
        governance = build_stage1_governance_service()
        content = build_stage5_content_production_service(governance=governance)
        service = build_stage6_human_review_service(content, governance)

        self.assertEqual([], service.list_assignments())
        self.assertEqual([], service.list_approval_statuses())


if __name__ == "__main__":
    unittest.main()
