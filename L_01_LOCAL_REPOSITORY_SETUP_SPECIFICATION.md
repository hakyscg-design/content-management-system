# L-01 Local Repository Setup Specification

| Field | Value |
|---|---|
| Project | Football Troll Vault v2 |
| Phase | L-01 - Local Repository Setup |
| Artifact type | Specification |
| Status | FROZEN |
| Created | 2026-07-31 |
| Freeze date | 2026-07-31 |
| Baseline | Accepted Baseline |
| Baseline HEAD | `a4630fd8eb1128f5d44bc5ad073ccf9ea6fd23b3` |
| Baseline tag | `ftv-v2-mvp-accepted` |
| Repository freeze | RF-01 - `REPOSITORY FROZEN - ACCEPTED BASELINE FINALIZED` |

## 1. Purpose

L-01 defines how the accepted Football Troll Vault v2 MVP baseline should be prepared for local-tool implementation.

This specification does not implement the tool. It defines the approved setup direction for later phases so the local tool can be built without redesigning the accepted MVP, changing service ownership, changing accepted contracts, or changing acceptance behavior.

## 2. Authoritative Sources Reviewed

| Source | Repository path | L-01 use |
|---|---|---|
| System Requirements | `FTV_SYSTEM_REQUIREMENTS.md` | Confirms production-layer scope, persistent operational storage requirement, manual-first and human-governed constraints. |
| Repository Review Profile | `REPOSITORY_REVIEW_PROFILE.md` | Confirms repository-friendly, MVP-first, modular, maintainable direction. |
| Accepted Baseline Repository | tag `ftv-v2-mvp-accepted` | Defines the source state for Local Tool work. |
| Architecture Blueprint | `FTV_ARCHITECTURE_BLUEPRINT.md` | Defines layer rules, bounded contexts, ownership, and forbidden dependencies. |
| Service Catalog | `FTV_SERVICE_CATALOG.md` | Defines FTV-SVC-01 through FTV-SVC-11 and service ownership. |
| Component Catalog | `FTV_COMPONENT_CATALOG.md` | Provides component/reference constraints without authorizing new capability expansion. |
| Build Execution Documents | `docs/build-execution/BE_01...BE_06` | Defines TypeScript/pnpm baseline, in-memory service implementation, and deferred persistence/UI/API work. |
| Acceptance Reports | `AT_00...AT_05`, CR-01, AT-03/AT-04 reruns | Defines accepted behavior, governance enforcement, failure recovery, verified references, and manual fallback. |
| Repository Freeze Report | `RF_01_REPOSITORY_FREEZE_ACCEPTED_BASELINE_FINALIZATION_REPORT.md` | Confirms accepted baseline finalization and authorizes L-01 as next step. |

Chat history is not used as an authoritative source.

## 3. Current Repository Baseline

| Area | Observed state |
|---|---|
| Git | Branch `main`, HEAD `a4630fd8eb1128f5d44bc5ad073ccf9ea6fd23b3`, tag `ftv-v2-mvp-accepted`. Remediation preflight found only the existing untracked L-01 draft before edits. |
| Runtime baseline | Node.js 24 LTS line, pnpm 11, TypeScript, ESLint, Prettier, Vitest. |
| Root package manager | `pnpm@11.9.0` declared in `package.json`. |
| Existing apps | `apps/api` and `apps/operator-console` are placeholders. |
| Existing services | TypeScript service packages exist under `services/*`; FTV-SVC-10 remains non-runtime reference-only. |
| Existing integration | `services/workflow-orchestration/src/integration.ts` coordinates accepted in-process owner-routed flows. |
| Existing persistence | Runtime service state is in-memory. Durable database schema and persistence were deferred by BE-06. |
| Existing UI/API | No local web UI, no implemented API routes, no browser operator console. |
| Existing tests | Unit, contract, integration, acceptance-remediation regression tests are available through pnpm scripts. |
| Existing Python footprint | `docs/build-execution/BE_01_WORKSPACE_REPOSITORY_BOOTSTRAP.md` records existing FTV Python source packages under `src/ftv` and Python tests under `tests/ftv`. `docs/build-execution/BE_03_SERVICE_IMPLEMENTATION.md` records that this pre-BE Python footprint coexists with the TypeScript service implementation. The accepted local-tool runtime direction is TypeScript because BE-01 freezes TypeScript/Node/pnpm and BE-03 freezes TypeScript service packages, but L-01 does not authorize deleting, rewriting, or ignoring the Python footprint. Its final authority/disposition remains a repository verification item for any phase that would touch it. |

## 4. L-01 Scope

L-01 is a design-only setup phase.

In scope:

- Define the local runtime model.
- Define the local application structure.
- Define the local database choice and ownership mapping approach.
- Define the local media/file storage approach.
- Define startup, shutdown, setup, and developer command strategy.
- Define environment/configuration strategy.
- Define packaging, backup, and restore strategy.
- Define guardrails for later implementation phases.

Out of scope:

- Code changes.
- Dependency installation.
- Database schema creation.
- Prisma schema or migrations.
- Next.js routes or UI screens.
- API endpoints.
- Service refactors.
- Contract changes.
- Business-rule changes.
- Acceptance behavior changes.
- New capabilities.
- Cloud deployment, Docker/Kubernetes, CI/CD expansion, AI, or publishing automation.

## 5. Local Tool Runtime Decision

| Decision | Specification |
|---|---|
| Runtime style | Local-first web application running on the operator's Windows machine. |
| Physical topology | Single local Node.js process for the web application and local API boundary. |
| Logical topology | Preserve frozen logical service boundaries through existing `services/*` packages and owner-routed application/integration calls. |
| UI framework | Next.js in `apps/operator-console`, unless later implementation discovers a blocking incompatibility. |
| API boundary | Next.js route handlers or server actions may serve local-only API needs; `apps/api` remains reserved unless a later phase proves a separate local API package is necessary. |
| Package manager | Keep pnpm as the canonical package manager. Add npm-compatible root scripts only as command aliases if required for the final operator experience. |
| Port | Default local URL: `http://localhost:3000`. |
| Network posture | Bind to localhost by default. No cloud service, no remote publishing, no external connector requirement. |

Package-manager rule: `pnpm install` remains the canonical dependency installation command. Later convenience commands may expose `npm run setup`, `npm run dev`, and `npm run doctor`, but those npm scripts must call pnpm or workspace scripts internally where workspace behavior is required. L-01 does not authorize switching package managers, creating `package-lock.json`, or accepting `package-lock.json`.

Recommended operator command direction for later implementation:

```text
corepack enable
pnpm install
npm run setup
npm run doctor
npm run dev
```

Rationale: This keeps a simple local operator experience while avoiding physical microservices. Logical services remain separate packages and retain ownership boundaries.

## 5.1 Application Boundary for Local Routes and Actions

Next.js route handlers, server actions, and server-side application actions are transport/application entry points only. They must not become business-rule owners.

Required dependency direction:

```text
UI / Local Transport
-> Application Boundary
-> Owning Service
-> Infrastructure Adapter
```

Forbidden behavior for later phases:

- UI calls Prisma directly.
- UI calls persistence adapters directly.
- UI mutates the database directly.
- Server actions bypass the application or owning-service boundary.
- Route handlers recreate business rules already owned by services.
- Transport code decides workflow transitions.
- UI-specific models duplicate service state or become authoritative.

Server actions remain an allowed implementation option only when this dependency direction is preserved.

## 6. Local Database Decision

| Decision | Specification |
|---|---|
| Database | SQLite local file database. |
| ORM/tooling | Prisma should be used for migrations and typed persistence adapters in later phases. |
| Logical database location | `<repository-root>/.ftv-local/data/ftv.sqlite`, configurable through local runtime configuration. |
| Prisma URL resolution | L-03 must generate a Windows-safe SQLite connection URL from the resolved local base directory. It must not assume Prisma resolves `file:` URLs relative to repository root or `prisma/schema.prisma`. |
| Persistence owner rule | Tables and repository adapters must map records to their authoritative owner service. Cross-service references remain references, not shared ownership. |
| Schema timing | No schema is created in L-01. Schema design and migrations belong to L-03. |
| Accepted behavior guard | Persistence must preserve CR-01 verified-reference behavior and duplicate/fabricated-reference rejection behavior. |

The database is infrastructure. It must not own business logic, redefine state transitions, or permit direct cross-service mutation.

L-03 path requirements:

- Resolve the configured local base directory before building the Prisma URL.
- Support Windows paths, including paths with spaces.
- Avoid hardcoded machine-specific absolute paths in tracked source.
- Avoid accidental dependency on the location of `prisma/schema.prisma`.
- Allow setup/runtime code to generate the final connection URL.
- Fail fast if the resolved path is invalid or inaccessible.

## 7. Local Storage Decision

| Area | Specification |
|---|---|
| Storage root | `.ftv-local/media` by default, configurable. |
| Managed media | Uploaded/source media files, generated derivatives, thumbnails, export bundles, manual publishing packages, and import files as applicable in later phases. |
| Record ownership | Files are referenced by owner-service records; the filesystem never becomes the authoritative business owner. |
| Path policy | Store relative paths in persisted records where practical; resolve against configured local storage root at runtime. |
| Backup inclusion | `.ftv-local/data`, `.ftv-local/media`, `.ftv-local/exports`, and a safe backup manifest/configuration snapshot are the minimum local state set for backup. Do not treat `.ftv-local/config` as a required source configuration store. |
| Git policy | Local database, media, logs, temp files, and backups should be ignored by Git; source code and specifications remain tracked. |

## 8. Proposed Project Structure

Later implementation phases should use this structure unless review finds a baseline conflict:

```text
apps/
  operator-console/        # Next.js local UI and local server boundary
  api/                     # Reserved; avoid using unless needed
packages/
  local-runtime/           # Future local app composition, service factory, lifecycle helpers
  local-persistence/       # Future Prisma/SQLite adapters
  local-storage/           # Future filesystem storage adapter
services/
  */                       # Existing accepted owner-service packages
prisma/
  schema.prisma            # Future L-03 schema
  migrations/              # Future L-03 migrations
scripts/
  local/                   # Future setup, backup, restore, doctor scripts
.ftv-local/                # Ignored local runtime state
  data/
  media/
  exports/
  backups/
  logs/
  tmp/
```

Backup packages created in later phases may contain `manifest.json` or `configuration.json` inside the backup artifact. That snapshot is not a live `.env.local` backup and must include only non-sensitive restore metadata.

L-01 does not create this structure. It defines the target for later reviewed phases.

## 9. Startup and Shutdown Strategy

| Command goal | Specification |
|---|---|
| Corepack | `corepack enable` is the recommended first-time preparation command for the pnpm-managed workspace. |
| Install | `pnpm install` is the canonical dependency installation command. Do not require `npm install` to install the whole workspace and do not create `package-lock.json`. |
| Setup | `npm run setup` should prepare local directories, validate `.env.local`, initialize SQLite, and run migrations once L-03 exists. |
| Doctor | `npm run doctor` should verify local runtime readiness before or after setup/restore once implemented. |
| Dev start | `npm run dev` should start the local operator console at `http://localhost:3000`. |
| Validation | Existing `pnpm validate`, `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm format:check` remain required developer checks. |
| Shutdown | Local dev server shutdown is process termination; no background service should remain running unless explicitly introduced in a later approved phase. |
| Restart | Restart must reuse the same SQLite database and media root so records persist after process restart. |

Startup must fail fast with actionable errors if configuration is invalid, the database is inaccessible, migrations fail, migration state is incompatible, storage/log directories cannot be created or written, port `3000` is occupied, runtime versions are incompatible, application composition is incomplete, or required owner-service dependencies cannot resolve.

The tool must not run in a partially operational state, skip failed migrations, silently change the database, silently change the storage location, or silently switch ports. If the default port is occupied, startup should report the conflict and may suggest configuring another port, but must not move to another port without informing the operator.

No startup scripts are created in L-01.

## 9.1 Local Doctor Specification

L-01 defines the future `npm run doctor` behavior only; it does not implement the command.

Minimum doctor checks:

- Node.js version.
- pnpm/Corepack availability.
- Workspace dependency state.
- Environment/configuration resolution.
- Local base directory.
- Database path.
- Database existence when expected.
- Database connectivity.
- Migration status.
- Media/storage directory existence.
- Read/write permissions.
- Logs, exports, and backup directories.
- Application version.
- Schema or migration version.
- Backup compatibility when doctor runs after restore.
- Unresolved or missing asset references at the local infrastructure level where this can be checked without changing business data.

Doctor must not mutate business data or silently repair problems. It must return actionable errors and clear exit status.

## 10. Configuration Strategy

Configuration should stay technical and local. It must not redefine governance or business rules.

Proposed environment variables for later phases:

| Variable | Purpose |
|---|---|
| `FTV_ENV` | Existing runtime environment value. |
| `FTV_LOG_LEVEL` | Existing logging level. |
| `FTV_LOCAL_BASE_DIR` | Root for local runtime state, default `.ftv-local`. |
| `FTV_DATABASE_URL` | Runtime-generated or operator-provided Prisma SQLite URL. L-03 must define exact Windows-safe resolution. |
| `FTV_DATABASE_PATH` | Optional logical SQLite path before URL conversion, defaulting to `<repository-root>/.ftv-local/data/ftv.sqlite`. |
| `FTV_MEDIA_ROOT` | Local media root, default `.ftv-local/media`. |
| `FTV_EXPORT_ROOT` | Local export root, default `.ftv-local/exports`. |
| `FTV_BACKUP_ROOT` | Local backup root, default `.ftv-local/backups`. |
| `FTV_LOG_ROOT` | Local log root, default `.ftv-local/logs`. |
| `FTV_LOCAL_HOST` | Default `localhost`. |
| `FTV_LOCAL_PORT` | Default `3000`. |

Secrets are not required for the local single-user MVP. If future work adds optional external connectors, that requires separate approval and must not be introduced in L-01.

Backup configuration policy:

- Do not backup raw `.env.local`.
- Backup packages should include a safe `manifest.json` or `configuration.json` snapshot.
- The snapshot may include application version, local tool version, accepted baseline reference, schema/migration version, runtime layout version, configured relative paths, and backup creation time.
- The snapshot must exclude secrets and machine-specific sensitive values unless explicitly approved later.

## 11. Packaging Strategy

| Area | Specification |
|---|---|
| Primary package | Source checkout remains the main local tool package. |
| Canonical install | `corepack enable` then `pnpm install`. |
| Operator command target | `npm run setup`, `npm run doctor`, `npm run dev` as convenience scripts that may call pnpm/workspace scripts internally. |
| Build package | Later phase may add `npm run build` and `npm run start` for local production-like execution. |
| Windows support | Scripts must work in Windows PowerShell and standard npm script execution. |
| No installer in L-01 | No MSI, EXE, Docker image, or packaged desktop app is designed or created in L-01. |
| Git as history | Git remains the source and history mechanism for code/spec changes; local runtime state is backed up separately. |
| Lockfile policy | Keep `pnpm-lock.yaml`; do not create or accept `package-lock.json`. |

## 12. Backup and Restore Strategy

Later implementation should provide manual backup/restore scripts that operate only on local state.

Backup set:

- SQLite database file.
- Media root.
- Export root.
- Safe configuration snapshot excluding secrets.
- Backup manifest.
- Optional logs when requested.

Backup consistency rule:

- Later implementation must either suspend write operations during backup or use an application-level backup procedure that creates a consistent SQLite snapshot, matching asset manifest, and matching configuration metadata.
- Backup must not copy isolated pieces while the tool is actively writing data in a way that can produce a mismatched database/filesystem state.

Backup manifest minimum fields:

- Backup ID.
- Application version.
- Accepted Baseline or Local Tool version.
- Migration/schema version.
- Creation timestamp.
- Database checksum.
- Asset manifest/checksums when applicable.
- Included directories/files.
- Backup completion status.

Restore requirements:

- Stop local dev/server process before restore.
- Restore into `.ftv-local` or configured local base dir.
- Validate database file exists.
- Validate media paths resolve.
- Run a local doctor check after restore.
- Validate backup manifest completion status and schema compatibility.
- Never overwrite a current local state directory without explicit operator confirmation.

L-01 creates no backup/restore scripts.

## 13. Developer Workflow

Recommended workflow for later implementation phases:

1. Start from tag `ftv-v2-mvp-accepted` or a branch created from current accepted HEAD.
2. Keep each L-phase on a focused branch or clearly reviewed commit set.
3. Preserve existing tests and validation commands.
4. Add local-tool tests only for the layer being introduced.
5. Run focused tests during development and `pnpm validate` before review.
6. Present results for review before freeze.
7. Do not begin the next L-phase until current phase is confirmed and frozen.
8. Keep `pnpm-lock.yaml` as the workspace lockfile and reject accidental `package-lock.json` creation.

## 14. Guardrails for Later Phases

| Guardrail | Required behavior |
|---|---|
| Architecture | No redesign. Presentation/Application/Infrastructure must call accepted services through owner-respecting boundaries. |
| Service ownership | No service merge, split, rename, or ownership transfer. |
| Contracts | Do not change accepted service contracts unless a formal approved change request is issued. |
| Governance | Preserve approval gates, verified references, audit/manual action requirements, duplicate guards, and failure recovery from CR-01 and acceptance reruns. |
| Publishing | Manual publishing record only. No autonomous posting or platform automation. |
| AI | No AI features, agents, recommendation automation, or generation workflows. |
| Storage | Database/filesystem are infrastructure adapters only. |
| UI | UI must not bypass owner services or mutate records directly. |
| Admin | Core data administration remains non-authoritative. |
| In-memory adapter | Existing accepted in-memory implementations may be reused in L-02 only as temporary runtime adapters. They are not Local Tool persistence. |
| Adapter replacement | Application composition must allow in-memory adapters to be replaced by SQLite adapters in L-03 without changing UI contracts or accepted service contracts. |

L-02-specific in-memory guardrail:

- Do not create UI-specific duplicate state models.
- Do not create parallel business logic.
- Do not copy business rules into UI code.
- Do not change contracts to fit UI convenience.
- Label any temporary in-memory adapter clearly.
- Do not treat in-memory state as complete local persistence.

## 15. Phase Handoff Proposal

After L-01 is reviewed and frozen, the next phase may be L-02 - Core Tool Assembly.

L-02 should not start until the operator confirms this specification and explicitly authorizes freeze.

Suggested L-02 scope after approval:

- Create local app shell.
- Add navigation for accepted workflow areas.
- Wire thin UI/application actions to accepted in-memory service implementations only as temporary adapters through the application boundary.
- Keep persistence deferred to L-03.
- Keep backup/restore deferred to L-03/L-04 as appropriate.
- Preserve adapter replaceability so SQLite adapters can replace in-memory adapters without changing UI or service contracts.

This handoff is informational only. It does not authorize L-02.

## 16. Self Review

| Check | Result |
|---|---|
| Used accepted baseline repository as source of truth | Pass |
| Verified baseline HEAD and tag | Pass |
| Recorded remediation preflight worktree state | Pass |
| Kept pnpm as canonical package manager | Pass |
| Did not create or authorize `package-lock.json` | Pass |
| Did not overstate Python footprint authority; recorded repository verification item | Pass |
| Distinguished logical database path from Prisma URL resolution | Pass |
| Required UI/routes/server actions to use the application boundary | Pass |
| Defined local doctor behavior | Pass |
| Defined consistent DB/filesystem backup rule | Pass |
| Defined startup fail-fast behavior | Pass |
| Clarified in-memory adapters are temporary for L-02 | Pass |
| Did not use chat history as source | Pass |
| Did not edit frozen canonical artifacts | Pass |
| Did not write code | Pass |
| Did not install dependencies | Pass |
| Did not create database schema or migrations | Pass |
| Did not create Prisma schema | Pass |
| Did not build UI/API routes | Pass |
| Did not start implementation | Pass |
| Preserved service boundaries | Pass |
| Preserved business rules and accepted behavior | Pass |
| Preserved acceptance behavior | Pass |
| Did not add capabilities | Pass |
| Preserved governance/manual-first constraints | Pass |
| Avoided cloud, microservice physical split, AI, and publishing automation | Pass |
| L-01 freeze authorized by operator | Pass |
| Defined local runtime, database, storage, startup, doctor, configuration, packaging, backup/restore, and developer workflow | Pass |

## 17. Stop Point

L-01 FROZEN.

No implementation has started. L-02 must not begin without separate operator authorization.
