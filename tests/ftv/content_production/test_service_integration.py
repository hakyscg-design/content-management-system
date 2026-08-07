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
    AddAssetToPackageCommand,
    AddPackageDependencyCommand,
    CreateContentBriefCommand,
    CreateContentPackageCommand,
    CreateContentVersionCommand,
    MarkContentReadyForReviewCommand,
)
from ftv.content_production.errors import ContentValidationError
from ftv.content_production.models import ContentSnapshot, PackageAssetReference
from ftv.content_production.state import ContentPackageState
from ftv.governance.config import build_stage1_governance_service
from ftv.governance.models import Actor
from ftv.media_processing.config import build_stage4_media_processing_service
from ftv.media_processing.contracts import CreateProcessingJobCommand, ExecuteProcessingJobCommand
from ftv.media_processing.state import ProcessingJobState, ProcessingOperation
from ftv.source_intake.config import build_stage2_source_intake_service
from ftv.source_intake.contracts import (
    ApproveSourceCommand,
    CaptureProvenanceCommand,
    MarkRightsPendingCommand,
    RecordRightsDecisionCommand,
    RegisterSourceCommand,
)
from ftv.source_intake.state import RightsStatus


class ContentProductionServiceIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.actor = Actor("content-user", "Content User")
        self.governance = build_stage1_governance_service()
        self.sources = build_stage2_source_intake_service(self.governance)
        self.assets = build_stage3_asset_registry_service(self.sources, self.governance)
        self.media = build_stage4_media_processing_service(self.assets, self.governance)
        self.content = build_stage5_content_production_service(self.assets, self.media, self.governance)

    def approved_source_id(self) -> str:
        source = self.sources.register_source(
            RegisterSourceCommand(
                "https://example.com/source.mp4",
                "Example",
                self.actor,
                {"approved_key": "key-001"},
            )
        )
        source = self.sources.validate_source(source.source_id, self.actor)
        self.sources.capture_provenance(
            CaptureProvenanceCommand(source.source_id, self.actor, "Approved key evidence")
        )
        self.sources.mark_rights_pending(
            MarkRightsPendingCommand(source.source_id, self.actor, "Needs rights review")
        )
        self.sources.record_rights_decision(
            RecordRightsDecisionCommand(
                source.source_id,
                self.actor,
                RightsStatus.APPROVED,
                "Approved rights",
            )
        )
        source = self.sources.approve_source(
            ApproveSourceCommand(source.source_id, self.actor, "Manual source approval")
        )
        return source.source_id

    def ready_asset_with_derivatives(self, media_reference: str = "media/content.mp4"):
        asset = self.assets.register_asset(
            RegisterAssetCommand(self.approved_source_id(), media_reference, self.actor, {"team": "FTV"})
        )
        asset = self.assets.mark_asset_ready(
            MarkAssetReadyCommand(asset.asset_id, self.actor, "Ready for content")
        )
        job = self.media.create_job(
            CreateProcessingJobCommand(
                asset.asset_id,
                self.actor,
                (
                    ProcessingOperation.NORMALIZE_MEDIA,
                    ProcessingOperation.GENERATE_THUMBNAIL,
                    ProcessingOperation.EXTRACT_METADATA,
                ),
            )
        )
        completed = self.media.execute_job(ExecuteProcessingJobCommand(job.job_id, self.actor))
        self.assertEqual(ProcessingJobState.COMPLETED, completed.state)
        derivatives = self.media.list_derivatives_for_asset(asset.asset_id)
        return asset, derivatives

    def package_asset_reference(self, asset, derivatives=()):
        return PackageAssetReference(
            asset.asset_id,
            asset.media_reference,
            provenance_reference=asset.source_id,
            derivative_references=tuple(item.derivative_reference for item in derivatives),
        )

    def create_brief_and_package(self):
        asset, derivatives = self.ready_asset_with_derivatives()
        reference = self.package_asset_reference(asset, derivatives)
        brief = self.content.create_brief(
            CreateContentBriefCommand("Match day troll", "Fast reaction meme clip", self.actor)
        )
        package = self.content.create_package(
            CreateContentPackageCommand(
                brief.brief_id,
                "Match day package",
                self.actor,
                (reference,),
                {"format": "short"},
            )
        )
        return brief, package, reference

    def test_content_package_version_lifecycle_reaches_ready_for_review(self):
        brief, package, reference = self.create_brief_and_package()
        snapshot = ContentSnapshot(
            title="Match day package",
            script="Opening beat, joke setup, punchline.",
            caption="When the underdog scores first",
            production_notes="Use processed preview.",
            asset_references=(reference,),
            media_references=reference.derivative_references,
        )

        version = self.content.create_version(
            CreateContentVersionCommand(package.package_id, snapshot, self.actor)
        )
        ready = self.content.mark_ready_for_review(
            MarkContentReadyForReviewCommand(
                package.package_id,
                self.actor,
                "Package complete and ready for human review",
            )
        )

        self.assertEqual(brief.brief_id, package.brief_id)
        self.assertEqual(1, version.version_number)
        self.assertIsNone(version.previous_version_id)
        self.assertEqual(version.version_id, ready.current_version_id)
        self.assertEqual(ContentPackageState.READY_FOR_REVIEW, ready.state)

    def test_new_version_increments_and_preserves_previous_snapshot(self):
        _, package, reference = self.create_brief_and_package()
        first = self.content.create_version(
            CreateContentVersionCommand(
                package.package_id,
                ContentSnapshot("v1", "script one", "caption one", asset_references=(reference,)),
                self.actor,
            )
        )
        second = self.content.create_version(
            CreateContentVersionCommand(
                package.package_id,
                ContentSnapshot("v2", "script two", "caption two", asset_references=(reference,)),
                self.actor,
                rollback_reference_version_id=first.version_id,
            )
        )
        versions = self.content.list_versions_for_package(package.package_id)

        self.assertEqual([1, 2], [version.version_number for version in versions])
        self.assertEqual(first.version_id, second.previous_version_id)
        self.assertEqual(first.version_id, second.rollback_reference_version_id)
        self.assertFalse(self.content.get_version(first.version_id).active)
        self.assertEqual("script one", self.content.get_version(first.version_id).snapshot.script)

    def test_package_dependency_is_recorded_without_merging_packages(self):
        _, package_one, _ = self.create_brief_and_package()
        _, package_two, _ = self.create_brief_and_package()

        dependency = self.content.add_dependency(
            AddPackageDependencyCommand(
                package_one.package_id,
                package_two.package_id,
                "Second package provides alternate hook",
                self.actor,
            )
        )

        self.assertEqual(package_one.package_id, dependency.package_id)
        self.assertEqual(1, len(self.content.list_dependencies_for_package(package_one.package_id)))

    def test_ready_for_review_requires_current_version(self):
        _, package, _ = self.create_brief_and_package()

        with self.assertRaises(ContentValidationError):
            self.content.mark_ready_for_review(
                MarkContentReadyForReviewCommand(package.package_id, self.actor, "No version yet")
            )

    def test_package_creation_rejects_unknown_media_derivative_reference(self):
        asset, _ = self.ready_asset_with_derivatives("media/unknown-derivative.mp4")
        reference = PackageAssetReference(
            asset.asset_id,
            asset.media_reference,
            derivative_references=("derivatives/unknown.mp4",),
        )
        brief = self.content.create_brief(
            CreateContentBriefCommand("Bad derivative", "Should fail", self.actor)
        )

        with self.assertRaises(ContentValidationError):
            self.content.create_package(
                CreateContentPackageCommand(brief.brief_id, "Bad package", self.actor, (reference,))
            )

    def test_add_asset_to_package_validates_ready_asset_boundary(self):
        _, package, _ = self.create_brief_and_package()
        pending_asset = self.assets.register_asset(
            RegisterAssetCommand(self.approved_source_id(), "media/pending-content.mp4", self.actor)
        )

        with self.assertRaises(ContentValidationError):
            self.content.add_asset_to_package(
                AddAssetToPackageCommand(
                    package.package_id,
                    PackageAssetReference(pending_asset.asset_id, pending_asset.media_reference),
                    self.actor,
                )
            )


if __name__ == "__main__":
    unittest.main()
