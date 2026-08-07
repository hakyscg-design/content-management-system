# Stage-3 Manual Validation Guide

1. Confirm Stage-1 and Stage-2 tests still pass.
2. Confirm Stage-3 code exists only under `src/ftv/asset_registry`.
3. Create and approve a Stage-2 source.
4. Register an asset from the approved source.
5. Confirm the asset has source ID, media reference, rights association, metadata, and pending state.
6. Mark asset ready only when rights are approved or restricted.
7. Update rights to rejected/expired and confirm asset becomes blocked.
8. Record a duplicate candidate between two different assets.
9. Resolve duplicate by human decision: confirmed duplicate, false positive, merge decided, or keep separate decided.
10. Confirm merge decision records human intent only and does not automatically merge assets.
11. Confirm no Media Processing, Content Package, Review, or Publishing implementation was introduced.

