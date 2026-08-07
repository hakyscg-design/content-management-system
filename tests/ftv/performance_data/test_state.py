import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.performance_data.errors import PerformanceStateTransitionError
from ftv.performance_data.state import PerformanceImportState, assert_import_transition


class PerformanceDataStateTests(unittest.TestCase):
    def test_pending_can_import_or_cancel(self):
        assert_import_transition(PerformanceImportState.PENDING, PerformanceImportState.IMPORTING)
        assert_import_transition(PerformanceImportState.PENDING, PerformanceImportState.CANCELLED)

    def test_importing_can_import_fail_or_cancel(self):
        assert_import_transition(PerformanceImportState.IMPORTING, PerformanceImportState.IMPORTED)
        assert_import_transition(PerformanceImportState.IMPORTING, PerformanceImportState.FAILED)
        assert_import_transition(PerformanceImportState.IMPORTING, PerformanceImportState.CANCELLED)

    def test_imported_is_terminal(self):
        with self.assertRaises(PerformanceStateTransitionError):
            assert_import_transition(PerformanceImportState.IMPORTED, PerformanceImportState.CANCELLED)


if __name__ == "__main__":
    unittest.main()
