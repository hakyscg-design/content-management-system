import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.governance.errors import OwnershipViolationError, ValidationError
from ftv.governance.models import OwnerRecord, RecordReference
from ftv.governance.ownership import OwnershipCatalog


class OwnershipCatalogTests(unittest.TestCase):
    def test_owner_lookup(self):
        catalog = OwnershipCatalog([OwnerRecord("Rule evaluation", "FTV-SVC-09")])

        self.assertEqual("FTV-SVC-09", catalog.owner_for("Rule evaluation"))

    def test_duplicate_owner_records_are_rejected(self):
        with self.assertRaises(ValidationError):
            OwnershipCatalog(
                [
                    OwnerRecord("Asset", "FTV-SVC-01"),
                    OwnerRecord("Asset", "FTV-SVC-09"),
                ]
            )

    def test_non_owner_mutation_is_rejected(self):
        catalog = OwnershipCatalog([OwnerRecord("Asset", "FTV-SVC-01")])

        with self.assertRaises(OwnershipViolationError):
            catalog.assert_owner(RecordReference("Asset", "asset-1"), "FTV-SVC-09")


if __name__ == "__main__":
    unittest.main()

