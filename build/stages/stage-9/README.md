# Stage-9 Analytics & Learning

## Scope

Stage-9 implements FTV-SVC-07 Analytics & Reporting. It reads normalized performance facts and metric definitions from FTV-SVC-06, builds analytics datasets, generates narrative reports, and records learning summaries.

## In Scope

- Analytics dataset generation.
- Historical/report dataset model.
- Performance aggregation by command-driven dimensions.
- Dashboard/report data model.
- Narrative performance report.
- Learning summary with content performance links.
- Analytics history and governance audit.

## Out of Scope

- Rule engine, signal detection, decision engine, recommendation engine, AI, prompt engine, LLM, automation, workflow, and performance import.
- Content mutation.
- BI platform deployment.

## Source Components

- FTV-COMP-016: PostHog ingestion reference, REFERENCE ONLY.
- FTV-COMP-017: Metabase dashboard pattern, ADAPT.
- FTV-COMP-018: Evidence narrative report pattern, ADAPT.

## Validation

Run Stage-9 tests:

```powershell
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.analytics_reporting.test_validators tests.ftv.analytics_reporting.test_dataset tests.ftv.analytics_reporting.test_service_integration tests.ftv.analytics_reporting.test_smoke
```
