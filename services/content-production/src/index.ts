import { FtvError } from "../../../packages/errors/src/index.js";
import { assertIdentifier, createVerifiedEntityReference, type EntityReference } from "../../../packages/identifiers/src/index.js";

export const CONTENT_PRODUCTION_SERVICE_ID = "FTV-SVC-03" as const;

export type ContentPackageStatus = "draft" | "in-progress" | "ready-for-review" | "archived";

export interface ManualAction {
  readonly actorId: string;
  readonly reason: string;
}

export interface ContentBrief {
  readonly id: string;
  readonly title: string;
  readonly concept: string;
}

export interface ContentVersion {
  readonly id: string;
  readonly packageId: string;
  readonly versionNumber: number;
  readonly snapshot: Readonly<Record<string, string>>;
  readonly note: string;
}

export interface ContentPackage {
  readonly id: string;
  readonly briefId: string;
  readonly assetRefs: readonly EntityReference[];
  readonly status: ContentPackageStatus;
  readonly currentVersionId?: string;
}

export class ContentProductionService {
  readonly serviceId = CONTENT_PRODUCTION_SERVICE_ID;
  private readonly briefs = new Map<string, ContentBrief>();
  private readonly packages = new Map<string, ContentPackage>();
  private readonly versions = new Map<string, ContentVersion>();

  createBrief(id: string, title: string, concept: string, action: ManualAction): ContentBrief {
    requireManualAction(action);
    if (!title || !concept) throw validationError("Content brief requires title and concept.");
    const brief = Object.freeze({ id: assertIdentifier(id, "content brief id"), title, concept });
    this.briefs.set(id, brief);
    return brief;
  }

  createContentPackage(id: string, briefId: string, assetRefs: readonly EntityReference[], action: ManualAction): ContentPackage {
    requireManualAction(action);
    this.requireBrief(briefId);
    if (assetRefs.length === 0) throw validationError("Content package requires at least one asset reference.");
    const contentPackage = Object.freeze({
      id: assertIdentifier(id, "content package id"),
      briefId,
      assetRefs: Object.freeze([...assetRefs]),
      status: "draft" as const
    });
    this.packages.set(id, contentPackage);
    return contentPackage;
  }

  createVersion(packageId: string, snapshot: Readonly<Record<string, string>>, note: string, action: ManualAction): ContentVersion {
    requireManualAction(action);
    const contentPackage = this.requirePackage(packageId);
    const versionNumber = [...this.versions.values()].filter((version) => version.packageId === packageId).length + 1;
    const version = Object.freeze({
      id: `${packageId}:v${versionNumber}`,
      packageId,
      versionNumber,
      snapshot: Object.freeze({ ...snapshot }),
      note
    });
    this.versions.set(version.id, version);
    this.packages.set(packageId, Object.freeze({ ...contentPackage, status: "in-progress" as const, currentVersionId: version.id }));
    return version;
  }

  markReadyForReview(packageId: string, action: ManualAction): ContentPackage {
    requireManualAction(action);
    const contentPackage = this.requirePackage(packageId);
    if (!contentPackage.currentVersionId) throw validationError("Content package requires a version before review.");
    const updated = Object.freeze({ ...contentPackage, status: "ready-for-review" as const });
    this.packages.set(packageId, updated);
    return updated;
  }

  contentVersionReference(versionId: string): EntityReference {
    if (!this.versions.has(versionId)) throw validationError("Content version was not found.");
    return createVerifiedEntityReference({ id: versionId, ownerServiceId: this.serviceId, entityType: "ContentVersion" });
  }

  getPackage(id: string): ContentPackage | undefined {
    return this.packages.get(id);
  }

  private requireBrief(id: string): ContentBrief {
    const brief = this.briefs.get(id);
    if (!brief) throw validationError("Content brief was not found.");
    return brief;
  }

  private requirePackage(id: string): ContentPackage {
    const contentPackage = this.packages.get(id);
    if (!contentPackage) throw validationError("Content package was not found.");
    return contentPackage;
  }
}

function requireManualAction(action: ManualAction): void {
  if (!action.actorId || !action.reason) throw validationError("Manual action requires actorId and reason.");
}

function validationError(message: string): FtvError {
  return new FtvError({ code: "FTV-SVC-03-VALIDATION", category: "validation", message });
}
