# Stage-4 Manual Validation

## Manual Flow

1. Register and approve a source through Stage-2.
2. Register the approved source as an asset through Stage-3.
3. Mark the asset READY.
4. Create a Stage-4 processing job for the READY asset.
5. Execute the job with normalization, thumbnail generation, and metadata extraction operations.
6. Confirm the job history records pending, running, and completed states.
7. Confirm derivatives are registered against the asset without changing Stage-3 asset ownership or status.
8. Confirm metadata is associated with the asset and job.
9. For a failed adapter, retry the job manually and cancel it manually if needed.
10. For OCR/STT, plug in an optional enrichment provider and confirm no provider is required by default.

## Expected Result

- Stage-4 owns only media processing job records and generated media processing records.
- Stage-4 references READY asset records but does not mutate asset ownership data.
- Governance audit events are recorded through FTV-SVC-09 for each mutation.
- Optional OCR/STT remains an extension point, not an MVP dependency.
