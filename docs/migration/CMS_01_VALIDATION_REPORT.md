# CMS-01 Validation Report

## Commands

| Check               | Result                                           |
| ------------------- | ------------------------------------------------ |
| `pnpm install`      | PASS                                             |
| `npm run setup`     | PASS                                             |
| `npm run doctor`    | PASS                                             |
| `pnpm format:check` | PASS                                             |
| `pnpm lint`         | PASS                                             |
| `pnpm typecheck`    | PASS                                             |
| `pnpm test`         | PASS: 11 test files, 55 tests                    |
| `pnpm validate`     | PASS                                             |
| `npm run dev`       | PASS: Next.js started on `http://localhost:3000` |

## Localhost Smoke

| Scenario                  | Result                                                                           |
| ------------------------- | -------------------------------------------------------------------------------- |
| `/`                       | HTTP 200                                                                         |
| `/source-assets`          | HTTP 200                                                                         |
| `/workflow`               | HTTP 200                                                                         |
| `/review`                 | HTTP 200                                                                         |
| `/publishing`             | HTTP 200                                                                         |
| `/performance-analytics`  | HTTP 200                                                                         |
| `/administration`         | HTTP 200                                                                         |
| `/api/local/snapshot`     | HTTP 200                                                                         |
| Asset Library markers     | PASS: `Asset Library`, `Search assets`, `Reset` present in rendered HTML         |
| Valid asset intake        | PASS                                                                             |
| Local media fixture       | PASS                                                                             |
| Invalid publishing gate   | PASS                                                                             |
| Snapshot after operations | PASS: records=5, media=1, persistence=`persistent`, runtime=`durable-sqlite-l03` |

## Restart Verification

After dev server restart, `/api/local/snapshot` returned records=5, media=1, persistence=`persistent`, runtime=`durable-sqlite-l03`.

## Backup / Restore Verification

- Backup created: `.ftv-local/backups/backup-2026-08-07T154239103Z`
- Manifest includes application version, schema version, migration version, database, media, and config paths.
- Before backup: records=5, media=1.
- After mutation: records=7, media=2.
- After restore: records=5, media=1.

## ZIP Package

- Requested path: `C:\content-management-system.zip`.
- Actual created path: `C:\content-management-system\content-management-system.zip`.
- Reason for alternate path: Windows denied direct write to root `C:\` during `Compress-Archive`.
- Exclusions: `node_modules`, `.git`, `.next`, `.ftv-local`, logs, coverage/dist/temp artifacts.

## Limitations

Browser-level click automation for Asset Library edit/save/cancel was not executed. HTML and component source preserve Search, Filter, Sort, Reset, Asset Detail, Edit, Save, and Cancel behavior, and local runtime tests passed.
