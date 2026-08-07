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
    ArchiveContentPackageCommand,
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
from ftv.human_review.constants import ENTITY_CONTENT_PACKAGE
from ftv.human_review.contracts import (
    AssignReviewerCommand,
    CancelReviewCommand,
    RecordReviewDecisionCommand,
    RequestReviewCommand,
    StartReviewCommand,
)
from ftv.human_review.errors import ReviewValidationError
from ftv.human_review.state import ApprovalState, ReviewDecisionType, ReviewStatus
from ftv.media_processing.config import build_stage4_media_processing_service
from ftv.media_processing.contracts import CreateProcessingJobCommand, ExecuteProcessingJobCommand
from ftv.media_processing.state import ProcessingOperation
from ftv.source_intake.config import build_stage2_source_intake_service
from ftv.source_intake.contracts import (
    ApproveSourceCommand,
    CaptureProvenanceCommand,
    MarkRightsPendingCommand,
    RecordRightsDecisionCommand,
    RegisterSourceCommand,
)
from ftv.source_intake.state import RightsStatus


class HumanReviewServiceIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.producer = Actor("producer", "Producer")
        self.reviewer = Actor("reviewer", "Reviewer")
        self.override_reviewer = Actor("lead-reviewer", "Lead Reviewer")
        self.governance = build_stage1_governance_service()
        self.sources = build_stage2_source_intake_service(self.governance)
        self.assets = build_stage3_asset_registry_service(self.sources, self.governance)
        self.media = build_stage4_media_processing_service(self.assets, self.governance)
        self.content = build_stage5_content_production_service(self.assets, self.media, self.governance)
        self.review = build_stage6_human_review_service(self.content, self.governance)

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
            RecordRightsDecisionCommand(
                source.source_id,
                self.producer,
                RightsStatus.APPROVED,
                "Approved rights",
            )
        )
        source = self.sources.approve_source(
            ApproveSourceCommand(source.source_id, self.producer, "Manual source approval")
        )
        return source.source_id

    def ready_content_package(self):
        asset = self.assets.register_asset(
            RegisterAssetCommand(self.approved_source_id(), "media/review.mp4", self.producer)
        )
        asset = self.assets.mark_asset_ready(
            MarkAssetReadyCommand(asset.asset_id, self.producer, "Ready for content")
        )
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
            CreateContentBriefCommand("Review brief", "Human review candidate", self.producer)
        )
        package = self.content.create_package(
            CreateContentPackageCommand(brief.brief_id, "Review package", self.producer, (reference,))
        )
        self.content.create_version(
            CreateContentVersionCommand(
                package.package_id,
                ContentSnapshot(
                    "Review package",
                    "Script for reviewer.",
                    "Caption for reviewer.",
                    asset_references=(reference,),
                    media_references=reference.derivative_references,
                ),
                self.producer,
            )
        )
        return self.content.mark_ready_for_review(
            MarkContentReadyForReviewCommand(package.package_id, self.producer, "Complete")
        )

    def request_assignment(self):
        package = self.ready_content_package()
        return self.review.request_review(
            RequestReviewCommand(
                RecordReference(ENTITY_CONTENT_PACKAGE, package.package_id),
                self.producer,
                "Needs human approval",
            )
        )

    def assigned_started_review(self):
        assignment = self.request_assignment()
        assignment = self.review.assign_reviewer(
            AssignReviewerCommand(assignment.assignment_id, self.reviewer, self.producer)
        )
        return self.review.start_review(StartReviewCommand(assignment.assignment_id, self.reviewer))

    def test_review_lifecycle_approve_updates_assignment_decision_approval_and_history(self):
        assignment = self.assigned_started_review()

        decision = self.review.record_decision(
            RecordReviewDecisionCommand(
                assignment.assignment_id,
                self.reviewer,
                ReviewDecisionType.APPROVE,
                "Looks good",
            )
        )
        approval = self.review.get_approval_for_assignment(assignment.assignment_id)
        history = self.review.list_history_for_assignment(assignment.assignment_id)

        self.assertEqual(ReviewStatus.APPROVED, self.review.get_assignment(assignment.assignment_id).status)
        self.assertEqual(ApprovalState.APPROVED, approval.state)
        self.assertEqual(decision.decision_id, approval.decision_id)
        self.assertEqual(
            [
                ReviewStatus.REQUESTED,
                ReviewStatus.ASSIGNED,
                ReviewStatus.IN_REVIEW,
                ReviewStatus.APPROVED,
            ],
            [entry.current_status for entry in history],
        )
        target_package = self.content.get_package(assignment.target.record_id)
        self.assertEqual(ContentPackageState.READY_FOR_REVIEW, target_package.state)

    def test_reject_flow_requires_reason_and_records_rejection(self):
        assignment = self.assigned_started_review()

        with self.assertRaises(ReviewValidationError):
            self.review.record_decision(
                RecordReviewDecisionCommand(
                    assignment.assignment_id,
                    self.reviewer,
                    ReviewDecisionType.REJECT,
                    "No reason",
                )
            )

        decision = self.review.record_decision(
            RecordReviewDecisionCommand(
                assignment.assignment_id,
                self.reviewer,
                ReviewDecisionType.REJECT,
                "Needs changes",
                "Caption misses context",
            )
        )
        approval = self.review.get_approval_for_assignment(assignment.assignment_id)

        self.assertEqual(ReviewDecisionType.REJECT, decision.decision)
        self.assertEqual(ApprovalState.REJECTED, approval.state)
        self.assertEqual("Caption misses context", approval.reject_reason)

    def test_return_flow_records_return_reason(self):
        assignment = self.assigned_started_review()

        self.review.record_decision(
            RecordReviewDecisionCommand(
                assignment.assignment_id,
                self.reviewer,
                ReviewDecisionType.RETURN,
                "Return to producer",
                "Needs alternate intro",
            )
        )
        approval = self.review.get_approval_for_assignment(assignment.assignment_id)

        self.assertEqual(ApprovalState.RETURNED, approval.state)
        self.assertEqual("Needs alternate intro", approval.return_reason)

    def test_override_approval_records_override_flag(self):
        assignment = self.assigned_started_review()

        decision = self.review.record_decision(
            RecordReviewDecisionCommand(
                assignment.assignment_id,
                self.override_reviewer,
                ReviewDecisionType.OVERRIDE_APPROVE,
                "Lead approval with manual override",
                "Manual override after rights/context check",
                override=True,
            )
        )
        approval = self.review.get_approval_for_assignment(assignment.assignment_id)

        self.assertTrue(decision.override)
        self.assertEqual(ApprovalState.OVERRIDE_APPROVED, approval.state)
        self.assertTrue(approval.override)

    def test_cancel_review_updates_assignment_and_approval(self):
        assignment = self.request_assignment()

        cancelled = self.review.cancel_review(
            CancelReviewCommand(assignment.assignment_id, self.producer, "Review no longer needed")
        )
        approval = self.review.get_approval_for_assignment(assignment.assignment_id)

        self.assertEqual(ReviewStatus.CANCELLED, cancelled.status)
        self.assertEqual(ApprovalState.CANCELLED, approval.state)

    def test_review_queue_lists_only_active_reviews(self):
        assignment = self.request_assignment()

        self.assertEqual([assignment.assignment_id], [item.assignment_id for item in self.review.list_review_queue()])
        self.review.cancel_review(
            CancelReviewCommand(assignment.assignment_id, self.producer, "Review no longer needed")
        )

        self.assertEqual([], self.review.list_review_queue())

    def test_review_request_requires_ready_content_target(self):
        package = self.ready_content_package()
        package = self.content.archive_package(
            ArchiveContentPackageCommand(package.package_id, self.producer, "Archive for validation")
        )

        with self.assertRaises(ReviewValidationError):
            self.review.request_review(
                RequestReviewCommand(
                    RecordReference(ENTITY_CONTENT_PACKAGE, package.package_id),
                    self.producer,
                    "Archived target",
                )
            )

    def test_unavailable_reviewer_cannot_be_assigned(self):
        service = build_stage6_human_review_service(self.content, self.governance, ("reviewer",))
        package = self.ready_content_package()
        assignment = service.request_review(
            RequestReviewCommand(
                RecordReference(ENTITY_CONTENT_PACKAGE, package.package_id),
                self.producer,
                "Needs human approval",
            )
        )

        with self.assertRaises(ReviewValidationError):
            service.assign_reviewer(AssignReviewerCommand(assignment.assignment_id, self.reviewer, self.producer))


if __name__ == "__main__":
    unittest.main()
