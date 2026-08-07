import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.governance.config import build_stage1_governance_service
from ftv.governance.models import Actor, RecordReference
from ftv.workflow_orchestration.adapters import RecordingWorkflowCommandDispatcher
from ftv.workflow_orchestration.config import build_stage10_workflow_orchestration_service
from ftv.workflow_orchestration.constants import SERVICE_HUMAN_REVIEW, SERVICE_MEDIA_PROCESSING, SERVICE_PERFORMANCE_DATA
from ftv.workflow_orchestration.contracts import (
    CancelWorkflowRunCommand,
    RegisterWorkflowCommand,
    RetryWorkflowRunCommand,
    StartWorkflowRunCommand,
)
from ftv.workflow_orchestration.models import WorkflowTargetCommand
from ftv.workflow_orchestration.state import WorkflowRunState, WorkflowStepState, WorkflowTriggerType


class WorkflowOrchestrationServiceIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.operator = Actor("ops-1", "Operator")
        self.governance = build_stage1_governance_service()
        self.dispatcher = RecordingWorkflowCommandDispatcher()
        self.workflow = build_stage10_workflow_orchestration_service(self.governance, self.dispatcher)

    def target_commands(self):
        return (
            WorkflowTargetCommand(
                SERVICE_MEDIA_PROCESSING,
                "start_processing_job",
                RecordReference("Media processing job", "job-1"),
                {"mode": "manual"},
            ),
            WorkflowTargetCommand(
                SERVICE_HUMAN_REVIEW,
                "request_review",
                RecordReference("Review assignment", "review-1"),
                {"reason": "workflow handoff"},
            ),
            WorkflowTargetCommand(
                SERVICE_PERFORMANCE_DATA,
                "import_metrics",
                RecordReference("Performance import", "import-1"),
                {"source": "csv"},
            ),
        )

    def register_manual_run(self, dispatcher=None):
        if dispatcher is not None:
            self.workflow = build_stage10_workflow_orchestration_service(self.governance, dispatcher)
        return self.workflow.register_workflow(
            RegisterWorkflowCommand(
                "Manual operations run",
                WorkflowTriggerType.MANUAL,
                "manual-operator",
                self.operator,
                self.target_commands(),
            )
        )

    def test_manual_trigger_coordinates_owner_service_commands_without_owning_target_state(self):
        workflow_run = self.register_manual_run()

        result = self.workflow.start_workflow(StartWorkflowRunCommand(workflow_run.workflow_run_id, self.operator))
        history = self.workflow.list_history_for_run(workflow_run.workflow_run_id)

        self.assertEqual(WorkflowRunState.COMPLETED, result.state)
        self.assertEqual([WorkflowStepState.COMPLETED] * 3, [step.state for step in result.steps])
        self.assertEqual(self.target_commands(), tuple(self.dispatcher.dispatched))
        self.assertIn("target_record", result.steps[0].output_summary)
        self.assertEqual(WorkflowRunState.REQUESTED, history[0].current_state)
        self.assertTrue(history[0].audit_event_id.startswith("audit-"))
        self.assertTrue(history[-1].audit_event_id.startswith("audit-"))

    def test_failure_visibility_records_failed_step_and_run(self):
        failing_dispatcher = RecordingWorkflowCommandDispatcher(fail_commands=("request_review",))
        workflow_run = self.register_manual_run(failing_dispatcher)

        result = self.workflow.start_workflow(StartWorkflowRunCommand(workflow_run.workflow_run_id, self.operator))
        history = self.workflow.list_history_for_run(workflow_run.workflow_run_id)

        self.assertEqual(WorkflowRunState.FAILED, result.state)
        self.assertEqual(WorkflowStepState.FAILED, result.steps[1].state)
        self.assertIn("request_review", result.failure_reason)
        self.assertEqual(result.steps[1].step_id, history[-1].step_id)
        self.assertTrue(history[-1].audit_event_id.startswith("audit-"))

    def test_failed_run_can_be_marked_retrying_and_restarted(self):
        retry_dispatcher = RecordingWorkflowCommandDispatcher(fail_once_commands=("import_metrics",))
        workflow_run = self.register_manual_run(retry_dispatcher)
        failed = self.workflow.start_workflow(StartWorkflowRunCommand(workflow_run.workflow_run_id, self.operator))
        self.assertEqual(WorkflowRunState.FAILED, failed.state)

        retry_ready = self.workflow.retry_workflow(
            RetryWorkflowRunCommand(workflow_run.workflow_run_id, self.operator, "Retry after CSV correction")
        )
        completed = self.workflow.start_workflow(StartWorkflowRunCommand(retry_ready.workflow_run_id, self.operator))

        self.assertEqual(1, retry_ready.retry_count)
        self.assertEqual(WorkflowRunState.REQUESTED, retry_ready.state)
        self.assertEqual(WorkflowRunState.COMPLETED, completed.state)
        self.assertGreaterEqual(retry_dispatcher.attempts_for(self.target_commands()[2]), 2)

    def test_requested_run_can_be_cancelled_with_manual_fallback_reason(self):
        workflow_run = self.register_manual_run()

        cancelled = self.workflow.cancel_workflow(
            CancelWorkflowRunCommand(workflow_run.workflow_run_id, self.operator, "Continue manually")
        )

        self.assertEqual(WorkflowRunState.CANCELLED, cancelled.state)
        self.assertEqual("Continue manually", cancelled.failure_reason)

    def test_scheduled_trigger_is_a_boundary_not_an_autonomous_scheduler(self):
        result = self.workflow.register_workflow(
            RegisterWorkflowCommand(
                "Nightly import boundary",
                WorkflowTriggerType.SCHEDULED_BOUNDARY,
                "scheduled-boundary:daily-performance-import",
                self.operator,
                (
                    WorkflowTargetCommand(
                        SERVICE_PERFORMANCE_DATA,
                        "import_metrics",
                        RecordReference("Performance import", "import-scheduled-1"),
                    ),
                ),
            )
        )

        self.assertEqual(WorkflowTriggerType.SCHEDULED_BOUNDARY, result.trigger_type)
        self.assertEqual(WorkflowRunState.REQUESTED, result.state)
        self.assertEqual([], self.dispatcher.dispatched)


if __name__ == "__main__":
    unittest.main()
