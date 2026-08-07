import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.governance.config import build_stage1_governance_service
from ftv.governance.models import Actor
from ftv.source_intake.config import build_stage2_source_intake_service
from ftv.source_intake.contracts import (
    ApproveSourceCommand,
    CaptureProvenanceCommand,
    MarkRightsPendingCommand,
    RecordRightsDecisionCommand,
    RegisterSourceCommand,
)
from ftv.source_intake.state import RightsStatus, SourceStatus


class SourceIntakeServiceIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.actor = Actor("intake-user", "Intake User")
        self.service = build_stage2_source_intake_service(build_stage1_governance_service())

    def test_source_registration_to_approval_flow(self):
        source = self.service.register_source(
            RegisterSourceCommand(
                source_uri="https://example.com/source.mp4",
                origin_label="Example account",
                submitted_by=self.actor,
                metadata={"approved_key": "key-001"},
            )
        )
        source = self.service.validate_source(source.source_id, self.actor)
        provenance = self.service.capture_provenance(
            CaptureProvenanceCommand(source.source_id, self.actor, "Captured from approved key")
        )
        source = self.service.mark_rights_pending(
            MarkRightsPendingCommand(source.source_id, self.actor, "Needs rights confirmation")
        )
        source = self.service.record_rights_decision(
            RecordRightsDecisionCommand(
                source.source_id,
                self.actor,
                RightsStatus.APPROVED,
                "Approved for MVP use",
            )
        )
        source = self.service.approve_source(
            ApproveSourceCommand(source.source_id, self.actor, "Manual approval complete")
        )

        self.assertEqual(SourceStatus.APPROVED, source.status)
        self.assertEqual(RightsStatus.APPROVED, source.rights_status)
        self.assertEqual(source.source_id, provenance.source_id)
        self.assertEqual(1, len(self.service.list_provenance(source.source_id)))
        self.assertEqual(1, len(self.service.list_rights_decisions(source.source_id)))

    def test_rejected_rights_cannot_be_approved(self):
        source = self.service.register_source(
            RegisterSourceCommand("https://example.com/source.mp4", "Example", self.actor)
        )
        source = self.service.validate_source(source.source_id, self.actor)
        source = self.service.mark_rights_pending(
            MarkRightsPendingCommand(source.source_id, self.actor, "Needs rights")
        )
        self.service.record_rights_decision(
            RecordRightsDecisionCommand(
                source.source_id,
                self.actor,
                RightsStatus.REJECTED,
                "Rights rejected",
            )
        )

        with self.assertRaises(Exception):
            self.service.approve_source(
                ApproveSourceCommand(source.source_id, self.actor, "Should not approve")
            )


if __name__ == "__main__":
    unittest.main()

