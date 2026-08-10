# Content Management System

Content Management System (CMS) is a local-first, manual-first production layer for content projects. It was extracted from the accepted Football Troll Vault v2 production system and preserves the accepted service boundaries, governance behavior, audit posture, local runtime work, SQLite persistence, local media storage, and backup/restore support.

Football Troll Vault is retained as the first project profile under `projects/football-troll-vault/`. TKIC remains a separate Decision / Intelligence Layer. Research Engine remains a separate Research Layer.

## Status

- CMS baseline: v1.0 operator accepted, frozen, and released
- Source repository: `C:\repository-acquisition-framework`
- Source accepted baseline HEAD: `a4630fd8eb1128f5d44bc5ad073ccf9ea6fd23b3`
- Source accepted tag: `ftv-v2-mvp-accepted`
- Local runtime: persistent SQLite and local filesystem storage
- Released feature baseline: CMS Features 01-06

## Prerequisites

- Node.js 24 LTS line
- pnpm 11

## Install And Run

```text
corepack enable
pnpm install
npm run setup
npm run doctor
npm run dev
```

Open:

```text
http://localhost:3000
```

## Local Data

By default CMS uses `.ftv-local/` inside this repository for local runtime data. Machine-local data is not source material and should not be committed.

For future migration, prefer an external base directory such as:

```text
C:\cms-local-data
```

set through `FTV_LOCAL_BASE_DIR` until a CMS-named compatibility variable is introduced.

## Backup And Restore

```text
npm run backup
npm run restore -- .ftv-local/backups/<backup-folder>
```

## Validation

```text
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm validate
```

Historical FTV documents remain preserved as evidence. Do not rewrite them merely to make naming cleaner.
