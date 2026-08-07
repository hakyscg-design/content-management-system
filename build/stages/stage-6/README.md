# Stage-6 Human Review & Approval

## Scope

Stage-6 implements FTV-SVC-05 Human Review & Approval. It owns review assignments, review decisions, approval statuses, and review history for review-ready content targets.

## In Scope

- Review request and registration.
- Review assignment queue and reviewer assignment.
- Review lifecycle: requested, assigned, in review, approved, rejected, returned, cancelled.
- Approval decision, approval state, rejection/return reason, manual override flag, timestamp, and traceability.
- Review history and audit-oriented state transition records.
- Ready-for-review target validation against Stage-5 content records.
- Reviewer availability validation.
- Governance validation and audit recording through FTV-SVC-09.

## Out of Scope

- Content mutation or ownership.
- Publishing, publishing checklist, platform posting, performance import, analytics, or workflow coordination.
- BPMN/user-task engine adoption.
- Direct adoption of Directus, Payload, AppFlowy, or Camunda.

## Source Components

- FTV-COMP-013: Payload-derived status transition pattern, ADAPT.
- FTV-COMP-024: Directus activity/version visibility pattern, ADAPT.
- FTV-COMP-027: AppFlowy review workspace UX pattern, REFERENCE ONLY.
- FTV-COMP-028: Directus review status/approval record pattern, ADAPT.

## Validation

Run Stage-6 tests and prior-stage regressions:

```powershell
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.human_review.test_state tests.ftv.human_review.test_validators tests.ftv.human_review.test_service_integration tests.ftv.human_review.test_smoke
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.governance.test_ownership tests.ftv.governance.test_rules tests.ftv.governance.test_service_integration tests.ftv.governance.test_smoke tests.ftv.source_intake.test_validators tests.ftv.source_intake.test_state tests.ftv.source_intake.test_service_integration tests.ftv.source_intake.test_smoke tests.ftv.asset_registry.test_state tests.ftv.asset_registry.test_validators tests.ftv.asset_registry.test_service_integration tests.ftv.asset_registry.test_smoke tests.ftv.media_processing.test_state tests.ftv.media_processing.test_validators tests.ftv.media_processing.test_service_integration tests.ftv.media_processing.test_smoke tests.ftv.content_production.test_state tests.ftv.content_production.test_validators tests.ftv.content_production.test_service_integration tests.ftv.content_production.test_smoke tests.ftv.human_review.test_state tests.ftv.human_review.test_validators tests.ftv.human_review.test_service_integration tests.ftv.human_review.test_smoke
```
