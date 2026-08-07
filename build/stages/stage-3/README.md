# Stage-3 - Asset Registry & Duplicate Control

This Stage-3 implementation establishes the Asset Registry foundation for
Football Troll Vault v2.

Scope:

- FTV-SVC-01 Source & Asset Registry, limited to Asset, Rights association,
  Asset state, and Duplicate match records.
- FTV-SVC-09 Governance & Rule dependency from Stage-1.
- Stage-2 Source Intake dependency.
- CAP-02 Asset Management.
- Rights Manager, Stage-3 extension.
- Duplicate Decision Handler.

Out of scope:

- Media Processing.
- FFmpeg.
- OCR/STT.
- Thumbnail Generation.
- Metadata Extraction Pipeline.
- Content Package.
- Review.
- Publishing.

Run validation:

```text
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.asset_registry.test_state tests.ftv.asset_registry.test_validators tests.ftv.asset_registry.test_service_integration tests.ftv.asset_registry.test_smoke
```

