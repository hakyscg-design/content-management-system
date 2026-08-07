# Operator Console

L-03 local browser console for Football Troll Vault v2.

```text
npm run setup
npm run doctor
npm run dev
```

Open `http://localhost:3000`.

The L-03 runtime uses SQLite and local filesystem media storage under `.ftv-local/`. Run `npm run backup` to create a manual backup and `npm run restore -- .ftv-local/backups/<backup-folder>` to restore one. Final packaging remains deferred.
