# L-01 Local Repository Setup Specification Remediation Report

## 1. Baseline Verification

- HEAD: `a4630fd8eb1128f5d44bc5ad073ccf9ea6fd23b3`
- Tag: `ftv-v2-mvp-accepted`
- Working tree before remediation: not fully clean because `L_01_LOCAL_REPOSITORY_SETUP_SPECIFICATION.md` already existed as an untracked L-01 draft from the prior specification step. No source, dependency, schema, migration, or canonical artifact changes were present in preflight status.

## 2. Files Changed

- File: `L_01_LOCAL_REPOSITORY_SETUP_SPECIFICATION.md`
- Change type: Remediated draft specification update.
- File: `L_01_LOCAL_REPOSITORY_SETUP_SPECIFICATION_REMEDIATION_REPORT.md`
- Change type: New remediation report.

## 3. Remediation Summary

| Finding ID | Resolution | Evidence section |
|---|---|---|
| R-01 | Clarified pnpm as canonical package manager, `pnpm install` as canonical install command, npm scripts as convenience wrappers only, and no `package-lock.json`. | Spec sections 5, 9, 11, 13, 16 |
| R-02 | Replaced unsupported Python-footprint conclusion with repository-sourced statement from BE-01 and BE-03; Python disposition remains a verification item if touched later. | Spec section 3 |
| R-03 | Removed `.ftv-local/config` as a required live config store and defined safe backup manifest/configuration snapshot instead of raw `.env.local` backup. | Spec sections 7, 8, 10, 12 |
| R-04 | Distinguished logical SQLite location from Prisma URL resolution and assigned Windows-safe URL generation to L-03. | Spec sections 6, 10 |
| R-05 | Added local route/server action boundary rules requiring UI/local transport to pass through application boundary and owning services. | Spec section 5.1 |
| R-06 | Added future `npm run doctor` behavior and minimum checks without implementation. | Spec sections 9, 9.1, 11, 12 |
| R-07 | Added consistent backup rule covering SQLite, media/filesystem, exports, safe configuration snapshot, and manifest. | Spec section 12 |
| R-08 | Added fail-fast startup behavior and prohibited partial operation, silent migration/database/storage/port changes. | Spec section 9 |
| R-09 | Clarified accepted in-memory implementations may be temporary L-02 adapters only and must be replaceable by SQLite adapters in L-03. | Spec sections 14, 15 |
| R-10 | Reviewed command, storage, config, backup, runtime, guardrail, handoff, and self-review language for internal consistency. | Spec sections 3 through 17 |

## 4. Source Verification

- Python authority source: `docs/build-execution/BE_01_WORKSPACE_REPOSITORY_BOOTSTRAP.md` records Python source/tests under `src/ftv` and `tests/ftv`; `docs/build-execution/BE_03_SERVICE_IMPLEMENTATION.md` records the pre-BE Python footprint coexisting with the TypeScript service implementation.
- Package manager source: `package.json` declares `packageManager` as `pnpm@11.9.0`; `pnpm-lock.yaml` and `pnpm-workspace.yaml` are present.
- Runtime source: `docs/build-execution/BE_01_WORKSPACE_REPOSITORY_BOOTSTRAP.md` freezes TypeScript, Node.js 24 LTS line, pnpm, ESLint, Prettier, and Vitest; `docs/build-execution/BE_03_SERVICE_IMPLEMENTATION.md` freezes TypeScript service-owned MVP implementations.
- Other relevant frozen sources: `FTV_ARCHITECTURE_BLUEPRINT.md`, `FTV_SERVICE_CATALOG.md`, `CR_01_ACCEPTANCE_BLOCKER_REMEDIATION_REPORT.md`, `AT_03_GOVERNANCE_MANUAL_FALLBACK_ACCEPTANCE_RERUN_REPORT.md`, `AT_04_FAILURE_RECOVERY_ERROR_HANDLING_ACCEPTANCE_RERUN_REPORT.md`, `AT_05_FINAL_MVP_ACCEPTANCE_RERUN_REPORT.md`, and `RF_01_REPOSITORY_FREEZE_ACCEPTED_BASELINE_FINALIZATION_REPORT.md`.

## 5. Scope Compliance

- Code changed: No
- Dependencies changed: No
- Schema created: No
- Migrations created: No
- Implementation started: No

## 6. Validation

- Markdown structure: Reviewed for required remediation sections.
- Internal consistency: Reviewed for package manager, database path, configuration backup, startup, doctor, backup/restore, application boundary, and L-02 in-memory adapter consistency.
- Git diff reviewed: Yes; status contains only the L-01 specification and this remediation report as untracked documentation artifacts.

## 7. Self Review

- Result: Pass. Baseline HEAD/tag verified; pnpm remains canonical; no package-lock was created; Python footprint authority was not overstated; Prisma URL/path resolution was clarified; local route/action boundaries were defined; doctor, backup consistency, fail-fast startup, and temporary in-memory adapter guardrails were added; no code, dependency, schema, migration, implementation, business-rule, service-ownership, acceptance-behavior, capability, freeze, tag, or L-02 work was performed.

## 8. Final Status

L-01 REMEDIATED DRAFT - AWAITING OPERATOR REVIEW
