import { describe, expect, test } from "vitest";
import { createAuditRecord } from "../../packages/audit/src/index.js";
import {
  FtvError,
  toSafeErrorOutput
} from "../../packages/errors/src/index.js";
import { Logger, MemoryLogSink } from "../../packages/logging/src/index.js";

describe("error, logging, and audit foundations", () => {
  test("formats safe error output without exposing technical context", () => {
    const error = new FtvError({
      code: "FTV-VALIDATION-001",
      category: "validation",
      message: "Invalid input.",
      technicalContext: { secret: "do-not-print" }
    });

    expect(toSafeErrorOutput(error)).toEqual({
      code: "FTV-VALIDATION-001",
      category: "validation",
      message: "Invalid input."
    });
  });

  test("writes diagnostic logs separately from audit records", () => {
    const sink = new MemoryLogSink();
    const logger = new Logger(sink);
    const record = logger.log(
      "error",
      "Validation failed.",
      { operationId: "operation-001" },
      new Error("boom")
    );

    expect(record.error?.message).toBe("boom");
    expect(sink.records).toHaveLength(1);
  });

  test("creates audit-compatible records without approving actions", () => {
    const record = createAuditRecord(
      {
        actor: { actorId: "operator-001" },
        action: "FOUNDATION_CHECK",
        targetRef: "workspace",
        reason: "BE-02 validation",
        operationId: "operation-001"
      },
      new Date("2026-07-30T00:00:00.000Z")
    );

    expect(record.timestamp).toBe("2026-07-30T00:00:00.000Z");
  });
});
