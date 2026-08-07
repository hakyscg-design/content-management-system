import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, normalize, relative } from "node:path";
import process from "node:process";
import { PrismaClient } from "@prisma/client";
import { loadProjectConfig } from "@ftv/configuration";
import { toSafeErrorOutput } from "@ftv/errors";
import { createEntityReference } from "@ftv/identifiers";
import type { CanonicalProject } from "@ftv/domain-types";
import { AnalyticsReportingService } from "@ftv/analytics-reporting";
import { ContentProductionService } from "@ftv/content-production";
import { CoreDataAdministrationService } from "@ftv/core-data-administration";
import { GovernanceRuleService } from "@ftv/governance-rule";
import { HumanReviewApprovalService } from "@ftv/human-review-approval";
import { MediaProcessingService } from "@ftv/media-processing";
import { PerformanceDataService } from "@ftv/performance-data";
import { PublishingPreparationService } from "@ftv/publishing-preparation";
import { SourceAssetRegistryService } from "@ftv/source-asset-registry";
import {
  WorkflowOrchestrationService,
  type ManualAction
} from "@ftv/workflow-orchestration";

export const LOCAL_RUNTIME_KIND = "durable-sqlite-l03" as const;

const schemaVersion = "l03-20260731000100";
const operatorAction: ManualAction = Object.freeze({
  actorId: "local-operator",
  reason: "L-03 local operator action"
});

export interface LocalRuntimeServices {
  readonly sourceAssetRegistry: SourceAssetRegistryService;
  readonly mediaProcessing: MediaProcessingService;
  readonly contentProduction: ContentProductionService;
  readonly publishingPreparation: PublishingPreparationService;
  readonly humanReviewApproval: HumanReviewApprovalService;
  readonly performanceData: PerformanceDataService;
  readonly analyticsReporting: AnalyticsReportingService;
  readonly workflowOrchestration: WorkflowOrchestrationService;
  readonly governanceRule: GovernanceRuleService;
  readonly coreDataAdministration: CoreDataAdministrationService;
}

export interface LocalRecordSummary {
  readonly id: string;
  readonly ownerServiceId: string;
  readonly entityType: string;
  readonly label: string;
  readonly status: string;
}

export interface LocalMediaSummary {
  readonly id: string;
  readonly ownerServiceId: string;
  readonly fileName: string;
  readonly relativePath: string;
  readonly byteSize: number;
  readonly sha256: string;
}

export interface LocalRouteSummary {
  readonly route: string;
  readonly capability: string;
  readonly owningService: string;
  readonly status: string;
}

export interface LocalOperationResult {
  readonly ok: boolean;
  readonly title: string;
  readonly message: string;
  readonly code?: string;
  readonly category?: string;
  readonly workflowRunId?: string;
}

export interface LocalDashboardView {
  readonly runtimeKind: typeof LOCAL_RUNTIME_KIND;
  readonly project: CanonicalProject;
  readonly persistence: "persistent";
  readonly warning: string;
  readonly records: readonly LocalRecordSummary[];
  readonly media: readonly LocalMediaSummary[];
  readonly routes: readonly LocalRouteSummary[];
  readonly lastOperation?: LocalOperationResult;
}

interface LocalRuntimeState {
  readonly services: LocalRuntimeServices;
  readonly prisma: PrismaClient;
  readonly project: CanonicalProject;
  readonly baseDir: string;
  readonly mediaDir: string;
}

interface PersistedRecordRow {
  readonly id: string;
  readonly ownerServiceId: string;
  readonly entityType: string;
  readonly label: string;
  readonly status: string;
}

interface PersistedMediaRow {
  readonly id: string;
  readonly ownerServiceId: string;
  readonly fileName: string;
  readonly relativePath: string;
  readonly byteSize: number;
  readonly sha256: string;
}

const routeSummaries: readonly LocalRouteSummary[] = Object.freeze([
  Object.freeze({
    route: "/",
    capability: "CAP-10 Data Management",
    owningService: "FTV-SVC-11",
    status: "implemented"
  }),
  Object.freeze({
    route: "/source-assets",
    capability: "CAP-01 Asset Acquisition; CAP-02 Asset Management",
    owningService: "FTV-SVC-01",
    status: "implemented"
  }),
  Object.freeze({
    route: "/workflow",
    capability: "CAP-08 Workflow Management",
    owningService: "FTV-SVC-08",
    status: "implemented"
  }),
  Object.freeze({
    route: "/review",
    capability: "CAP-12 Human Review Support",
    owningService: "FTV-SVC-05",
    status: "implemented"
  }),
  Object.freeze({
    route: "/publishing",
    capability: "CAP-05 Publishing Preparation",
    owningService: "FTV-SVC-04",
    status: "implemented"
  }),
  Object.freeze({
    route: "/performance-analytics",
    capability: "CAP-06 Performance Data Collection; CAP-07 Performance Analysis",
    owningService: "FTV-SVC-06; FTV-SVC-07",
    status: "implemented"
  }),
  Object.freeze({
    route: "/administration",
    capability: "CAP-10 Data Management; CAP-11 Governance Support",
    owningService: "FTV-SVC-11; FTV-SVC-09",
    status: "implemented"
  })
]);

export async function getLocalDashboardView(): Promise<LocalDashboardView> {
  const runtime = getLocalRuntimeState();
  await ensureSeedData(runtime);
  const [records, media, lastOperation] = await Promise.all([
    runtime.prisma.localRecord.findMany({ orderBy: { createdAt: "asc" } }),
    runtime.prisma.localMedia.findMany({ orderBy: { createdAt: "asc" } }),
    runtime.prisma.localOperation.findFirst({ orderBy: { createdAt: "desc" } })
  ]);

  return Object.freeze({
    runtimeKind: LOCAL_RUNTIME_KIND,
    project: runtime.project,
    persistence: "persistent" as const,
    warning:
      "L-03 uses SQLite and local filesystem storage. Data and media persist across local restarts.",
    records: Object.freeze(
      (records as PersistedRecordRow[]).map((record) =>
        Object.freeze({
  id: record.id,
  ownerServiceId: record.ownerServiceId,
  entityType: record.entityType,
  label: record.label,
  status: record.status
})
      )
    ),
    media: Object.freeze(
      (media as PersistedMediaRow[]).map((item) =>
        Object.freeze({
          id: item.id,
          ownerServiceId: item.ownerServiceId,
          fileName: item.fileName,
          relativePath: item.relativePath,
          byteSize: item.byteSize,
          sha256: item.sha256
        })
      )
    ),
    routes: routeSummaries,
    ...(lastOperation
      ? {
          lastOperation: Object.freeze({
            ok: lastOperation.ok,
            title: lastOperation.title,
            message: lastOperation.message,
            ...(lastOperation.code ? { code: lastOperation.code } : {}),
            ...(lastOperation.category
              ? { category: lastOperation.category }
              : {})
          })
        }
      : {})
  });
}

export async function submitLocalAssetIntake(): Promise<LocalOperationResult> {
  const runtime = getLocalRuntimeState();
  const sequence = await nextSequence(runtime);
  const sourceId = `l03-source-${sequence}`;
  const assetId = `l03-asset-${sequence}`;

  try {
    const workflow = runtime.services.workflowOrchestration.startRun(
      `l03-asset-intake-${sequence}:workflow`,
      [],
      operatorAction
    );
    const source = runtime.services.sourceAssetRegistry.captureSource(
      sourceId,
      `manual://approved-source/${sequence}`,
      operatorAction
    );
    runtime.services.sourceAssetRegistry.approveSource(source.id, operatorAction);
    const asset = runtime.services.sourceAssetRegistry.registerAsset({
      id: assetId,
      sourceReferenceId: source.id,
      evidence: "L-03 local durable evidence",
      action: operatorAction
    });
    runtime.services.sourceAssetRegistry.updateRightsStatus(
      asset.id,
      "approved",
      operatorAction
    );
    runtime.services.sourceAssetRegistry.markAssetReady(
      asset.id,
      operatorAction
    );
    runtime.services.workflowOrchestration.completeRun(
      workflow.id,
      operatorAction
    );

    await upsertRecord(runtime, {
      id: assetId,
      ownerServiceId: "FTV-SVC-01",
      entityType: "Asset",
      label: "Source & Asset Registry asset",
      status: asset?.status ?? "unknown",
      payload: toPayload({
        sourceId,
        workflowRunId: workflow.id,
        persistedBy: "L-03 Local Runtime"
      })
    });

    return recordOperation(runtime, {
      ok: true,
      title: "Owner-routed asset intake",
      message: `Created ${assetId} through FTV-SVC-01 and persisted locally.`,
      workflowRunId: workflow.id
    });
  } catch (error) {
    return recordOperation(runtime, safeFailure("Owner-routed asset intake rejected", error));
  }
}

export async function submitInvalidPublishingAttempt(): Promise<LocalOperationResult> {
  const runtime = getLocalRuntimeState();
  const sequence = await nextSequence(runtime);

  try {
    runtime.services.publishingPreparation.createPublishingPackage({
      id: `l03-invalid-pub-${sequence}`,
      contentVersionRef: createEntityReference({
        id: `fabricated-content-version-${sequence}`,
        ownerServiceId: "FTV-SVC-03",
        entityType: "ContentVersion"
      }),
      approvalStatusRef: createEntityReference({
        id: `fabricated-approval-${sequence}`,
        ownerServiceId: "FTV-SVC-05",
        entityType: "ApprovalStatus"
      }),
      metadata: { destination: "manual" },
      action: operatorAction
    });

    return recordOperation(runtime, {
      ok: false,
      title: "Unexpected publishing acceptance",
      message:
        "The publishing service accepted an invalid approval reference. This would violate L-03 acceptance."
    });
  } catch (error) {
    return recordOperation(runtime, safeFailure("Publishing gate preserved", error, true));
  }
}

export async function addLocalMediaFixture(): Promise<LocalOperationResult> {
  const runtime = getLocalRuntimeState();
  const sequence = await nextSequence(runtime);
  const id = `l03-media-${sequence}`;
  const fileName = `${id}.txt`;
  const relativePath = `media/${fileName}`;
  const absolutePath = safeLocalPath(runtime.baseDir, relativePath);

  if (existsSync(absolutePath)) {
    return recordOperation(runtime, {
      ok: false,
      title: "Local media rejected",
      message: `Media file already exists: ${relativePath}`
    });
  }

  const contents = Buffer.from(
    `Football Troll Vault L-03 local media fixture ${sequence}\n`,
    "utf8"
  );
  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, contents, { flag: "wx" });
  const sha256 = createHash("sha256").update(contents).digest("hex");

  await runtime.prisma.localMedia.create({
    data: {
      id,
      ownerServiceId: "FTV-SVC-02",
      fileName,
      relativePath,
      contentType: "text/plain",
      byteSize: contents.byteLength,
      sha256
    }
  });

  await upsertRecord(runtime, {
    id,
    ownerServiceId: "FTV-SVC-02",
    entityType: "Media",
    label: "Local media file",
    status: "stored",
    payload: toPayload({ relativePath, sha256 })
  });

  return recordOperation(runtime, {
    ok: true,
    title: "Local media stored",
    message: `Stored ${relativePath} in local filesystem storage.`
  });
}

export async function resetLocalRuntimeForTests(): Promise<void> {
  const holder = globalThis as typeof globalThis & {
    __ftvLocalRuntime?: LocalRuntimeState;
  };
  if (holder.__ftvLocalRuntime) {
    await holder.__ftvLocalRuntime.prisma.$disconnect();
  }
  delete holder.__ftvLocalRuntime;
}

function getLocalRuntimeState(): LocalRuntimeState {
  const holder = globalThis as typeof globalThis & {
    __ftvLocalRuntime?: LocalRuntimeState;
  };
  holder.__ftvLocalRuntime ??= createRuntime();
  return holder.__ftvLocalRuntime;
}

function findWorkspaceRoot(startDirectory: string): string {
  let currentDirectory = startDirectory;

  while (true) {
    if (existsSync(join(currentDirectory, "pnpm-workspace.yaml"))) {
      return currentDirectory;
    }

    const parentDirectory = dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      throw new Error(
        `Unable to locate the FTV workspace root from ${startDirectory}.`
      );
    }

    currentDirectory = parentDirectory;
  }
}

function createRuntime(): LocalRuntimeState {
  const workspaceRoot = findWorkspaceRoot(process.cwd());
  const config = loadProjectConfig();
  const project = config.project;
  const configuredBaseDir =
    process.env.FTV_LOCAL_BASE_DIR ?? defaultBaseDirForProject(project.id);

  const baseRoot = isAbsolute(configuredBaseDir)
    ? configuredBaseDir
    : join(workspaceRoot, configuredBaseDir);

  const databaseDir = join(baseRoot, "database");
  const mediaDir = join(baseRoot, "media");
  const databasePath = join(databaseDir, "ftv.sqlite");
  const databaseUrl = `file:${databasePath.replaceAll("\\", "/")}`;

  mkdirSync(databaseDir, { recursive: true });
  mkdirSync(mediaDir, { recursive: true });

  process.env.FTV_LOCAL_BASE_DIR = baseRoot;
  process.env.DATABASE_URL = databaseUrl;

  return {
    prisma: new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    }),
    project,
    baseDir: baseRoot,
    mediaDir,
    services: {
      sourceAssetRegistry: new SourceAssetRegistryService(),
      mediaProcessing: new MediaProcessingService(),
      contentProduction: new ContentProductionService(),
      publishingPreparation: new PublishingPreparationService(),
      humanReviewApproval: new HumanReviewApprovalService(),
      performanceData: new PerformanceDataService(),
      analyticsReporting: new AnalyticsReportingService(),
      workflowOrchestration: new WorkflowOrchestrationService(),
      governanceRule: new GovernanceRuleService(),
      coreDataAdministration: new CoreDataAdministrationService()
    }
  };
}

async function ensureSeedData(runtime: LocalRuntimeState): Promise<void> {
  const seeded = await runtime.prisma.localConfig.findUnique({
    where: { key: "l03.seeded" }
  });
  if (seeded) return;

  const source = runtime.services.sourceAssetRegistry.captureSource(
    "l03-seed-source",
    "manual://approved-source/seed",
    {
      actorId: "l03-seed",
      reason: "development-only L-03 seed through public contract"
    }
  );
  runtime.services.sourceAssetRegistry.approveSource(source.id, operatorAction);
  const asset = runtime.services.sourceAssetRegistry.registerAsset({
    id: "l03-seed-asset",
    sourceReferenceId: source.id,
    evidence: "L-03 seed provenance",
    action: operatorAction
  });
  runtime.services.sourceAssetRegistry.updateRightsStatus(
    asset.id,
    "approved",
    operatorAction
  );
  runtime.services.sourceAssetRegistry.markAssetReady(asset.id, operatorAction);
  const assetRef = runtime.services.sourceAssetRegistry.assetReference(asset.id);
  runtime.services.contentProduction.createBrief(
    "l03-seed-brief",
    "Seed content brief",
    "Manual-first football content production",
    operatorAction
  );
  const contentPackage = runtime.services.contentProduction.createContentPackage(
    "l03-seed-package",
    "l03-seed-brief",
    [assetRef],
    operatorAction
  );
  const version = runtime.services.contentProduction.createVersion(
    contentPackage.id,
    { caption: "Seed caption" },
    "L-03 seed version",
    operatorAction
  );
  runtime.services.contentProduction.markReadyForReview(
    contentPackage.id,
    operatorAction
  );
  const versionRef = runtime.services.contentProduction.contentVersionReference(
    version.id
  );
  runtime.services.humanReviewApproval.requestReview(
    "l03-seed-review",
    versionRef,
    operatorAction
  );

  await runtime.prisma.$transaction([
    runtime.prisma.localRecord.upsert({
      where: { id: asset.id },
      update: {},
      create: {
        id: asset.id,
        ownerServiceId: "FTV-SVC-01",
        entityType: "Asset",
        label: "Ready asset",
        status: "ready",
        payload: toPayload({ sourceId: source.id })
      }
    }),
    runtime.prisma.localRecord.upsert({
      where: { id: contentPackage.id },
      update: {},
      create: {
        id: contentPackage.id,
        ownerServiceId: "FTV-SVC-03",
        entityType: "ContentPackage",
        label: "Content package",
        status: "ready-for-review",
        payload: toPayload({ versionId: version.id })
      }
    }),
    runtime.prisma.localRecord.upsert({
      where: { id: "l03-seed-review" },
      update: {},
      create: {
        id: "l03-seed-review",
        ownerServiceId: "FTV-SVC-05",
        entityType: "HumanReview",
        label: "Human review",
        status: "pending",
        payload: toPayload({ contentVersionId: version.id })
      }
    }),
    runtime.prisma.localConfig.upsert({
      where: { key: "l03.seeded" },
      update: { value: "true" },
      create: { key: "l03.seeded", value: "true" }
    }),
    runtime.prisma.localConfig.upsert({
      where: { key: "schema.version" },
      update: { value: schemaVersion },
      create: { key: "schema.version", value: schemaVersion }
    })
  ]);
}

async function upsertRecord(
  runtime: LocalRuntimeState,
  record: LocalRecordSummary & {
    readonly entityType: string;
    readonly payload: string;
  }
): Promise<void> {
  await runtime.prisma.localRecord.upsert({
    where: { id: record.id },
    update: {
      ownerServiceId: record.ownerServiceId,
      entityType: record.entityType,
      label: record.label,
      status: record.status,
      payload: record.payload
    },
    create: {
      id: record.id,
      ownerServiceId: record.ownerServiceId,
      entityType: record.entityType,
      label: record.label,
      status: record.status,
      payload: record.payload
    }
  });
}

async function nextSequence(runtime: LocalRuntimeState): Promise<number> {
  const key = "operation.sequence";
  const current = await runtime.prisma.localConfig.findUnique({ where: { key } });
  const next = Number.parseInt(current?.value ?? "0", 10) + 1;
  await runtime.prisma.localConfig.upsert({
    where: { key },
    update: { value: String(next) },
    create: { key, value: String(next) }
  });
  return next;
}

async function recordOperation(
  runtime: LocalRuntimeState,
  result: LocalOperationResult
): Promise<LocalOperationResult> {
  const id = `operation-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await runtime.prisma.localOperation.create({
    data: {
      id,
      ok: result.ok,
      title: result.title,
      message: result.message,
      code: result.code ?? null,
      category: result.category ?? null,
      payload: toPayload({
        workflowRunId: result.workflowRunId ?? null
      })
    }
  });
  return Object.freeze(result);
}

function toPayload(value: unknown): string {
  return JSON.stringify(value);
}

function safeFailure(
  title: string,
  error: unknown,
  expected = false
): LocalOperationResult {
  const safe = toSafeErrorOutput(error);
  const message =
    safe.code === "FTV-SYSTEM-UNKNOWN" && error instanceof Error
      ? error.message
      : safe.message;
  return Object.freeze({
    ok: expected,
    title,
    message,
    code: safe.code,
    category: safe.category
  });
}

function safeLocalPath(baseDir: string, relativePath: string): string {
  const base = normalize(baseDir);
  const target = normalize(join(base, relativePath));
  if (relative(base, target).startsWith("..")) {
    throw new Error("local media path escapes FTV_LOCAL_BASE_DIR");
  }
  return target;
}

function defaultBaseDirForProject(projectId: string): string {
  if (projectId === "football-troll-vault") {
    return ".ftv-local";
  }

  return join(".cms-local", projectId);
}

export function readLocalMediaBytes(relativePath: string): Buffer {
  const runtime = getLocalRuntimeState();
  return readFileSync(safeLocalPath(runtime.baseDir, relativePath));
}
