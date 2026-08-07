# Stage-11 - Core Data Administration & Visibility

## Implementation Plan

Stage-11 implements `FTV-SVC-11 Core Data Administration` only. The service provides read-only cross-domain visibility over owner records, admin view configuration, owner identification, and owner-service redirection.

The implementation follows the frozen roadmap:

- Cross-domain record browsing.
- Record lookup and visibility.
- Owner identification.
- Owner-service redirect for modification requests.
- Read-only administration view.
- Administration configuration.
- View access, browsing, configuration, user, timestamp, and audit linkage.

Administration does not own or directly mutate business records.

## Folder Structure

```text
src/ftv/core_data_administration/
tests/ftv/core_data_administration/
build/stages/stage-11/
```

## Package Layout

```text
core_data_administration
|-- config.py
|-- constants.py
|-- contracts.py
|-- errors.py
|-- governance.py
|-- interfaces.py
|-- models.py
|-- repository_adapters.py
|-- service.py
|-- validators.py
`-- __init__.py
```

## Source Tree

```text
src/ftv/core_data_administration/config.py
src/ftv/core_data_administration/constants.py
src/ftv/core_data_administration/contracts.py
src/ftv/core_data_administration/errors.py
src/ftv/core_data_administration/governance.py
src/ftv/core_data_administration/interfaces.py
src/ftv/core_data_administration/models.py
src/ftv/core_data_administration/repository_adapters.py
src/ftv/core_data_administration/service.py
src/ftv/core_data_administration/validators.py
src/ftv/core_data_administration/__init__.py
tests/ftv/core_data_administration/test_service_integration.py
tests/ftv/core_data_administration/test_smoke.py
tests/ftv/core_data_administration/test_validators.py
```

## Interface Design

Commands:

- `ConfigureAdminViewCommand`
- `ConfigureSchemaDisplayCommand`
- `BrowseAdminViewCommand`
- `LookupAdminRecordCommand`
- `RedirectMutationRequestCommand`

Ports:

- `AdminViewDefinitionRepository`
- `SchemaDisplayMetadataRepository`
- `OwnerRecordReadGateway`
- `AdminActionHistoryRepository`

`OwnerRecordReadGateway` is read-only and represents owner-service snapshots. It is not a shared database and does not transfer business record ownership to administration.

## Domain Models and DTOs

- `AdminViewDefinition`
- `SchemaDisplayMetadata`
- `OwnerRecordSnapshot`
- `AdminRecordView`
- `AdminRecordListing`
- `OwnerServiceRedirect`
- `AdminActionHistoryEntry`

## Administration Models

Administration owns:

- admin view configuration;
- schema/display metadata;
- admin visibility history containing governance audit ids.

Administration references but does not own:

- source references;
- assets;
- media processing jobs;
- content packages and versions;
- publishing packages;
- review assignments and approvals;
- performance imports/facts/metrics;
- analytics reports;
- workflow runs;
- governance records.

## View Models

Admin views define:

- target entity type;
- frozen owner service id;
- display name;
- visible fields.

Admin record views are always `read_only=True`.

## Audit Models

Audit events remain owned by `FTV-SVC-09 Governance & Rule`. Stage-11 records `AdminActionHistoryEntry` rows with linked `audit_event_id` for:

- admin view configuration;
- schema display configuration;
- view browsing;
- record lookup;
- mutation redirection.

## Repository Adapter

Stage-11 uses in-memory adapters only:

- `InMemoryAdminViewDefinitionRepository`
- `InMemorySchemaDisplayMetadataRepository`
- `InMemoryAdminActionHistoryRepository`
- `InMemoryOwnerRecordReadGateway`

No database, shared ownership table, admin mutation surface, or Directus runtime is introduced.

## Internal Modules

- Admin View Configuration: implemented by `CoreDataAdministrationService`, `AdminViewDefinition`, and schema display metadata.

## Configuration

`build_stage11_core_data_administration_service()` composes:

- Stage-1 governance service;
- in-memory admin view repository;
- in-memory schema/display metadata repository;
- in-memory read-only owner snapshot gateway;
- in-memory admin action history;
- governance gateway;
- validator using the frozen ownership catalog.

## Repository Decisions Applied

- Directus: ADAPT pattern for admin/data model and activity visibility.
- Grafana: REFERENCE ONLY for visibility pattern.

No third-party code was copied.

## Tests

```text
tests/ftv/core_data_administration/test_validators.py
tests/ftv/core_data_administration/test_service_integration.py
tests/ftv/core_data_administration/test_smoke.py
```

Coverage includes:

- admin view configuration validation;
- schema display metadata configuration;
- cross-domain read-only browsing;
- owner record lookup;
- owner-service redirect;
- direct mutation rejection;
- audit id linkage in admin history.

## Known Limitations

- No Directus runtime.
- No shared database design.
- No cross-domain write logic.
- Owner snapshots are read-only inputs for MVP validation.
- Access validation is routed through the existing Stage-1 governance rule path.

## Next Stage Dependency

Stage-12 can validate end-to-end MVP readiness after Stage-11 review/freeze. Stage-11 does not implement Stage-12 readiness packaging.

