import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.governance.models import Actor, RecordReference
from ftv.workflow_orchestration.constants import SERVICE_MEDIA_PROCESSING
from ftv.workflow_orchestration.contracts import CancelWorkflowRunCommand, RegisterWorkflowCommand, RetryWorkflowRunCommand
from ftv.workflow_orchestration.errors import WorkflowValidationError
from ftv.workflow_orchestration.models import WorkflowTargetCommand
from ftv.workflow_orchestration.state import WorkflowTriggerType
from ftv.workflow_orchestration.validators import WorkflowValidator


class WorkflowValidatorTests(unittest.TestCase):
    def setUp(self):
        self.actor = Actor("operator")
        self.validator = WorkflowValidator((SERVICE_MEDIA_PROCESSING,), max_retry_count=1)

    def target_command(self):
        return WorkflowTargetCommand(
            SERVICE_MEDIA_PROCESSING,
            "start_processing_job",
            RecordReference("Media processing job", "job-1"),
        )

    def test_registration_requires_owner_service_command(self):
        with self.assertRaises(WorkflowValidationError):
            self.validator.validate_registration(
                RegisterWorkflowCommand("Media run", WorkflowTriggerType.MANUAL, "manual-ui", self.actor, ())
            )

    def test_registration_rejects_unsupported_target_owner_service(self):
        with self.assertRaises(WorkflowValidationError):
            self.validator.validate_registration(
                RegisterWorkflowCommand(
                    "Bad target",
                    WorkflowTriggerType.MANUAL,
                    "manual-ui",
                    self.actor,
                    (WorkflowTargetCommand("FTV-SVC-03", "mutate_content", RecordReference("Content package", "c1")),),
                )
            )

    def test_retry_requires_reason_and_respects_limit(self):
        with self.assertRaises(WorkflowValidationError):
            self.validator.validate_retry(RetryWorkflowRunCommand("run-1", self.actor, " "), 0)
        with self.assertRaises(WorkflowValidationError):
            self.validator.validate_retry(RetryWorkflowRunCommand("run-1", self.actor, "Retry"), 1)

    def test_cancel_requires_reason(self):
        with self.assertRaises(WorkflowValidationError):
            self.validator.validate_cancel(CancelWorkflowRunCommand("run-1", self.actor, " "))


if __name__ == "__main__":
    unittest.main()

