import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.core_data_administration.config import build_stage11_core_data_administration_service
from ftv.core_data_administration.contracts import ConfigureAdminViewCommand
from ftv.governance.config import build_stage1_governance_service
from ftv.governance.models import Actor


class CoreDataAdministrationSmokeTests(unittest.TestCase):
    def test_admin_view_opens(self):
        service = build_stage11_core_data_administration_service(build_stage1_governance_service())
        view = service.configure_view(
            ConfigureAdminViewCommand("Workflow run", "Workflow Runs", ("workflow_run_id", "state"), Actor("admin"))
        )

        self.assertEqual("FTV-SVC-08", view.owner_service_id)


if __name__ == "__main__":
    unittest.main()

