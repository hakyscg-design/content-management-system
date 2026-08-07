# BE-01 Workspace & Repository Bootstrap

| Field         | Value                                   |
| ------------- | --------------------------------------- |
| Project       | Football Troll Vault v2                 |
| BE step       | BE-01                                   |
| Status        | FROZEN                                  |
| Scope         | Workspace and repository bootstrap only |
| Freeze status | Frozen                                  |
| User approval | Confirmed                               |
| Freeze date   | 2026-07-30                              |

## Inspection Summary

The repository already contains RAF documentation, FTV canonical artifacts, FTV Python source packages under `src/ftv`, FTV Python tests under `tests/ftv`, and stage reports under `build/stages`.

Detected conflicts:

- The current execution prompt says no code has been implemented yet, but the repository already contains FTV service implementation files and tests.
- The frozen BE-01 baseline selects TypeScript, pnpm, ESLint, Prettier, and Vitest, while the existing implementation footprint is Python.
- `FTV_SYSTEM_REQUIREMENTS.md` and `REPOSITORY_REVIEW_PROFILE.md` are available from the operator-provided Downloads path, but are not present in the repository root.

No frozen architecture, service ownership, repository decision, capability, database schema, API, workflow, AI behavior, or business logic was changed by BE-01 bootstrap.

## Service Folder Mapping

| Service ID | Frozen service name              | BE-01 placeholder folder             | Runtime status          |
| ---------- | -------------------------------- | ------------------------------------ | ----------------------- |
| FTV-SVC-01 | Source & Asset Registry Service  | `services/source-asset-registry`     | Placeholder             |
| FTV-SVC-02 | Media Processing Service         | `services/media-processing`          | Placeholder             |
| FTV-SVC-03 | Content Production Service       | `services/content-production`        | Placeholder             |
| FTV-SVC-04 | Publishing Preparation Service   | `services/publishing-preparation`    | Placeholder             |
| FTV-SVC-05 | Human Review & Approval Service  | `services/human-review-approval`     | Placeholder             |
| FTV-SVC-06 | Performance Data Service         | `services/performance-data`          | Placeholder             |
| FTV-SVC-07 | Analytics & Reporting Service    | `services/analytics-reporting`       | Placeholder             |
| FTV-SVC-08 | Workflow Orchestration Service   | `services/workflow-orchestration`    | Placeholder             |
| FTV-SVC-09 | Governance & Rule Service        | `services/governance-rule`           | Placeholder             |
| FTV-SVC-10 | Reference Pattern Library        | `services/reference-pattern-library` | Non-runtime placeholder |
| FTV-SVC-11 | Core Data Administration Service | `services/core-data-administration`  | Placeholder             |

## Technology Baseline

- Runtime language: TypeScript.
- Runtime: Node.js 24 LTS line.
- Package manager: pnpm.
- Workspace orchestration: pnpm workspaces.
- Type checking: TypeScript compiler.
- Linting: ESLint.
- Formatting: Prettier.
- Testing: Vitest.
- Persistence, API framework, UI framework, logging package, runtime validation package, CI/CD, and deployment remain deferred.

## Root Commands

The root workspace exposes `pnpm install`, `pnpm format`, `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:unit`, `pnpm test:contract`, `pnpm test:integration`, `pnpm test:e2e`, `pnpm validate`, and `pnpm clean`.

Contract, integration, and end-to-end test commands are explicit not-yet-applicable placeholders for BE-01.

## Change Request Review

CHANGE REQUEST REQUIRED: NO

BE-01 did not add services, domains, capabilities, ownership changes, repository adoptions, database schemas, API implementations, UI implementations, workflows, AI behavior, or business logic.

## Deferred Work

- BE-02 shared foundation.
- Service implementation.
- Business contracts.
- Persistence.
- API and UI frameworks.
- Workflow implementation.
- AI implementation.
- Candidate repository code adoption.

## Freeze Decision

**Decision:** BE-01 approved and frozen by the user.

**Freeze status:** `FROZEN`

**Freeze date:** 2026-07-30

**Frozen scope:**

- Workspace and repository bootstrap foundation.
- TypeScript, Node.js, pnpm, ESLint, Prettier, and Vitest bootstrap baseline.
- Service-folder placeholder mapping for FTV-SVC-01 through FTV-SVC-11.
- Package, documentation, third-party, script, and bootstrap test placeholders.
- Root command baseline and validation mechanism.
- Environment, secret, license, and version-control hygiene baseline.

**Effect of Freeze:**

- BE-01 is now the approved workspace bootstrap baseline.
- BE-01 must not be changed without explicit user approval or applicable Change Request review.
- BE-02 is not started by this Freeze action.
- BE-02 implementation still requires separate explicit human approval.
