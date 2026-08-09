import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("L-03 static boundaries", () => {
  it("keeps package-lock absent and requires Prisma without adding sqlite package drift", () => {
    const packageJson = JSON.parse(
      readFileSync(join(root, "package.json"), "utf8")
    ) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const dependencies = {
      ...(packageJson.dependencies ?? {}),
      ...(packageJson.devDependencies ?? {})
    };

    expect(existsSync(join(root, "package-lock.json"))).toBe(false);
    expect(dependencies["@prisma/client"]).toBeDefined();
    expect(dependencies.prisma).toBeDefined();
    expect(Object.keys(dependencies)).not.toContain("sqlite3");
    expect(Object.keys(dependencies)).not.toContain("better-sqlite3");
  });

  it("keeps UI and route handlers behind the local application boundary", () => {
    const appFiles = listFiles(join(root, "apps/operator-console/app")).filter(
      (file) => file.endsWith(".ts") || file.endsWith(".tsx")
    );
    const routeFiles = appFiles.filter((file) => file.endsWith("route.ts"));
    const uiFiles = appFiles.filter((file) => !file.endsWith("route.ts"));
    const projectContext = readFileSync(
      join(root, "apps/operator-console/app/project-context.ts"),
      "utf8"
    );
    expect(projectContext).toContain("@ftv/local-runtime");

    for (const file of uiFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toContain("../../../services/");
      expect(source).not.toContain("@prisma/client");
      expect(source).not.toContain("PrismaClient");
    }

    for (const file of routeFiles) {
      const source = readFileSync(file, "utf8");
      expect(
        source.includes("@ftv/local-runtime") ||
          source.includes("project-context") ||
          source.includes("resolveLocalProject")
      ).toBe(true);
      expect(source).not.toContain("new SourceAssetRegistryService");
      expect(source).not.toContain("new PrismaClient");
      expect(source).not.toContain("writeFileSync");
    }
  });

  it("keeps navigation aligned to implemented traceable routes", () => {
    const navigation = readFileSync(
      join(root, "apps/operator-console/app/navigation.tsx"),
      "utf8"
    );
    const traceability = readFileSync(
      join(root, "docs/local-tool/L_02_ROUTE_TRACEABILITY.md"),
      "utf8"
    );
    const routes = [
      "/",
      "/source-assets",
      "/content-production",
      "/workflow",
      "/review",
      "/publishing",
      "/performance-analytics",
      "/administration"
    ];

    for (const route of routes) {
      expect(navigation).toContain(route);
      expect(traceability).toContain(`| \`${route}\``);
    }

    expect(navigation).not.toContain("trend");
    expect(navigation).not.toContain("AI");
  });

  it("maps persisted models to accepted owner services", () => {
    const mapping = readFileSync(
      join(root, "docs/local-tool/L_03_PERSISTENCE_MAPPING.md"),
      "utf8"
    );
    for (const model of [
      "LocalRecord",
      "LocalMedia",
      "LocalOperation",
      "LocalConfig"
    ]) {
      expect(mapping).toContain(model);
    }
    for (const owner of [
      "FTV-SVC-01",
      "FTV-SVC-02",
      "FTV-SVC-08",
      "FTV-SVC-11"
    ]) {
      expect(mapping).toContain(owner);
    }
  });
});

function listFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}
