import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  OPERATOR_LANGUAGE_COOKIE,
  copy,
  localizeValue,
  operatorLanguages,
  resolveRequestLanguage,
  resolveOperatorLanguage
} from "../../apps/operator-console/app/i18n.js";

const root = process.cwd();

describe("Feature 07 language layer", () => {
  it("resolves EN by default and VN only when explicitly selected", () => {
    expect(resolveOperatorLanguage(undefined)).toBe("en");
    expect(resolveOperatorLanguage("en")).toBe("en");
    expect(resolveOperatorLanguage("vn")).toBe("vn");
    expect(resolveOperatorLanguage("football-troll-vault")).toBe("en");
  });

  it("provides global shell copy for both supported languages", () => {
    expect(operatorLanguages.map((language) => language.id)).toEqual([
      "en",
      "vn"
    ]);
    expect(copy.en.nav.administration).toBe("Administration");
    expect(copy.vn.nav.administration).toBe("Quan tri");
    expect(copy.vn.shell.projectLabel).toBe("Du an dang hoat dong");
    expect(copy.vn.shell.languageLabel).toBe("Ngon ngu");
  });

  it("localizes runtime guidance without changing canonical values", () => {
    expect(localizeValue("Create content package", "vn")).toBe(
      "Tao goi noi dung"
    );
    expect(localizeValue("record-id-001", "vn")).toBe("record-id-001");
    expect(localizeValue("FTV-SVC-01", "vn")).toBe("FTV-SVC-01");
    expect(localizeValue("Create content package", "en")).toBe(
      "Create content package"
    );
  });

  it("keeps language as a global shell cookie, not project configuration", () => {
    const route = readFileSync(
      join(root, "apps/operator-console/app/api/local/language/route.ts"),
      "utf8"
    );
    const administrationRoute = readFileSync(
      join(root, "apps/operator-console/app/api/local/administration/route.ts"),
      "utf8"
    );

    expect(OPERATOR_LANGUAGE_COOKIE).toBe("cms-operator-language");
    expect(route).toContain("Max-Age=31536000");
    expect(route).not.toContain("projectId");
    expect(route).not.toContain("updateProjectAdministrationSettings");
    expect(projectRouteSource()).not.toContain(OPERATOR_LANGUAGE_COOKIE);
    expect(administrationRoute).not.toContain(OPERATOR_LANGUAGE_COOKIE);
  });

  it("resolves API response language from the global request cookie", () => {
    expect(
      resolveRequestLanguage(
        new Request("http://localhost", {
          headers: { cookie: "cms-active-project=synthetic-project" }
        })
      )
    ).toBe("en");
    expect(
      resolveRequestLanguage(
        new Request("http://localhost", {
          headers: {
            cookie:
              "cms-active-project=synthetic-project; cms-operator-language=vn"
          }
        })
      )
    ).toBe("vn");
  });

  it("localizes direct API validation errors without changing project data", () => {
    const projectRoute = projectRouteSource();
    const administrationRoute = readFileSync(
      join(root, "apps/operator-console/app/api/local/administration/route.ts"),
      "utf8"
    );

    expect(copy.vn.api.unknownProject).toBe("Khong ro du an CMS.");
    expect(projectRoute).toContain("text.api.unknownProject");
    expect(administrationRoute).toContain(
      "text.api.administrationRejectedTitle"
    );
    expect(administrationRoute).toContain(
      "text.api.administrationRejectedMessage"
    );
  });
});

function projectRouteSource(): string {
  return readFileSync(
    join(root, "apps/operator-console/app/api/local/project/route.ts"),
    "utf8"
  );
}
