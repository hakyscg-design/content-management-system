import { createContentProductionPackage } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  await createContentProductionPackage(
    {
      assetId: String(form.get("assetId") ?? ""),
      title: String(form.get("title") ?? ""),
      concept: String(form.get("concept") ?? ""),
      caption: String(form.get("caption") ?? "")
    },
    await getOperatorRuntimeOptions()
  );

  return Response.redirect(new URL("/content-production", request.url), 303);
}
