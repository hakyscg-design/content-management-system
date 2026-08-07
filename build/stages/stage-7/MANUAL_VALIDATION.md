# Stage-7 Manual Validation

## Manual Flow

1. Confirm Stage-1 through Stage-6 are frozen and passing.
2. Create a Stage-5 content package/version.
3. Approve the content target through Stage-6.
4. Create a Stage-7 publishing package from the approved content/version/approval references.
5. Complete all checklist items.
6. Mark the publishing package ready.
7. Record manual publishing completion with an external post/reference ID.
8. Confirm no platform posting/API call, performance import, analytics report, workflow run, or scheduler is created.

## Expected Result

- FTV-SVC-04 owns only Publishing package and its checklist/export/manual completion data.
- FTV-SVC-03 remains owner of content records.
- FTV-SVC-05 remains owner of approval status.
- Manual publishing remains external and human-governed.
