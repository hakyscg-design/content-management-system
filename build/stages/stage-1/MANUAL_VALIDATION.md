# Stage-1 Manual Validation Guide

Use this guide to manually review the Stage-1 foundation without starting Stage-2.

1. Confirm frozen source artifacts were not edited.
2. Confirm Stage-1 code lives under `src/ftv/governance`.
3. Confirm tests live under `tests/ftv/governance`.
4. Confirm `OwnershipCatalog` rejects duplicate owners.
5. Confirm `LightweightBusinessRuleValidator` denies non-owner mutations.
6. Confirm Core Data Administration can configure a view for `Asset` but does not become the owner of `Asset`.
7. Confirm audit event recording is append-only in the Stage-1 adapter.
8. Confirm no source intake, asset registry, media processing, content, review, publishing, performance, analytics, or workflow implementation exists in this stage.

