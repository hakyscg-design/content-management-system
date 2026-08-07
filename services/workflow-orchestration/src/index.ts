import { FtvError } from "../../../packages/errors/src/index.js";
import { assertIdentifier, createEntityReference, type EntityReference } from "../../../packages/identifiers/src/index.js";

export const WORKFLOW_ORCHESTRATION_SERVICE_ID = "FTV-SVC-08" as const;

export type WorkflowRunStatus = "started" | "step-completed" | "completed" | "failed" | "cancelled";

export interface ManualAction {
  readonly actorId: string;
  readonly reason: string;
}

export interface WorkflowRun {
  readonly id: string;
  readonly triggerType: "manual" | "scheduled-candidate";
  readonly targetRefs: readonly EntityReference[];
  readonly status: WorkflowRunStatus;
  readonly completedSteps: readonly string[];
  readonly errorMessage?: string;
}

export class WorkflowOrchestrationService {
  readonly serviceId = WORKFLOW_ORCHESTRATION_SERVICE_ID;
  private readonly runs = new Map<string, WorkflowRun>();

  startRun(id: string, targetRefs: readonly EntityReference[], action: ManualAction, triggerType: WorkflowRun["triggerType"] = "manual"): WorkflowRun {
    requireManualAction(action);
    const run = Object.freeze({
      id: assertIdentifier(id, "workflow run id"),
      triggerType,
      targetRefs: Object.freeze([...targetRefs]),
      status: "started" as const,
      completedSteps: Object.freeze([])
    });
    this.runs.set(id, run);
    return run;
  }

  recordStepCompleted(id: string, stepName: string, action: ManualAction): WorkflowRun {
    requireManualAction(action);
    const run = this.requireRun(id);
    return this.replaceRun(
      id,
      Object.freeze({
        ...run,
        status: "step-completed" as const,
        completedSteps: Object.freeze([...run.completedSteps, assertIdentifier(stepName, "workflow step")])
      })
    );
  }

  completeRun(id: string, action: ManualAction): WorkflowRun {
    requireManualAction(action);
    const run = this.requireRun(id);
    return this.replaceRun(id, Object.freeze({ ...run, status: "completed" as const }));
  }

  failRun(id: string, errorMessage: string, action: ManualAction): WorkflowRun {
    requireManualAction(action);
    const run = this.requireRun(id);
    return this.replaceRun(id, Object.freeze({ ...run, status: "failed" as const, errorMessage }));
  }

  workflowRunReference(id: string): EntityReference {
    this.requireRun(id);
    return createEntityReference({ id, ownerServiceId: this.serviceId, entityType: "WorkflowRun" });
  }

  private requireRun(id: string): WorkflowRun {
    const run = this.runs.get(id);
    if (!run) throw validationError("Workflow run was not found.");
    return run;
  }

  private replaceRun(id: string, run: WorkflowRun): WorkflowRun {
    this.runs.set(id, run);
    return run;
  }
}

function requireManualAction(action: ManualAction): void {
  if (!action.actorId || !action.reason) throw validationError("Manual action requires actorId and reason.");
}

function validationError(message: string): FtvError {
  return new FtvError({ code: "FTV-SVC-08-VALIDATION", category: "validation", message });
}
