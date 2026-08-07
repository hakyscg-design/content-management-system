import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.core_data_administration.contracts import ConfigureAdminViewCommand, RedirectMutationRequestCommand
from ftv.core_data_administration.errors import AdminValidationError
from ftv.core_data_administration.validators import CoreDataAdminValidator
from ftv.governance.config import build_stage1_governance_service
from ftv.governance.models import Actor, RecordReference


class CoreDataAdminValidatorTests(unittest.TestCase):
    def setUp(self):
        self.actor = Actor("admin-1")
        self.validator = CoreDataAdminValidator(build_stage1_governance_service().ownership)

    def test_view_configuration_requires_visible_fields(self):
        with self.assertRaises(AdminValidationError):
            self.validator.validate_view_configuration(
                ConfigureAdminViewCommand("Asset", "Assets", (), self.actor)
            )

    def test_view_configuration_resolves_frozen_owner(self):
        owner = self.validator.validate_view_configuration(
            ConfigureAdminViewCommand("Asset", "Assets", ("asset_id",), self.actor)
        )

        self.assertEqual("FTV-SVC-01", owner)

    def test_redirect_requires_reason(self):
        with self.assertRaises(AdminValidationError):
            self.validator.validate_redirect(
                RedirectMutationRequestCommand(
                    RecordReference("Content package", "pkg-1"),
                    "update",
                    self.actor,
                    " ",
                )
            )


if __name__ == "__main__":
    unittest.main()

