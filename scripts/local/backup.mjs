import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import { basename, join } from "node:path";
import process from "node:process";

const root = process.cwd();
const localBase = process.env.FTV_LOCAL_BASE_DIR ?? ".ftv-local";
const timestamp = new Date()
  .toISOString()
  .replaceAll(":", "")
  .replaceAll(".", "");
const backupDir = join(root, localBase, "backups", `backup-${timestamp}`);
const databasePath = join(root, localBase, "database", "ftv.sqlite");
const mediaDir = join(root, localBase, "media");
const configDir = join(root, localBase, "config");

if (!existsSync(databasePath)) {
  console.error(
    "Backup failed: SQLite database is missing. Run npm run setup first."
  );
  process.exit(1);
}

mkdirSync(join(backupDir, "database"), { recursive: true });
mkdirSync(join(backupDir, "media"), { recursive: true });
mkdirSync(join(backupDir, "config"), { recursive: true });

copyFileSync(databasePath, join(backupDir, "database", "ftv.sqlite"));
copyTree(mediaDir, join(backupDir, "media"));
copyTree(configDir, join(backupDir, "config"));

const manifest = {
  timestamp,
  applicationVersion: JSON.parse(
    readFileSync(join(root, "package.json"), "utf8")
  ).version,
  schemaVersion: "l03-20260731000100",
  migrationVersion: "20260731000100_l03_local_persistence",
  database: "database/ftv.sqlite",
  media: "media",
  config: "config"
};
writeFileSync(
  join(backupDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  { flag: "wx" }
);

console.log(`Backup created: ${backupDir}`);

function copyTree(source, destination) {
  if (!existsSync(source)) return;
  mkdirSync(destination, { recursive: true });
  for (const entry of readdirSync(source)) {
    const from = join(source, entry);
    const to = join(destination, basename(entry));
    if (statSync(from).isDirectory()) copyTree(from, to);
    else copyFileSync(from, to);
  }
}
