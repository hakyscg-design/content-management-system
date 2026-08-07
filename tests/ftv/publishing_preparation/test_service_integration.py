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
from ftv.human_review.constants import ENTITY_CONTENT_PACKAGE as REVIEW_CONTENT_PACKAGE
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
from ftv.publishing_preparation.config import build_stage7_publishing_preparation_service
from ftv.publishing_preparation.constants import DEFAULT_CHECKLIST_ITEMS
from ftv.publishing_preparation.contracts import (
    BlockPublishingPackageCommand,
    CancelPublishingPackageCommand,
    CompleteChecklistItemCommand,
    CreatePublishingPackageCommand,
    MarkManualPublishingCompleteCommand,
    MarkPublishingPackageReadyCommand,
    ResumePublishingPackageCommand,
)
from ftv.publishing_preparation.errors import PublishingValidationError
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
from ftv.source_intake.state import RightsStatus


class PublishingPreparationServiceIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.producer = Actor("producer", "Producer")
        self.reviewer = Actor("reviewer", "Reviewer")
        self.publisher = Actor("publisher", "Publisher")
        self.governance = build_stage1_governance_service()
        self.sources = build_stage2_source_intake_service(self.governance)
        self.assets = build_stage3_asset_registry_service(self.sources, self.governance)
        self.media = build_stage4_media_processing_service(self.assets, self.governance)
        self.content = build_stage5_content_production_service(self.assets, self.media, self.governance)
        self.review = build_stage6_human_review_service(self.content, self.governance)
        self.publishing = build_stage7_publishing_preparation_service(
            self.content,
            self.review,
            self.governance,
        )

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

    def ready_content(self):
        asset = self.assets.register_asset(
            RegisterAssetCommand(self.approved_source_id(), "media/publish.mp4", self.producer)
        )
        asset = self.assets.mark_asset_ready(MarkAssetReadyCommand(asset.asset_id, self.producer, "Ready"))
        job = self.media.create_job(
            CreateProcessingJobCommand(
                asset.asset_id,
                self.producer,
                (ProcessingOperation.GENERATE_THUMBNAIL, ProcessingOperation.EXTRACT_METADATA),
            )
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
            CreateContentBriefCommand("Publishing brief", "Manual publishing candidate", self.producer)
        )
        package = self.content.create_package(
            CreateContentPackageCommand(brief.brief_id, "Publishing content", self.producer, (reference,))
        )
        version = self.content.create_version(
            CreateContentVersionCommand(
                package.package_id,
                ContentSnapshot(
                    "Publishing content",
                    "Script for manual publishing.",
                    "Caption for manual publishing.",
                    asset_references=(reference,),
                    media_references=reference.derivative_references,
                ),
                self.producer,
            )
        )
        package = self.content.mark_ready_for_review(
            MarkContentReadyForReviewCommand(package.package_id, self.producer, "Ready for review")
        )
        return package, version

    def approved_content_refs(self):
        package, version = self.ready_content()
        assignment = self.review.request_review(
            RequestReviewCommand(
                RecordReference(REVIEW_CONTENT_PACKAGE, package.package_id),
                self.producer,
                "Needs approval",
            )
        )
        self.review.assign_reviewer(AssignReviewerCommand(assignment.assignment_id, self.reviewer, self.producer))
        self.review.start_review(StartReviewCommand(assignment.assignment_id, self.reviewer))
        self.review.record_decision(
            RecordReviewDecisionCommand(
                assignment.assignment_id,
                self.reviewer,
                ReviewDecisionType.APPROVE,
                "Approved for publishing prep",
            )
        )
        approval = self.review.get_approval_for_assignment(assignment.assignment_id)
        return (
            RecordReference("Content package", package.package_id),
            RecordReference("Content version", version.version_id),
            RecordReference("Approval status", approval.assignment_id),
        )

    def create_publishing_package(self):
        content_package_ref, version_ref, approval_ref = self.approved_content_refs()
        return self.publishing.create_package(
            CreatePublishingPackageCommand(
                content_package_ref,
                version_ref,
                approval_ref,
                self.publisher,
                PublishingMetadata(
                    caption="Manual caption",
                    platform_target="manual-youtube",
                    tags=("football", "shorts"),
                    values={"title": "Manual title"},
                ),
                ExportInformation(export_path="exports/package.zip", notes="Manual export bundle"),
            )
        )

    def test_package_creation_records_traceability_and_history(self):
        package = self.create_publishing_package()
        history = self.publishing.list_history_for_package(package.publishing_package_id)

        self.assertEqual(PublishingPackageState.PREPARING, package.state)
        self.assertTrue(package.asset_references)
        self.assertTrue(package.media_references)
        self.assertEqual("manual-youtube", package.metadata.platform_target)
        self.assertEqual([PublishingPackageState.PREPARING], [entry.current_state for entry in history])

    def test_ready_requires_full_checklist_then_manual_completion(self):
        package = self.create_publishing_package()

        with self.assertRaises(PublishingValidationError):
            self.publishing.mark_ready(
                MarkPublishingPackageReadyCommand(package.publishing_package_id, self.publisher, "Not complete")
            )

        for item in DEFAULT_CHECKLIST_ITEMS:
            package = self.publishing.complete_checklist_item(
                CompleteChecklistItemCommand(package.publishing_package_id, self.publisher, item)
            )
        ready = self.publishing.mark_ready(
            MarkPublishingPackageReadyCommand(package.publishing_package_id, self.publisher, "Checklist complete")
        )
        completed = self.publishing.mark_manual_complete(
            MarkManualPublishingCompleteCommand(
                ready.publishing_package_id,
                self.publisher,
                "manual-post-123",
                "Human posted and recorded reference",
            )
        )

        self.assertEqual(PublishingPackageState.READY, ready.state)
        self.assertEqual(PublishingPackageState.COMPLETED, completed.state)
        self.assertEqual("manual-post-123", completed.manual_publish_reference)

    def test_block_resume_and_cancel_flow(self):
        package = self.create_publishing_package()

        blocked = self.publishing.block_package(
            BlockPublishingPackageCommand(package.publishing_package_id, self.publisher, "Missing thumbnail")
        )
        resumed = self.publishing.resume_package(
            ResumePublishingPackageCommand(blocked.publishing_package_id, self.publisher, "Thumbnail fixed")
        )
        cancelled = self.publishing.cancel_package(
            CancelPublishingPackageCommand(resumed.publishing_package_id, self.publisher, "Manual cancellation")
        )

        self.assertEqual(PublishingPackageState.BLOCKED, blocked.state)
        self.assertEqual(PublishingPackageState.PREPARING, resumed.state)
        self.assertEqual(PublishingPackageState.CANCELLED, cancelled.state)

    def test_unapproved_content_cannot_create_publishing_package(self):
        package, version = self.ready_content()

        with self.assertRaises(PublishingValidationError):
            self.publishing.create_package(
                CreatePublishingPackageCommand(
                    RecordReference("Content package", package.package_id),
                    RecordReference("Content version", version.version_id),
                    RecordReference("Approval status", "unknown-assignment"),
                    self.publisher,
                    PublishingMetadata("Caption", "manual-youtube"),
                )
            )


if __name__ == "__main__":
    unittest.main()
