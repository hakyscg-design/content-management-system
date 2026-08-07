import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.governance.models import Actor
from ftv.performance_data.contracts import DefineMetricCommand, MapMetricCommand
from ftv.performance_data.errors import PerformanceValidationError
from ftv.performance_data.validators import PerformanceValidator


class PerformanceDataValidatorTests(unittest.TestCase):
    def setUp(self):
        self.actor = Actor("analyst", "Analyst")
        self.validator = PerformanceValidator()

    def test_metric_definition_requires_key_name_and_unit(self):
        with self.assertRaises(PerformanceValidationError):
            self.validator.validate_metric_definition(DefineMetricCommand("", "Views", "count", self.actor))
        with self.assertRaises(PerformanceValidationError):
            self.validator.validate_metric_definition(DefineMetricCommand("views", "", "count", self.actor))

    def test_metric_mapping_requires_positive_multiplier(self):
        with self.assertRaises(PerformanceValidationError):
            self.validator.validate_metric_mapping(
                MapMetricCommand("youtube", "views", "views", "count", "count", self.actor, 0)
            )


if __name__ == "__main__":
    unittest.main()
