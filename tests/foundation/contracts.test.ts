import { describe, expect, test } from "vitest";
import {
  createContractEnvelope,
  type IntegrationPort
} from "../../packages/contracts/src/index.js";

describe("contract foundation", () => {
  test("creates versioned command envelopes without business ownership", () => {
    const envelope = createContractEnvelope({
      kind: "command",
      name: "ExampleFoundationCommand",
      version: "0.0.1",
      ownerServiceId: "FTV-SVC-09",
      consumerServiceId: "FTV-SVC-01",
      operationId: "operation-001",
      payload: { referenceOnly: true }
    });

    expect(envelope.kind).toBe("command");
    expect(envelope.version).toBe("0.0.1");
    expect(Object.isFrozen(envelope)).toBe(true);
  });

  test("defines integration ports without implementing workflows", async () => {
    const echoPort: IntegrationPort<string, string> = {
      execute: async (input) => input
    };

    await expect(echoPort.execute("manual-ready")).resolves.toBe(
      "manual-ready"
    );
  });
});
