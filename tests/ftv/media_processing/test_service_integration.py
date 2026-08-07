import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.asset_registry.config import build_stage3_asset_registry_service
from ftv.asset_registry.contracts import MarkAssetReadyCommand, RegisterAssetCommand
from ftv.asset_registry.state import AssetStatus
from ftv.governance.config import build_stage1_governance_service
from ftv.governance.models import Actor
from ftv.media_processing.adapters import DeterministicMediaProcessor, StaticOptionalEnrichmentProvider
from ftv.media_processing.config import build_stage4_media_processing_service
from ftv.media_processing.contracts import (
    CancelProcessingJobCommand,
    CreateProcessingJobCommand,
    ExecuteProcessingJobCommand,
    RetryProcessingJobCommand,
)
from ftv.media_processing.errors import ProcessingValidationError
from ftv.media_processing.state import DerivativeKind, ProcessingJobState, ProcessingOperation
from ftv.source_intake.config import build_stage2_source_intake_service
from ftv.source_intake.contracts import (
    ApproveSourceCommand,
    CaptureProvenanceCommand,
    MarkRightsPendingCommand,
    RecordRightsDecisionCommand,
    RegisterSourceCommand,
)
from ftv.source_intake.state import RightsStatus


class MediaProcessingServiceIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.actor = Actor("media-user", "Media User")
        self.governance = build_stage1_governance_service()
        self.sources = build_stage2_source_intake_service(self.governance)
        self.assets = build_stage3_asset_registry_service(self.sources, self.governance)
        self.media = build_stage4_media_processing_service(self.assets, self.governance)

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

    def ready_asset(self, media_reference: str = "media/original.mp4"):
        asset = self.assets.register_asset(
            RegisterAssetCommand(self.approved_source_id(), media_reference, self.actor, {"team": "FTV"})
        )
        return self.assets.mark_asset_ready(
            MarkAssetReadyCommand(asset.asset_id, self.actor, "Ready for media processing")
        )

    def create_job(self, asset_id: str, operations: tuple[ProcessingOperation, ...]):
        return self.media.create_job(CreateProcessingJobCommand(asset_id, self.actor, operations))

    def test_job_execution_creates_derivatives_metadata_history_and_keeps_asset_owner_state(self):
        asset = self.ready_asset()
        job = self.create_job(
            asset.asset_id,
            (
                ProcessingOperation.NORMALIZE_MEDIA,
                ProcessingOperation.GENERATE_THUMBNAIL,
                ProcessingOperation.EXTRACT_METADATA,
            ),
        )

        completed = self.media.execute_job(ExecuteProcessingJobCommand(job.job_id, self.actor))

        self.assertEqual(ProcessingJobState.COMPLETED, completed.state)
        derivative_kinds = {item.kind for item in self.media.list_derivatives_for_asset(asset.asset_id)}
        self.assertEqual(
            {
                DerivativeKind.THUMBNAIL,
                DerivativeKind.PREVIEW,
                DerivativeKind.NORMALIZED_MEDIA,
                DerivativeKind.OPTIMIZED_MEDIA,
            },
            derivative_kinds,
        )
        metadata = self.media.list_metadata_for_asset(asset.asset_id)
        self.assertEqual(1, len(metadata))
        self.assertIsNotNone(metadata[0].file_hash)
        self.assertEqual(asset.media_reference, self.assets.get_asset(asset.asset_id).media_reference)
        self.assertEqual(AssetStatus.READY, self.assets.get_asset(asset.asset_id).status)
        self.assertEqual(
            [ProcessingJobState.PENDING, ProcessingJobState.RUNNING, ProcessingJobState.COMPLETED],
            [entry.state for entry in self.media.list_history_for_job(job.job_id)],
        )

    def test_failed_job_can_be_manually_retried_then_cancelled(self):
        asset = self.ready_asset("media/failing.mp4")
        failing_media = build_stage4_media_processing_service(
            self.assets,
            self.governance,
            media_processor=DeterministicMediaProcessor(fail=True),
        )
        job = failing_media.create_job(
            CreateProcessingJobCommand(
                asset.asset_id,
                self.actor,
                (ProcessingOperation.NORMALIZE_MEDIA,),
            )
        )

        failed = failing_media.execute_job(ExecuteProcessingJobCommand(job.job_id, self.actor))
        retried = failing_media.retry_job(
            RetryProcessingJobCommand(failed.job_id, self.actor, "Manual retry after checking failure")
        )
        cancelled = failing_media.cancel_job(
            CancelProcessingJobCommand(retried.job_id, self.actor, "Manual cancel during MVP validation")
        )

        self.assertEqual(ProcessingJobState.FAILED, failed.state)
        self.assertIn("deterministic media processor failure", failed.error_message)
        self.assertEqual(ProcessingJobState.PENDING, retried.state)
        self.assertEqual(ProcessingJobState.CANCELLED, cancelled.state)

    def test_pending_job_can_be_manually_cancelled(self):
        asset = self.ready_asset("media/cancel.mp4")
        job = self.create_job(asset.asset_id, (ProcessingOperation.EXTRACT_METADATA,))

        cancelled = self.media.cancel_job(
            CancelProcessingJobCommand(job.job_id, self.actor, "Manual cancel before execution")
        )

        self.assertEqual(ProcessingJobState.CANCELLED, cancelled.state)

    def test_optional_enrichment_uses_extension_point_without_required_provider(self):
        asset = self.ready_asset("media/enrichment.mp4")
        media = build_stage4_media_processing_service(
            self.assets,
            self.governance,
            enrichment_provider=StaticOptionalEnrichmentProvider("stub-ocr-stt", "sample text"),
        )
        job = media.create_job(
            CreateProcessingJobCommand(
                asset.asset_id,
                self.actor,
                (ProcessingOperation.OPTIONAL_ENRICHMENT,),
            )
        )

        completed = media.execute_job(ExecuteProcessingJobCommand(job.job_id, self.actor))
        enrichments = media.list_enrichments_for_asset(asset.asset_id)

        self.assertEqual(ProcessingJobState.COMPLETED, completed.state)
        self.assertEqual(1, len(enrichments))
        self.assertEqual("stub-ocr-stt", enrichments[0].provider_label)

    def test_processing_requires_ready_asset(self):
        asset = self.assets.register_asset(
            RegisterAssetCommand(self.approved_source_id(), "media/not-ready.mp4", self.actor)
        )

        with self.assertRaises(ProcessingValidationError):
            self.create_job(asset.asset_id, (ProcessingOperation.EXTRACT_METADATA,))


if __name__ == "__main__":
    unittest.main()
