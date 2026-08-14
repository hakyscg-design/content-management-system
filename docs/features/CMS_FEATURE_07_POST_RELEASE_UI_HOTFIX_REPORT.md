# CMS Feature 07 - Post-release UI Hotfix Report

## Scope

Post-release hotfix for the operator console losing application styling at `localhost:3000` after the corrected Feature 07 release. The fix restores the accepted CMS UI styling path without redesigning the UI and without changing localization, business logic, persisted data, or service behavior.

## Root Cause

- The tracked styling pipeline was intact:
  - `apps/operator-console/app/layout.tsx` still imported `./globals.css`.
  - `apps/operator-console/app/globals.css` was unchanged from the pre-correction Feature 07 baseline.
  - No Tailwind/PostCSS configuration existed or changed.
- The live dev runtime served HTML that referenced `/_next/static/css/app/layout.css`.
- That CSS URL returned 404 because the local generated Next output was stale: `apps/operator-console/.next/static/css/app/` existed as a directory while the real CSS existed only as a production hashed asset such as `static/css/3a2f51fd9b8cbe92.css`.
- This left the browser with valid CMS HTML but no loaded global stylesheet, causing the raw browser HTML appearance.

## Implementation

- Added `scripts/local/clean-operator-console-next.mjs`.
- Wired `apps/operator-console/package.json` `predev` to remove only `apps/operator-console/.next` before the canonical `next dev --hostname localhost --port 3000` command runs.
- Added a regression check that:
  - verifies the canonical dev script remains unchanged
  - verifies the dev startup cleanup is wired
  - verifies the cleanup targets only the operator-console `.next` generated assets
  - verifies `.ftv-local` is not referenced

## Files Changed

- `apps/operator-console/package.json`
- `scripts/local/clean-operator-console-next.mjs`
- `tests/bootstrap/workspace.test.ts`
- `docs/features/CMS_FEATURE_07_POST_RELEASE_UI_HOTFIX_REPORT.md`

## Preservation

- Existing accepted CSS was not changed.
- No localization strings or EN/VN logic were changed.
- No business data, project data, service records, local database, local media, backup/restore state, or operator data were modified.
- Runtime visual smoke remains operator-side; no background server restart troubleshooting was performed for this hotfix.

## Validation

- Root-cause inspection:
  - Live HTML at `localhost:3000` contained the expected stylesheet link and CMS shell classes.
  - Direct fetch of `/_next/static/css/app/layout.css` returned 404, confirming missing generated CSS in the current dev runtime.
- Full canonical validation:
  - `pnpm validate`
  - Result: PASS, format check, lint, typecheck, 12 test files / 84 tests, workspace validation passed.
- Operator-console production build:
  - `node_modules\.bin\next.cmd build apps/operator-console`
  - Result: PASS.
  - Notes: Next emitted existing non-blocking advisories about webpack cache snapshotting and the Next.js ESLint plugin.
- Runtime browser smoke:
  - Result: SKIPPED - operator verification.
  - Reason: operator instructed Codex not to spend time troubleshooting background server startup.

## PR And SHA

- Branch: `hotfix/feature-07-operator-console-styles`
- PR: https://github.com/hakyscg-design/content-management-system/pull/9
- Ending implementation SHA: `a86ac3f31e5ed67270e39a8af0193bc1b7a76b3a`
- Ending report/PR head SHA: recorded in the operator handoff.

## Status

HOTFIX READY - AWAITING OPERATOR REVIEW
