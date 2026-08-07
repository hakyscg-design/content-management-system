import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.content_production.contracts import CreateContentBriefCommand, CreateContentPackageCommand
from ftv.content_production.errors import ContentValidationError
from ftv.content_production.models import PackageAssetReference
from ftv.content_production.validators import ContentValidator
from ftv.governance.models import Actor


class ContentProductionValidatorTests(unittest.TestCase):
    def setUp(self):
        self.actor = Actor("content-user", "Content User")
        self.validator = ContentValidator()

    def test_brief_creation_requires_title_and_concept(self):
        with self.assertRaises(ContentValidationError):
            self.validator.validate_brief_creation(CreateContentBriefCommand("", "concept", self.actor))
        with self.assertRaises(ContentValidationError):
            self.validator.validate_brief_creation(CreateContentBriefCommand("title", "", self.actor))

    def test_package_creation_requires_asset_references(self):
        with self.assertRaises(ContentValidationError):
            self.validator.validate_package_creation(
                CreateContentPackageCommand("brief-1", "Package", self.actor, ())
            )

    def test_asset_reference_requires_media_reference(self):
        with self.assertRaises(ContentValidationError):
            self.validator.validate_package_creation(
                CreateContentPackageCommand(
                    "brief-1",
                    "Package",
                    self.actor,
                    (PackageAssetReference("asset-1", ""),),
                )
            )


if __name__ == "__main__":
    unittest.main()
