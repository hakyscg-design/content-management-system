import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.content_production.errors import ContentStateTransitionError
from ftv.content_production.state import ContentPackageState, assert_package_transition


class ContentProductionStateTests(unittest.TestCase):
    def test_draft_can_move_to_in_progress_or_archive(self):
        assert_package_transition(ContentPackageState.DRAFT, ContentPackageState.IN_PROGRESS)
        assert_package_transition(ContentPackageState.DRAFT, ContentPackageState.ARCHIVED)

    def test_in_progress_can_move_to_ready_for_review(self):
        assert_package_transition(ContentPackageState.IN_PROGRESS, ContentPackageState.READY_FOR_REVIEW)

    def test_archived_is_terminal(self):
        with self.assertRaises(ContentStateTransitionError):
            assert_package_transition(ContentPackageState.ARCHIVED, ContentPackageState.IN_PROGRESS)


if __name__ == "__main__":
    unittest.main()
