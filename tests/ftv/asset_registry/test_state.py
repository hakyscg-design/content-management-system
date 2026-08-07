import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.asset_registry.errors import AssetStateTransitionError, DuplicateStateTransitionError
from ftv.asset_registry.state import (
    AssetStatus,
    DuplicateMatchState,
    assert_asset_transition,
    assert_duplicate_transition,
)


class AssetRegistryStateTests(unittest.TestCase):
    def test_asset_can_move_from_pending_to_ready(self):
        assert_asset_transition(AssetStatus.PENDING, AssetStatus.READY)

    def test_asset_cannot_leave_archived(self):
        with self.assertRaises(AssetStateTransitionError):
            assert_asset_transition(AssetStatus.ARCHIVED, AssetStatus.READY)

    def test_duplicate_can_move_from_potential_to_confirmed(self):
        assert_duplicate_transition(
            DuplicateMatchState.POTENTIAL_DUPLICATE,
            DuplicateMatchState.CONFIRMED_DUPLICATE,
        )

    def test_duplicate_cannot_merge_without_confirmed_state(self):
        with self.assertRaises(DuplicateStateTransitionError):
            assert_duplicate_transition(
                DuplicateMatchState.POTENTIAL_DUPLICATE,
                DuplicateMatchState.MERGE_DECIDED,
            )


if __name__ == "__main__":
    unittest.main()

