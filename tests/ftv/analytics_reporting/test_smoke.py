import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.analytics_reporting.config import build_stage9_analytics_reporting_service
from ftv.content_production.config import build_stage5_content_production_service
from ftv.governance.config import build_stage1_governance_service
from ftv.human_review.config import build_stage6_human_review_service
from ftv.performance_data.config import build_stage8_performance_data_service
from ftv.publishing_preparation.config import build_stage7_publishing_preparation_service


class AnalyticsReportingSmokeTests(unittest.TestCase):
    def test_stage9_service_builds_with_empty_in_memory_repositories(self):
        governance = build_stage1_governance_service()
        content = build_stage5_content_production_service(governance=governance)
        review = build_stage6_human_review_service(content, governance)
        publishing = build_stage7_publishing_preparation_service(content, review, governance)
        performance = build_stage8_performance_data_service(publishing, governance)
        service = build_stage9_analytics_reporting_service(performance, governance)

        self.assertEqual([], service.list_reports())


if __name__ == "__main__":
    unittest.main()
