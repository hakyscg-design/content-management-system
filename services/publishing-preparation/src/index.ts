import { FtvError } from "../../../packages/errors/src/index.js";
import {
  assertIdentifier,
  assertVerifiedEntityReference,
  createVerifiedEntityReference,
  type EntityReference
} from "../../../packages/identifiers/src/index.js";

export const PUBLISHING_PREPARATION_SERVICE_ID = "FTV-SVC-04" as const;

export type PublishingPackageStatus = "preparing" | "ready" | "completed" | "blocked" | "cancelled";

export interface ManualAction {
  readonly actorId: string;
  readonly reason: string;
}

export interface PublishingChecklist {
  readonly metadataReviewed: boolean;
  readonly rightsReviewed: boolean;
  readonly approvalConfirmed: boolean;
  readonly exportPrepared: boolean;
}

export interface PublishingPackage {
  readonly id: string;
  readonly contentVersionRef: EntityReference;
  readonly approvalStatusRef: EntityReference;
  readonly metadata: Readonly<Record<string, string>>;
  readonly checklist: PublishingChecklist;
  readonly status: PublishingPackageStatus;
  readonly manualPublishingReference?: string;
}

interface ApprovalGateReference extends EntityReference {
  readonly approvalState?: string;
  readonly targetRef?: EntityReference;
}

const emptyChecklist: PublishingChecklist = Object.freeze({
  metadataReviewed: false,
  rightsReviewed: false,
  approvalConfirmed: false,
  exportPrepared: false
});

export class PublishingPreparationService {
  readonly serviceId = PUBLISHING_PREPARATION_SERVICE_ID;
  private readonly packages = new Map<string, PublishingPackage>();

  createPublishingPackage(input: {
    readonly id: string;
    readonly contentVersionRef: EntityReference;
    readonly approvalStatusRef: EntityReference;
    readonly metadata: Readonly<Record<string, string>>;
    readonly action: ManualAction;
  }): PublishingPackage {
    requireManualAction(input.action);
    if (input.contentVersionRef.ownerServiceId !== "FTV-SVC-03") throw validationError("Publishing package must reference content owned by FTV-SVC-03.");
    assertApprovedApprovalReference(input.approvalStatusRef, input.contentVersionRef);
    if (this.packages.has(input.id)) throw validationError("Publishing package already exists.");
    const publishingPackage = Object.freeze({
      id: assertIdentifier(input.id, "publishing package id"),
      contentVersionRef: input.contentVersionRef,
      approvalStatusRef: input.approvalStatusRef,
      metadata: Object.freeze({ ...input.metadata }),
      checklist: emptyChecklist,
      status: "preparing" as const
    });
    this.packages.set(publishingPackage.id, publishingPackage);
    return publishingPackage;
  }

  updateChecklist(id: string, checklist: PublishingChecklist, action: ManualAction): PublishingPackage {
    requireManualAction(action);
    const publishingPackage = this.requirePackage(id);
    const updated = Object.freeze({ ...publishingPackage, checklist: Object.freeze({ ...checklist }) });
    this.packages.set(id, updated);
    return updated;
  }

  markReady(id: string, action: ManualAction): PublishingPackage {
    requireManualAction(action);
    const publishingPackage = this.requirePackage(id);
    assertApprovedApprovalReference(publishingPackage.approvalStatusRef, publishingPackage.contentVersionRef);
    if (!Object.values(publishingPackage.checklist).every(Boolean)) {
      throw validationError("Publishing checklist must be complete before ready state.");
    }
    const updated = Object.freeze({ ...publishingPackage, status: "ready" as const });
    this.packages.set(id, updated);
    return updated;
  }

  recordManualPublishingComplete(id: string, manualPublishingReference: string, action: ManualAction): PublishingPackage {
    requireManualAction(action);
    const publishingPackage = this.requirePackage(id);
    assertApprovedApprovalReference(publishingPackage.approvalStatusRef, publishingPackage.contentVersionRef);
    if (publishingPackage.status !== "ready") throw validationError("Publishing package must be ready before completion.");
    const updated = Object.freeze({ ...publishingPackage, status: "completed" as const, manualPublishingReference });
    this.packages.set(id, updated);
    return updated;
  }

  publishingPackageReference(id: string): EntityReference {
    this.requirePackage(id);
    return createVerifiedEntityReference({ id, ownerServiceId: this.serviceId, entityType: "PublishingPackage" });
  }

  getPackage(id: string): PublishingPackage | undefined {
    return this.packages.get(id);
  }

  private requirePackage(id: string): PublishingPackage {
    const publishingPackage = this.packages.get(id);
    if (!publishingPackage) throw validationError("Publishing package was not found.");
    return publishingPackage;
  }
}

function requireManualAction(action: ManualAction): void {
  if (!action.actorId || !action.reason) throw validationError("Manual action requires actorId and reason.");
}

function validationError(message: string): FtvError {
  return new FtvError({ code: "FTV-SVC-04-VALIDATION", category: "validation", message });
}

function assertApprovedApprovalReference(approvalStatusRef: EntityReference, contentVersionRef: EntityReference): void {
  const approvalReference = assertVerifiedEntityReference(approvalStatusRef, {
    ownerServiceId: "FTV-SVC-05",
    entityType: "ApprovalStatus",
    label: "approval status reference"
  }) as ApprovalGateReference;

  if (approvalReference.approvalState !== "approved" && approvalReference.approvalState !== "override-approved") {
    throw validationError("Publishing requires an approved approval status reference.");
  }

  if (approvalReference.targetRef?.id !== contentVersionRef.id || approvalReference.targetRef.ownerServiceId !== contentVersionRef.ownerServiceId) {
    throw validationError("Approval status reference must approve the publishing content version.");
  }
}
