import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.governance.config import build_stage1_ownership_catalog
from ftv.governance.models import Actor, RecordReference, RuleContext
from ftv.governance.repository_adapters import InMemoryRuleEvaluationRepository
from ftv.governance.rules import LightweightBusinessRuleValidator


class LightweightBusinessRuleValidatorTests(unittest.TestCase):
    def setUp(self):
        self.repository = InMemoryRuleEvaluationRepository()
        self.validator = LightweightBusinessRuleValidator(
            build_stage1_ownership_catalog(),
            self.repository,
        )
        self.actor = Actor("user-1")

    def test_owner_service_can_mutate_owned_rule_evaluation(self):
        evaluation = self.validator.evaluate(
            RuleContext(
                actor=self.actor,
                action="mutate:create",
                target=RecordReference("Rule evaluation", "rule-1"),
                requesting_service="FTV-SVC-09",
            )
        )

        self.assertTrue(evaluation.allowed)
        self.assertEqual(1, len(self.repository.list_all()))

    def test_non_owner_service_cannot_mutate_governance_record(self):
        evaluation = self.validator.evaluate(
            RuleContext(
                actor=self.actor,
                action="mutate:create",
                target=RecordReference("Audit event", "audit-1"),
                requesting_service="FTV-SVC-01",
            )
        )

        self.assertFalse(evaluation.allowed)
        self.assertIn("owner is FTV-SVC-09", evaluation.reason)

    def test_core_data_admin_cannot_mutate_business_record(self):
        evaluation = self.validator.evaluate(
            RuleContext(
                actor=self.actor,
                action="mutate:update",
                target=RecordReference("Asset", "asset-1"),
                requesting_service="FTV-SVC-11",
            )
        )

        self.assertFalse(evaluation.allowed)
        self.assertIn("non-authoritative", evaluation.reason)


if __name__ == "__main__":
    unittest.main()

