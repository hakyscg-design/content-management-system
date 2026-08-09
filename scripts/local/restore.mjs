import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync
} from "node:fs";
import { basename, isAbsolute, join, resolve } from "node:path";
import process from "node:process";

const root = process.cwd();
const backupArg = process.argv[2];
const projectId = resolveProjectId(
  process.env.CMS_PROJECT_ID ?? process.env.FTV_PROJECT_ID
);
const localBase =
  process.env.FTV_LOCAL_BASE_DIR ?? defaultBaseDirForProject(projectId);
const localRoot = isAbsolute(localBase) ? localBase : join(root, localBase);

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
const supportedSchemaVersions = new Set([
  "l03-20260731000100",
  "cms-20260809000100"
]);
if (!supportedSchemaVersions.has(manifest.schemaVersion)) {
  console.error(
    `Restore failed: unsupported schema version ${manifest.schemaVersion ?? "<missing>"}.`
  );
  process.exit(1);
}
if ((manifest.projectId ?? "football-troll-vault") !== projectId) {
  console.error(
    `Restore failed: backup project ${manifest.projectId ?? "football-troll-vault"} does not match active project ${projectId}.`
  );
  process.exit(1);
}

const restoreTmp = join(localRoot, "tmp", `restore-${Date.now()}`);
mkdirSync(restoreTmp, { recursive: true });
copyFileSync(backupDatabase, join(restoreTmp, "ftv.sqlite"));
copyTree(join(backupDir, "media"), join(restoreTmp, "media"));
copyTree(join(backupDir, "config"), join(restoreTmp, "config"));

const databaseDir = join(localRoot, "database");
const mediaDir = join(localRoot, "media");
const configDir = join(localRoot, "config");
mkdirSync(databaseDir, { recursive: true });
mkdirSync(mediaDir, { recursive: true });
mkdirSync(configDir, { recursive: true });

copyFileSync(join(restoreTmp, "ftv.sqlite"), join(databaseDir, "ftv.sqlite"));
replaceTree(join(restoreTmp, "media"), mediaDir);
replaceTree(join(restoreTmp, "config"), configDir);
runSetupMigration();

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

function runSetupMigration() {
  const result = spawnSync(process.execPath, ["scripts/local/setup.mjs"], {
    cwd: root,
    env: {
      ...process.env,
      CMS_PROJECT_ID: projectId,
      FTV_LOCAL_BASE_DIR: localBase,
      FTV_SKIP_PRISMA_GENERATE: "1"
    },
    encoding: "utf8"
  });

  if (result.status !== 0) {
    console.error(result.stdout);
    console.error(result.stderr);
    console.error("Restore failed: setup migration did not complete.");
    process.exit(result.status ?? 1);
  }
}

function resolveProjectId(candidate) {
  const projectId = candidate?.trim() || "football-troll-vault";
  if (
    projectId === "football-troll-vault" ||
    projectId === "synthetic-project"
  ) {
    return projectId;
  }

  console.error(`Restore failed: unknown CMS project: ${projectId}.`);
  process.exit(1);
}

function defaultBaseDirForProject(projectId) {
  if (projectId === "football-troll-vault") {
    return ".ftv-local";
  }

  return join(".cms-local", projectId);
}
