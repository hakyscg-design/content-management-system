import { describe, expect, test } from "vitest";
import {
  DEFAULT_PROJECT_ID,
  listProjects,
  loadProjectConfig,
  resolveProject
} from "../../packages/configuration/src/index.js";

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
      project: {
        id: "football-troll-vault",
        name: "Football Troll Vault",
        slug: "football-troll-vault",
        profilePath: "projects/football-troll-vault/PROJECT_PROFILE.md",
        serviceNamespace: "FTV"
      },
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

  test("defaults to the Football Troll Vault project for compatibility", () => {
    const config = loadProjectConfig({ env: {} });

    expect(config.project.id).toBe(DEFAULT_PROJECT_ID);
    expect(config.project.serviceNamespace).toBe("FTV");
  });

  test("resolves a second synthetic project without duplicating services", () => {
    const config = loadProjectConfig({
      env: {
        CMS_PROJECT_ID: "synthetic-project"
      }
    });

    expect(config.project).toEqual(resolveProject("synthetic-project"));
    expect(listProjects().map((project) => project.id)).toEqual([
      "football-troll-vault",
      "synthetic-project"
    ]);
  });

  test("rejects unknown projects safely", () => {
    expect(() =>
      loadProjectConfig({ env: { CMS_PROJECT_ID: "unknown-project" } })
    ).toThrow("Unknown CMS project: unknown-project.");
  });
});
