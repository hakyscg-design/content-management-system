import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.analytics_reporting.config import build_stage9_analytics_reporting_service
from ftv.analytics_reporting.contracts import GenerateAnalyticsReportCommand
from ftv.analytics_reporting.state import AggregationMethod, AnalyticsReportState
from ftv.asset_registry.config import build_stage3_asset_registry_service
from ftv.asset_registry.contracts import MarkAssetReadyCommand, RegisterAssetCommand
from ftv.content_production.config import build_stage5_content_production_service
from ftv.content_production.contracts import (
    CreateContentBriefCommand,
    CreateContentPackageCommand,
    CreateContentVersionCommand,
    MarkContentReadyForReviewCommand,
)
from ftv.content_production.models import ContentSnapshot, PackageAssetReference
from ftv.content_production.state import ContentPackageState
from ftv.core_data_administration.config import build_stage11_core_data_administration_service
from ftv.core_data_administration.contracts import (
    BrowseAdminViewCommand,
    ConfigureAdminViewCommand,
    LookupAdminRecordCommand,
    RedirectMutationRequestCommand,
)
from ftv.core_data_administration.models import OwnerRecordSnapshot
from ftv.governance.config import build_stage1_governance_service
from ftv.governance.models import Actor, RecordReference
from ftv.human_review.config import build_stage6_human_review_service
from ftv.human_review.contracts import (
    AssignReviewerCommand,
    RecordReviewDecisionCommand,
    RequestReviewCommand,
    StartReviewCommand,
)
from ftv.human_review.state import ApprovalState, ReviewDecisionType
from ftv.media_processing.config import build_stage4_media_processing_service
from ftv.media_processing.contracts import CreateProcessingJobCommand, ExecuteProcessingJobCommand
from ftv.media_processing.state import ProcessingJobState, ProcessingOperation
from ftv.performance_data.config import build_stage8_performance_data_service
from ftv.performance_data.contracts import DefineMetricCommand, ImportCsvCommand, MapMetricCommand
from ftv.performance_data.state import PerformanceImportState
from ftv.publishing_preparation.config import build_stage7_publishing_preparation_service
from ftv.publishing_preparation.constants import DEFAULT_CHECKLIST_ITEMS
from ftv.publishing_preparation.contracts import (
    CompleteChecklistItemCommand,
    CreatePublishingPackageCommand,
    MarkManualPublishingCompleteCommand,
    MarkPublishingPackageReadyCommand,
)
from ftv.publishing_preparation.models import ExportInformation, PublishingMetadata
from ftv.publishing_preparation.state import PublishingPackageState
from ftv.source_intake.config import build_stage2_source_intake_service
from ftv.source_intake.contracts import (
    ApproveSourceCommand,
    CaptureProvenanceCommand,
    MarkRightsPendingCommand,
    RecordRightsDecisionCommand,
    RegisterSourceCommand,
)
from ftv.source_intake.state import RightsStatus, SourceStatus
from ftv.workflow_orchestration.config import build_stage10_workflow_orchestration_service
from ftv.workflow_orchestration.constants import SERVICE_HUMAN_REVIEW, SERVICE_MEDIA_PROCESSING, SERVICE_PERFORMANCE_DATA
from ftv.workflow_orchestration.contracts import RegisterWorkflowCommand, StartWorkflowRunCommand
from ftv.workflow_orchestration.models import WorkflowTargetCommand
from ftv.workflow_orchestration.state import WorkflowRunState, WorkflowTriggerType


class ProductionReadyMvpValidationTests(unittest.TestCase):
    def setUp(self):
        self.producer = Actor("producer", "Producer")
        self.reviewer = Actor("reviewer", "Reviewer")
        self.publisher = Actor("publisher", "Publisher")
        self.analyst = Actor("analyst", "Analyst")
        self.operator = Actor("operator", "Operator")
        self.admin = Actor("admin", "Admin")
        self.governance = build_stage1_governance_service()
        self.sources = build_stage2_source_intake_service(self.governance)
        self.assets = build_stage3_asset_registry_service(self.sources, self.governance)
        self.media = build_stage4_media_processing_service(self.assets, self.governance)
        self.content = build_stage5_content_production_service(self.assets, self.media, self.governance)
        self.review = build_stage6_human_review_service(self.content, self.governance)
        self.publishing = build_stage7_publishing_preparation_service(self.content, self.review, self.governance)
        self.performance = build_stage8_performance_data_service(self.publishing, self.governance)
        self.analytics = build_stage9_analytics_reporting_service(self.performance, self.governance)
        self.workflow = build_stage10_workflow_orchestration_service(self.governance)

    def test_manual_first_source_to_learning_mvp_with_workflow_and_admin_support(self):
        source = self.sources.register_source(
            RegisterSourceCommand(
                "https://example.com/goal.mp4",
                "Approved football source",
                self.producer,
                {"approved_key": "key-001"},
            )
        )
        source = self.sources.validate_source(source.source_id, self.producer)
        self.sources.capture_provenance(CaptureProvenanceCommand(source.source_id, self.producer, "Manual source evidence"))
        self.sources.mark_rights_pending(MarkRightsPendingCommand(source.source_id, self.producer, "Needs rights check"))
        rights_known_source = self.sources.record_rights_decision(
            RecordRightsDecisionCommand(source.source_id, self.producer, RightsStatus.APPROVED, "Approved for MVP")
        )
        source = self.sources.approve_source(ApproveSourceCommand(source.source_id, self.producer, "Source approved"))

        asset = self.assets.register_asset(RegisterAssetCommand(source.source_id, "media/goal.mp4", self.producer))
        asset = self.assets.mark_asset_ready(MarkAssetReadyCommand(asset.asset_id, self.producer, "Asset ready"))

        job = self.media.create_job(
            CreateProcessingJobCommand(
                asset.asset_id,
                self.producer,
                (
                    ProcessingOperation.NORMALIZE_MEDIA,
                    ProcessingOperation.GENERATE_THUMBNAIL,
                    ProcessingOperation.EXTRACT_METADATA,
                ),
            )
        )
        job = self.media.execute_job(ExecuteProcessingJobCommand(job.job_id, self.producer))
        derivatives = self.media.list_derivatives_for_asset(asset.asset_id)

        package_asset = PackageAssetReference(
            asset.asset_id,
            asset.media_reference,
            provenance_reference=asset.source_id,
            derivative_references=tuple(item.derivative_reference for item in derivatives),
        )
        brief = self.content.create_brief(
            CreateContentBriefCommand("Derby clip brief", "Manual-first source-to-learning MVP", self.producer)
        )
        content_package = self.content.create_package(
            CreateContentPackageCommand(brief.brief_id, "Derby reaction package", self.producer, (package_asset,))
        )
        version = self.content.create_version(
            CreateContentVersionCommand(
                content_package.package_id,
                ContentSnapshot(
                    "Derby reaction package",
                    "A short football reaction script",
                    "Caption for manual posting",
                    asset_references=(package_asset,),
                    media_references=package_asset.derivative_references,
                ),
                self.producer,
            )
        )
        content_package = self.content.mark_ready_for_review(
            MarkContentReadyForReviewCommand(content_package.package_id, self.producer, "Ready for human review")
        )

        assignment = self.review.request_review(
            RequestReviewCommand(RecordReference("Content package", content_package.package_id), self.producer, "Approval gate")
        )
        assignment = self.review.assign_reviewer(
            AssignReviewerCommand(assignment.assignment_id, self.reviewer, self.producer)
        )
        assignment = self.review.start_review(StartReviewCommand(assignment.assignment_id, self.reviewer))
        decision = self.review.record_decision(
            RecordReviewDecisionCommand(assignment.assignment_id, self.reviewer, ReviewDecisionType.APPROVE, "Approved")
        )
        approval = self.review.get_approval_for_assignment(assignment.assignment_id)

        publishing = self.publishing.create_package(
            CreatePublishingPackageCommand(
                RecordReference("Content package", content_package.package_id),
                RecordReference("Content version", version.version_id),
                RecordReference("Approval status", approval.assignment_id),
                self.publisher,
                PublishingMetadata("Caption for manual posting", "manual-youtube", ("football", "derby")),
                ExportInformation(export_path="exports/derby-reaction.zip"),
            )
        )
        for item in DEFAULT_CHECKLIST_ITEMS:
            publishing = self.publishing.complete_checklist_item(
                CompleteChecklistItemCommand(publishing.publishing_package_id, self.publisher, item)
            )
        publishing = self.publishing.mark_ready(
            MarkPublishingPackageReadyCommand(publishing.publishing_package_id, self.publisher, "Ready for manual publishing")
        )
        publishing = self.publishing.mark_manual_complete(
            MarkManualPublishingCompleteCommand(
                publishing.publishing_package_id,
                self.publisher,
                "manual-post-001",
                "Published manually by operator",
            )
        )

        metric = self.performance.define_metric(DefineMetricCommand("views", "Views", "count", self.analyst))
        self.performance.map_metric(
            MapMetricCommand("youtube", "view_count", metric.metric_key, "count", "count", self.analyst)
        )
        performance_import = self.performance.import_csv(
            ImportCsvCommand(
                RecordReference("Publishing package", publishing.publishing_package_id),
                "youtube",
                self.analyst,
                "observed_at,view_count\n2026-07-30,100\n2026-07-31,150\n",
            )
        )

        report = self.analytics.generate_report(
            GenerateAnalyticsReportCommand(
                "MVP learning report",
                "narrative",
                self.analyst,
                ("views",),
                ("content_package", "platform"),
                AggregationMethod.SUM,
                "Manual analyst learning note",
            )
        )

        workflow_run = self.workflow.register_workflow(
            RegisterWorkflowCommand(
                "MVP operations visibility run",
                WorkflowTriggerType.MANUAL,
                "manual-mvp-validation",
                self.operator,
                (
                    WorkflowTargetCommand(
                        SERVICE_MEDIA_PROCESSING,
                        "start_processing_job",
                        RecordReference("Media processing job", job.job_id),
                    ),
                    WorkflowTargetCommand(
                        SERVICE_HUMAN_REVIEW,
                        "request_review",
                        RecordReference("Review assignment", assignment.assignment_id),
                    ),
                    WorkflowTargetCommand(
                        SERVICE_PERFORMANCE_DATA,
                        "import_metrics",
                        RecordReference("Performance import", performance_import.import_id),
                    ),
                ),
            )
        )
        workflow_run = self.workflow.start_workflow(StartWorkflowRunCommand(workflow_run.workflow_run_id, self.operator))

        admin = build_stage11_core_data_administration_service(
            self.governance,
            (
                OwnerRecordSnapshot(
                    RecordReference("Asset", asset.asset_id),
                    "FTV-SVC-01",
                    {"asset_id": asset.asset_id, "state": asset.status.value},
                ),
                OwnerRecordSnapshot(
                    RecordReference("Content package", content_package.package_id),
                    "FTV-SVC-03",
                    {"package_id": content_package.package_id, "state": content_package.state.value},
                ),
                OwnerRecordSnapshot(
                    RecordReference("Analytics report", report.report_id),
                    "FTV-SVC-07",
                    {"report_id": report.report_id, "state": report.state.value},
                ),
                OwnerRecordSnapshot(
                    RecordReference("Workflow run", workflow_run.workflow_run_id),
                    "FTV-SVC-08",
                    {"workflow_run_id": workflow_run.workflow_run_id, "state": workflow_run.state.value},
                ),
            ),
        )
        asset_view = admin.configure_view(
            ConfigureAdminViewCommand("Asset", "Assets", ("asset_id", "state"), self.admin)
        )
        asset_listing = admin.browse_view(BrowseAdminViewCommand(asset_view.view_id, self.admin))
        report_lookup = admin.lookup_record(
            LookupAdminRecordCommand(RecordReference("Analytics report", report.report_id), self.admin)
        )
        redirect = admin.redirect_mutation_request(
            RedirectMutationRequestCommand(
                RecordReference("Workflow run", workflow_run.workflow_run_id),
                "cancel",
                self.admin,
                "Admin is read-only",
            )
        )

        self.assertEqual(SourceStatus.RIGHTS_KNOWN, rights_known_source.status)
        self.assertEqual(SourceStatus.APPROVED, source.status)
        self.assertEqual(ProcessingJobState.COMPLETED, job.state)
        self.assertGreaterEqual(len(derivatives), 1)
        self.assertEqual(ContentPackageState.READY_FOR_REVIEW, content_package.state)
        self.assertEqual(ApprovalState.APPROVED, approval.state)
        self.assertEqual(ReviewDecisionType.APPROVE, decision.decision)
        self.assertEqual(PublishingPackageState.COMPLETED, publishing.state)
        self.assertEqual(PerformanceImportState.IMPORTED, performance_import.state)
        self.assertEqual(AnalyticsReportState.GENERATED, report.state)
        self.assertEqual(250, report.dataset.rows[0].value)
        self.assertEqual(("views",), report.learning_summary.metric_references)
        self.assertEqual(WorkflowRunState.COMPLETED, workflow_run.state)
        self.assertTrue(asset_listing.records[0].read_only)
        self.assertEqual("FTV-SVC-07", report_lookup.owner_service_id)
        self.assertEqual("FTV-SVC-08", redirect.owner_service_id)
        self.assertEqual(
            ContentPackageState.READY_FOR_REVIEW,
            self.content.get_package(content_package.package_id).state,
        )


if __name__ == "__main__":
    unittest.main()
