# Stage-5 Content Production Core

## Scope

Stage-5 implements FTV-SVC-03 Content Production Core. It owns content briefs, content packages, and content versions, and it references READY assets plus optional media derivatives from prior owner services.

## In Scope

- Content brief creation.
- Content package creation and registration.
- Package asset and media references.
- Package dependency records.
- Content metadata.
- Content lifecycle state: draft, in progress, ready for review, archived.
- Version creation, increment, history, previous version, active version, rollback reference, immutable snapshots.
- Ready-for-review validation.
- Governance validation and audit recording through FTV-SVC-09.

## Out of Scope

- Human review, approval, publishing, publishing checklist, performance import, analytics, and workflow coordination.
- AI content generation.
- Direct adoption of Payload, AppFlowy, Strapi, Directus, or a database.
- Mutation of asset, media, review, publishing, analytics, or governance owner records.

## Source Components

- FTV-COMP-009: Payload-derived content brief/edit-plan record pattern, ADAPT.
- FTV-COMP-010: AppFlowy planning workspace UX pattern, REFERENCE ONLY.
- FTV-COMP-011: Payload-derived draft/version workflow pattern, ADAPT.

## Validation

Run the Stage-5 tests and prior-stage regressions:

```powershell
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.content_production.test_state tests.ftv.content_production.test_validators tests.ftv.content_production.test_service_integration tests.ftv.content_production.test_smoke
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.governance.test_ownership tests.ftv.governance.test_rules tests.ftv.governance.test_service_integration tests.ftv.governance.test_smoke tests.ftv.source_intake.test_validators tests.ftv.source_intake.test_state tests.ftv.source_intake.test_service_integration tests.ftv.source_intake.test_smoke tests.ftv.asset_registry.test_state tests.ftv.asset_registry.test_validators tests.ftv.asset_registry.test_service_integration tests.ftv.asset_registry.test_smoke tests.ftv.media_processing.test_state tests.ftv.media_processing.test_validators tests.ftv.media_processing.test_service_integration tests.ftv.media_processing.test_smoke tests.ftv.content_production.test_state tests.ftv.content_production.test_validators tests.ftv.content_production.test_service_integration tests.ftv.content_production.test_smoke
```
