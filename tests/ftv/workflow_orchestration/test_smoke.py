import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.governance.config import build_stage1_governance_service
from ftv.governance.models import Actor, RecordReference
from ftv.workflow_orchestration.config import build_stage10_workflow_orchestration_service
from ftv.workflow_orchestration.constants import SERVICE_MEDIA_PROCESSING
from ftv.workflow_orchestration.contracts import RegisterWorkflowCommand
from ftv.workflow_orchestration.models import WorkflowTargetCommand
from ftv.workflow_orchestration.state import WorkflowRunState, WorkflowTriggerType


class WorkflowSmokeTests(unittest.TestCase):
    def test_workflow_run_can_be_registered(self):
        service = build_stage10_workflow_orchestration_service(build_stage1_governance_service())
        run = service.register_workflow(
            RegisterWorkflowCommand(
                "Smoke workflow",
                WorkflowTriggerType.MANUAL,
                "manual-smoke",
                Actor("operator"),
                (
                    WorkflowTargetCommand(
                        SERVICE_MEDIA_PROCESSING,
                        "start_processing_job",
                        RecordReference("Media processing job", "job-smoke"),
                    ),
                ),
            )
        )

        self.assertEqual(WorkflowRunState.REQUESTED, run.state)
        self.assertEqual(1, len(service.list_workflow_runs()))


if __name__ == "__main__":
    unittest.main()

