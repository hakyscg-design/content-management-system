import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.analytics_reporting.dataset import AnalyticsDatasetBuilder
from ftv.analytics_reporting.state import AggregationMethod
from ftv.governance.models import RecordReference
from ftv.performance_data.models import PerformanceFact


class AnalyticsDatasetBuilderTests(unittest.TestCase):
    def test_dataset_aggregates_by_content_and_platform(self):
        facts = [
            PerformanceFact.create(
                "import-1",
                RecordReference("Publishing package", "pub-1"),
                RecordReference("Content package", "content-1"),
                "youtube",
                "views",
                10,
                "count",
                "10",
                "count",
                "2026-07-30",
                1,
            ),
            PerformanceFact.create(
                "import-1",
                RecordReference("Publishing package", "pub-1"),
                RecordReference("Content package", "content-1"),
                "youtube",
                "views",
                15,
                "count",
                "15",
                "count",
                "2026-07-31",
                2,
            ),
        ]

        dataset = AnalyticsDatasetBuilder().build(
            facts,
            ("views",),
            ("content_package", "platform"),
            AggregationMethod.SUM,
        )

        self.assertEqual(1, len(dataset.rows))
        self.assertEqual(25, dataset.rows[0].value)
        self.assertEqual("content-1", dataset.rows[0].dimensions["content_package"])


if __name__ == "__main__":
    unittest.main()
