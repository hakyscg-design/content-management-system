import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const requiredRootFiles = [
  ".editorconfig",
  ".gitattributes",
  ".gitignore",
  ".npmrc",
  ".nvmrc",
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.json",
  "eslint.config.js",
  "prettier.config.js",
  "vitest.config.ts",
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "LICENSE_NOTICE.md",
  "AGENTS.md"
];

const requiredDirectories = [
  "apps/operator-console",
  "apps/api",
  "services/source-asset-registry",
  "services/media-processing",
  "services/content-production",
  "services/publishing-preparation",
  "services/human-review-approval",
  "services/performance-data",
  "services/analytics-reporting",
  "services/workflow-orchestration",
  "services/governance-rule",
  "services/reference-pattern-library",
  "services/core-data-administration",
  "packages/contracts",
  "packages/domain-types",
  "packages/identifiers",
  "packages/errors",
  "packages/configuration",
  "packages/logging",
  "packages/audit",
  "packages/testing",
  "packages/utilities",
  "tests/bootstrap",
  "docs/canonical",
  "docs/build-execution",
  "scripts/bootstrap",
  "scripts/validation",
  "config/eslint",
  "config/typescript",
  "config/test",
  "third-party/notices",
  "third-party/licenses"
];

const sharedPackages = [
  "contracts",
  "domain-types",
  "identifiers",
  "errors",
  "configuration",
  "logging",
  "audit",
  "testing",
  "utilities"
];

const canonicalServiceIds = [
  "FTV-SVC-01",
  "FTV-SVC-02",
  "FTV-SVC-03",
  "FTV-SVC-04",
  "FTV-SVC-05",
  "FTV-SVC-06",
  "FTV-SVC-07",
  "FTV-SVC-08",
  "FTV-SVC-09",
  "FTV-SVC-10",
  "FTV-SVC-11"
];

const runtimeServiceFolders = [
  "source-asset-registry",
  "media-processing",
  "content-production",
  "publishing-preparation",
  "human-review-approval",
  "performance-data",
  "analytics-reporting",
  "workflow-orchestration",
  "governance-rule",
  "core-data-administration"
];

const failures = [];

for (const file of requiredRootFiles) {
  if (!existsSync(join(root, file)))
    failures.push(`Missing root file: ${file}`);
}

for (const directory of requiredDirectories) {
  if (!existsSync(join(root, directory))) {
    failures.push(`Missing directory: ${directory}`);
  }
}

for (const serviceId of canonicalServiceIds) {
  const serviceReadmes = readdirSync(join(root, "services"), {
    withFileTypes: true
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(root, "services", entry.name, "README.md"))
    .filter((path) => existsSync(path));

  const found = serviceReadmes.some((path) =>
    readFileSync(path, "utf8").includes(serviceId)
  );
  if (!found)
    failures.push(`Missing service ID in service placeholder: ${serviceId}`);
}

const forbiddenGeneratedDirectories = ["node_modules", "dist", "coverage"];
for (const directory of forbiddenGeneratedDirectories) {
  const path = join(root, directory);
  if (
    existsSync(path) &&
    statSync(path).isDirectory() &&
    directory !== "node_modules"
  ) {
    failures.push(`Generated directory present: ${directory}`);
  }
}

const secretFiles = [".env", ".env.local", ".env.test"];
for (const file of secretFiles) {
  if (existsSync(join(root, file)))
    failures.push(`Secret-like local file present: ${file}`);
}

const packageJson = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8")
);
const requiredScripts = [
  "format",
  "format:check",
  "lint",
  "typecheck",
  "test",
  "test:unit",
  "test:contract",
  "test:integration",
  "test:e2e",
  "validate",
  "clean"
];

for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script])
    failures.push(`Missing root script: ${script}`);
}

const packageFiles = [
  join(root, "package.json"),
  ...["apps", "services", "packages"].flatMap((folder) =>
    readdirSync(join(root, folder), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(root, folder, entry.name, "package.json"))
      .filter((path) => existsSync(path))
  )
];

const packageNames = packageFiles.map(
  (path) => JSON.parse(readFileSync(path, "utf8")).name
);
if (new Set(packageNames).size !== packageNames.length) {
  failures.push("Workspace package names must be unique.");
}

for (const packageName of sharedPackages) {
  const packageRoot = join(root, "packages", packageName);
  if (!existsSync(join(packageRoot, "package.json"))) {
    failures.push(`Missing shared package manifest: ${packageName}`);
  }
  if (!existsSync(join(packageRoot, "src", "index.ts"))) {
    failures.push(`Missing shared package source entry point: ${packageName}`);
  }
  if (
    existsSync(join(packageRoot, "README.md")) &&
    !readFileSync(join(packageRoot, "README.md"), "utf8").includes("BE-02")
  ) {
    failures.push(
      `Shared package README must mention BE-02 scope: ${packageName}`
    );
  }
}

for (const serviceFolder of runtimeServiceFolders) {
  const serviceRoot = join(root, "services", serviceFolder);
  if (!existsSync(join(serviceRoot, "src", "index.ts"))) {
    failures.push(
      `Missing runtime service source entry point: ${serviceFolder}`
    );
  }
}

if (failures.length > 0) {
  console.error("Workspace validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Workspace validation passed.");
