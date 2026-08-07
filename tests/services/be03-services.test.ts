import { describe, expect, test } from "vitest";
import {
  createEntityReference,
  createVerifiedEntityReference
} from "../../packages/identifiers/src/index.js";
import { AnalyticsReportingService } from "../../services/analytics-reporting/src/index.js";
import { ContentProductionService } from "../../services/content-production/src/index.js";
import { CoreDataAdministrationService } from "../../services/core-data-administration/src/index.js";
import { GovernanceRuleService } from "../../services/governance-rule/src/index.js";
import { HumanReviewApprovalService } from "../../services/human-review-approval/src/index.js";
import { MediaProcessingService } from "../../services/media-processing/src/index.js";
import { PerformanceDataService } from "../../services/performance-data/src/index.js";
import { PublishingPreparationService } from "../../services/publishing-preparation/src/index.js";
import { SourceAssetRegistryService } from "../../services/source-asset-registry/src/index.js";
import { WorkflowOrchestrationService } from "../../services/workflow-orchestration/src/index.js";

const manualAction = Object.freeze({
  actorId: "operator-001",
  reason: "manual MVP operation"
});

describe("BE-03 FTV-SVC-01 Source & Asset Registry", () => {
  test("manages source, asset, provenance, rights, and duplicate ownership", () => {
    const service = new SourceAssetRegistryService();
    service.captureSource(
      "source-001",
      "https://example.test/source",
      manualAction
    );
    service.approveSource("source-001", manualAction);
    service.registerAsset({
      id: "asset-001",
      sourceReferenceId: "source-001",
      metadata: { title: "Clip" },
      evidence: "manual upload evidence",
      action: manualAction
    });
    service.updateRightsStatus("asset-001", "approved", manualAction);
    const readyAsset = service.markAssetReady("asset-001", manualAction);

    service.registerAsset({
      id: "asset-002",
      sourceReferenceId: "source-001",
      evidence: "manual duplicate check",
      action: manualAction
    });
    const match = service.recordDuplicateMatch({
      id: "duplicate-001",
      assetId: "asset-001",
      candidateAssetId: "asset-002",
      action: manualAction
    });

    expect(readyAsset.status).toBe("ready");
    expect(match.status).toBe("candidate");
    expect(service.assetReference("asset-001").ownerServiceId).toBe(
      "FTV-SVC-01"
    );
  });

  test("requires manual action and usable rights before ready state", () => {
    const service = new SourceAssetRegistryService();
    expect(() =>
      service.captureSource("source-001", "https://example.test/source", {
        actorId: "",
        reason: ""
      })
    ).toThrow("Manual action");

    service.captureSource(
      "source-001",
      "https://example.test/source",
      manualAction
    );
    service.approveSource("source-001", manualAction);
    service.registerAsset({
      id: "asset-001",
      sourceReferenceId: "source-001",
      evidence: "evidence",
      action: manualAction
    });

    expect(() => service.markAssetReady("asset-001", manualAction)).toThrow(
      "usable rights"
    );
  });
});

describe("BE-03 FTV-SVC-03 Content Production", () => {
  test("creates brief, package, version, and review-ready state using asset references", () => {
    const service = new ContentProductionService();
    const assetRef = createEntityReference({
      id: "asset-001",
      ownerServiceId: "FTV-SVC-01",
      entityType: "Asset"
    });
    const brief = service.createBrief(
      "brief-001",
      "Funny derby moment",
      "Short clip concept",
      manualAction
    );
    const contentPackage = service.createContentPackage(
      "content-001",
      brief.id,
      [assetRef],
      manualAction
    );
    const version = service.createVersion(
      contentPackage.id,
      { caption: "Matchday chaos" },
      "manual draft",
      manualAction
    );
    const ready = service.markReadyForReview(contentPackage.id, manualAction);

    expect(version.versionNumber).toBe(1);
    expect(ready.status).toBe("ready-for-review");
    expect(service.contentVersionReference(version.id).ownerServiceId).toBe(
      "FTV-SVC-03"
    );
  });

  test("does not create packages without externally owned asset references", () => {
    const service = new ContentProductionService();
    const brief = service.createBrief(
      "brief-001",
      "Title",
      "Concept",
      manualAction
    );

    expect(() =>
      service.createContentPackage("content-001", brief.id, [], manualAction)
    ).toThrow("asset reference");
  });
});

describe("BE-03 FTV-SVC-04 Publishing Preparation", () => {
  test("prepares checklist and records manual publishing completion", () => {
    const service = new PublishingPreparationService();
    const reviewService = new HumanReviewApprovalService();
    const contentVersionRef = createVerifiedEntityReference({
      id: "content-001:v1",
      ownerServiceId: "FTV-SVC-03",
      entityType: "ContentVersion"
    });
    reviewService.requestReview("review-001", contentVersionRef, manualAction);
    reviewService.recordDecision("review-001", "approved", manualAction);
    const approvalStatusRef =
      reviewService.approvalStatusReference("review-001");
    service.createPublishingPackage({
      id: "publishing-001",
      contentVersionRef,
      approvalStatusRef,
      metadata: { destination: "manual-export" },
      action: manualAction
    });
    service.updateChecklist(
      "publishing-001",
      {
        metadataReviewed: true,
        rightsReviewed: true,
        approvalConfirmed: true,
        exportPrepared: true
      },
      manualAction
    );
    service.markReady("publishing-001", manualAction);
    const completed = service.recordManualPublishingComplete(
      "publishing-001",
      "manual-post-url",
      manualAction
    );

    expect(completed.status).toBe("completed");
    expect(
      service.publishingPackageReference("publishing-001").ownerServiceId
    ).toBe("FTV-SVC-04");
  });

  test("does not mark ready with incomplete manual checklist", () => {
    const service = new PublishingPreparationService();
    const reviewService = new HumanReviewApprovalService();
    const contentVersionRef = createVerifiedEntityReference({
      id: "content-001:v1",
      ownerServiceId: "FTV-SVC-03",
      entityType: "ContentVersion"
    });
    reviewService.requestReview("review-001", contentVersionRef, manualAction);
    reviewService.recordDecision("review-001", "approved", manualAction);
    service.createPublishingPackage({
      id: "publishing-001",
      contentVersionRef,
      approvalStatusRef: reviewService.approvalStatusReference("review-001"),
      metadata: {},
      action: manualAction
    });

    expect(() => service.markReady("publishing-001", manualAction)).toThrow(
      "checklist"
    );
  });
});

describe("BE-03 FTV-SVC-05 Human Review & Approval", () => {
  test("owns assignment, decision, and approval status without mutating target records", () => {
    const service = new HumanReviewApprovalService();
    const targetRef = createEntityReference({
      id: "content-001:v1",
      ownerServiceId: "FTV-SVC-03",
      entityType: "ContentVersion"
    });
    service.requestReview("review-001", targetRef, manualAction);
    service.assignReviewer("review-001", "reviewer-001", manualAction);
    const decision = service.recordDecision(
      "review-001",
      "approved",
      manualAction
    );

    expect(decision.decision).toBe("approved");
    expect(service.getApprovalStatus("review-001")?.state).toBe("approved");
    expect(service.approvalStatusReference("review-001").ownerServiceId).toBe(
      "FTV-SVC-05"
    );
  });

  test("rejects review targets owned by review service itself", () => {
    const service = new HumanReviewApprovalService();
    const targetRef = createEntityReference({
      id: "review-owned",
      ownerServiceId: "FTV-SVC-05",
      entityType: "ApprovalStatus"
    });

    expect(() =>
      service.requestReview("review-001", targetRef, manualAction)
    ).toThrow("owned by another service");
  });
});

describe("BE-03 supporting services", () => {
  test("FTV-SVC-02 owns media processing jobs and derivative references only", () => {
    const service = new MediaProcessingService();
    const assetRef = createVerifiedEntityReference({
      id: "asset-001",
      ownerServiceId: "FTV-SVC-01",
      entityType: "Asset"
    });
    service.createJob("job-001", assetRef, "thumbnail", manualAction);
    service.startJob("job-001", manualAction);
    const completed = service.completeJob(
      "job-001",
      ["derivative://thumb"],
      { width: "1080" },
      manualAction
    );

    expect(completed.status).toBe("completed");
    expect(service.processingJobReference("job-001").ownerServiceId).toBe(
      "FTV-SVC-02"
    );
  });

  test("FTV-SVC-06 owns imports, facts, metrics, and references publishing output", () => {
    const service = new PerformanceDataService();
    const publishingRef = createVerifiedEntityReference({
      id: "publishing-001",
      ownerServiceId: "FTV-SVC-04",
      entityType: "PublishingPackage"
    });
    service.defineMetric("metric-views", "Views", "count", manualAction);
    service.stageImport(
      "import-001",
      "manual-csv",
      publishingRef,
      manualAction
    );
    service.recordFact(
      "fact-001",
      "import-001",
      "metric-views",
      100,
      publishingRef,
      manualAction
    );
    const completed = service.completeImport("import-001", manualAction);

    expect(completed.status).toBe("imported");
    expect(service.performanceFactReference("fact-001").ownerServiceId).toBe(
      "FTV-SVC-06"
    );
  });

  test("FTV-SVC-07 owns reports and learning summaries without production mutation", () => {
    const service = new AnalyticsReportingService();
    const factRef = createVerifiedEntityReference({
      id: "fact-001",
      ownerServiceId: "FTV-SVC-06",
      entityType: "PerformanceFact"
    });
    const report = service.createReport(
      "report-001",
      "Weekly report",
      [factRef],
      "Manual narrative",
      manualAction
    );
    const summary = service.recordLearningSummary(
      "learning-001",
      report.id,
      "Try shorter captions.",
      manualAction
    );

    expect(summary.reportId).toBe("report-001");
    expect(service.analyticsReportReference(report.id).ownerServiceId).toBe(
      "FTV-SVC-07"
    );
  });
});

describe("BE-03 cross-cutting services", () => {
  test("FTV-SVC-08 owns workflow runs but only stores target references", () => {
    const service = new WorkflowOrchestrationService();
    const targetRef = createEntityReference({
      id: "asset-001",
      ownerServiceId: "FTV-SVC-01",
      entityType: "Asset"
    });
    service.startRun("workflow-001", [targetRef], manualAction);
    service.recordStepCompleted("workflow-001", "manual-check", manualAction);
    const completed = service.completeRun("workflow-001", manualAction);

    expect(completed.status).toBe("completed");
    expect(service.workflowRunReference("workflow-001").ownerServiceId).toBe(
      "FTV-SVC-08"
    );
  });

  test("FTV-SVC-09 owns roles, relations, rule evaluations, and audit events", () => {
    const service = new GovernanceRuleService();
    const targetRef = createEntityReference({
      id: "asset-001",
      ownerServiceId: "FTV-SVC-01",
      entityType: "Asset"
    });
    service.assignRole("role-001", "operator-001", "producer", manualAction);
    service.addAuthorizationRelation(
      "relation-001",
      "operator-001",
      "approve",
      targetRef,
      manualAction
    );
    const evaluation = service.evaluateRule(
      "evaluation-001",
      "operator-001",
      "approve",
      targetRef,
      manualAction
    );
    const audit = service.recordAuditEvent(
      "audit-001",
      {
        actor: { actorId: "operator-001" },
        action: "APPROVE",
        targetRef: "asset-001",
        reason: "manual sign-off",
        operationId: "operation-001"
      },
      manualAction
    );

    expect(evaluation.allowed).toBe(true);
    expect(audit.action).toBe("APPROVE");
    expect(
      service.ruleEvaluationReference("evaluation-001").ownerServiceId
    ).toBe("FTV-SVC-09");
  });

  test("FTV-SVC-11 owns non-authoritative admin metadata only", () => {
    const service = new CoreDataAdministrationService();
    const assetRef = createEntityReference({
      id: "asset-001",
      ownerServiceId: "FTV-SVC-01",
      entityType: "Asset"
    });
    service.configureView(
      "view-001",
      "Asset Review",
      "FTV-SVC-01",
      ["id", "status"],
      manualAction
    );
    service.registerDisplayMetadata(
      "metadata-001",
      assetRef,
      "Asset 001",
      manualAction
    );
    const inspection = service.inspectRecord(
      "inspection-001",
      assetRef,
      "manual inspection",
      manualAction
    );

    expect(inspection.authoritative).toBe(false);
    expect(service.adminViewReference("view-001").ownerServiceId).toBe(
      "FTV-SVC-11"
    );
  });
});
