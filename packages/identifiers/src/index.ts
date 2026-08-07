export type ServiceId = `FTV-SVC-${string}`;

export interface EntityReference {
  readonly id: string;
  readonly ownerServiceId: ServiceId;
  readonly entityType: string;
}

export interface VerifiedEntityReference extends EntityReference {
  readonly verifiedByServiceId: ServiceId;
}

const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{1,127}$/;
const SERVICE_ID_PATTERN = /^FTV-SVC-\d{2}$/;

export function assertIdentifier(value: string, label = "identifier"): string {
  if (!ID_PATTERN.test(value)) {
    throw new Error(`${label} must be stable, non-empty, and contain only safe identifier characters.`);
  }

  return value;
}

export function assertServiceId(value: string): ServiceId {
  if (!SERVICE_ID_PATTERN.test(value)) {
    throw new Error("serviceId must preserve the canonical FTV-SVC-NN format.");
  }

  return value as ServiceId;
}

export function createEntityReference(input: EntityReference): EntityReference {
  return Object.freeze({
    id: assertIdentifier(input.id, "entity id"),
    ownerServiceId: assertServiceId(input.ownerServiceId),
    entityType: assertIdentifier(input.entityType, "entity type")
  });
}

export function createVerifiedEntityReference(input: EntityReference): VerifiedEntityReference {
  const reference = createEntityReference(input);
  return Object.freeze({
    ...reference,
    verifiedByServiceId: reference.ownerServiceId
  });
}

export function assertVerifiedEntityReference(
  reference: EntityReference,
  expected: {
    readonly ownerServiceId: ServiceId;
    readonly entityType: string;
    readonly label?: string;
  }
): VerifiedEntityReference {
  const label = expected.label ?? "entity reference";
  const verifiedReference = reference as Partial<VerifiedEntityReference>;

  if (reference.ownerServiceId !== expected.ownerServiceId || reference.entityType !== expected.entityType) {
    throw new Error(`${label} must reference ${expected.ownerServiceId} ${expected.entityType}.`);
  }

  if (verifiedReference.verifiedByServiceId !== expected.ownerServiceId) {
    throw new Error(`${label} must be verified by its owner service.`);
  }

  return reference as VerifiedEntityReference;
}
