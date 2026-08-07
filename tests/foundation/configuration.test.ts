import { describe, expect, test } from "vitest";
import { loadProjectConfig } from "../../packages/configuration/src/index.js";

describe("configuration foundation", () => {
  test("loads safe defaults and environment overrides", () => {
    const config = loadProjectConfig({
      env: {
        FTV_ENV: "test",
        FTV_LOG_LEVEL: "debug",
        FTV_SERVICE_ID: "FTV-SVC-09"
      }
    });

    expect(config).toEqual({
      environment: "test",
      logLevel: "debug",
      serviceId: "FTV-SVC-09"
    });
    expect(Object.isFrozen(config)).toBe(true);
  });

  test("rejects unsupported environment values", () => {
    expect(() => loadProjectConfig({ env: { FTV_ENV: "staging" } })).toThrow(
      "FTV_ENV"
    );
  });
});
