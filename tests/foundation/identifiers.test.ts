import { describe, expect, test } from "vitest";
import {
  assertIdentifier,
  assertServiceId,
  createEntityReference
} from "../../packages/identifiers/src/index.js";

describe("identifier foundation", () => {
  test("creates immutable owner-traceable references", () => {
    const reference = createEntityReference({
      id: "asset-001",
      ownerServiceId: "FTV-SVC-01",
      entityType: "Asset"
    });

    expect(reference.ownerServiceId).toBe("FTV-SVC-01");
    expect(Object.isFrozen(reference)).toBe(true);
  });

  test("rejects invalid service IDs and unsafe identifiers", () => {
    expect(() => assertServiceId("SVC-01")).toThrow("FTV-SVC-NN");
    expect(() => assertIdentifier("")).toThrow("identifier");
  });
});
