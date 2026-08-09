import { approveContentForReview } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const result = await approveContentForReview(
    {
      contentPackageId: String(form.get("contentPackageId") ?? ""),
      reviewerId: String(form.get("reviewerId") ?? ""),
      reason: String(form.get("reason") ?? "")
    },
    await getOperatorRuntimeOptions()
  );

  if (!result.ok) return Response.json(result, { status: 400 });
  return Response.redirect(new URL("/review", request.url), 303);
}
