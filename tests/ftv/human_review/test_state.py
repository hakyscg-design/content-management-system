import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.human_review.errors import ReviewStateTransitionError
from ftv.human_review.state import ReviewStatus, assert_review_transition


class HumanReviewStateTests(unittest.TestCase):
    def test_requested_can_assign_or_cancel(self):
        assert_review_transition(ReviewStatus.REQUESTED, ReviewStatus.ASSIGNED)
        assert_review_transition(ReviewStatus.REQUESTED, ReviewStatus.CANCELLED)

    def test_in_review_can_end_with_review_outcomes(self):
        assert_review_transition(ReviewStatus.IN_REVIEW, ReviewStatus.APPROVED)
        assert_review_transition(ReviewStatus.IN_REVIEW, ReviewStatus.REJECTED)
        assert_review_transition(ReviewStatus.IN_REVIEW, ReviewStatus.RETURNED)
        assert_review_transition(ReviewStatus.IN_REVIEW, ReviewStatus.CANCELLED)

    def test_approved_is_terminal(self):
        with self.assertRaises(ReviewStateTransitionError):
            assert_review_transition(ReviewStatus.APPROVED, ReviewStatus.IN_REVIEW)


if __name__ == "__main__":
    unittest.main()
