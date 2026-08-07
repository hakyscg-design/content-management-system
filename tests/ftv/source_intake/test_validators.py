import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.governance.models import Actor
from ftv.source_intake.contracts import RegisterSourceCommand
from ftv.source_intake.errors import SourceValidationError
from ftv.source_intake.state import RightsStatus
from ftv.source_intake.validators import SourceValidator


class SourceValidatorTests(unittest.TestCase):
    def setUp(self):
        self.validator = SourceValidator()
        self.actor = Actor("intake-user")

    def test_registration_requires_supported_uri(self):
        with self.assertRaises(SourceValidationError):
            self.validator.validate_registration(
                RegisterSourceCommand("ftp://example.com/file.mp4", "Example", self.actor)
            )

    def test_registration_accepts_https_source(self):
        self.validator.validate_registration(
            RegisterSourceCommand("https://example.com/file.mp4", "Example", self.actor)
        )

    def test_source_approval_requires_known_usable_rights(self):
        with self.assertRaises(SourceValidationError):
            self.validator.validate_source_can_be_approved(RightsStatus.REJECTED)


if __name__ == "__main__":
    unittest.main()

