import { createContentProductionPackage } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const result = await createContentProductionPackage(
    {
      assetId: String(form.get("assetId") ?? ""),
      title: String(form.get("title") ?? ""),
      concept: String(form.get("concept") ?? ""),
      caption: String(form.get("caption") ?? "")
    },
    await getOperatorRuntimeOptions()
  );

  if (!result.ok) return Response.json(result, { status: 400 });
  return Response.redirect(new URL("/content-production", request.url), 303);
}
