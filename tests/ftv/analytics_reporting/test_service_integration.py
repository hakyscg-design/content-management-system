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
from ftv.governance.config import build_stage1_governance_service
from ftv.governance.models import Actor, RecordReference
from ftv.human_review.config import build_stage6_human_review_service
from ftv.human_review.contracts import AssignReviewerCommand, RecordReviewDecisionCommand, RequestReviewCommand, StartReviewCommand
from ftv.human_review.state import ReviewDecisionType
from ftv.media_processing.config import build_stage4_media_processing_service
from ftv.media_processing.contracts import CreateProcessingJobCommand, ExecuteProcessingJobCommand
from ftv.media_processing.state import ProcessingOperation
from ftv.performance_data.config import build_stage8_performance_data_service
from ftv.performance_data.contracts import DefineMetricCommand, ImportCsvCommand, MapMetricCommand
from ftv.publishing_preparation.config import build_stage7_publishing_preparation_service
from ftv.publishing_preparation.constants import DEFAULT_CHECKLIST_ITEMS
from ftv.publishing_preparation.contracts import (
    CompleteChecklistItemCommand,
    CreatePublishingPackageCommand,
    MarkManualPublishingCompleteCommand,
    MarkPublishingPackageReadyCommand,
)
from ftv.publishing_preparation.models import ExportInformation, PublishingMetadata
from ftv.source_intake.config import build_stage2_source_intake_service
from ftv.source_intake.contracts import (
    ApproveSourceCommand,
    CaptureProvenanceCommand,
    MarkRightsPendingCommand,
    RecordRightsDecisionCommand,
    RegisterSourceCommand,
)
from ftv.source_intake.state import RightsStatus


class AnalyticsReportingServiceIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.producer = Actor("producer", "Producer")
        self.reviewer = Actor("reviewer", "Reviewer")
        self.publisher = Actor("publisher", "Publisher")
        self.analyst = Actor("analyst", "Analyst")
        self.governance = build_stage1_governance_service()
        self.sources = build_stage2_source_intake_service(self.governance)
        self.assets = build_stage3_asset_registry_service(self.sources, self.governance)
        self.media = build_stage4_media_processing_service(self.assets, self.governance)
        self.content = build_stage5_content_production_service(self.assets, self.media, self.governance)
        self.review = build_stage6_human_review_service(self.content, self.governance)
        self.publishing = build_stage7_publishing_preparation_service(self.content, self.review, self.governance)
        self.performance = build_stage8_performance_data_service(self.publishing, self.governance)
        self.analytics = build_stage9_analytics_reporting_service(self.performance, self.governance)

    def approved_source_id(self) -> str:
        source = self.sources.register_source(
            RegisterSourceCommand("https://example.com/source.mp4", "Example", self.producer, {"approved_key": "key-001"})
        )
        source = self.sources.validate_source(source.source_id, self.producer)
        self.sources.capture_provenance(CaptureProvenanceCommand(source.source_id, self.producer, "Evidence"))
        self.sources.mark_rights_pending(MarkRightsPendingCommand(source.source_id, self.producer, "Needs rights"))
        self.sources.record_rights_decision(
            RecordRightsDecisionCommand(source.source_id, self.producer, RightsStatus.APPROVED, "Approved")
        )
        source = self.sources.approve_source(ApproveSourceCommand(source.source_id, self.producer, "Approved"))
        return source.source_id

    def create_performance_facts(self):
        asset = self.assets.register_asset(
            RegisterAssetCommand(self.approved_source_id(), "media/analytics.mp4", self.producer)
        )
        asset = self.assets.mark_asset_ready(MarkAssetReadyCommand(asset.asset_id, self.producer, "Ready"))
        job = self.media.create_job(
            CreateProcessingJobCommand(asset.asset_id, self.producer, (ProcessingOperation.GENERATE_THUMBNAIL,))
        )
        self.media.execute_job(ExecuteProcessingJobCommand(job.job_id, self.producer))
        reference = PackageAssetReference(
            asset.asset_id,
            asset.media_reference,
            provenance_reference=asset.source_id,
            derivative_references=tuple(item.derivative_reference for item in self.media.list_derivatives_for_asset(asset.asset_id)),
        )
        brief = self.content.create_brief(CreateContentBriefCommand("Analytics brief", "Learning loop", self.producer))
        package = self.content.create_package(
            CreateContentPackageCommand(brief.brief_id, "Analytics content", self.producer, (reference,))
        )
        version = self.content.create_version(
            CreateContentVersionCommand(
                package.package_id,
                ContentSnapshot("Analytics content", "Script", "Caption", asset_references=(reference,), media_references=reference.derivative_references),
                self.producer,
            )
        )
        package = self.content.mark_ready_for_review(MarkContentReadyForReviewCommand(package.package_id, self.producer, "Ready"))
        assignment = self.review.request_review(
            RequestReviewCommand(RecordReference("Content package", package.package_id), self.producer, "Review")
        )
        self.review.assign_reviewer(AssignReviewerCommand(assignment.assignment_id, self.reviewer, self.producer))
        self.review.start_review(StartReviewCommand(assignment.assignment_id, self.reviewer))
        self.review.record_decision(RecordReviewDecisionCommand(assignment.assignment_id, self.reviewer, ReviewDecisionType.APPROVE, "OK"))
        approval = self.review.get_approval_for_assignment(assignment.assignment_id)
        publishing = self.publishing.create_package(
            CreatePublishingPackageCommand(
                RecordReference("Content package", package.package_id),
                RecordReference("Content version", version.version_id),
                RecordReference("Approval status", approval.assignment_id),
                self.publisher,
                PublishingMetadata("Caption", "manual-youtube", ("football",)),
                ExportInformation(export_path="exports/analytics.zip"),
            )
        )
        for item in DEFAULT_CHECKLIST_ITEMS:
            publishing = self.publishing.complete_checklist_item(
                CompleteChecklistItemCommand(publishing.publishing_package_id, self.publisher, item)
            )
        publishing = self.publishing.mark_ready(MarkPublishingPackageReadyCommand(publishing.publishing_package_id, self.publisher, "Ready"))
        publishing = self.publishing.mark_manual_complete(
            MarkManualPublishingCompleteCommand(publishing.publishing_package_id, self.publisher, "manual-post-001", "Posted")
        )
        metric = self.performance.define_metric(DefineMetricCommand("views", "Views", "count", self.analyst))
        self.performance.map_metric(MapMetricCommand("youtube", "view_count", metric.metric_key, "count", "count", self.analyst))
        self.performance.import_csv(
            ImportCsvCommand(
                RecordReference("Publishing package", publishing.publishing_package_id),
                "youtube",
                self.analyst,
                "observed_at,view_count\n2026-07-30,100\n2026-07-31,150\n",
            )
        )
        return package

    def test_generate_report_creates_dataset_narrative_learning_and_history_without_content_mutation(self):
        package = self.create_performance_facts()

        report = self.analytics.generate_report(
            GenerateAnalyticsReportCommand(
                "Weekly performance",
                "narrative",
                self.analyst,
                ("views",),
                ("content_package", "platform"),
                AggregationMethod.SUM,
                "Manual analyst note",
            )
        )

        self.assertEqual(AnalyticsReportState.GENERATED, report.state)
        self.assertEqual(1, len(report.dataset.rows))
        self.assertEqual(250, report.dataset.rows[0].value)
        self.assertIn("views: 250", report.narrative)
        self.assertEqual(("views",), report.learning_summary.metric_references)
        self.assertEqual(package.package_id, report.learning_summary.content_package_refs[0].record_id)
        self.assertEqual(ContentPackageState.READY_FOR_REVIEW, self.content.get_package(package.package_id).state)
        self.assertEqual(1, len(self.analytics.list_history_for_report(report.report_id)))


if __name__ == "__main__":
    unittest.main()
