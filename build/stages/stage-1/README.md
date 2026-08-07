# Stage-1 - Governance & Ownership Foundation

This Stage-1 implementation establishes the governance foundation required by
`FTV_BUILD_ROADMAP.md`.

Scope:

- FTV-SVC-09 Governance & Rule.
- FTV-SVC-11 Core Data Administration as non-authoritative reference consumer.
- CAP-09, CAP-10, CAP-11.
- Lightweight business-rule validation.
- Audit event recording.
- Authorization relation concepts.
- Admin view configuration without business-record ownership.

Out of scope:

- Stage-2 source intake.
- Stage-3 asset registry.
- Any runtime database, API, UI, infrastructure, deployment, or external OSS runtime integration.

Run validation:

```text
python -m unittest tests.ftv.governance.test_ownership tests.ftv.governance.test_rules tests.ftv.governance.test_service_integration tests.ftv.governance.test_smoke
```

