import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.publishing_preparation.errors import PublishingStateTransitionError
from ftv.publishing_preparation.state import PublishingPackageState, assert_publishing_transition


class PublishingPreparationStateTests(unittest.TestCase):
    def test_preparing_can_ready_block_or_cancel(self):
        assert_publishing_transition(PublishingPackageState.PREPARING, PublishingPackageState.READY)
        assert_publishing_transition(PublishingPackageState.PREPARING, PublishingPackageState.BLOCKED)
        assert_publishing_transition(PublishingPackageState.PREPARING, PublishingPackageState.CANCELLED)

    def test_ready_can_complete_block_or_cancel(self):
        assert_publishing_transition(PublishingPackageState.READY, PublishingPackageState.COMPLETED)
        assert_publishing_transition(PublishingPackageState.READY, PublishingPackageState.BLOCKED)
        assert_publishing_transition(PublishingPackageState.READY, PublishingPackageState.CANCELLED)

    def test_completed_is_terminal(self):
        with self.assertRaises(PublishingStateTransitionError):
            assert_publishing_transition(PublishingPackageState.COMPLETED, PublishingPackageState.BLOCKED)


if __name__ == "__main__":
    unittest.main()
