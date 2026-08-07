# Stage-11 Manual Validation Guide

## Prerequisites

- Stage-1 governance and ownership catalog are available.
- Stage-3 through Stage-10 owner records are stable.
- Stage-11 must not mutate target business records.

## Admin View Configuration

1. Build `GovernanceService` with `build_stage1_governance_service()`.
2. Build `CoreDataAdministrationService` with `build_stage11_core_data_administration_service(governance, snapshots)`.
3. Configure a view using `ConfigureAdminViewCommand`.
4. Verify:
   - the view owner service id matches the frozen ownership catalog;
   - visible fields are stored in admin configuration;
   - admin action history contains an audit event id.

## Cross-Domain Record Browsing

1. Seed read-only `OwnerRecordSnapshot` values for business records.
2. Browse the configured view using `BrowseAdminViewCommand`.
3. Verify:
   - returned records are `read_only=True`;
   - displayed fields are filtered by the view definition;
   - owner service id is shown.

## Record Lookup

1. Lookup a business record with `LookupAdminRecordCommand`.
2. Verify:
   - the owner matches the frozen ownership catalog;
   - the record is read-only;
   - lookup adds admin action history with audit id.

## Owner-Service Redirect

1. Request a modification through `RedirectMutationRequestCommand`.
2. Verify:
   - no business record is updated;
   - redirect message points to the authoritative owner service.

## Read-Only Enforcement

1. Call `reject_direct_business_mutation()` for a business record.
2. Verify it raises `ReadOnlyAdministrationError`.
3. Continue manual operation in the owner service directly.

