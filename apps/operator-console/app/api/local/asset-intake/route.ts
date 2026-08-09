import { submitLocalAssetIntake } from "@ftv/local-runtime";
import { createManualSourceAsset } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const form = await request.formData();
    const result = await createManualSourceAsset(
      {
        sourceUrl: String(form.get("sourceUrl") ?? ""),
        label: String(form.get("label") ?? ""),
        evidence: String(form.get("evidence") ?? "")
      },
      await getOperatorRuntimeOptions()
    );
    if (!result.ok) return Response.json(result, { status: 400 });
    return Response.redirect(new URL("/source-assets", request.url), 303);
  }

  return Response.json(
    await submitLocalAssetIntake(await getOperatorRuntimeOptions())
  );
}
