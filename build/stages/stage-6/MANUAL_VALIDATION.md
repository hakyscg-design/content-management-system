# Stage-6 Manual Validation

## Manual Flow

1. Confirm Stage-1 through Stage-5 are frozen and passing.
2. Create a Stage-5 content package and mark it `ready_for_review`.
3. Request review for the content package.
4. Assign an available reviewer.
5. Start review as the assigned reviewer.
6. Record an approval decision and confirm approval status becomes approved.
7. Repeat with a separate package for reject and return decisions, each with a reason.
8. Repeat with override approval and confirm the override flag is recorded.
9. Cancel a requested review and confirm approval status becomes cancelled.
10. Confirm content package/version records remain unchanged by review decisions.

## Expected Result

- FTV-SVC-05 owns review assignment, review decision, approval status, and review history.
- Review decisions change review/approval records only.
- FTV-SVC-03 content packages remain owner-controlled and are referenced by ID.
- Governance/audit checks are recorded through FTV-SVC-09.
- Manual spreadsheet fallback remains possible with assignment, reviewer, state, decision, reason, override, and timestamp columns.
