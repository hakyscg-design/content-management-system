import {
  constants,
  accessSync,
  existsSync,
  readFileSync,
  statSync
} from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];
const localBase = process.env.FTV_LOCAL_BASE_DIR ?? ".ftv-local";
const localRoot = isAbsolute(localBase) ? localBase : join(root, localBase);
const databasePath = join(localRoot, "database", "ftv.sqlite");
const databaseUrl = `file:${resolve(databasePath).replaceAll("\\", "/")}`;

function pass(name, evidence) {
  checks.push({ name, result: "PASS", evidence });
}

function fail(name, evidence) {
  checks.push({ name, result: "FAIL", evidence });
}

function existsCheck(path) {
  return existsSync(join(root, path));
}

const packageJson = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8")
);
const nodeMajor = Number.parseInt(
  process.versions.node.split(".")[0] ?? "0",
  10
);
if (nodeMajor >= 24 && nodeMajor < 25) pass("Node.js version", process.version);
else fail("Node.js version", `Expected >=24 <25, found ${process.version}`);

if (packageJson.packageManager === "pnpm@11.9.0")
  pass("Canonical package manager", packageJson.packageManager);
else
  fail(
    "Canonical package manager",
    `Unexpected packageManager ${packageJson.packageManager ?? "<missing>"}`
  );

for (const file of [
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "apps/operator-console/package.json",
  "prisma/schema.prisma"
]) {
  if (existsCheck(file)) pass(`Workspace file ${file}`, "present");
  else fail(`Workspace file ${file}`, "missing");
}

if (!existsCheck("package-lock.json")) pass("package-lock.json", "absent");
else fail("package-lock.json", "must not be present");

for (const directory of [
  localRoot,
  join(localRoot, "database"),
  join(localRoot, "media"),
  join(localRoot, "config"),
  join(localRoot, "backups"),
  join(localRoot, "logs"),
  join(localRoot, "tmp")
]) {
  const absolutePath = directory;
  if (!existsSync(absolutePath)) {
    fail(`Local directory ${directory}`, "missing; run npm run setup");
    continue;
  }

  try {
    accessSync(absolutePath, constants.R_OK | constants.W_OK);
    pass(`Local directory ${directory}`, "read/write");
  } catch {
    fail(`Local directory ${directory}`, "not readable/writable");
  }
}

pass(
  "Environment configuration",
  `FTV_LOCAL_HOST=${process.env.FTV_LOCAL_HOST ?? "localhost"}, FTV_LOCAL_PORT=${process.env.FTV_LOCAL_PORT ?? "3000"}`
);

if (existsSync(databasePath) && statSync(databasePath).isFile()) {
  pass("SQLite database path", databasePath);
} else {
  fail("SQLite database path", "missing; run npm run setup");
}

try {
  process.env.DATABASE_URL = databaseUrl;
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    await prisma.localConfig.findMany({ take: 1 });
    pass("SQLite connectivity", "Prisma Client query succeeded");
    const migrations = await prisma.$queryRawUnsafe(
      'SELECT "migration_name" FROM "_prisma_migrations" WHERE "migration_name" = ? LIMIT 1',
      "20260731000100_l03_local_persistence"
    );
    if (Array.isArray(migrations) && migrations.length > 0)
      pass(
        "Prisma migration status",
        "20260731000100_l03_local_persistence applied"
      );
    else fail("Prisma migration status", "L-03 migration is not recorded");
  } finally {
    await prisma.$disconnect();
  }
} catch (error) {
  fail(
    "SQLite connectivity",
    error instanceof Error ? error.message : String(error)
  );
}

for (const check of checks) {
  console.log(`${check.result}: ${check.name} - ${check.evidence}`);
}

if (checks.some((check) => check.result === "FAIL")) {
  process.exit(1);
}
