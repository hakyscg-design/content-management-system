# Stage-2 - Source Intake Foundation

This Stage-2 implementation establishes manual-first source intake for
Football Troll Vault v2.

Scope:

- FTV-SVC-01 Source & Asset Registry, limited to Source Reference intake.
- FTV-SVC-09 Governance & Rule dependency from Stage-1.
- CAP-01, CAP-02, CAP-11 within Stage-2 source/provenance/rights scope.
- Approved Source Acquisition.
- Provenance Capture.
- Rights Manager, Stage-2 portion only.

Out of scope:

- Asset Registry.
- Duplicate Detection.
- Media Processing.
- Content Production.
- Publishing.
- Performance Data.
- Analytics.
- Workflow automation beyond governance/audit checks.

Run validation:

```text
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.source_intake.test_validators tests.ftv.source_intake.test_state tests.ftv.source_intake.test_service_integration tests.ftv.source_intake.test_smoke
```

