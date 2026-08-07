import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from ftv.governance.models import Actor
from ftv.media_processing.contracts import CreateProcessingJobCommand
from ftv.media_processing.errors import ProcessingValidationError
from ftv.media_processing.state import ProcessingOperation
from ftv.media_processing.validators import ProcessingValidator


class MediaProcessingValidatorTests(unittest.TestCase):
    def setUp(self):
        self.validator = ProcessingValidator()
        self.actor = Actor("media-user", "Media User")

    def test_job_creation_requires_asset_id(self):
        with self.assertRaises(ProcessingValidationError):
            self.validator.validate_job_creation(
                CreateProcessingJobCommand(
                    "",
                    self.actor,
                    (ProcessingOperation.EXTRACT_METADATA,),
                )
            )

    def test_job_creation_requires_operations(self):
        with self.assertRaises(ProcessingValidationError):
            self.validator.validate_job_creation(CreateProcessingJobCommand("asset-1", self.actor, ()))

    def test_manual_reason_is_required(self):
        with self.assertRaises(ProcessingValidationError):
            self.validator.validate_reason(" ")


if __name__ == "__main__":
    unittest.main()
