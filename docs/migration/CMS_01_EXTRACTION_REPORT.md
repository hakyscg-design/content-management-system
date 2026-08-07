# CMS-01 Extraction Report

## Result

CMS package created at `C:\content-management-system` from current local source repository `C:\repository-acquisition-framework`.

Status: complete with unresolved items awaiting operator review.

## Source Pre-Check

- Source branch: `main`
- Source HEAD: `a4630fd8eb1128f5d44bc5ad073ccf9ea6fd23b3`
- Accepted FTV baseline tag: `ftv-v2-mvp-accepted`
- Source Local Tool work: uncommitted/untracked local L-01/L-02/L-03 files were present and treated as current local source.
- Source local runtime data: `.ftv-local` contained SQLite database, media, config, backup, logs/tmp. It was not copied into source package.

## Extraction Strategy

- Copied product/runtime source into a new sibling repository directory.
- Preserved accepted FTV services, boundaries, tests, local runtime, Prisma schema, migrations, setup/doctor/backup/restore scripts.
- Preserved historical FTV evidence without rewriting it.
- Added CMS-level overview/status/project model/migration docs.
- Extracted Football Troll Vault as `projects/football-troll-vault/PROJECT_PROFILE.md`.
- Excluded generic RAF framework volumes and TKIC artifacts from CMS core.

## Adaptations

- Root package renamed to `content-management-system`.
- Product-facing README and operator console title generalized to CMS.
- Internal `@ftv/*` package names and FTV service IDs retained as compatibility identifiers.
- `AGENTS.md` in target is CMS-specific, not copied from RAF.

## Local Data Handling

Machine-local `.ftv-local` data remains external to source. CMS target was validated with its own `.ftv-local` runtime directory. Preferred future external data location: `C:\cms-local-data`.

## Source Repository Safety

No source files were deleted, moved, reset, or cleaned for CMS-01 packaging.
