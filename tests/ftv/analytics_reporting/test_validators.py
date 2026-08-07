import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.analytics_reporting.contracts import GenerateAnalyticsReportCommand
from ftv.analytics_reporting.errors import AnalyticsValidationError
from ftv.analytics_reporting.state import AggregationMethod
from ftv.analytics_reporting.validators import AnalyticsValidator
from ftv.governance.models import Actor


class AnalyticsValidatorTests(unittest.TestCase):
    def setUp(self):
        self.validator = AnalyticsValidator()
        self.actor = Actor("analyst", "Analyst")

    def test_report_request_requires_known_metrics(self):
        with self.assertRaises(AnalyticsValidationError):
            self.validator.validate_report_request(
                GenerateAnalyticsReportCommand(
                    "Report",
                    "summary",
                    self.actor,
                    ("unknown",),
                    ("content_package",),
                    AggregationMethod.SUM,
                ),
                ("views",),
            )

    def test_report_request_requires_group_by(self):
        with self.assertRaises(AnalyticsValidationError):
            self.validator.validate_report_request(
                GenerateAnalyticsReportCommand("Report", "summary", self.actor, ("views",), (), AggregationMethod.SUM),
                ("views",),
            )


if __name__ == "__main__":
    unittest.main()
