import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.workflow_orchestration.errors import WorkflowStateTransitionError
from ftv.workflow_orchestration.state import WorkflowRunState, assert_run_transition


class WorkflowStateTests(unittest.TestCase):
    def test_requested_can_start_or_cancel(self):
        assert_run_transition(WorkflowRunState.REQUESTED, WorkflowRunState.RUNNING)
        assert_run_transition(WorkflowRunState.REQUESTED, WorkflowRunState.CANCELLED)

    def test_completed_is_terminal(self):
        with self.assertRaises(WorkflowStateTransitionError):
            assert_run_transition(WorkflowRunState.COMPLETED, WorkflowRunState.RUNNING)

    def test_failed_can_enter_retrying(self):
        assert_run_transition(WorkflowRunState.FAILED, WorkflowRunState.RETRYING)


if __name__ == "__main__":
    unittest.main()

