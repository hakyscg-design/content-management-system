import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.core_data_administration.config import build_stage11_core_data_administration_service
from ftv.core_data_administration.contracts import (
    BrowseAdminViewCommand,
    ConfigureAdminViewCommand,
    ConfigureSchemaDisplayCommand,
    LookupAdminRecordCommand,
    RedirectMutationRequestCommand,
)
from ftv.core_data_administration.errors import ReadOnlyAdministrationError
from ftv.core_data_administration.models import OwnerRecordSnapshot
from ftv.governance.config import build_stage1_governance_service
from ftv.governance.models import Actor, RecordReference


class CoreDataAdministrationServiceIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.admin = Actor("admin-1", "Admin")
        self.governance = build_stage1_governance_service()
        self.snapshots = (
            OwnerRecordSnapshot(
                RecordReference("Asset", "asset-1"),
                "FTV-SVC-01",
                {"asset_id": "asset-1", "state": "ready", "title": "Goal clip"},
                "asset-v1",
            ),
            OwnerRecordSnapshot(
                RecordReference("Content package", "pkg-1"),
                "FTV-SVC-03",
                {"package_id": "pkg-1", "state": "review_ready", "title": "Derby meme"},
                "content-v1",
            ),
            OwnerRecordSnapshot(
                RecordReference("Workflow run", "workflow-run-1"),
                "FTV-SVC-08",
                {"workflow_run_id": "workflow-run-1", "state": "completed"},
                "workflow-v1",
            ),
        )
        self.service = build_stage11_core_data_administration_service(self.governance, self.snapshots)

    def test_configure_view_owns_admin_configuration_only_and_records_audit(self):
        view = self.service.configure_view(
            ConfigureAdminViewCommand("Asset", "Asset Admin View", ("asset_id", "state"), self.admin)
        )
        history = self.service.list_action_history()

        self.assertEqual("FTV-SVC-01", view.owner_service_id)
        self.assertEqual(1, len(self.service.list_views()))
        self.assertEqual("Admin view configuration", history[-1].target.entity_type)
        self.assertEqual("mutate:configure_admin_view", history[-1].action)
        self.assertTrue(history[-1].audit_event_id.startswith("audit-"))

    def test_browse_view_returns_read_only_cross_domain_owner_snapshots(self):
        view = self.service.configure_view(
            ConfigureAdminViewCommand("Asset", "Asset Admin View", ("asset_id", "state"), self.admin)
        )

        listing = self.service.browse_view(BrowseAdminViewCommand(view.view_id, self.admin))

        self.assertEqual("Asset", listing.view.entity_type)
        self.assertEqual(1, len(listing.records))
        self.assertTrue(listing.records[0].read_only)
        self.assertEqual("FTV-SVC-01", listing.records[0].owner_service_id)
        self.assertEqual({"asset_id": "asset-1", "state": "ready"}, dict(listing.records[0].display_values))

    def test_lookup_record_identifies_owner_without_becoming_authoritative(self):
        record = self.service.lookup_record(
            LookupAdminRecordCommand(RecordReference("Content package", "pkg-1"), self.admin)
        )

        self.assertEqual("FTV-SVC-03", record.owner_service_id)
        self.assertTrue(record.read_only)
        self.assertEqual("Derby meme", record.display_values["title"])

    def test_redirect_mutation_request_routes_to_owner_service(self):
        redirect = self.service.redirect_mutation_request(
            RedirectMutationRequestCommand(
                RecordReference("Workflow run", "workflow-run-1"),
                "cancel",
                self.admin,
                "Admin view cannot mutate workflow state",
            )
        )

        self.assertEqual("FTV-SVC-08", redirect.owner_service_id)
        self.assertIn("FTV-SVC-08", redirect.redirect_message)

    def test_direct_business_mutation_is_rejected(self):
        with self.assertRaises(ReadOnlyAdministrationError):
            self.service.reject_direct_business_mutation(RecordReference("Asset", "asset-1"))

    def test_schema_display_metadata_is_owned_by_administration(self):
        metadata = self.service.configure_schema_display(
            ConfigureSchemaDisplayCommand("Asset", "Asset", "asset_id", self.admin)
        )

        self.assertEqual("Asset", metadata.entity_type)
        self.assertEqual(1, len(self.service.list_schema_metadata()))
        self.assertEqual("Schema/display metadata", self.service.list_action_history()[-1].target.entity_type)


if __name__ == "__main__":
    unittest.main()
