import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

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
from ftv.governance.config import build_stage1_governance_service
from ftv.governance.models import Actor, RecordReference
from ftv.human_review.config import build_stage6_human_review_service
from ftv.human_review.contracts import (
    AssignReviewerCommand,
    RecordReviewDecisionCommand,
    RequestReviewCommand,
    StartReviewCommand,
)
from ftv.human_review.state import ReviewDecisionType
from ftv.media_processing.config import build_stage4_media_processing_service
from ftv.media_processing.contracts import CreateProcessingJobCommand, ExecuteProcessingJobCommand
from ftv.media_processing.state import ProcessingOperation
from ftv.performance_data.config import build_stage8_performance_data_service
from ftv.performance_data.contracts import DefineMetricCommand, ImportCsvCommand, ImportMetricsCommand, MapMetricCommand
from ftv.performance_data.errors import PerformanceValidationError
from ftv.performance_data.state import ImportMethod, PerformanceImportState
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


class PerformanceDataServiceIntegrationTests(unittest.TestCase):
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

    def approved_source_id(self) -> str:
        source = self.sources.register_source(
            RegisterSourceCommand(
                "https://example.com/source.mp4",
                "Example",
                self.producer,
                {"approved_key": "key-001"},
            )
        )
        source = self.sources.validate_source(source.source_id, self.producer)
        self.sources.capture_provenance(
            CaptureProvenanceCommand(source.source_id, self.producer, "Approved key evidence")
        )
        self.sources.mark_rights_pending(
            MarkRightsPendingCommand(source.source_id, self.producer, "Needs rights review")
        )
        self.sources.record_rights_decision(
            RecordRightsDecisionCommand(source.source_id, self.producer, RightsStatus.APPROVED, "Approved")
        )
        source = self.sources.approve_source(
            ApproveSourceCommand(source.source_id, self.producer, "Manual source approval")
        )
        return source.source_id

    def completed_publishing_package(self):
        asset = self.assets.register_asset(
            RegisterAssetCommand(self.approved_source_id(), "media/performance.mp4", self.producer)
        )
        asset = self.assets.mark_asset_ready(MarkAssetReadyCommand(asset.asset_id, self.producer, "Ready"))
        job = self.media.create_job(
            CreateProcessingJobCommand(asset.asset_id, self.producer, (ProcessingOperation.GENERATE_THUMBNAIL,))
        )
        self.media.execute_job(ExecuteProcessingJobCommand(job.job_id, self.producer))
        derivatives = self.media.list_derivatives_for_asset(asset.asset_id)
        reference = PackageAssetReference(
            asset.asset_id,
            asset.media_reference,
            provenance_reference=asset.source_id,
            derivative_references=tuple(item.derivative_reference for item in derivatives),
        )
        brief = self.content.create_brief(
            CreateContentBriefCommand("Performance brief", "Metric import candidate", self.producer)
        )
        package = self.content.create_package(
            CreateContentPackageCommand(brief.brief_id, "Performance content", self.producer, (reference,))
        )
        version = self.content.create_version(
            CreateContentVersionCommand(
                package.package_id,
                ContentSnapshot(
                    "Performance content",
                    "Script",
                    "Caption",
                    asset_references=(reference,),
                    media_references=reference.derivative_references,
                ),
                self.producer,
            )
        )
        package = self.content.mark_ready_for_review(
            MarkContentReadyForReviewCommand(package.package_id, self.producer, "Ready")
        )
        assignment = self.review.request_review(
            RequestReviewCommand(RecordReference("Content package", package.package_id), self.producer, "Review")
        )
        self.review.assign_reviewer(AssignReviewerCommand(assignment.assignment_id, self.reviewer, self.producer))
        self.review.start_review(StartReviewCommand(assignment.assignment_id, self.reviewer))
        self.review.record_decision(
            RecordReviewDecisionCommand(assignment.assignment_id, self.reviewer, ReviewDecisionType.APPROVE, "OK")
        )
        approval = self.review.get_approval_for_assignment(assignment.assignment_id)
        publishing = self.publishing.create_package(
            CreatePublishingPackageCommand(
                RecordReference("Content package", package.package_id),
                RecordReference("Content version", version.version_id),
                RecordReference("Approval status", approval.assignment_id),
                self.publisher,
                PublishingMetadata("Caption", "manual-youtube", ("football",)),
                ExportInformation(export_path="exports/performance.zip"),
            )
        )
        for item in DEFAULT_CHECKLIST_ITEMS:
            publishing = self.publishing.complete_checklist_item(
                CompleteChecklistItemCommand(publishing.publishing_package_id, self.publisher, item)
            )
        publishing = self.publishing.mark_ready(
            MarkPublishingPackageReadyCommand(publishing.publishing_package_id, self.publisher, "Ready")
        )
        return self.publishing.mark_manual_complete(
            MarkManualPublishingCompleteCommand(
                publishing.publishing_package_id,
                self.publisher,
                "manual-post-999",
                "Posted manually",
            )
        )

    def define_views_mapping(self):
        metric = self.performance.define_metric(
            DefineMetricCommand("views", "Views", "count", self.analyst)
        )
        mapping = self.performance.map_metric(
            MapMetricCommand("youtube", "view_count", metric.metric_key, "count", "count", self.analyst)
        )
        return metric, mapping

    def test_csv_import_creates_normalized_facts_with_traceability_and_history(self):
        publishing = self.completed_publishing_package()
        self.define_views_mapping()

        result = self.performance.import_csv(
            ImportCsvCommand(
                RecordReference("Publishing package", publishing.publishing_package_id),
                "youtube",
                self.analyst,
                "observed_at,view_count\n2026-07-30,100\n2026-07-31,125\n",
            )
        )
        facts = self.performance.list_facts_for_import(result.import_id)
        history = self.performance.list_history_for_import(result.import_id)

        self.assertEqual(PerformanceImportState.IMPORTED, result.state)
        self.assertEqual(2, result.fact_count)
        self.assertEqual([100.0, 125.0], [fact.value for fact in facts])
        self.assertEqual(publishing.publishing_package_id, facts[0].publishing_package_ref.record_id)
        self.assertEqual(publishing.content_package_ref.record_id, facts[0].content_package_ref.record_id)
        self.assertEqual(
            [PerformanceImportState.PENDING, PerformanceImportState.IMPORTING, PerformanceImportState.IMPORTED],
            [entry.current_state for entry in history],
        )

    def test_manual_import_records_validation_errors(self):
        publishing = self.completed_publishing_package()
        self.define_views_mapping()

        result = self.performance.import_metrics(
            ImportMetricsCommand(
                RecordReference("Publishing package", publishing.publishing_package_id),
                "youtube",
                ImportMethod.MANUAL,
                self.analyst,
                ({"observed_at": "2026-07-30", "view_count": "not-a-number"},),
            )
        )
        errors = self.performance.list_errors_for_import(result.import_id)

        self.assertEqual(PerformanceImportState.FAILED, result.state)
        self.assertEqual(0, result.fact_count)
        self.assertEqual(1, result.error_count)
        self.assertEqual("view_count", errors[0].field_name)

    def test_import_requires_metric_mapping(self):
        publishing = self.completed_publishing_package()

        with self.assertRaises(PerformanceValidationError):
            self.performance.import_metrics(
                ImportMetricsCommand(
                    RecordReference("Publishing package", publishing.publishing_package_id),
                    "youtube",
                    ImportMethod.MANUAL,
                    self.analyst,
                    ({"observed_at": "2026-07-30", "view_count": "100"},),
                )
            )

    def test_import_requires_manual_publishing_completion(self):
        publishing = self.completed_publishing_package()
        self.define_views_mapping()
        # Use the content package reference instead of publishing package to verify owner-boundary validation.
        with self.assertRaises(PerformanceValidationError):
            self.performance.import_metrics(
                ImportMetricsCommand(
                    publishing.content_package_ref,
                    "youtube",
                    ImportMethod.MANUAL,
                    self.analyst,
                    ({"observed_at": "2026-07-30", "view_count": "100"},),
                )
            )


if __name__ == "__main__":
    unittest.main()
