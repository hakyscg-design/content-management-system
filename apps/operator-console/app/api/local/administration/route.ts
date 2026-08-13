import {
  createLocalProjectBackup,
  updateProjectAdministrationSettings
} from "@ftv/local-runtime";
import { copy, resolveRequestLanguage } from "../../../i18n.js";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const options = await getOperatorRuntimeOptions();
  const text = copy[resolveRequestLanguage(request)];

  if (action !== "create-backup" && action !== "update-settings") {
    return Response.json(
      {
        ok: false,
        title: text.api.administrationRejectedTitle,
        message: text.api.administrationRejectedMessage
      },
      { status: 400 }
    );
  }

  if (action === "create-backup") {
    await createLocalProjectBackup(options);
  } else {
    await updateProjectAdministrationSettings(
      {
        operatorLabel: String(form.get("operatorLabel") ?? ""),
        defaultLocale: String(form.get("defaultLocale") ?? ""),
        policyNote: String(form.get("policyNote") ?? "")
      },
      options
    );
  }

  return Response.redirect(new URL("/administration", request.url), 303);
}
