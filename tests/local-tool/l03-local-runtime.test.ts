import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { vi } from "vitest";

type RuntimeModule = typeof import("../../packages/local-runtime/src/index.js");

describe("L-03 local runtime persistence", () => {
  let baseDir: string;
  let runtime: RuntimeModule;

  beforeEach(async () => {
    baseDir = mkdtempSync(join(tmpdir(), "ftv-l03-"));
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
    delete process.env.FTV_LOCAL_BASE_DIR;
    delete process.env.DATABASE_URL;
    rmSync(baseDir, { recursive: true, force: true });
  }, 30000);

  it("exposes the durable SQLite runtime view", async () => {
    const view = await runtime.getLocalDashboardView();

    expect(view.runtimeKind).toBe(runtime.LOCAL_RUNTIME_KIND);
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
});
