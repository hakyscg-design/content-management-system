import { describe, expect, test } from "vitest";
import {
  EventBus,
  createServiceCommand,
  createServiceEvent
} from "../../packages/contracts/src/index.js";
import { createEntityReference } from "../../packages/identifiers/src/index.js";
import { AnalyticsReportingService } from "../../services/analytics-reporting/src/index.js";
import { ContentProductionService } from "../../services/content-production/src/index.js";
import { GovernanceRuleService } from "../../services/governance-rule/src/index.js";
import { HumanReviewApprovalService } from "../../services/human-review-approval/src/index.js";
import { MediaProcessingService } from "../../services/media-processing/src/index.js";
import { PerformanceDataService } from "../../services/performance-data/src/index.js";
import { PublishingPreparationService } from "../../services/publishing-preparation/src/index.js";
import { SourceAssetRegistryService } from "../../services/source-asset-registry/src/index.js";
import { createMvpIntegrationCoordinator } from "../../services/workflow-orchestration/src/integration.js";
import { WorkflowOrchestrationService } from "../../services/workflow-orchestration/src/index.js";

const manualAction = Object.freeze({
  actorId: "operator-001",
  reason: "manual integration trigger"
});

function createServices() {
  return {
    sourceAssetRegistry: new SourceAssetRegistryService(),
    mediaProcessing: new MediaProcessingService(),
    contentProduction: new ContentProductionService(),
    publishingPreparation: new PublishingPreparationService(),
    humanReviewApproval: new HumanReviewApprovalService(),
    performanceData: new PerformanceDataService(),
    analyticsReporting: new AnalyticsReportingService(),
    workflowOrchestration: new WorkflowOrchestrationService(),
    governanceRule: new GovernanceRuleService()
  };
}

describe("BE-04 service contracts", () => {
  test("command contracts preserve target owner and version", () => {
    const command = createServiceCommand({
      name: "CreateProcessingJob",
      version: "0.0.1",
      targetOwnerServiceId: "FTV-SVC-02",
      operationId: "operation-contract-001",
      payload: {
        assetRef: createEntityReference({
          id: "asset-001",
          ownerServiceId: "FTV-SVC-01",
          entityType: "Asset"
        }),
        processingJobId: "job-001"
      }
    });

    expect(command.targetOwnerServiceId).toBe("FTV-SVC-02");
    expect(command.version).toBe("0.0.1");
    expect(Object.isFrozen(command)).toBe(true);
  });

  test("events publish after owner state changes and deliver to consumers", async () => {
    const eventBus = new EventBus();
    const delivered: string[] = [];
    eventBus.subscribe<{ assetId: string }>(
      "AssetRegistered",
      async (event) => {
        delivered.push(event.payload.assetId);
      }
    );

    const result = await eventBus.publish(
      createServiceEvent({
        name: "AssetRegistered",
        version: "0.0.1",
        producerServiceId: "FTV-SVC-01",
        operationId: "operation-event-001",
        payload: { assetId: "asset-001" }
      })
    );

    expect(result.ok).toBe(true);
    expect(result.payload?.delivered).toBe(1);
    expect(delivered).toEqual(["asset-001"]);
  });
});

describe("BE-04 required MVP flows", () => {
  test("Flow 1 Asset Intake publishes asset availability", async () => {
    const services = createServices();
    const coordinator = createMvpIntegrationCoordinator(services);

    const result = await coordinator.runAssetIntakeFlow({
      operationId: "operation-asset-intake",
      sourceId: "source-001",
      sourceUrl: "https://example.test/source",
      assetId: "asset-001",
      evidence: "manual evidence",
      action: manualAction
    });

    expect(result.status).toBe("completed");
    expect(result.events).toContain("AssetRegistered");
    expect(services.sourceAssetRegistry.getAsset("asset-001")?.status).toBe(
      "ready"
    );
  });

  test("Flow 2 Media Processing routes command to media owner and event back to asset owner", async () => {
    const services = createServices();
    const coordinator = createMvpIntegrationCoordinator(services);
    await coordinator.runAssetIntakeFlow({
      operationId: "operation-asset-intake",
      sourceId: "source-001",
      sourceUrl: "https://example.test/source",
      assetId: "asset-001",
      evidence: "manual evidence",
      action: manualAction
    });

    const result = await coordinator.runMediaProcessingFlow({
      operationId: "operation-media",
      assetId: "asset-001",
      processingJobId: "job-001",
      action: manualAction
    });

    expect(result.status).toBe("completed");
    expect(result.events).toContain("MediaProcessingCompleted");
    expect(services.mediaProcessing.getJob("job-001")?.status).toBe(
      "completed"
    );
    expect(
      services.sourceAssetRegistry.getAsset("asset-001")?.processingJobRefs
    ).toHaveLength(1);
  });

  test("Flow 3 Content Production requests review through Human Review owner", async () => {
    const services = createServices();
    const coordinator = createMvpIntegrationCoordinator(services);
    await coordinator.runAssetIntakeFlow({
      operationId: "operation-asset-intake",
      sourceId: "source-001",
      sourceUrl: "https://example.test/source",
      assetId: "asset-001",
      evidence: "manual evidence",
      action: manualAction
    });

    const result = await coordinator.runContentProductionFlow({
      operationId: "operation-content",
      assetId: "asset-001",
      briefId: "brief-001",
      contentPackageId: "content-001",
      reviewId: "review-001",
      action: manualAction
    });

    expect(result.status).toBe("completed");
    expect(services.contentProduction.getPackage("content-001")?.status).toBe(
      "ready-for-review"
    );
    expect(
      services.humanReviewApproval.getApprovalStatus("review-001")?.state
    ).toBe("pending");
  });

  test("Flows 4-6 review, publishing, performance, and learning remain owner-routed", async () => {
    const services = createServices();
    const coordinator = createMvpIntegrationCoordinator(services);
    const contentVersionRef = createEntityReference({
      id: "content-001:v1",
      ownerServiceId: "FTV-SVC-03",
      entityType: "ContentVersion"
    });

    const result = await coordinator.runReviewPublishingPerformanceLearningFlow(
      {
        operationId: "operation-learning",
        contentVersionRef,
        reviewId: "review-001",
        publishingPackageId: "publishing-001",
        importId: "import-001",
        metricId: "metric-views",
        factId: "fact-001",
        reportId: "report-001",
        action: manualAction
      }
    );

    expect(result.status).toBe("completed");
    expect(
      services.humanReviewApproval.getApprovalStatus("review-001")?.state
    ).toBe("approved");
    expect(
      services.performanceData.performanceFactReference("fact-001")
        .ownerServiceId
    ).toBe("FTV-SVC-06");
    expect(
      services.analyticsReporting.analyticsReportReference("report-001")
        .ownerServiceId
    ).toBe("FTV-SVC-07");
  });
});

describe("BE-04 failure and ownership controls", () => {
  test("failed command returns failure without hidden mutation", async () => {
    const services = createServices();
    const coordinator = createMvpIntegrationCoordinator(services);

    const result = await coordinator.commandRouter.dispatch(
      createServiceCommand({
        name: "UnknownCommand",
        version: "0.0.1",
        targetOwnerServiceId: "FTV-SVC-02",
        operationId: "operation-failure",
        payload: {}
      })
    );

    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe("FTV-CONTRACT-NO-HANDLER");
    expect(services.mediaProcessing.getJob("job-missing")).toBeUndefined();
  });

  test("failed event handling reports failure for manual recovery", async () => {
    const eventBus = new EventBus();
    eventBus.subscribe("MediaProcessingCompleted", async () => {
      throw new Error("manual recovery needed");
    });

    const result = await eventBus.publish(
      createServiceEvent({
        name: "MediaProcessingCompleted",
        version: "0.0.1",
        producerServiceId: "FTV-SVC-02",
        operationId: "operation-event-failure",
        payload: {}
      })
    );

    expect(result.ok).toBe(false);
    expect(result.errorCode).toBe("FTV-CONTRACT-EVENT-HANDLER-FAILED");
  });

  test("workflow coordinates without owning business state and analytics remains read-oriented", async () => {
    const services = createServices();
    const coordinator = createMvpIntegrationCoordinator(services);
    await coordinator.runReviewPublishingPerformanceLearningFlow({
      operationId: "operation-ownership",
      contentVersionRef: createEntityReference({
        id: "content-001:v1",
        ownerServiceId: "FTV-SVC-03",
        entityType: "ContentVersion"
      }),
      reviewId: "review-001",
      publishingPackageId: "publishing-001",
      importId: "import-001",
      metricId: "metric-views",
      factId: "fact-001",
      reportId: "report-001",
      action: manualAction
    });

    expect(
      services.workflowOrchestration.workflowRunReference(
        "operation-ownership:workflow"
      ).ownerServiceId
    ).toBe("FTV-SVC-08");
    expect(
      services.analyticsReporting.analyticsReportReference("report-001")
        .ownerServiceId
    ).toBe("FTV-SVC-07");
  });
});
