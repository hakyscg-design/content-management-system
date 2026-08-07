import { describe, expect, test } from "vitest";
import {
  createTestOperationId,
  expectFrozen,
  fixedIsoTimestamp
} from "../../packages/testing/src/index.js";
import {
  assertNonEmpty,
  ensureNfc,
  redactSecrets
} from "../../packages/utilities/src/index.js";

describe("utilities and testing foundations", () => {
  test("preserves Vietnamese NFC text", () => {
    const text = "Nội dung sẵn sàng để xuất bản.";
    expect(ensureNfc(text)).toBe(text.normalize("NFC"));
  });

  test("redacts obvious secrets from technical text", () => {
    expect(redactSecrets("token=abc password=hunter2")).toBe(
      "token=[REDACTED] password=[REDACTED]"
    );
  });

  test("provides deterministic test helpers", () => {
    expect(fixedIsoTimestamp()).toBe("2026-07-30T00:00:00.000Z");
    expect(createTestOperationId("123")).toBe("test-operation-123");
    expect(expectFrozen(Object.freeze({ ok: true }))).toEqual({ ok: true });
    expect(() => assertNonEmpty("", "value")).toThrow("value");
  });
});
