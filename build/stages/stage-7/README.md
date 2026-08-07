# Stage-7 Publishing Preparation

## Scope

Stage-7 implements FTV-SVC-04 Publishing Preparation. It owns publishing packages, readiness checklist state, export metadata, manual publishing completion references, and publishing history.

## In Scope

- Publishing package creation from approved content.
- Publishing metadata: caption, tags, platform target, metadata values.
- Content, asset, media, version, and approval references.
- Publishing checklist completion.
- Publishing states: preparing, ready, blocked, cancelled, completed.
- Manual publishing completion reference.
- Publishing history and governance audit.

## Out of Scope

- Platform posting, Facebook API, YouTube API, Instagram API, auto publishing, scheduler, performance import, analytics, or workflow coordination.
- Content version ownership or approval decision ownership.
- Direct adoption of Ghost, Payload, Penpot, or Strapi.

## Source Components

- FTV-COMP-012: Ghost publishing metadata/checklist pattern, ADAPT.
- FTV-COMP-013: Payload publish-readiness state pattern, ADAPT.
- FTV-COMP-014: Penpot visual template reference, REFERENCE ONLY.

## Validation

Run Stage-7 tests and prior-stage regressions:

```powershell
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.publishing_preparation.test_state tests.ftv.publishing_preparation.test_validators tests.ftv.publishing_preparation.test_service_integration tests.ftv.publishing_preparation.test_smoke
```
