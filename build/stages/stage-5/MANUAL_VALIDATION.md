# Stage-5 Manual Validation

## Manual Flow

1. Confirm Stage-1 through Stage-4 are frozen and passing.
2. Register and approve a source through Stage-2.
3. Register and mark an asset READY through Stage-3.
4. Run Stage-4 media processing and record derivatives/metadata.
5. Create a content brief in Stage-5.
6. Create a content package from the brief and READY asset references.
7. Create the first content version with script, caption, production notes, asset references, and media references.
8. Create a second content version and confirm the previous version remains immutable and inactive.
9. Mark the package ready for review.
10. Confirm no review assignment, approval, publishing package, performance import, or analytics report is created by Stage-5.

## Expected Result

- Content Production owns Content brief, Content package, and Content version records.
- Asset and media records are referenced but not mutated.
- Version history is append-oriented and previous snapshots are preserved.
- Ready-for-review validates package completeness but does not perform human review.
- Governance/audit checks are routed through FTV-SVC-09.
