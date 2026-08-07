# L-02 Core Tool Assembly Report

## 1. Executive Result

- Status: Ready for operator review.
- Implementation result: Local operator console shell assembled with Next.js, a thin local runtime application boundary, route traceability, temporary in-memory service composition, setup/doctor commands, README updates, and L-02 tests.
- Freeze status: FROZEN by explicit operator confirmation.

## 2. Baseline Verification

- Starting HEAD: `a4630fd8eb1128f5d44bc5ad073ccf9ea6fd23b3`
- Accepted tag: `ftv-v2-mvp-accepted`
- Branch: `main`
- Preflight worktree: only approved/frozen L-01 documentation was present as untracked work before L-02 changes.
- Node: `v24.14.0`
- pnpm: `11.9.0`

## 3. Authoritative Sources Used

| Source                                                             | Purpose                                                                       |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `FTV_SYSTEM_REQUIREMENTS.md`                                       | Confirm accepted workflow and capability scope.                               |
| `REPOSITORY_REVIEW_PROFILE.md`                                     | Confirm project/repository governance context.                                |
| `FTV_ARCHITECTURE_BLUEPRINT.md`                                    | Confirm modular-monolith topology and local-first direction.                  |
| `FTV_SERVICE_CATALOG.md`                                           | Confirm service ownership and capability mapping.                             |
| `FTV_COMPONENT_CATALOG.md`                                         | Confirm accepted component boundaries.                                        |
| `FTV_SYSTEM_ASSEMBLY.md`                                           | Confirm accepted system assembly and service interactions.                    |
| Acceptance and rerun reports                                       | Confirm accepted behavior, governance, manual fallback, and failure handling. |
| `RF_01_REPOSITORY_FREEZE_ACCEPTED_BASELINE_FINALIZATION_REPORT.md` | Confirm baseline freeze context.                                              |
| `L_01_LOCAL_REPOSITORY_SETUP_SPECIFICATION.md`                     | Confirm frozen L-01 basis for local tool setup.                               |
| Existing `services/*/src/index.ts` public APIs                     | Determine valid owner-routed operations and boundary-safe composition.        |
| Existing tests and validation scripts                              | Preserve accepted regression behavior and add L-02 coverage.                  |

## 4. Scope Implemented

| Item                            | Result                                                                     | Evidence                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Operator console application    | Implemented under `apps/operator-console` using Next.js.                   | `apps/operator-console/app/*`, `apps/operator-console/package.json`                             |
| Accepted workflow navigation    | Implemented only traceable L-02 routes.                                    | `docs/local-tool/L_02_ROUTE_TRACEABILITY.md`, `apps/operator-console/app/navigation.tsx`        |
| Application boundary            | Implemented as thin local runtime package.                                 | `packages/local-runtime/src/index.ts`                                                           |
| Temporary in-memory composition | Implemented via accepted services and process singleton.                   | `packages/local-runtime/src/index.ts`                                                           |
| Minimal demonstrable operations | Implemented valid asset intake and invalid publishing-reference rejection. | `apps/operator-console/app/local-actions.tsx`, `apps/operator-console/app/api/local/*/route.ts` |
| L-02 setup and doctor commands  | Implemented without persistence readiness claims.                          | `scripts/local/setup.mjs`, `scripts/local/doctor.mjs`                                           |
| Documentation                   | README updates and route traceability added.                               | `README.md`, `apps/operator-console/README.md`, `docs/local-tool/L_02_ROUTE_TRACEABILITY.md`    |

## 5. Route and Capability Traceability

| Route                    | Capability                                                      | Owning service                     | Contract/action                                                                             | Evidence                                     |
| ------------------------ | --------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `/`                      | CAP-10 Data Management; CAP-08 Workflow Management              | FTV-SVC-11; FTV-SVC-08; FTV-SVC-01 | `getLocalDashboardView`; `submitLocalAssetIntake`; `submitInvalidPublishingAttempt`         | `docs/local-tool/L_02_ROUTE_TRACEABILITY.md` |
| `/source-assets`         | CAP-01 Asset Acquisition; CAP-02 Asset Management               | FTV-SVC-01                         | `captureSource`; `approveSource`; `registerAsset`; `markAssetReady`                         | `docs/local-tool/L_02_ROUTE_TRACEABILITY.md` |
| `/workflow`              | CAP-08 Workflow Management                                      | FTV-SVC-08                         | `startRun`; `completeRun`; `failRun`                                                        | `docs/local-tool/L_02_ROUTE_TRACEABILITY.md` |
| `/review`                | CAP-12 Human Review Support                                     | FTV-SVC-05                         | `requestReview`; `assignReviewer`; `recordDecision`                                         | `docs/local-tool/L_02_ROUTE_TRACEABILITY.md` |
| `/publishing`            | CAP-05 Publishing Preparation                                   | FTV-SVC-04                         | `createPublishingPackage`; `updateChecklist`; `markReady`; `recordManualPublishingComplete` | `docs/local-tool/L_02_ROUTE_TRACEABILITY.md` |
| `/performance-analytics` | CAP-06 Performance Data Collection; CAP-07 Performance Analysis | FTV-SVC-06; FTV-SVC-07             | `defineMetric`; `stageImport`; `recordFact`; `completeImport`; `createReport`               | `docs/local-tool/L_02_ROUTE_TRACEABILITY.md` |
| `/administration`        | CAP-10 Data Management; CAP-11 Governance Support               | FTV-SVC-11; FTV-SVC-09             | `configureView`; `inspectRecord`; `evaluateRule`; `recordAuditEvent`                        | `docs/local-tool/L_02_ROUTE_TRACEABILITY.md` |

## 6. Application Boundary

- Dependency direction: UI / local transport -> `@ftv/local-runtime` -> owning service public contracts -> temporary in-memory service implementations.
- Composition entry point: `packages/local-runtime/src/index.ts`.
- Transport entry points: `apps/operator-console/app/api/local/snapshot/route.ts`, `apps/operator-console/app/api/local/asset-intake/route.ts`, `apps/operator-console/app/api/local/invalid-publishing/route.ts`, and `apps/operator-console/app/local-actions.tsx`.
- Owning-service calls: asset intake uses FTV-SVC-01 and FTV-SVC-08 public APIs; invalid publishing gate uses FTV-SVC-04 public API and preserves owner-verified reference rejection.
- Forbidden imports verification: static tests verify no UI/service-internal or route-handler/store bypass pattern for L-02 surfaces.

## 7. Temporary In-Memory Runtime

- Existing implementations reused: accepted TypeScript in-memory service implementations exposed by each service package.
- Runtime lifetime: single `globalThis.__ftvLocalRuntime` instance per local application process.
- Seed/fixture behavior: deterministic L-02 bootstrap fixture uses only public service contracts and is explicitly temporary/non-production.
- Non-persistence warning: visible in operator console pages and documented in README files.
- L-03 replacement point: `packages/local-runtime/src/index.ts` composition boundary can replace temporary adapters without changing UI contracts or accepted service contracts.

## 8. Files Changed

| File                                         | Change                                                             | Reason                                                            |
| -------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `.gitignore`                                 | Added `.next/` and `.ftv-local/`.                                  | Prevent generated local/runtime artifacts from being tracked.     |
| `.prettierignore`                            | Added frozen L-01 markdown ignore.                                 | Avoid reformatting frozen L-01 documents during L-02 validation.  |
| `README.md`                                  | Added Local Tool L-02 run/test notes.                              | Minimal operator/developer usage instructions.                    |
| `apps/operator-console/README.md`            | Replaced placeholder notes with L-02 app instructions.             | Explain console startup and non-persistence.                      |
| `apps/operator-console/package.json`         | Converted placeholder into Next.js app package.                    | Enable local operator console.                                    |
| `apps/operator-console/app/*`                | Added layouts, navigation, pages, actions, and API route handlers. | Implement L-02 app shell and thin transport.                      |
| `apps/operator-console/next-env.d.ts`        | Added Next.js type declarations.                                   | Required for Next.js app.                                         |
| `apps/operator-console/next.config.mjs`      | Added workspace package transpilation and extension aliases.       | Support existing NodeNext workspace packages in Next dev runtime. |
| `apps/operator-console/tsconfig.json`        | Added app-level TypeScript config.                                 | Support Next app compilation.                                     |
| `docs/local-tool/L_02_ROUTE_TRACEABILITY.md` | Added required route traceability document.                        | Prove route/capability/service mapping.                           |
| `eslint.config.js`                           | Added TSX/browser globals and generated artifact ignores.          | Validate Next UI without linting generated output.                |
| `package.json`                               | Added setup/doctor/dev scripts and Next/React dev dependencies.    | Provide local tool commands.                                      |
| `packages/local-runtime/*`                   | Added local runtime package.                                       | Application boundary and temporary composition.                   |
| `pnpm-lock.yaml`                             | Updated lockfile.                                                  | Record dependency graph for Next/React.                           |
| `pnpm-workspace.yaml`                        | Added approved build allowance for `sharp`.                        | Complete pnpm install after build approval.                       |
| `scripts/local/*`                            | Added setup and doctor scripts.                                    | L-02-safe local preparation and diagnostics.                      |
| `tests/local-tool/*`                         | Added L-02 runtime and static boundary tests.                      | Verify scope, runtime, and boundary guardrails.                   |
| `tsconfig.json`                              | Included local runtime and L-02 tests.                             | Typecheck new packages/tests.                                     |
| `vitest.config.ts`                           | Included local tool tests.                                         | Run L-02 tests in validation.                                     |

## 9. Dependencies

| Dependency         | Version   | Reason                                                                 | License |
| ------------------ | --------- | ---------------------------------------------------------------------- | ------- |
| `next`             | `15.5.22` | Local browser-based operator console using approved Next.js direction. | MIT     |
| `react`            | `19.2.3`  | Required UI runtime for Next.js.                                       | MIT     |
| `react-dom`        | `19.2.3`  | Required DOM renderer for Next.js.                                     | MIT     |
| `@types/react`     | `19.2.7`  | TypeScript support for React.                                          | MIT     |
| `@types/react-dom` | `19.2.3`  | TypeScript support for React DOM.                                      | MIT     |

- package-lock.json present: No.
- pnpm-lock.yaml changed: Yes.

## 10. Commands

| Command                     | Exit code          | Result                      | Evidence                                                                                                   |
| --------------------------- | ------------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `git rev-parse HEAD`        | 0                  | Passed                      | `a4630fd8eb1128f5d44bc5ad073ccf9ea6fd23b3`                                                                 |
| `git tag --points-at HEAD`  | 0                  | Passed                      | `ftv-v2-mvp-accepted`                                                                                      |
| `git status --short`        | 0                  | Passed                      | Initial worktree contained only approved L-01 untracked docs before L-02 changes.                          |
| `git branch --show-current` | 0                  | Passed                      | `main`                                                                                                     |
| `node --version`            | 0                  | Passed                      | `v24.14.0`                                                                                                 |
| `pnpm --version`            | 0                  | Passed                      | `11.9.0`                                                                                                   |
| `pnpm install`              | 0                  | Passed after build approval | First run required approving `sharp`; rerun completed successfully and did not create `package-lock.json`. |
| `pnpm format:check`         | 0                  | Passed                      | `All matched files use Prettier code style!`                                                               |
| `pnpm lint`                 | 0                  | Passed                      | `eslint .` completed without errors.                                                                       |
| `pnpm typecheck`            | 0                  | Passed                      | `tsc --noEmit` completed.                                                                                  |
| `pnpm test`                 | 0                  | Passed                      | 11 test files, 54 tests passed.                                                                            |
| `pnpm validate`             | 0                  | Passed                      | Format, lint, typecheck, tests, and workspace validation passed.                                           |
| `npm run setup`             | 0                  | Passed                      | `L-02 setup complete`; persistence features explicitly deferred.                                           |
| `npm run doctor`            | 0                  | Passed                      | Node/pnpm/workspace/local dirs passed; DB/migration/backup reported not applicable/deferred to L-03.       |
| `npm run dev`               | 0 after clean stop | Passed                      | Next.js started at `http://localhost:3000`; smoke routes/API passed; process stopped.                      |

## 11. Test Results

| Test category             | Result | Evidence                                                                                                      |
| ------------------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| App shell tests           | Passed | Static tests verify approved navigation and non-persistent warning; smoke test verified all pages return 200. |
| Boundary tests            | Passed | `tests/local-tool/l02-static-boundaries.test.ts` checks route/UI boundary rules and dependency exclusions.    |
| Runtime composition tests | Passed | `tests/local-tool/l02-local-runtime.test.ts` verifies temporary runtime kind and reset behavior.              |
| Operation tests           | Passed | Valid owner-routed asset intake succeeds; invalid fabricated approval reference is rejected.                  |
| Regression tests          | Passed | `pnpm test`: 11 files, 54 tests passed.                                                                       |
| Workspace validation      | Passed | `pnpm validate`: workspace validation passed.                                                                 |

## 12. Manual Verification

| Scenario          | Expected                                       | Actual                                                             | Result |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------ | ------ |
| Start local app   | Bind to localhost:3000                         | Next reported `Local: http://localhost:3000`                       | PASS   |
| Root route        | HTTP 200                                       | `/ 200`                                                            | PASS   |
| Navigation routes | HTTP 200 for every implemented route           | All six navigation routes returned 200                             | PASS   |
| Snapshot API      | HTTP 200 with temporary runtime view           | `/api/local/snapshot 200`                                          | PASS   |
| Valid operation   | Owner-routed asset intake succeeds             | `Created l02-asset-1 through FTV-SVC-01.`                          | PASS   |
| Invalid operation | Existing service rejection is preserved safely | `approval status reference must be verified by its owner service.` | PASS   |
| Shutdown          | Dev process stopped                            | `http://localhost:3000` no longer responded                        | PASS   |

## 13. Architecture and Governance Verification

| Check                               | Result | Evidence                                                                           |
| ----------------------------------- | ------ | ---------------------------------------------------------------------------------- |
| Baseline integrity preserved        | PASS   | HEAD/tag verified; frozen canonical docs not modified.                             |
| Modular-monolith topology preserved | PASS   | Added local app/runtime package inside existing workspace.                         |
| Service ownership preserved         | PASS   | Local runtime calls owning service public APIs.                                    |
| No contract redesign                | PASS   | No service public contract changes.                                                |
| No business logic in UI             | PASS   | UI displays read models and invokes boundary/actions.                              |
| Human governance preserved          | PASS   | Review/publishing remain human-governed; invalid publishing reference rejected.    |
| No autonomous publishing            | PASS   | No connectors or automation added.                                                 |
| No AI/trend/crawling capability     | PASS   | Static test and navigation traceability exclude these routes.                      |
| No persistence leakage              | PASS   | No Prisma, SQLite, schema, migrations, database file, or durable repository added. |
| Package integrity                   | PASS   | pnpm canonical; no `package-lock.json`.                                            |

## 14. Known Limitations

- Persistence: Deferred to L-03. L-02 state is in-memory and resets on restart.
- SQLite: Deferred to L-03.
- Prisma: Deferred to L-03.
- Media storage: Durable media storage is deferred to L-03.
- Backup/restore: Deferred to L-03.
- Packaging: Production packaging/installer is deferred to a later phase.
- Other: Browser-level visual QA was represented by HTTP/render smoke verification; no separate browser automation framework existed in the baseline.

## 15. Deviations

- Deviation: `pnpm install` initially exited non-zero because pnpm blocked the `sharp` build script until approval.
- Source conflict: None.
- Impact: Remediated with `pnpm approve-builds sharp`; final `pnpm install` completed successfully.
- Required operator decision: None for L-02 review.

## 16. Self Review

| Check                                                   | Result |
| ------------------------------------------------------- | ------ |
| Correct HEAD and tag verified                           | PASS   |
| L-01 frozen basis verified                              | PASS   |
| Frozen canonical files unchanged                        | PASS   |
| Next.js app shell runs locally                          | PASS   |
| localhost binding verified                              | PASS   |
| Route-to-capability traceability complete               | PASS   |
| Navigation contains no invented capability              | PASS   |
| UI uses application boundary                            | PASS   |
| Route handlers/server actions remain thin               | PASS   |
| Owning services remain authoritative                    | PASS   |
| No direct UI-to-store access                            | PASS   |
| No direct UI-to-infrastructure access                   | PASS   |
| No business logic duplicated                            | PASS   |
| No workflow transition duplicated                       | PASS   |
| No UI-specific authoritative state model                | PASS   |
| Existing in-memory services are temporary adapters only | PASS   |
| Non-persistence is visible                              | PASS   |
| Adapter replacement point for L-03 is clear             | PASS   |
| Human governance preserved                              | PASS   |
| Accepted failures preserved                             | PASS   |
| No Prisma dependency                                    | PASS   |
| No SQLite dependency                                    | PASS   |
| No schema                                               | PASS   |
| No migrations                                           | PASS   |
| No persistent database                                  | PASS   |
| No durable media storage                                | PASS   |
| No backup/restore implementation                        | PASS   |
| No AI                                                   | PASS   |
| No autonomous publishing                                | PASS   |
| No trend discovery                                      | PASS   |
| No new service                                          | PASS   |
| No service merge or split                               | PASS   |
| No contract redesign                                    | PASS   |
| pnpm remains canonical                                  | PASS   |
| No `package-lock.json`                                  | PASS   |
| Existing tests pass                                     | PASS   |
| New tests pass                                          | PASS   |
| `pnpm validate` passes                                  | PASS   |
| Local app smoke verification passes                     | PASS   |
| Documentation is complete                               | PASS   |
| No unrelated refactor                                   | PASS   |
| No L-03 work started                                    | PASS   |
| L-02 frozen only after explicit operator confirmation   | PASS   |

## 17. Git Diff Summary

- Changed files: `.gitignore`, `.prettierignore`, `README.md`, `apps/operator-console/README.md`, `apps/operator-console/package.json`, `eslint.config.js`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.json`, `vitest.config.ts`.
- Untracked files: frozen L-01 docs already present; new L-02 app files under `apps/operator-console/app`, `apps/operator-console/next-env.d.ts`, `apps/operator-console/next.config.mjs`, `apps/operator-console/tsconfig.json`, `docs/local-tool/`, `packages/local-runtime/`, `scripts/local/`, `tests/local-tool/`, and this report.
- Generated files removed: No tracked generated files. Generated `.next/` and `.ftv-local/` artifacts are ignored; `.ftv-local/` is expected after `npm run setup`.
- Unexpected changes: None identified.

## 18. Final Status

L-02 FROZEN - CORE TOOL ASSEMBLY ACCEPTED
