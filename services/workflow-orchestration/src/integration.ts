import {
  CommandRouter,
  EventBus,
  createServiceCommand,
  createServiceEvent,
  type ServiceEvent
} from "../../../packages/contracts/src/index.js";
import { type EntityReference } from "../../../packages/identifiers/src/index.js";
import { AnalyticsReportingService } from "../../analytics-reporting/src/index.js";
import { ContentProductionService } from "../../content-production/src/index.js";
import { GovernanceRuleService } from "../../governance-rule/src/index.js";
import { HumanReviewApprovalService } from "../../human-review-approval/src/index.js";
import { MediaProcessingService } from "../../media-processing/src/index.js";
import { PerformanceDataService } from "../../performance-data/src/index.js";
import { PublishingPreparationService } from "../../publishing-preparation/src/index.js";
import { SourceAssetRegistryService } from "../../source-asset-registry/src/index.js";
import { WorkflowOrchestrationService, type ManualAction } from "./index.js";

export const BE04_CONTRACT_VERSION = "0.0.1" as const;

export interface IntegrationServices {
  readonly sourceAssetRegistry: SourceAssetRegistryService;
  readonly mediaProcessing: MediaProcessingService;
  readonly contentProduction: ContentProductionService;
  readonly publishingPreparation: PublishingPreparationService;
  readonly humanReviewApproval: HumanReviewApprovalService;
  readonly performanceData: PerformanceDataService;
  readonly analyticsReporting: AnalyticsReportingService;
  readonly workflowOrchestration: WorkflowOrchestrationService;
  readonly governanceRule: GovernanceRuleService;
}

export interface FlowResult {
  readonly operationId: string;
  readonly workflowRunId: string;
  readonly status: "completed" | "failed" | "manual-recovery-required";
  readonly events: readonly string[];
  readonly errorCode?: string;
}

export class MvpIntegrationCoordinator {
  readonly commandRouter = new CommandRouter();
  readonly eventBus = new EventBus();

  constructor(private readonly services: IntegrationServices) {
    this.registerCommandHandlers();
    this.registerEventHandlers();
  }

  async runAssetIntakeFlow(input: {
    readonly operationId: string;
    readonly sourceId: string;
    readonly sourceUrl: string;
    readonly assetId: string;
    readonly evidence: string;
    readonly action: ManualAction;
  }): Promise<FlowResult> {
    const workflow = this.services.workflowOrchestration.startRun(`${input.operationId}:workflow`, [], input.action);

    try {
      const source = this.services.sourceAssetRegistry.captureSource(input.sourceId, input.sourceUrl, input.action);
      this.services.sourceAssetRegistry.approveSource(source.id, input.action);
      const asset = this.services.sourceAssetRegistry.registerAsset({
        id: input.assetId,
        sourceReferenceId: source.id,
        evidence: input.evidence,
        action: input.action
      });
      this.services.sourceAssetRegistry.updateRightsStatus(asset.id, "approved", input.action);
      this.services.sourceAssetRegistry.markAssetReady(asset.id, input.action);
      await this.eventBus.publish(
        createServiceEvent({
          name: "AssetRegistered",
          version: BE04_CONTRACT_VERSION,
          producerServiceId: "FTV-SVC-01",
          operationId: input.operationId,
          payload: { assetRef: this.services.sourceAssetRegistry.assetReference(asset.id) }
        })
      );
      this.services.workflowOrchestration.completeRun(workflow.id, input.action);
      return this.success(input.operationId, workflow.id);
    } catch (error) {
      return this.failure(input.operationId, workflow.id, input.action, error);
    }
  }

  async runMediaProcessingFlow(input: {
    readonly operationId: string;
    readonly assetId: string;
    readonly processingJobId: string;
    readonly action: ManualAction;
  }): Promise<FlowResult> {
    const assetRef = this.services.sourceAssetRegistry.assetReference(input.assetId);
    const workflow = this.services.workflowOrchestration.startRun(`${input.operationId}:workflow`, [assetRef], input.action);

    try {
      const commandResult = await this.commandRouter.dispatch<{ assetRef: EntityReference; processingJobId: string }, EntityReference>(
        createServiceCommand({
          name: "CreateProcessingJob",
          version: BE04_CONTRACT_VERSION,
          targetOwnerServiceId: "FTV-SVC-02",
          operationId: input.operationId,
          payload: { assetRef, processingJobId: input.processingJobId }
        })
      );
      if (!commandResult.ok || !commandResult.payload) return this.manualRecovery(input.operationId, workflow.id, commandResult.errorCode);

      this.services.mediaProcessing.startJob(input.processingJobId, input.action);
      this.services.mediaProcessing.completeJob(input.processingJobId, ["manual-derivative-ref"], { source: "manual" }, input.action);

      await this.eventBus.publish(
        createServiceEvent({
          name: "MediaProcessingCompleted",
          version: BE04_CONTRACT_VERSION,
          producerServiceId: "FTV-SVC-02",
          operationId: input.operationId,
          payload: { assetId: input.assetId, processingJobRef: commandResult.payload }
        })
      );
      this.services.workflowOrchestration.completeRun(workflow.id, input.action);
      return this.success(input.operationId, workflow.id);
    } catch (error) {
      return this.failure(input.operationId, workflow.id, input.action, error);
    }
  }

  async runContentProductionFlow(input: {
    readonly operationId: string;
    readonly assetId: string;
    readonly briefId: string;
    readonly contentPackageId: string;
    readonly reviewId: string;
    readonly action: ManualAction;
  }): Promise<FlowResult> {
    const assetRef = this.services.sourceAssetRegistry.assetReference(input.assetId);
    const workflow = this.services.workflowOrchestration.startRun(`${input.operationId}:workflow`, [assetRef], input.action);

    try {
      this.services.contentProduction.createBrief(input.briefId, "Manual brief", "Manual content production", input.action);
      const contentPackage = this.services.contentProduction.createContentPackage(input.contentPackageId, input.briefId, [assetRef], input.action);
      const version = this.services.contentProduction.createVersion(contentPackage.id, { caption: "Manual caption" }, "manual version", input.action);
      this.services.contentProduction.markReadyForReview(contentPackage.id, input.action);
      const versionRef = this.services.contentProduction.contentVersionReference(version.id);
      await this.commandRouter.dispatch(
        createServiceCommand({
          name: "RequestReview",
          version: BE04_CONTRACT_VERSION,
          targetOwnerServiceId: "FTV-SVC-05",
          operationId: input.operationId,
          payload: { reviewId: input.reviewId, targetRef: versionRef }
        })
      );
      this.services.workflowOrchestration.completeRun(workflow.id, input.action);
      return this.success(input.operationId, workflow.id);
    } catch (error) {
      return this.failure(input.operationId, workflow.id, input.action, error);
    }
  }

  async runReviewPublishingPerformanceLearningFlow(input: {
    readonly operationId: string;
    readonly contentVersionRef: EntityReference;
    readonly reviewId: string;
    readonly publishingPackageId: string;
    readonly importId: string;
    readonly metricId: string;
    readonly factId: string;
    readonly reportId: string;
    readonly action: ManualAction;
  }): Promise<FlowResult> {
    const workflow = this.services.workflowOrchestration.startRun(`${input.operationId}:workflow`, [input.contentVersionRef], input.action);

    try {
      this.services.humanReviewApproval.requestReview(input.reviewId, input.contentVersionRef, input.action);
      this.services.humanReviewApproval.assignReviewer(input.reviewId, input.action.actorId, input.action);
      this.services.humanReviewApproval.recordDecision(input.reviewId, "approved", input.action);
      const approvalStatusRef = this.services.humanReviewApproval.approvalStatusReference(input.reviewId);

      this.services.publishingPreparation.createPublishingPackage({
        id: input.publishingPackageId,
        contentVersionRef: input.contentVersionRef,
        approvalStatusRef,
        metadata: { destination: "manual" },
        action: input.action
      });
      this.services.publishingPreparation.updateChecklist(
        input.publishingPackageId,
        { metadataReviewed: true, rightsReviewed: true, approvalConfirmed: true, exportPrepared: true },
        input.action
      );
      this.services.publishingPreparation.markReady(input.publishingPackageId, input.action);
      this.services.publishingPreparation.recordManualPublishingComplete(input.publishingPackageId, "manual-publish-ref", input.action);
      const publishingRef = this.services.publishingPreparation.publishingPackageReference(input.publishingPackageId);

      this.services.performanceData.defineMetric(input.metricId, "Views", "count", input.action);
      this.services.performanceData.stageImport(input.importId, "manual-csv", publishingRef, input.action);
      this.services.performanceData.recordFact(input.factId, input.importId, input.metricId, 1, publishingRef, input.action);
      this.services.performanceData.completeImport(input.importId, input.action);
      const factRef = this.services.performanceData.performanceFactReference(input.factId);

      this.services.analyticsReporting.createReport(input.reportId, "Manual report", [factRef], "Manual learning narrative", input.action);
      this.services.workflowOrchestration.completeRun(workflow.id, input.action);
      return this.success(input.operationId, workflow.id);
    } catch (error) {
      return this.failure(input.operationId, workflow.id, input.action, error);
    }
  }

  private registerCommandHandlers(): void {
    this.commandRouter.register<{ assetRef: EntityReference; processingJobId: string }, EntityReference>(
      "CreateProcessingJob",
      "FTV-SVC-02",
      async (command) => {
        this.services.mediaProcessing.createJob(command.payload.processingJobId, command.payload.assetRef, "manual-processing", {
          actorId: "integration",
          reason: "owner-routed command"
        });
        return this.services.mediaProcessing.processingJobReference(command.payload.processingJobId);
      }
    );

    this.commandRouter.register<{ reviewId: string; targetRef: EntityReference }, EntityReference>("RequestReview", "FTV-SVC-05", async (command) => {
      this.services.humanReviewApproval.requestReview(command.payload.reviewId, command.payload.targetRef, {
        actorId: "integration",
        reason: "owner-routed command"
      });
      return this.services.humanReviewApproval.approvalStatusReference(command.payload.reviewId);
    });
  }

  private registerEventHandlers(): void {
    this.eventBus.subscribe<{ assetId: string; processingJobRef: EntityReference }>("MediaProcessingCompleted", async (event) => {
      this.services.sourceAssetRegistry.recordProcessingReference(event.payload.assetId, event.payload.processingJobRef, {
        actorId: "integration",
        reason: "owner-handled media processing completion event"
      });
    });
  }

  private success(operationId: string, workflowRunId: string): FlowResult {
    return Object.freeze({
      operationId,
      workflowRunId,
      status: "completed" as const,
      events: this.eventsFor(operationId)
    });
  }

  private failure(operationId: string, workflowRunId: string, action: ManualAction, error: unknown): FlowResult {
    this.services.workflowOrchestration.failRun(workflowRunId, error instanceof Error ? error.message : "Unknown integration failure.", action);
    return this.manualRecovery(operationId, workflowRunId, "FTV-INTEGRATION-FLOW-FAILED");
  }

  private manualRecovery(operationId: string, workflowRunId: string, errorCode?: string): FlowResult {
    return Object.freeze({
      operationId,
      workflowRunId,
      status: "manual-recovery-required" as const,
      events: this.eventsFor(operationId),
      ...(errorCode ? { errorCode } : {})
    });
  }

  private eventsFor(operationId: string): readonly string[] {
    return Object.freeze(
      this.eventBus.publishedEvents.filter((event: ServiceEvent<unknown>) => event.operationId === operationId).map((event) => event.name)
    );
  }
}

export function createMvpIntegrationCoordinator(services: IntegrationServices): MvpIntegrationCoordinator {
  return new MvpIntegrationCoordinator(services);
}
