import { FtvError } from "../../../packages/errors/src/index.js";
import {
  assertIdentifier,
  assertVerifiedEntityReference,
  createVerifiedEntityReference,
  type EntityReference
} from "../../../packages/identifiers/src/index.js";

export const MEDIA_PROCESSING_SERVICE_ID = "FTV-SVC-02" as const;

export type ProcessingJobStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export interface ManualAction {
  readonly actorId: string;
  readonly reason: string;
}

export interface ProcessingJob {
  readonly id: string;
  readonly assetRef: EntityReference;
  readonly operation: string;
  readonly status: ProcessingJobStatus;
  readonly derivativeRefs: readonly string[];
  readonly metadata: Readonly<Record<string, string>>;
  readonly errorMessage?: string;
}

export class MediaProcessingService {
  readonly serviceId = MEDIA_PROCESSING_SERVICE_ID;
  private readonly jobs = new Map<string, ProcessingJob>();

  createJob(id: string, assetRef: EntityReference, operation: string, action: ManualAction): ProcessingJob {
    requireManualAction(action);
    assertVerifiedEntityReference(assetRef, {
      ownerServiceId: "FTV-SVC-01",
      entityType: "Asset",
      label: "asset reference"
    });
    if (this.jobs.has(id)) throw validationError("Processing job already exists.");
    const job = Object.freeze({
      id: assertIdentifier(id, "processing job id"),
      assetRef,
      operation: assertIdentifier(operation, "processing operation"),
      status: "pending" as const,
      derivativeRefs: Object.freeze([]),
      metadata: Object.freeze({})
    });
    this.jobs.set(id, job);
    return job;
  }

  startJob(id: string, action: ManualAction): ProcessingJob {
    requireManualAction(action);
    const job = this.requireJob(id);
    if (job.status !== "pending") throw validationError("Only pending jobs can start.");
    return this.replaceJob(id, Object.freeze({ ...job, status: "running" as const }));
  }

  completeJob(id: string, derivativeRefs: readonly string[], metadata: Readonly<Record<string, string>>, action: ManualAction): ProcessingJob {
    requireManualAction(action);
    const job = this.requireJob(id);
    if (job.status !== "running") throw validationError("Only running jobs can complete.");
    return this.replaceJob(
      id,
      Object.freeze({
        ...job,
        status: "completed" as const,
        derivativeRefs: Object.freeze([...derivativeRefs]),
        metadata: Object.freeze({ ...metadata })
      })
    );
  }

  failJob(id: string, errorMessage: string, action: ManualAction): ProcessingJob {
    requireManualAction(action);
    const job = this.requireJob(id);
    if (job.status !== "running") throw validationError("Only running jobs can fail.");
    return this.replaceJob(id, Object.freeze({ ...job, status: "failed" as const, errorMessage }));
  }

  processingJobReference(id: string): EntityReference {
    this.requireJob(id);
    return createVerifiedEntityReference({ id, ownerServiceId: this.serviceId, entityType: "MediaProcessingJob" });
  }

  getJob(id: string): ProcessingJob | undefined {
    return this.jobs.get(id);
  }

  private requireJob(id: string): ProcessingJob {
    const job = this.jobs.get(id);
    if (!job) throw validationError("Processing job was not found.");
    return job;
  }

  private replaceJob(id: string, job: ProcessingJob): ProcessingJob {
    this.jobs.set(id, job);
    return job;
  }
}

function requireManualAction(action: ManualAction): void {
  if (!action.actorId || !action.reason) throw validationError("Manual action requires actorId and reason.");
}

function validationError(message: string): FtvError {
  return new FtvError({ code: "FTV-SVC-02-VALIDATION", category: "validation", message });
}
