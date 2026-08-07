import { FtvError } from "../../../packages/errors/src/index.js";
import {
  assertIdentifier,
  assertVerifiedEntityReference,
  createVerifiedEntityReference,
  type EntityReference
} from "../../../packages/identifiers/src/index.js";

export const PERFORMANCE_DATA_SERVICE_ID = "FTV-SVC-06" as const;

export type PerformanceImportStatus = "staged" | "imported" | "failed";

export interface ManualAction {
  readonly actorId: string;
  readonly reason: string;
}

export interface MetricDefinition {
  readonly id: string;
  readonly name: string;
  readonly unit: string;
}

export interface PerformanceImport {
  readonly id: string;
  readonly source: string;
  readonly publishingPackageRef: EntityReference;
  readonly status: PerformanceImportStatus;
}

export interface PerformanceFact {
  readonly id: string;
  readonly importId: string;
  readonly metricDefinitionId: string;
  readonly value: number;
  readonly observedForRef: EntityReference;
}

export class PerformanceDataService {
  readonly serviceId = PERFORMANCE_DATA_SERVICE_ID;
  private readonly metricDefinitions = new Map<string, MetricDefinition>();
  private readonly imports = new Map<string, PerformanceImport>();
  private readonly facts = new Map<string, PerformanceFact>();

  defineMetric(id: string, name: string, unit: string, action: ManualAction): MetricDefinition {
    requireManualAction(action);
    if (this.metricDefinitions.has(id)) throw validationError("Metric definition already exists.");
    const metric = Object.freeze({ id: assertIdentifier(id, "metric definition id"), name, unit });
    this.metricDefinitions.set(id, metric);
    return metric;
  }

  stageImport(id: string, source: string, publishingPackageRef: EntityReference, action: ManualAction): PerformanceImport {
    requireManualAction(action);
    assertVerifiedEntityReference(publishingPackageRef, {
      ownerServiceId: "FTV-SVC-04",
      entityType: "PublishingPackage",
      label: "publishing package reference"
    });
    if (this.imports.has(id)) throw validationError("Performance import already exists.");
    const stagedImport = Object.freeze({
      id: assertIdentifier(id, "performance import id"),
      source: assertIdentifier(source, "performance source"),
      publishingPackageRef,
      status: "staged" as const
    });
    this.imports.set(id, stagedImport);
    return stagedImport;
  }

  recordFact(id: string, importId: string, metricDefinitionId: string, value: number, observedForRef: EntityReference, action: ManualAction): PerformanceFact {
    requireManualAction(action);
    this.requireImport(importId);
    if (!this.metricDefinitions.has(metricDefinitionId)) throw validationError("Metric definition was not found.");
    if (this.facts.has(id)) throw validationError("Performance fact already exists.");
    const fact = Object.freeze({ id: assertIdentifier(id, "performance fact id"), importId, metricDefinitionId, value, observedForRef });
    this.facts.set(id, fact);
    return fact;
  }

  completeImport(id: string, action: ManualAction): PerformanceImport {
    requireManualAction(action);
    const stagedImport = this.requireImport(id);
    const completed = Object.freeze({ ...stagedImport, status: "imported" as const });
    this.imports.set(id, completed);
    return completed;
  }

  performanceFactReference(id: string): EntityReference {
    if (!this.facts.has(id)) throw validationError("Performance fact was not found.");
    return createVerifiedEntityReference({ id, ownerServiceId: this.serviceId, entityType: "PerformanceFact" });
  }

  private requireImport(id: string): PerformanceImport {
    const stagedImport = this.imports.get(id);
    if (!stagedImport) throw validationError("Performance import was not found.");
    return stagedImport;
  }
}

function requireManualAction(action: ManualAction): void {
  if (!action.actorId || !action.reason) throw validationError("Manual action requires actorId and reason.");
}

function validationError(message: string): FtvError {
  return new FtvError({ code: "FTV-SVC-06-VALIDATION", category: "validation", message });
}
