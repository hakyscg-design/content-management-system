import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.source_intake.errors import SourceStateTransitionError
from ftv.source_intake.state import SourceStatus, assert_source_transition


class SourceStateTests(unittest.TestCase):
    def test_valid_source_transition(self):
        assert_source_transition(SourceStatus.CAPTURED, SourceStatus.VALIDATED)

    def test_invalid_source_transition(self):
        with self.assertRaises(SourceStateTransitionError):
            assert_source_transition(SourceStatus.CAPTURED, SourceStatus.APPROVED)


if __name__ == "__main__":
    unittest.main()

