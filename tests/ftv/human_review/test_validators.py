import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.governance.models import Actor, RecordReference
from ftv.human_review.contracts import RequestReviewCommand
from ftv.human_review.errors import ReviewValidationError
from ftv.human_review.policies import StaticReviewerAvailabilityPolicy
from ftv.human_review.state import ReviewStatus
from ftv.human_review.validators import HumanReviewValidator


class HumanReviewValidatorTests(unittest.TestCase):
    def setUp(self):
        self.actor = Actor("reviewer", "Reviewer")
        self.validator = HumanReviewValidator(StaticReviewerAvailabilityPolicy(("blocked",)))

    def test_review_request_requires_target_and_reason(self):
        with self.assertRaises(ReviewValidationError):
            self.validator.validate_request(
                RequestReviewCommand(RecordReference("Content package", "target-1"), self.actor, "")
            )
        with self.assertRaises(ReviewValidationError):
            blank_actor = type("BlankActor", (), {"actor_id": ""})()
            self.validator.validate_request(
                RequestReviewCommand(RecordReference("Content package", "target-1"), blank_actor, "Ready")
            )

    def test_active_review_blocks_duplicate_request(self):
        with self.assertRaises(ReviewValidationError):
            self.validator.validate_can_request_new_review([ReviewStatus.REQUESTED])

    def test_completed_review_does_not_block_new_review(self):
        self.validator.validate_can_request_new_review([ReviewStatus.RETURNED])


if __name__ == "__main__":
    unittest.main()
