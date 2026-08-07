export function fixedIsoTimestamp(): string {
  return "2026-07-30T00:00:00.000Z";
}

export function createTestOperationId(suffix = "001"): string {
  return `test-operation-${suffix}`;
}

export function expectFrozen<T extends object>(value: T): T {
  if (!Object.isFrozen(value)) {
    throw new Error("Expected value to be frozen.");
  }

  return value;
}
