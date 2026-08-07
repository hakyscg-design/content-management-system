import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.asset_registry.config import build_stage3_asset_registry_service
from ftv.asset_registry.contracts import (
    BlockAssetCommand,
    MarkAssetReadyCommand,
    RecordDuplicateCandidateCommand,
    RegisterAssetCommand,
    ResolveDuplicateCommand,
    UpdateAssetRightsCommand,
)
from ftv.asset_registry.errors import AssetValidationError
from ftv.asset_registry.state import AssetRightsState, AssetStatus, DuplicateMatchState
from ftv.governance.config import build_stage1_governance_service
from ftv.governance.models import Actor
from ftv.source_intake.config import build_stage2_source_intake_service
from ftv.source_intake.contracts import (
    ApproveSourceCommand,
    CaptureProvenanceCommand,
    MarkRightsPendingCommand,
    RecordRightsDecisionCommand,
    RegisterSourceCommand,
)
from ftv.source_intake.state import RightsStatus


class AssetRegistryServiceIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.actor = Actor("asset-user", "Asset User")
        self.governance = build_stage1_governance_service()
        self.sources = build_stage2_source_intake_service(self.governance)
        self.assets = build_stage3_asset_registry_service(self.sources, self.governance)

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
        source = self.sources.mark_rights_pending(
            MarkRightsPendingCommand(source.source_id, self.actor, "Needs rights")
        )
        source = self.sources.record_rights_decision(
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

    def register_asset(self, media_reference: str = "media/original.mp4"):
        return self.assets.register_asset(
            RegisterAssetCommand(
                self.approved_source_id(),
                media_reference,
                self.actor,
                {"team": "FTV"},
            )
        )

    def test_asset_registration_and_ready_flow(self):
        asset = self.register_asset()
        asset = self.assets.mark_asset_ready(
            MarkAssetReadyCommand(asset.asset_id, self.actor, "Ready after source checks")
        )

        self.assertEqual(AssetStatus.READY, asset.status)
        self.assertEqual(AssetRightsState.APPROVED, asset.rights_state)
        self.assertEqual(1, len(self.assets.list_assets()))

    def test_asset_registration_requires_approved_source(self):
        source = self.sources.register_source(
            RegisterSourceCommand("https://example.com/pending.mp4", "Example", self.actor)
        )

        with self.assertRaises(AssetValidationError):
            self.assets.register_asset(
                RegisterAssetCommand(source.source_id, "media/pending.mp4", self.actor)
            )

    def test_rights_rejection_blocks_ready_asset(self):
        asset = self.register_asset()
        asset = self.assets.mark_asset_ready(
            MarkAssetReadyCommand(asset.asset_id, self.actor, "Ready")
        )
        asset = self.assets.update_asset_rights(
            UpdateAssetRightsCommand(
                asset.asset_id,
                AssetRightsState.REJECTED,
                self.actor,
                "Rights revoked",
            )
        )

        self.assertEqual(AssetStatus.BLOCKED, asset.status)
        self.assertEqual(AssetRightsState.REJECTED, asset.rights_state)

    def test_manual_duplicate_review_and_merge_decision(self):
        asset_one = self.register_asset("media/one.mp4")
        asset_two = self.register_asset("media/two.mp4")
        match = self.assets.record_duplicate_candidate(
            RecordDuplicateCandidateCommand(
                asset_one.asset_id,
                asset_two.asset_id,
                self.actor,
                "perceptual hash similarity",
                0.92,
            )
        )
        match = self.assets.resolve_duplicate(
            ResolveDuplicateCommand(
                match.duplicate_match_id,
                self.actor,
                DuplicateMatchState.CONFIRMED_DUPLICATE,
                "Human confirmed duplicate",
            )
        )
        match = self.assets.resolve_duplicate(
            ResolveDuplicateCommand(
                match.duplicate_match_id,
                self.actor,
                DuplicateMatchState.MERGE_DECIDED,
                "Human chose merge; no automatic merge performed",
            )
        )

        self.assertEqual(DuplicateMatchState.MERGE_DECIDED, match.state)
        self.assertEqual(1, len(self.assets.list_duplicate_matches(asset_one.asset_id)))

    def test_keep_separate_duplicate_resolution(self):
        asset_one = self.register_asset("media/one.mp4")
        asset_two = self.register_asset("media/two.mp4")
        match = self.assets.record_duplicate_candidate(
            RecordDuplicateCandidateCommand(
                asset_one.asset_id,
                asset_two.asset_id,
                self.actor,
                "same source family",
                0.7,
            )
        )
        match = self.assets.resolve_duplicate(
            ResolveDuplicateCommand(
                match.duplicate_match_id,
                self.actor,
                DuplicateMatchState.KEEP_SEPARATE_DECIDED,
                "Different edit context",
            )
        )

        self.assertEqual(DuplicateMatchState.KEEP_SEPARATE_DECIDED, match.state)


if __name__ == "__main__":
    unittest.main()

