import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import { basename, isAbsolute, join } from "node:path";
import process from "node:process";

const root = process.cwd();
const projectId = resolveProjectId(
  process.env.CMS_PROJECT_ID ?? process.env.FTV_PROJECT_ID
);
const localBase =
  process.env.FTV_LOCAL_BASE_DIR ?? defaultBaseDirForProject(projectId);
const localRoot = isAbsolute(localBase) ? localBase : join(root, localBase);
const timestamp = new Date()
  .toISOString()
  .replaceAll(":", "")
  .replaceAll(".", "");
const backupDir = join(localRoot, "backups", `backup-${timestamp}`);
const databasePath = join(localRoot, "database", "ftv.sqlite");
const mediaDir = join(localRoot, "media");
const configDir = join(localRoot, "config");

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
  projectId,
  applicationVersion: JSON.parse(
    readFileSync(join(root, "package.json"), "utf8")
  ).version,
  schemaVersion: "cms-20260809000100",
  migrationVersion: "20260809000100_cms_project_scoped_local_persistence",
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

function resolveProjectId(candidate) {
  const projectId = candidate?.trim() || "football-troll-vault";
  if (
    projectId === "football-troll-vault" ||
    projectId === "synthetic-project"
  ) {
    return projectId;
  }

  console.error(`Backup failed: unknown CMS project: ${projectId}.`);
  process.exit(1);
}

function defaultBaseDirForProject(projectId) {
  if (projectId === "football-troll-vault") {
    return ".ftv-local";
  }

  return join(".cms-local", projectId);
}
