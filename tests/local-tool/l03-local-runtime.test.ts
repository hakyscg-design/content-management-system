import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execSync, spawnSync } from "node:child_process";
import { vi } from "vitest";

type RuntimeModule = typeof import("../../packages/local-runtime/src/index.js");

describe("L-03 local runtime persistence", () => {
  let baseDir: string;
  let runtime: RuntimeModule;

  beforeEach(async () => {
    baseDir = mkdtempSync(join(tmpdir(), "ftv-l03-"));
    delete process.env.CMS_PROJECT_ID;
    process.env.FTV_LOCAL_BASE_DIR = baseDir;
    process.env.DATABASE_URL = `file:${join(baseDir, "database", "ftv.sqlite").replaceAll("\\", "/")}`;
    execSync("npm run setup", {
      cwd: process.cwd(),
      env: { ...process.env, FTV_SKIP_PRISMA_GENERATE: "1" },
      shell: process.platform === "win32" ? "cmd.exe" : undefined,
      stdio: "pipe"
    });
    vi.resetModules();
    runtime = await import("../../packages/local-runtime/src/index.js");
    if (runtime) await runtime.resetLocalRuntimeForTests();
  }, 30000);

  afterEach(async () => {
    if (runtime) await runtime.resetLocalRuntimeForTests();
    delete process.env.CMS_PROJECT_ID;
    delete process.env.FTV_LOCAL_BASE_DIR;
    delete process.env.DATABASE_URL;
    rmSync(baseDir, { recursive: true, force: true });
  }, 30000);

  it("exposes the durable SQLite runtime view", async () => {
    const view = await runtime.getLocalDashboardView();

    expect(view.runtimeKind).toBe(runtime.LOCAL_RUNTIME_KIND);
    expect(view.project.id).toBe("football-troll-vault");
    expect(view.project.serviceNamespace).toBe("FTV");
    expect(view.persistence).toBe("persistent");
    expect(view.warning).toContain("persist");
    expect(
      view.records.some((record) => record.ownerServiceId === "FTV-SVC-01")
    ).toBe(true);
    expect(view.routes.map((route) => route.route)).toEqual([
      "/",
      "/source-assets",
      "/workflow",
      "/review",
      "/publishing",
      "/performance-analytics",
      "/administration"
    ]);
  });

  it("persists a valid owner-routed asset intake across runtime restart", async () => {
    const result = await runtime.submitLocalAssetIntake();
    expect(result.ok).toBe(true);

    await runtime.resetLocalRuntimeForTests();
    const view = await runtime.getLocalDashboardView();

    expect(
      view.records.some(
        (record) =>
          record.id.startsWith("l03-asset-") &&
          record.ownerServiceId === "FTV-SVC-01"
      )
    ).toBe(true);
  });

  it("persists local media metadata and file bytes across runtime restart", async () => {
    const result = await runtime.addLocalMediaFixture();
    expect(result.ok).toBe(true);

    await runtime.resetLocalRuntimeForTests();
    const view = await runtime.getLocalDashboardView();

    expect(view.media).toHaveLength(1);
    expect(existsSync(join(baseDir, view.media[0]?.relativePath ?? ""))).toBe(
      true
    );
  });

  it("preserves publishing approval validation for fabricated references", async () => {
    const result = await runtime.submitInvalidPublishingAttempt();

    expect(result.ok).toBe(true);
    expect(result.title).toBe("Publishing gate preserved");
    expect(result.message).toContain("verified by its owner service");
  });

  it("isolates records, media, and operations between projects in one local store", async () => {
    const ftvAsset = await runtime.submitLocalAssetIntake();
    const ftvMedia = await runtime.addLocalMediaFixture();
    expect(ftvAsset.ok).toBe(true);
    expect(ftvMedia.ok).toBe(true);

    await runtime.resetLocalRuntimeForTests();
    process.env.CMS_PROJECT_ID = "synthetic-project";
    vi.resetModules();
    runtime = await import("../../packages/local-runtime/src/index.js");

    const syntheticInitialView = await runtime.getLocalDashboardView();
    expect(syntheticInitialView.project.id).toBe("synthetic-project");
    expect(
      syntheticInitialView.records.some((record) => record.id === "l03-asset-1")
    ).toBe(false);
    expect(syntheticInitialView.media).toHaveLength(0);
    expect(syntheticInitialView.lastOperation).toBeUndefined();

    const syntheticMedia = await runtime.addLocalMediaFixture();
    expect(syntheticMedia.ok).toBe(true);

    const syntheticView = await runtime.getLocalDashboardView();
    expect(syntheticView.media).toHaveLength(1);
    expect(syntheticView.media[0]?.relativePath).toBe(
      "projects/synthetic-project/media/l03-media-1.txt"
    );

    await runtime.resetLocalRuntimeForTests();
    delete process.env.CMS_PROJECT_ID;
    vi.resetModules();
    runtime = await import("../../packages/local-runtime/src/index.js");

    const ftvView = await runtime.getLocalDashboardView();
    expect(ftvView.project.id).toBe("football-troll-vault");
    expect(ftvView.records.some((record) => record.id === "l03-asset-1")).toBe(
      true
    );
    expect(ftvView.media.map((item) => item.relativePath)).toEqual([
      "media/l03-media-2.txt"
    ]);
    expect(ftvView.lastOperation?.title).toBe("Local media stored");
  });

  it("records project identity in backups and rejects cross-project restore", async () => {
    const output = execSync("npm run backup", {
      cwd: process.cwd(),
      env: {
        ...process.env,
        CMS_PROJECT_ID: "synthetic-project",
        FTV_LOCAL_BASE_DIR: baseDir
      },
      shell: process.platform === "win32" ? "cmd.exe" : undefined,
      stdio: "pipe"
    }).toString("utf8");
    const backupDir = output.match(/Backup created: (.+)\s*$/)?.[1];
    expect(backupDir).toBeDefined();

    const manifest = JSON.parse(
      readFileSync(join(backupDir ?? "", "manifest.json"), "utf8")
    ) as { projectId?: string; schemaVersion?: string };
    expect(manifest.projectId).toBe("synthetic-project");
    expect(manifest.schemaVersion).toBe("cms-20260809000100");

    const restore = spawnSync(
      process.execPath,
      ["scripts/local/restore.mjs", backupDir ?? ""],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          FTV_LOCAL_BASE_DIR: baseDir
        },
        encoding: "utf8"
      }
    );

    expect(restore.status).not.toBe(0);
    expect(`${restore.stdout ?? ""}${restore.stderr ?? ""}`).toContain(
      "backup project synthetic-project does not match active project football-troll-vault"
    );
  });
});
