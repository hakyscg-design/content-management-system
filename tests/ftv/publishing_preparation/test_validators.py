import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.publishing_preparation.errors import PublishingValidationError
from ftv.publishing_preparation.models import PublishingMetadata
from ftv.publishing_preparation.validators import PublishingValidator


class PublishingPreparationValidatorTests(unittest.TestCase):
    def setUp(self):
        self.validator = PublishingValidator(("content_approved", "platform_selected"))

    def test_metadata_requires_caption_and_platform(self):
        with self.assertRaises(PublishingValidationError):
            self.validator.validate_metadata(PublishingMetadata("", "youtube"))
        with self.assertRaises(PublishingValidationError):
            self.validator.validate_metadata(PublishingMetadata("caption", ""))

    def test_checklist_required_items_are_exposed(self):
        self.assertEqual(("content_approved", "platform_selected"), self.validator.required_checklist_items)


if __name__ == "__main__":
    unittest.main()
