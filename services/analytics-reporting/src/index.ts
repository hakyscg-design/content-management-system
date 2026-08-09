import { FtvError } from "../../../packages/errors/src/index.js";
import {
  assertIdentifier,
  assertVerifiedEntityReference,
  createVerifiedEntityReference,
  type EntityReference
} from "../../../packages/identifiers/src/index.js";

export const ANALYTICS_REPORTING_SERVICE_ID = "FTV-SVC-07" as const;

export interface ManualAction {
  readonly actorId: string;
  readonly reason: string;
}

export interface AnalyticsReport {
  readonly id: string;
  readonly title: string;
  readonly performanceFactRefs: readonly EntityReference[];
  readonly narrative: string;
}

export interface LearningSummary {
  readonly id: string;
  readonly reportId: string;
  readonly summary: string;
}

export class AnalyticsReportingService {
  readonly serviceId = ANALYTICS_REPORTING_SERVICE_ID;
  private readonly reports = new Map<string, AnalyticsReport>();
  private readonly learningSummaries = new Map<string, LearningSummary>();

  createReport(id: string, title: string, performanceFactRefs: readonly EntityReference[], narrative: string, action: ManualAction): AnalyticsReport {
    requireManualAction(action);
    for (const ref of performanceFactRefs) {
      assertVerifiedEntityReference(ref, {
        ownerServiceId: "FTV-SVC-06",
        entityType: "PerformanceFact",
        label: "performance fact reference"
      });
    }
    if (this.reports.has(id)) throw validationError("Analytics report already exists.");
    const report = Object.freeze({
      id: assertIdentifier(id, "analytics report id"),
      title,
      performanceFactRefs: Object.freeze([...performanceFactRefs]),
      narrative
    });
    this.reports.set(id, report);
    return report;
  }

  recordLearningSummary(id: string, reportId: string, summary: string, action: ManualAction): LearningSummary {
    requireManualAction(action);
    if (!this.reports.has(reportId)) throw validationError("Analytics report was not found.");
    if (this.learningSummaries.has(id)) throw validationError("Learning summary already exists.");
    const learningSummary = Object.freeze({ id: assertIdentifier(id, "learning summary id"), reportId, summary });
    this.learningSummaries.set(id, learningSummary);
    return learningSummary;
  }

  analyticsReportReference(id: string): EntityReference {
    if (!this.reports.has(id)) throw validationError("Analytics report was not found.");
    return createVerifiedEntityReference({ id, ownerServiceId: this.serviceId, entityType: "AnalyticsReport" });
  }

  getReport(id: string): AnalyticsReport | undefined {
    return this.reports.get(id);
  }
}

function requireManualAction(action: ManualAction): void {
  if (!action.actorId || !action.reason) throw validationError("Manual action requires actorId and reason.");
}

function validationError(message: string): FtvError {
  return new FtvError({ code: "FTV-SVC-07-VALIDATION", category: "validation", message });
}
