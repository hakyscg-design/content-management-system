# Stage-9 Manual Validation

## Manual Flow

1. Confirm Stage-1 through Stage-8 are frozen and passing.
2. Create normalized performance facts through Stage-8.
3. Generate an analytics report with explicit metric keys, dimensions, and aggregation method.
4. Confirm the report contains dataset rows, narrative text, learning summary, metric references, and content references.
5. Confirm Stage-9 does not mutate content package/version records.
6. Confirm no rule engine, signal detection, recommendation engine, AI, workflow, or trend forecast is created.

## Expected Result

- FTV-SVC-07 owns analytics reports and learning summaries.
- FTV-SVC-06 continues owning facts/metrics.
- FTV-SVC-03 content is referenced only.
- Learning is human-readable and report-based, not an automated decision.
