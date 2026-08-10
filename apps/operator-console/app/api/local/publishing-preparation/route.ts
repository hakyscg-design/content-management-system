import { prepareManualPublishingPackage } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  await prepareManualPublishingPackage(
    {
      contentPackageId: String(form.get("contentPackageId") ?? ""),
      destination: String(form.get("destination") ?? ""),
      caption: String(form.get("caption") ?? "")
    },
    await getOperatorRuntimeOptions()
  );

  return Response.redirect(new URL("/publishing", request.url), 303);
}
