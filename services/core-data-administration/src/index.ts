import { FtvError } from "../../../packages/errors/src/index.js";
import { assertIdentifier, createEntityReference, type EntityReference } from "../../../packages/identifiers/src/index.js";

export const CORE_DATA_ADMINISTRATION_SERVICE_ID = "FTV-SVC-11" as const;

export interface ManualAction {
  readonly actorId: string;
  readonly reason: string;
}

export interface AdminViewConfiguration {
  readonly id: string;
  readonly name: string;
  readonly ownerServiceId: string;
  readonly visibleFields: readonly string[];
}

export interface DisplayMetadata {
  readonly id: string;
  readonly recordRef: EntityReference;
  readonly label: string;
}

export interface AdminInspectionRecord {
  readonly id: string;
  readonly recordRef: EntityReference;
  readonly note: string;
  readonly authoritative: false;
}

export class CoreDataAdministrationService {
  readonly serviceId = CORE_DATA_ADMINISTRATION_SERVICE_ID;
  private readonly views = new Map<string, AdminViewConfiguration>();
  private readonly metadata = new Map<string, DisplayMetadata>();
  private readonly inspections = new Map<string, AdminInspectionRecord>();

  configureView(id: string, name: string, ownerServiceId: string, visibleFields: readonly string[], action: ManualAction): AdminViewConfiguration {
    requireManualAction(action);
    if (ownerServiceId === this.serviceId) throw validationError("Admin views must point at owner services, not replace them.");
    const view = Object.freeze({
      id: assertIdentifier(id, "admin view id"),
      name,
      ownerServiceId,
      visibleFields: Object.freeze([...visibleFields])
    });
    this.views.set(id, view);
    return view;
  }

  registerDisplayMetadata(id: string, recordRef: EntityReference, label: string, action: ManualAction): DisplayMetadata {
    requireManualAction(action);
    const displayMetadata = Object.freeze({ id: assertIdentifier(id, "display metadata id"), recordRef, label });
    this.metadata.set(id, displayMetadata);
    return displayMetadata;
  }

  inspectRecord(id: string, recordRef: EntityReference, note: string, action: ManualAction): AdminInspectionRecord {
    requireManualAction(action);
    const inspection = Object.freeze({
      id: assertIdentifier(id, "admin inspection id"),
      recordRef,
      note,
      authoritative: false as const
    });
    this.inspections.set(id, inspection);
    return inspection;
  }

  adminViewReference(id: string): EntityReference {
    if (!this.views.has(id)) throw validationError("Admin view was not found.");
    return createEntityReference({ id, ownerServiceId: this.serviceId, entityType: "AdminViewConfiguration" });
  }
}

function requireManualAction(action: ManualAction): void {
  if (!action.actorId || !action.reason) throw validationError("Manual action requires actorId and reason.");
}

function validationError(message: string): FtvError {
  return new FtvError({ code: "FTV-SVC-11-VALIDATION", category: "validation", message });
}
