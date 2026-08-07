# Stage-8 Manual Validation

## Manual Flow

1. Confirm Stage-1 through Stage-7 are frozen and passing.
2. Create a completed Stage-7 publishing package with a manual publishing reference.
3. Define a metric definition, such as `views`.
4. Map a source field, such as `view_count`, to the canonical metric.
5. Import a CSV with `observed_at` and mapped metric fields.
6. Confirm normalized performance facts are created and tied to the publishing package and content package.
7. Import a bad row and confirm errors are recorded without creating polluted facts.
8. Confirm no analytics report, recommendation, trend detection, scheduler, workflow run, or platform API call is created.

## Expected Result

- FTV-SVC-06 owns imports, facts, definitions, mappings, errors, and import history.
- FTV-SVC-04 remains owner of publishing packages.
- CSV/manual import can feed Stage-9 analytics later through normalized facts.
- Invalid rows are captured as import errors.
