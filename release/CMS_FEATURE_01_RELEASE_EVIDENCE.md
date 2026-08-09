# CMS Feature 01 Release Evidence

Feature: Multi-Project Execution Foundation

Status: FEATURE 01 COMPLETE - FROZEN & RELEASED

Repository: hakyscg-design/content-management-system

PR: https://github.com/hakyscg-design/content-management-system/pull/1

Release tag: pending until merge validation completes

## Scope Released

- Canonical CMS project identity and resolution.
- Default FTV project identity: `football-troll-vault`.
- Synthetic second project identity: `synthetic-project`.
- Project-scoped local persistence and migration.
- Project-aware backup, restore, setup, and doctor scripts.
- Minimal operator active-project visibility and switching.
- Operator actions routed through the selected project context.

## Preservation

- Accepted FTV service ownership is unchanged.
- Governance and audit behavior are unchanged.
- Human approval and manual-first workflows are unchanged.
- Existing FTV local data maps to `football-troll-vault`.
- Historical FTV release and freeze documentation remains preserved.

## Final Validation

- `pnpm typecheck`: PASS.
- `pnpm.cmd exec vitest run tests/local-tool`: PASS, 2 files / 11 tests.
- `apps/operator-console/node_modules/.bin/next.CMD build`: PASS.
- `pnpm validate`: PASS, 11 files / 61 tests plus workspace validation.

## Release Actions

To be finalized after commit and merge:

- PR ready for review.
- PR merged to `main`.
- Feature release tag created.
- Main SHA recorded.
- Tag SHA recorded.

## Final Evidence

This file is finalized before merge with validation evidence. The final main SHA and tag are recorded in the operator handoff after the merge and tag operations complete.
