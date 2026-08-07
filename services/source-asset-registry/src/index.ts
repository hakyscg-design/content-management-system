import { FtvError } from "../../../packages/errors/src/index.js";
import { assertIdentifier, createVerifiedEntityReference, type EntityReference } from "../../../packages/identifiers/src/index.js";

export const SOURCE_ASSET_REGISTRY_SERVICE_ID = "FTV-SVC-01" as const;

export type SourceStatus = "captured" | "approved" | "rejected";
export type RightsStatus = "unknown" | "pending" | "approved" | "restricted" | "rejected";
export type AssetStatus = "registered" | "ready" | "blocked" | "archived";
export type DuplicateMatchStatus = "candidate" | "confirmed" | "dismissed";

export interface ManualAction {
  readonly actorId: string;
  readonly reason: string;
}

export interface SourceReference {
  readonly id: string;
  readonly url: string;
  readonly status: SourceStatus;
  readonly manualNote?: string;
}

export interface AssetRecord {
  readonly id: string;
  readonly sourceReferenceId: string;
  readonly status: AssetStatus;
  readonly rightsStatus: RightsStatus;
  readonly metadata: Readonly<Record<string, string>>;
  readonly processingJobRefs: readonly EntityReference[];
}

export interface ProvenanceRecord {
  readonly id: string;
  readonly assetId: string;
  readonly evidence: string;
}

export interface DuplicateMatchRecord {
  readonly id: string;
  readonly assetId: string;
  readonly candidateAssetId: string;
  readonly status: DuplicateMatchStatus;
  readonly reason?: string;
}

export class SourceAssetRegistryService {
  readonly serviceId = SOURCE_ASSET_REGISTRY_SERVICE_ID;
  private readonly sources = new Map<string, SourceReference>();
  private readonly assets = new Map<string, AssetRecord>();
  private readonly provenance = new Map<string, ProvenanceRecord>();
  private readonly duplicateMatches = new Map<string, DuplicateMatchRecord>();

  captureSource(id: string, url: string, action: ManualAction): SourceReference {
    requireManualAction(action);
    assertIdentifier(id, "source reference id");
    if (!url) throw validationError("Source URL is required.");
    if (this.sources.has(id)) throw conflictError("Source reference already exists.");

    const source = Object.freeze({ id, url, status: "captured" as const, manualNote: action.reason });
    this.sources.set(id, source);
    return source;
  }

  approveSource(id: string, action: ManualAction): SourceReference {
    requireManualAction(action);
    const source = this.requireSource(id);
    const approved = Object.freeze({ ...source, status: "approved" as const, manualNote: action.reason });
    this.sources.set(id, approved);
    return approved;
  }

  registerAsset(input: {
    readonly id: string;
    readonly sourceReferenceId: string;
    readonly metadata?: Readonly<Record<string, string>>;
    readonly evidence: string;
    readonly action: ManualAction;
  }): AssetRecord {
    requireManualAction(input.action);
    assertIdentifier(input.id, "asset id");
    const source = this.requireSource(input.sourceReferenceId);
    if (source.status !== "approved") throw validationError("Source must be approved before asset registration.");
    if (this.assets.has(input.id)) throw conflictError("Asset already exists.");

    const asset = Object.freeze({
      id: input.id,
      sourceReferenceId: input.sourceReferenceId,
      status: "registered" as const,
      rightsStatus: "pending" as const,
      metadata: Object.freeze({ ...(input.metadata ?? {}) }),
      processingJobRefs: Object.freeze([])
    });
    const provenance = Object.freeze({
      id: `${input.id}:provenance`,
      assetId: input.id,
      evidence: input.evidence
    });
    this.assets.set(input.id, asset);
    this.provenance.set(provenance.id, provenance);
    return asset;
  }

  updateRightsStatus(assetId: string, rightsStatus: RightsStatus, action: ManualAction): AssetRecord {
    requireManualAction(action);
    const asset = this.requireAsset(assetId);
    const updated = Object.freeze({ ...asset, rightsStatus });
    this.assets.set(assetId, updated);
    return updated;
  }

  markAssetReady(assetId: string, action: ManualAction): AssetRecord {
    requireManualAction(action);
    const asset = this.requireAsset(assetId);
    if (asset.rightsStatus !== "approved" && asset.rightsStatus !== "restricted") {
      throw validationError("Asset requires usable rights before it can become ready.");
    }
    const updated = Object.freeze({ ...asset, status: "ready" as const });
    this.assets.set(assetId, updated);
    return updated;
  }

  recordDuplicateMatch(input: {
    readonly id: string;
    readonly assetId: string;
    readonly candidateAssetId: string;
    readonly action: ManualAction;
  }): DuplicateMatchRecord {
    requireManualAction(input.action);
    this.requireAsset(input.assetId);
    this.requireAsset(input.candidateAssetId);
    const match = Object.freeze({
      id: assertIdentifier(input.id, "duplicate match id"),
      assetId: input.assetId,
      candidateAssetId: input.candidateAssetId,
      status: "candidate" as const
    });
    this.duplicateMatches.set(match.id, match);
    return match;
  }

  recordProcessingReference(assetId: string, processingJobRef: EntityReference, action: ManualAction): AssetRecord {
    requireManualAction(action);
    const asset = this.requireAsset(assetId);
    if (processingJobRef.ownerServiceId !== "FTV-SVC-02") {
      throw validationError("Processing reference must be owned by FTV-SVC-02.");
    }
    const updated = Object.freeze({
      ...asset,
      processingJobRefs: Object.freeze([...asset.processingJobRefs, processingJobRef])
    });
    this.assets.set(assetId, updated);
    return updated;
  }

  resolveDuplicateMatch(id: string, status: Exclude<DuplicateMatchStatus, "candidate">, action: ManualAction): DuplicateMatchRecord {
    requireManualAction(action);
    const match = this.requireDuplicateMatch(id);
    const resolved = Object.freeze({ ...match, status, reason: action.reason });
    this.duplicateMatches.set(id, resolved);
    return resolved;
  }

  assetReference(assetId: string): EntityReference {
    this.requireAsset(assetId);
    return createVerifiedEntityReference({ id: assetId, ownerServiceId: this.serviceId, entityType: "Asset" });
  }

  getAsset(id: string): AssetRecord | undefined {
    return this.assets.get(id);
  }

  private requireSource(id: string): SourceReference {
    const source = this.sources.get(id);
    if (!source) throw validationError("Source reference was not found.");
    return source;
  }

  private requireAsset(id: string): AssetRecord {
    const asset = this.assets.get(id);
    if (!asset) throw validationError("Asset was not found.");
    return asset;
  }

  private requireDuplicateMatch(id: string): DuplicateMatchRecord {
    const match = this.duplicateMatches.get(id);
    if (!match) throw validationError("Duplicate match was not found.");
    return match;
  }
}

function requireManualAction(action: ManualAction): void {
  if (!action.actorId || !action.reason) throw validationError("Manual action requires actorId and reason.");
}

function validationError(message: string): FtvError {
  return new FtvError({ code: "FTV-SVC-01-VALIDATION", category: "validation", message });
}

function conflictError(message: string): FtvError {
  return new FtvError({ code: "FTV-SVC-01-CONFLICT", category: "conflict", message });
}
