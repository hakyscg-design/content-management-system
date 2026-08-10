import {
  createLocalProjectBackup,
  updateProjectAdministrationSettings
} from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const options = await getOperatorRuntimeOptions();

  if (action !== "create-backup" && action !== "update-settings") {
    return Response.json(
      {
        ok: false,
        title: "Administration action rejected",
        message: "Unknown administration action."
      },
      { status: 400 }
    );
  }

  const result =
    action === "create-backup"
      ? await createLocalProjectBackup(options)
      : await updateProjectAdministrationSettings(
          {
            operatorLabel: String(form.get("operatorLabel") ?? ""),
            defaultLocale: String(form.get("defaultLocale") ?? ""),
            policyNote: String(form.get("policyNote") ?? "")
          },
          options
        );

  if (!result.ok) return Response.json(result, { status: 400 });
  return Response.redirect(new URL("/administration", request.url), 303);
}
