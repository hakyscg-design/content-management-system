import { createAuditRecord, type AuditRecordDraft, type AuditRecord } from "../../../packages/audit/src/index.js";
import { FtvError } from "../../../packages/errors/src/index.js";
import { assertIdentifier, createEntityReference, type EntityReference } from "../../../packages/identifiers/src/index.js";

export const GOVERNANCE_RULE_SERVICE_ID = "FTV-SVC-09" as const;

export interface ManualAction {
  readonly actorId: string;
  readonly reason: string;
}

export interface UserRole {
  readonly id: string;
  readonly userId: string;
  readonly role: string;
}

export interface AuthorizationRelation {
  readonly id: string;
  readonly subjectId: string;
  readonly action: string;
  readonly targetRef: EntityReference;
}

export interface RuleEvaluation {
  readonly id: string;
  readonly allowed: boolean;
  readonly reason: string;
  readonly targetRef: EntityReference;
}

export class GovernanceRuleService {
  readonly serviceId = GOVERNANCE_RULE_SERVICE_ID;
  private readonly roles = new Map<string, UserRole>();
  private readonly relations = new Map<string, AuthorizationRelation>();
  private readonly evaluations = new Map<string, RuleEvaluation>();
  private readonly auditEvents = new Map<string, AuditRecord>();

  assignRole(id: string, userId: string, role: string, action: ManualAction): UserRole {
    requireManualAction(action);
    const userRole = Object.freeze({ id: assertIdentifier(id, "user role id"), userId, role });
    this.roles.set(id, userRole);
    return userRole;
  }

  addAuthorizationRelation(id: string, subjectId: string, relationAction: string, targetRef: EntityReference, action: ManualAction): AuthorizationRelation {
    requireManualAction(action);
    const relation = Object.freeze({
      id: assertIdentifier(id, "authorization relation id"),
      subjectId,
      action: relationAction,
      targetRef
    });
    this.relations.set(id, relation);
    return relation;
  }

  evaluateRule(id: string, subjectId: string, relationAction: string, targetRef: EntityReference, action: ManualAction): RuleEvaluation {
    requireManualAction(action);
    const allowed = [...this.relations.values()].some(
      (relation) => relation.subjectId === subjectId && relation.action === relationAction && relation.targetRef.id === targetRef.id
    );
    const evaluation = Object.freeze({
      id: assertIdentifier(id, "rule evaluation id"),
      allowed,
      reason: allowed ? "Matching authorization relation found." : "No matching authorization relation found.",
      targetRef
    });
    this.evaluations.set(id, evaluation);
    return evaluation;
  }

  recordAuditEvent(id: string, draft: AuditRecordDraft, action: ManualAction): AuditRecord {
    requireManualAction(action);
    const record = createAuditRecord(draft);
    this.auditEvents.set(assertIdentifier(id, "audit event id"), record);
    return record;
  }

  ruleEvaluationReference(id: string): EntityReference {
    if (!this.evaluations.has(id)) throw validationError("Rule evaluation was not found.");
    return createEntityReference({ id, ownerServiceId: this.serviceId, entityType: "RuleEvaluation" });
  }
}

function requireManualAction(action: ManualAction): void {
  if (!action.actorId || !action.reason) throw validationError("Manual action requires actorId and reason.");
}

function validationError(message: string): FtvError {
  return new FtvError({ code: "FTV-SVC-09-VALIDATION", category: "validation", message });
}
