import { completeManualPublishingPackage } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const result = await completeManualPublishingPackage(
    {
      publishingPackageId: String(form.get("publishingPackageId") ?? ""),
      manualPublishingReference: String(
        form.get("manualPublishingReference") ?? ""
      )
    },
    await getOperatorRuntimeOptions()
  );

  if (!result.ok) return Response.json(result, { status: 400 });
  return Response.redirect(new URL("/publishing", request.url), 303);
}
