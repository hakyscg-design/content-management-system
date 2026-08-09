import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync
} from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import process from "node:process";

const root = process.cwd();
const requiredFiles = [
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "apps/operator-console/package.json",
  "prisma/schema.prisma"
];
const projectId = resolveProjectId(
  process.env.CMS_PROJECT_ID ?? process.env.FTV_PROJECT_ID
);
const localBase =
  process.env.FTV_LOCAL_BASE_DIR ?? defaultBaseDirForProject(projectId);
const localRoot = isAbsolute(localBase) ? localBase : join(root, localBase);
const databaseUrl = `file:${resolve(localRoot, "database", "ftv.sqlite").replaceAll("\\", "/")}`;
const localDirs = [
  localRoot,
  join(localRoot, "database"),
  join(localRoot, "media"),
  join(localRoot, "config"),
  join(localRoot, "backups"),
  join(localRoot, "logs"),
  join(localRoot, "tmp")
];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) {
    console.error(
      `L-03 setup failed: required workspace file missing: ${file}`
    );
    process.exit(1);
  }
}

for (const directory of localDirs) {
  mkdirSync(directory, { recursive: true });
}

const configPath = join(localRoot, "config", "local.env");
if (!existsSync(configPath)) {
  writeFileSync(
    configPath,
    [
      "FTV_ENV=local",
      "FTV_LOG_LEVEL=info",
      "FTV_LOCAL_HOST=localhost",
      "FTV_LOCAL_PORT=3000",
      `CMS_PROJECT_ID=${projectId}`,
      `FTV_LOCAL_BASE_DIR=${localBase}`,
      `DATABASE_URL=${databaseUrl}`,
      ""
    ].join("\n"),
    { flag: "wx" }
  );
}

if (process.env.FTV_SKIP_PRISMA_GENERATE !== "1") {
  run("pnpm", [
    "--filter",
    "@ftv/local-runtime",
    "exec",
    "prisma",
    "generate",
    "--schema",
    join(root, "prisma", "schema.prisma")
  ]);
}
await applyMigration();

console.log("L-03 setup complete.");
console.log(`SQLite database: ${databaseUrl}`);
console.log(`Local storage: ${localRoot}`);

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      NODE_PATH: join(root, "node_modules")
    },
    stdio: "inherit",
    shell: process.platform === "win32"
  });
  if (result.status !== 0) {
    console.error(
      `L-03 setup failed while running: ${command} ${args.join(" ")}`
    );
    process.exit(result.status ?? 1);
  }
}

async function applyMigration() {
  process.env.DATABASE_URL = databaseUrl;
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    await prisma.$executeRawUnsafe(
      'CREATE TABLE IF NOT EXISTS "_prisma_migrations" ("id" TEXT NOT NULL PRIMARY KEY, "checksum" TEXT NOT NULL, "finished_at" DATETIME, "migration_name" TEXT NOT NULL, "logs" TEXT, "rolled_back_at" DATETIME, "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "applied_steps_count" INTEGER NOT NULL DEFAULT 0)'
    );
    const migrationNames = readdirSync(join(root, "prisma", "migrations"), {
      withFileTypes: true
    })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    for (const migrationName of migrationNames) {
      const migrationSql = readFileSync(
        join(root, "prisma", "migrations", migrationName, "migration.sql"),
        "utf8"
      );
      const checksum = createHash("sha256").update(migrationSql).digest("hex");
      const statements = migrationSql
        .split(";")
        .map((statement) => statement.trim())
        .filter(Boolean);
      const existing = await prisma.$queryRawUnsafe(
        'SELECT "checksum" FROM "_prisma_migrations" WHERE "migration_name" = ? LIMIT 1',
        migrationName
      );
      if (Array.isArray(existing) && existing.length > 0) {
        if (existing[0]?.checksum !== checksum) {
          throw new Error(`Migration checksum mismatch for ${migrationName}`);
        }
        continue;
      }

      for (const statement of statements) {
        await prisma.$executeRawUnsafe(statement);
      }
      await prisma.$executeRawUnsafe(
        'INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "applied_steps_count") VALUES (?, ?, CURRENT_TIMESTAMP, ?, NULL, NULL, ?)',
        migrationName,
        checksum,
        migrationName,
        statements.length
      );
    }
  } finally {
    await prisma.$disconnect();
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

  console.error(`L-03 setup failed: unknown CMS project: ${projectId}.`);
  process.exit(1);
}

function defaultBaseDirForProject(projectId) {
  if (projectId === "football-troll-vault") {
    return ".ftv-local";
  }

  return join(".cms-local", projectId);
}
