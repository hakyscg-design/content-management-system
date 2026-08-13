# CMS Feature 07 - Task 1 Report

## Scope

Task 1 started from accepted CMS v1.0 baseline on `main` at `1f6d1468c6e1edf7291113ef2b63c85fbc3e52c8` (`cms-v1.0.0-operator-accepted-freeze`) and used branch `feature/cms-global-en-vn-language-layer`.

## Implementation

- Added a global EN/VN operator language layer in `apps/operator-console/app/i18n.ts`.
- Added cookie-backed language resolution through `cms-operator-language`; default remains `en`, and `vn` is selected only by explicit operator action.
- Added a global `EN / VN` toggle in the CMS shell through `LanguageSwitcher`.
- Added `/api/local/language` to persist the language selection with a one-year global shell cookie.
- Localized global shell text, navigation, workspace headings, labels, buttons, help copy, notices, empty states, workflow guidance, and administration storage/backup guidance.
- Localized known runtime guidance and operation messages at presentation time without mutating runtime data.
- Kept project names, IDs, URLs, service IDs, form field names, record labels, stored statuses, canonical values, and persisted records unchanged.
- Kept language outside project configuration and Administration project settings.
- Preserved owner-service boundaries; the language route is a shell preference route and does not call business services.

## Tests And Validation

- Focused tests:
  - `pnpm test tests/local-tool/l07-language-layer.test.ts tests/local-tool/l03-static-boundaries.test.ts`
  - Result: PASS, 2 files / 9 tests.
- Typecheck:
  - `pnpm typecheck`
  - Result: PASS.
- Lint:
  - `pnpm lint`
  - Result: PASS.
- Operator-console production build:
  - `pnpm --filter @ftv/operator-console exec next build`
  - Result: PASS.
  - Note: Next emitted the existing advisory that the Next.js ESLint plugin is not detected.
- Full canonical validation:
  - `pnpm validate`
  - Result: PASS, 12 files / 79 tests, workspace validation passed.
- Runtime smoke:
  - `curl -H "Cookie: cms-operator-language=vn" http://localhost:3000`
  - Result: PASS; rendered `html lang="vi"`, VN shell/navigation/workspace text, and active VN toggle.

## Known Gaps

- This task does not add per-project language settings by design.
- Business records and canonical runtime values remain stored unchanged; known workflow guidance is localized in the UI layer only.
- No Feature 07 release merge, tag, freeze, or release was performed.

## PR

- Draft PR: pending.

## Ending SHA

- Pending commit.

## Final Status

TASK 1 COMPLETE — AWAITING OPERATOR REVIEW
