import { prepareManualPublishingPackage } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const result = await prepareManualPublishingPackage(
    {
      contentPackageId: String(form.get("contentPackageId") ?? ""),
      destination: String(form.get("destination") ?? ""),
      caption: String(form.get("caption") ?? "")
    },
    await getOperatorRuntimeOptions()
  );

  if (!result.ok) return Response.json(result, { status: 400 });
  return Response.redirect(new URL("/publishing", request.url), 303);
}
