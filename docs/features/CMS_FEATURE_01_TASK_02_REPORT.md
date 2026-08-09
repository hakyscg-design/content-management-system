# CMS Feature 01 Task 02 Report

Status: TASK 2 COMPLETE - AWAITING OPERATOR REVIEW

Repository: hakyscg-design/content-management-system

Branch: feature/cms-multi-project-foundation

PR: https://github.com/hakyscg-design/content-management-system/pull/1

Task 2 base inspected: 18bb10c3959a3b2bf41efb0733cdfd726ae4c109

## Implementation

- Added durable project-scoped local persistence in Prisma.
  - `LocalRecord`, `LocalMedia`, `LocalOperation`, and `LocalConfig` now include `projectId`.
  - Records, media, operations, and config use project-aware primary or unique keys.
  - Query indexes include `projectId` for owner/entity and operation lookup paths.
- Added migration `20260809000100_cms_project_scoped_local_persistence`.
  - Existing local rows are deterministically mapped to `football-troll-vault`.
  - Tables are rebuilt with project-scoped keys while preserving existing row values and timestamps.
- Updated local runtime persistence.
  - Dashboard reads filter by the active project.
  - Seed data, operation sequence, records, media, and operations write with the active project id.
  - FTV keeps legacy media paths under `media/...`.
  - Non-FTV projects write media under `projects/<project-id>/media/...`.
- Updated local setup.
  - Resolves the active project from `CMS_PROJECT_ID`, then compatibility `FTV_PROJECT_ID`, then default `football-troll-vault`.
  - Applies all Prisma migrations in repository order with checksum validation.
  - Writes `CMS_PROJECT_ID` into generated local config.
- Updated backup, restore, and doctor scripts.
  - FTV still defaults to `.ftv-local`.
  - Non-FTV projects default to `.cms-local/<project-id>`.
  - Backup manifests include `projectId`, `schemaVersion`, and the project-scoped migration version.
  - Restore rejects backups whose manifest project does not match the active project.
  - Restore accepts legacy L-03 FTV backup manifests and reruns local setup migrations after copying data.
  - Doctor checks the project-scoped migration.

## Migration Behavior

Migration `20260809000100_cms_project_scoped_local_persistence` preserves existing FTV data by rebuilding local tables and inserting all legacy rows with `projectId = 'football-troll-vault'`.

Legacy backup manifests without `projectId` are treated as `football-troll-vault` during restore. Restored databases are passed back through local setup so the project-scoped migration is applied before use.

No TKIC, Research Engine, AI, autonomous publishing, cloud dependency, broad project management UI, service merge/split, tag, freeze, release, or PR merge was added.

## Tests Added Or Updated

- `tests/local-tool/l03-local-runtime.test.ts`
  - Verifies records, media, and operations are isolated between `football-troll-vault` and `synthetic-project` while sharing one local store.
  - Verifies FTV compatibility media paths remain under `media/...`.
  - Verifies non-FTV project media paths are project-scoped.
  - Verifies backup manifests record project identity and restore rejects cross-project use.

Existing Task 1 configuration and runtime context tests remain in place.

## Validation Results

- `pnpm.cmd exec prisma generate --schema prisma/schema.prisma`: passed.
- `pnpm.cmd exec vitest run tests/local-tool`: passed, 2 files / 10 tests.
- `pnpm validate`: passed.
  - `pnpm format:check`: passed.
  - `pnpm lint`: passed.
  - `pnpm typecheck`: passed.
  - `pnpm test`: passed, 11 files / 60 tests.
  - `node scripts/validation/validate-workspace.mjs`: passed.

## Known Gaps Deferred To Later Tasks

- Operator UI still does not provide full project switching or project management.
- Service internals remain shared and in-memory per runtime instance; project-specific service policy expansion is deferred.
- Backup/restore remains local-first and file-based; no cloud or remote backup behavior was added.
- Historical FTV documents remain intentionally unchanged except where runtime isolation required code changes.

## Ending SHA

Final branch head after this report is committed and pushed is recorded in the operator handoff because a Git commit cannot contain its own final content hash.
