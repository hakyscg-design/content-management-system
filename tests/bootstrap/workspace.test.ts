import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const root = process.cwd();

describe("BE-01 workspace scaffold", () => {
  test("required top-level bootstrap files exist", () => {
    for (const file of [
      ".editorconfig",
      ".gitattributes",
      ".gitignore",
      ".npmrc",
      ".nvmrc",
      "package.json",
      "pnpm-workspace.yaml",
      "tsconfig.json",
      "eslint.config.js",
      "prettier.config.js",
      "vitest.config.ts",
      "SECURITY.md"
    ]) {
      expect(existsSync(join(root, file)), file).toBe(true);
    }
  });

  test("package names are unique and private", () => {
    const packageFiles = [
      join(root, "package.json"),
      ...["apps", "services"]
        .flatMap((folder) =>
          readdirSync(join(root, folder), { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => join(root, folder, entry.name, "package.json"))
        )
        .filter((path) => existsSync(path))
    ];

    const packages = packageFiles.map((path) =>
      JSON.parse(readFileSync(path, "utf8"))
    );
    const names = packages.map((pkg) => pkg.name);

    expect(new Set(names).size).toBe(names.length);
    expect(packages.every((pkg) => pkg.private === true)).toBe(true);
  });

  test("typescript smoke module compiles and preserves BE-01 scope", async () => {
    const module = await import("./type-smoke.js");
    expect(module.BOOTSTRAP_SCOPE).toBe("BE-01");
    expect(module.describeBootstrapScope()).toContain("no FTV business logic");
  });

  test("unicode text round-trips without ASCII transliteration", () => {
    const text = "Football Troll Vault - Nội dung sẵn sàng để xuất bản.";
    expect(Buffer.from(text, "utf8").toString("utf8")).toBe(text);
    expect(text.normalize("NFC")).toBe(text);
  });

  test("service placeholders preserve canonical service IDs", () => {
    const ids = [
      "FTV-SVC-01",
      "FTV-SVC-02",
      "FTV-SVC-03",
      "FTV-SVC-04",
      "FTV-SVC-05",
      "FTV-SVC-06",
      "FTV-SVC-07",
      "FTV-SVC-08",
      "FTV-SVC-09",
      "FTV-SVC-10",
      "FTV-SVC-11"
    ];

    const serviceReadmes = readdirSync(join(root, "services"), {
      withFileTypes: true
    })
      .filter((entry) => entry.isDirectory())
      .map((entry) =>
        readFileSync(join(root, "services", entry.name, "README.md"), "utf8")
      );

    for (const id of ids) {
      expect(
        serviceReadmes.some((readme) => readme.includes(id)),
        id
      ).toBe(true);
    }
  });

  test("secret-like local environment files are ignored", () => {
    const gitignore = readFileSync(join(root, ".gitignore"), "utf8");
    expect(gitignore).toContain(".env");
    expect(gitignore).toContain(".env.local");
    expect(gitignore).toContain(".env.test");
    expect(gitignore).toContain(".env.*.local");
  });

  test("operator console dev startup clears stale Next generated assets", () => {
    const operatorPackage = JSON.parse(
      readFileSync(join(root, "apps/operator-console/package.json"), "utf8")
    );
    const cleanupScript = readFileSync(
      join(root, "scripts/local/clean-operator-console-next.mjs"),
      "utf8"
    );

    expect(operatorPackage.scripts.predev).toBe(
      "node ../../scripts/local/clean-operator-console-next.mjs"
    );
    expect(operatorPackage.scripts.dev).toBe(
      "next dev --hostname localhost --port 3000"
    );
    expect(cleanupScript).toContain(
      'join(root, "apps", "operator-console", ".next")'
    );
    expect(cleanupScript).not.toContain(".ftv-local");
  });
});
