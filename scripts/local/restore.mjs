import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync
} from "node:fs";
import { basename, join, resolve } from "node:path";
import process from "node:process";

const root = process.cwd();
const backupArg = process.argv[2];
const localBase = process.env.FTV_LOCAL_BASE_DIR ?? ".ftv-local";

if (!backupArg) {
  console.error("Restore failed: provide a backup directory path.");
  process.exit(1);
}

const backupDir = resolve(root, backupArg);
const manifestPath = join(backupDir, "manifest.json");
const backupDatabase = join(backupDir, "database", "ftv.sqlite");
if (!existsSync(manifestPath) || !existsSync(backupDatabase)) {
  console.error("Restore failed: backup manifest or database is missing.");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (manifest.schemaVersion !== "l03-20260731000100") {
  console.error(
    `Restore failed: unsupported schema version ${manifest.schemaVersion ?? "<missing>"}.`
  );
  process.exit(1);
}

const restoreTmp = join(root, localBase, "tmp", `restore-${Date.now()}`);
mkdirSync(restoreTmp, { recursive: true });
copyFileSync(backupDatabase, join(restoreTmp, "ftv.sqlite"));
copyTree(join(backupDir, "media"), join(restoreTmp, "media"));
copyTree(join(backupDir, "config"), join(restoreTmp, "config"));

const databaseDir = join(root, localBase, "database");
const mediaDir = join(root, localBase, "media");
const configDir = join(root, localBase, "config");
mkdirSync(databaseDir, { recursive: true });
mkdirSync(mediaDir, { recursive: true });
mkdirSync(configDir, { recursive: true });

copyFileSync(join(restoreTmp, "ftv.sqlite"), join(databaseDir, "ftv.sqlite"));
replaceTree(join(restoreTmp, "media"), mediaDir);
replaceTree(join(restoreTmp, "config"), configDir);

console.log(`Restore completed from: ${backupDir}`);

function replaceTree(source, destination) {
  if (existsSync(destination))
    rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  copyTree(source, destination);
}

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
