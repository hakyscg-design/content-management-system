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
      "/content-production",
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

  it("persists the manual source to publishing preparation workspace flow", async () => {
    const assetResult = await runtime.createManualSourceAsset({
      sourceUrl: "manual://operator/source-001",
      label: "Operator source asset",
      evidence: "Manual rights evidence"
    });
    expect(assetResult.ok).toBe(true);

    let view = await runtime.getLocalDashboardView();
    const assetRecord = view.records.find(
      (record) =>
        record.entityType === "Asset" &&
        record.label === "Operator source asset"
    );
    expect(assetRecord).toBeDefined();
    expect(assetRecord?.ownerServiceId).toBe("FTV-SVC-01");

    const contentResult = await runtime.createContentProductionPackage({
      assetId: assetRecord?.id ?? "",
      title: "Operator content package",
      concept: "Manual content concept",
      caption: "Manual caption"
    });
    expect(contentResult.ok).toBe(true);

    view = await runtime.getLocalDashboardView();
    const contentRecord = view.records.find(
      (record) =>
        record.entityType === "ContentPackage" &&
        record.label === "Operator content package"
    );
    expect(contentRecord).toBeDefined();
    expect(contentRecord?.ownerServiceId).toBe("FTV-SVC-03");
    expect(contentRecord?.status).toBe("ready-for-review");

    const reviewResult = await runtime.approveContentForReview({
      contentPackageId: contentRecord?.id ?? "",
      reviewerId: "operator-reviewer",
      reason: "Manual approval"
    });
    expect(reviewResult.ok).toBe(true);

    view = await runtime.getLocalDashboardView();
    const reviewRecord = view.records.find(
      (record) =>
        record.entityType === "HumanReview" &&
        record.label === `Review for ${contentRecord?.id}`
    );
    expect(reviewRecord).toBeDefined();
    expect(reviewRecord?.ownerServiceId).toBe("FTV-SVC-05");
    expect(reviewRecord?.status).toBe("approved");

    const publishingResult = await runtime.prepareManualPublishingPackage({
      contentPackageId: contentRecord?.id ?? "",
      destination: "manual-channel",
      caption: "Final manual caption"
    });
    expect(publishingResult.ok).toBe(true);

    view = await runtime.getLocalDashboardView();
    const publishingRecord = view.records.find(
      (record) =>
        record.entityType === "PublishingPackage" &&
        record.label === `Manual package for ${contentRecord?.id}`
    );
    expect(publishingRecord).toBeDefined();
    expect(publishingRecord?.ownerServiceId).toBe("FTV-SVC-04");
    expect(publishingRecord?.status).toBe("ready");

    const completionResult = await runtime.completeManualPublishingPackage({
      publishingPackageId: publishingRecord?.id ?? "",
      manualPublishingReference: "manual://published/operator-001"
    });
    expect(completionResult.ok).toBe(true);

    await runtime.resetLocalRuntimeForTests();
    view = await runtime.getLocalDashboardView();
    const completedPackage = view.records.find(
      (record) => record.id === publishingRecord?.id
    );
    expect(completedPackage?.status).toBe("completed");
    expect(view.lastOperation?.title).toBe("Manual publishing recorded");
  });

  it("rejects premature or repeated workflow actions without mutating the next stage", async () => {
    const flow = await createReadyContentPackage("Lifecycle guard");

    const prematurePublishing = await runtime.prepareManualPublishingPackage({
      contentPackageId: flow.contentPackageId,
      destination: "manual"
    });
    expect(prematurePublishing.ok).toBe(false);
    expect(prematurePublishing.message).toContain("Approved human review");

    const duplicateContent = await runtime.createContentProductionPackage({
      assetId: flow.assetId,
      title: "Duplicate content package",
      concept: "Duplicate concept"
    });
    expect(duplicateContent.ok).toBe(false);
    expect(duplicateContent.message).toContain("already has a content package");

    const review = await runtime.approveContentForReview({
      contentPackageId: flow.contentPackageId,
      reviewerId: "operator-reviewer"
    });
    expect(review.ok).toBe(true);

    const duplicateReview = await runtime.approveContentForReview({
      contentPackageId: flow.contentPackageId,
      reviewerId: "operator-reviewer"
    });
    expect(duplicateReview.ok).toBe(false);
    expect(duplicateReview.message).toContain("already has an approved review");

    const publishing = await runtime.prepareManualPublishingPackage({
      contentPackageId: flow.contentPackageId,
      destination: "manual"
    });
    expect(publishing.ok).toBe(true);

    const duplicatePublishing = await runtime.prepareManualPublishingPackage({
      contentPackageId: flow.contentPackageId,
      destination: "manual"
    });
    expect(duplicatePublishing.ok).toBe(false);
    expect(duplicatePublishing.message).toContain(
      "already has a publishing package"
    );

    let view = await runtime.getLocalDashboardView();
    const publishingPackage = view.executionFlow.publishingPackages.find(
      (record) => record.contentPackageId === flow.contentPackageId
    );
    expect(publishingPackage?.canComplete).toBe(true);

    const completion = await runtime.completeManualPublishingPackage({
      publishingPackageId: publishingPackage?.id ?? "",
      manualPublishingReference: "manual://published/lifecycle-guard"
    });
    expect(completion.ok).toBe(true);

    const duplicateCompletion = await runtime.completeManualPublishingPackage({
      publishingPackageId: publishingPackage?.id ?? "",
      manualPublishingReference: "manual://published/lifecycle-guard-again"
    });
    expect(duplicateCompletion.ok).toBe(false);
    expect(duplicateCompletion.message).toContain("must be ready");

    view = await runtime.getLocalDashboardView();
    expect(
      view.executionFlow.contentPackages.find(
        (record) => record.id === flow.contentPackageId
      )?.nextAction
    ).toBe("Publishing package prepared");
    expect(
      view.executionFlow.publishingPackages.find(
        (record) => record.id === publishingPackage?.id
      )?.nextAction
    ).toBe("Manual publishing recorded");
  });

  it("runs the complete execution workflow independently for multiple projects", async () => {
    const ftvFlow = await completeManualWorkflow(
      "football-troll-vault",
      "FTV workflow"
    );
    const syntheticFlow = await completeManualWorkflow(
      "synthetic-project",
      "Synthetic workflow"
    );

    expect(ftvFlow.assetId).toBe(syntheticFlow.assetId);
    expect(ftvFlow.publishingPackageId).toBe(syntheticFlow.publishingPackageId);

    const ftvView = await runtime.getLocalDashboardView({
      projectId: "football-troll-vault"
    });
    expect(ftvView.project.id).toBe("football-troll-vault");
    expect(
      ftvView.records.some((record) => record.label === "FTV workflow content")
    ).toBe(true);
    expect(
      ftvView.records.some(
        (record) => record.label === "Synthetic workflow content"
      )
    ).toBe(false);
    expect(
      ftvView.executionFlow.publishingPackages.every(
        (record) => record.status === "completed"
      )
    ).toBe(true);

    const syntheticView = await runtime.getLocalDashboardView({
      projectId: "synthetic-project"
    });
    expect(syntheticView.project.id).toBe("synthetic-project");
    expect(
      syntheticView.records.some(
        (record) => record.label === "Synthetic workflow content"
      )
    ).toBe(true);
    expect(
      syntheticView.records.some(
        (record) => record.label === "FTV workflow content"
      )
    ).toBe(false);
    expect(
      syntheticView.executionFlow.publishingPackages.every(
        (record) => record.status === "completed"
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

  it("uses explicit project options without leaking operation state", async () => {
    const ftvResult = await runtime.submitLocalAssetIntake({
      projectId: "football-troll-vault"
    });
    expect(ftvResult.ok).toBe(true);

    const syntheticView = await runtime.getLocalDashboardView({
      projectId: "synthetic-project"
    });
    expect(syntheticView.project.id).toBe("synthetic-project");
    expect(syntheticView.lastOperation).toBeUndefined();
    expect(
      syntheticView.records.some((record) => record.id === "l03-asset-1")
    ).toBe(false);

    await expect(
      runtime.getLocalDashboardView({ projectId: "unknown-project" })
    ).rejects.toThrow("Unknown CMS project: unknown-project.");
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

  async function createReadyContentPackage(label: string): Promise<{
    readonly assetId: string;
    readonly contentPackageId: string;
  }> {
    const asset = await runtime.createManualSourceAsset({
      label: `${label} asset`,
      sourceUrl: `manual://source/${label.toLowerCase().replaceAll(" ", "-")}`,
      evidence: `${label} evidence`
    });
    expect(asset.ok).toBe(true);

    let view = await runtime.getLocalDashboardView();
    const assetRecord = view.executionFlow.assets.find(
      (record) => record.label === `${label} asset`
    );
    expect(assetRecord?.canCreateContent).toBe(true);

    const content = await runtime.createContentProductionPackage({
      assetId: assetRecord?.id ?? "",
      title: `${label} content`,
      concept: `${label} concept`,
      caption: `${label} caption`
    });
    expect(content.ok).toBe(true);

    view = await runtime.getLocalDashboardView();
    const contentRecord = view.executionFlow.contentPackages.find(
      (record) => record.label === `${label} content`
    );
    expect(contentRecord?.canApprove).toBe(true);

    return {
      assetId: assetRecord?.id ?? "",
      contentPackageId: contentRecord?.id ?? ""
    };
  }

  async function completeManualWorkflow(
    projectId: string,
    label: string
  ): Promise<{
    readonly assetId: string;
    readonly contentPackageId: string;
    readonly publishingPackageId: string;
  }> {
    const flow = await createReadyContentPackageForProject(projectId, label);

    const review = await runtime.approveContentForReview(
      {
        contentPackageId: flow.contentPackageId,
        reviewerId: "operator-reviewer",
        reason: `${label} approval`
      },
      { projectId }
    );
    expect(review.ok).toBe(true);

    let view = await runtime.getLocalDashboardView({ projectId });
    expect(
      view.executionFlow.contentPackages.find(
        (record) => record.id === flow.contentPackageId
      )?.canPreparePublishing
    ).toBe(true);

    const publishing = await runtime.prepareManualPublishingPackage(
      {
        contentPackageId: flow.contentPackageId,
        destination: "manual",
        caption: `${label} final caption`
      },
      { projectId }
    );
    expect(publishing.ok).toBe(true);

    view = await runtime.getLocalDashboardView({ projectId });
    const publishingPackage = view.executionFlow.publishingPackages.find(
      (record) => record.contentPackageId === flow.contentPackageId
    );
    expect(publishingPackage?.canComplete).toBe(true);

    const completion = await runtime.completeManualPublishingPackage(
      {
        publishingPackageId: publishingPackage?.id ?? "",
        manualPublishingReference: `manual://published/${projectId}/${label}`
      },
      { projectId }
    );
    expect(completion.ok).toBe(true);

    return {
      ...flow,
      publishingPackageId: publishingPackage?.id ?? ""
    };
  }

  async function createReadyContentPackageForProject(
    projectId: string,
    label: string
  ): Promise<{
    readonly assetId: string;
    readonly contentPackageId: string;
  }> {
    const asset = await runtime.createManualSourceAsset(
      {
        label: `${label} asset`,
        sourceUrl: `manual://source/${projectId}/${label}`,
        evidence: `${label} evidence`
      },
      { projectId }
    );
    expect(asset.ok).toBe(true);

    let view = await runtime.getLocalDashboardView({ projectId });
    const assetRecord = view.executionFlow.assets.find(
      (record) => record.label === `${label} asset`
    );
    expect(assetRecord?.canCreateContent).toBe(true);

    const content = await runtime.createContentProductionPackage(
      {
        assetId: assetRecord?.id ?? "",
        title: `${label} content`,
        concept: `${label} concept`,
        caption: `${label} caption`
      },
      { projectId }
    );
    expect(content.ok).toBe(true);

    view = await runtime.getLocalDashboardView({ projectId });
    const contentRecord = view.executionFlow.contentPackages.find(
      (record) => record.label === `${label} content`
    );
    expect(contentRecord?.canApprove).toBe(true);

    return {
      assetId: assetRecord?.id ?? "",
      contentPackageId: contentRecord?.id ?? ""
    };
  }
});
