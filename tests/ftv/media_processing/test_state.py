import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.media_processing.errors import ProcessingStateTransitionError
from ftv.media_processing.state import ProcessingJobState, assert_job_transition


class MediaProcessingStateTests(unittest.TestCase):
    def test_pending_can_start_or_cancel(self):
        assert_job_transition(ProcessingJobState.PENDING, ProcessingJobState.RUNNING)
        assert_job_transition(ProcessingJobState.PENDING, ProcessingJobState.CANCELLED)

    def test_failed_can_retry_or_cancel(self):
        assert_job_transition(ProcessingJobState.FAILED, ProcessingJobState.PENDING)
        assert_job_transition(ProcessingJobState.FAILED, ProcessingJobState.CANCELLED)

    def test_completed_is_terminal(self):
        with self.assertRaises(ProcessingStateTransitionError):
            assert_job_transition(ProcessingJobState.COMPLETED, ProcessingJobState.PENDING)


if __name__ == "__main__":
    unittest.main()
