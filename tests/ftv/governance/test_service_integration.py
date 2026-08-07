import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.governance.config import build_stage1_governance_service
from ftv.governance.constants import RELATION_ADMIN
from ftv.governance.contracts import (
    CheckAuthorizationCommand,
    ConfigureAdminViewCommand,
    EvaluateRuleCommand,
    RecordAuditEventCommand,
)
from ftv.governance.models import Actor, RecordReference


class GovernanceServiceIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.service = build_stage1_governance_service()
        self.actor = Actor("admin-1", "Admin")
        self.audit_ref = RecordReference("Audit event", "audit-1")

    def test_authorization_grant_and_check(self):
        self.service.grant_relation(self.actor, RELATION_ADMIN, self.audit_ref)

        allowed = self.service.check_authorization(
            CheckAuthorizationCommand(self.actor, "mutate:create", self.audit_ref)
        )

        self.assertTrue(allowed)

    def test_rule_evaluation_and_audit_event_flow(self):
        evaluation = self.service.evaluate_rule(
            EvaluateRuleCommand(
                actor=self.actor,
                action="mutate:create",
                target=RecordReference("Rule evaluation", "rule-1"),
                requesting_service="FTV-SVC-09",
            )
        )
        audit = self.service.record_audit_event(
            RecordAuditEventCommand(
                actor=self.actor,
                action="mutate:create",
                target=self.audit_ref,
                outcome="allowed" if evaluation.allowed else "denied",
                reason=evaluation.reason,
            )
        )

        self.assertTrue(evaluation.allowed)
        self.assertEqual("allowed", audit.outcome)
        self.assertEqual("Audit event", audit.target.entity_type)

    def test_admin_view_tracks_owner_without_owning_business_record(self):
        view = self.service.configure_admin_view(
            ConfigureAdminViewCommand(
                actor=self.actor,
                entity_type="Asset",
                display_name="Asset Admin View",
            )
        )

        self.assertEqual("FTV-SVC-01", view.owner_service)
        self.assertEqual("Asset", view.entity_type)


if __name__ == "__main__":
    unittest.main()

