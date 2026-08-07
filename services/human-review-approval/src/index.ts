import { FtvError } from "../../../packages/errors/src/index.js";
import {
  assertIdentifier,
  createVerifiedEntityReference,
  type EntityReference,
  type VerifiedEntityReference
} from "../../../packages/identifiers/src/index.js";

export const HUMAN_REVIEW_APPROVAL_SERVICE_ID = "FTV-SVC-05" as const;

export type ReviewAssignmentStatus = "requested" | "assigned" | "decided" | "cancelled";
export type ReviewDecisionType = "approved" | "rejected" | "returned" | "override-approved";

export interface ManualAction {
  readonly actorId: string;
  readonly reason: string;
}

export interface ReviewAssignment {
  readonly id: string;
  readonly targetRef: EntityReference;
  readonly status: ReviewAssignmentStatus;
  readonly reviewerId?: string;
}

export interface ReviewDecision {
  readonly id: string;
  readonly assignmentId: string;
  readonly decision: ReviewDecisionType;
  readonly reason: string;
  readonly reviewerId: string;
}

export interface ApprovalStatus {
  readonly id: string;
  readonly targetRef: EntityReference;
  readonly state: ReviewDecisionType | "pending";
}

export interface ApprovalStatusReference extends VerifiedEntityReference {
  readonly approvalState: ReviewDecisionType | "pending";
  readonly targetRef: EntityReference;
}

export class HumanReviewApprovalService {
  readonly serviceId = HUMAN_REVIEW_APPROVAL_SERVICE_ID;
  private readonly assignments = new Map<string, ReviewAssignment>();
  private readonly decisions = new Map<string, ReviewDecision>();
  private readonly approvals = new Map<string, ApprovalStatus>();

  requestReview(id: string, targetRef: EntityReference, action: ManualAction): ReviewAssignment {
    requireManualAction(action);
    if (targetRef.ownerServiceId === this.serviceId) throw validationError("Review target must be owned by another service.");
    const assignment = Object.freeze({ id: assertIdentifier(id, "review assignment id"), targetRef, status: "requested" as const });
    const approval = Object.freeze({ id: `${id}:approval`, targetRef, state: "pending" as const });
    this.assignments.set(id, assignment);
    this.approvals.set(approval.id, approval);
    return assignment;
  }

  assignReviewer(id: string, reviewerId: string, action: ManualAction): ReviewAssignment {
    requireManualAction(action);
    const assignment = this.requireAssignment(id);
    if (assignment.status !== "requested") throw validationError("Only requested reviews can be assigned.");
    const updated = Object.freeze({ ...assignment, status: "assigned" as const, reviewerId });
    this.assignments.set(id, updated);
    return updated;
  }

  recordDecision(assignmentId: string, decision: ReviewDecisionType, action: ManualAction): ReviewDecision {
    requireManualAction(action);
    const assignment = this.requireAssignment(assignmentId);
    const reviewerId = assignment.reviewerId ?? action.actorId;
    const reviewDecision = Object.freeze({
      id: `${assignmentId}:decision`,
      assignmentId,
      decision,
      reason: action.reason,
      reviewerId
    });
    this.decisions.set(reviewDecision.id, reviewDecision);
    this.assignments.set(assignmentId, Object.freeze({ ...assignment, status: "decided" as const, reviewerId }));
    this.approvals.set(`${assignmentId}:approval`, Object.freeze({ id: `${assignmentId}:approval`, targetRef: assignment.targetRef, state: decision }));
    return reviewDecision;
  }

  approvalStatusReference(assignmentId: string): ApprovalStatusReference {
    const id = `${assignmentId}:approval`;
    const approvalStatus = this.approvals.get(id);
    if (!approvalStatus) throw validationError("Approval status was not found.");
    return Object.freeze({
      ...createVerifiedEntityReference({ id, ownerServiceId: this.serviceId, entityType: "ApprovalStatus" }),
      approvalState: approvalStatus.state,
      targetRef: approvalStatus.targetRef
    });
  }

  getApprovalStatus(assignmentId: string): ApprovalStatus | undefined {
    return this.approvals.get(`${assignmentId}:approval`);
  }

  private requireAssignment(id: string): ReviewAssignment {
    const assignment = this.assignments.get(id);
    if (!assignment) throw validationError("Review assignment was not found.");
    return assignment;
  }
}

function requireManualAction(action: ManualAction): void {
  if (!action.actorId || !action.reason) throw validationError("Manual action requires actorId and reason.");
}

function validationError(message: string): FtvError {
  return new FtvError({ code: "FTV-SVC-05-VALIDATION", category: "validation", message });
}
