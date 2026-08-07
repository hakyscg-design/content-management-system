import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.asset_registry.errors import AssetValidationError
from ftv.asset_registry.state import AssetRightsState
from ftv.asset_registry.validators import AssetValidator, DuplicateValidator


class AssetRegistryValidatorTests(unittest.TestCase):
    def test_asset_ready_requires_usable_rights(self):
        with self.assertRaises(AssetValidationError):
            AssetValidator().validate_asset_can_be_ready(AssetRightsState.REJECTED)

    def test_duplicate_candidate_assets_must_differ(self):
        with self.assertRaises(AssetValidationError):
            DuplicateValidator().validate_candidate("asset-1", "asset-1", "same hash", 0.9)

    def test_duplicate_confidence_must_be_in_range(self):
        with self.assertRaises(AssetValidationError):
            DuplicateValidator().validate_candidate("asset-1", "asset-2", "hash", 1.5)


if __name__ == "__main__":
    unittest.main()

