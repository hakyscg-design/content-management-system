import { approveContentForReview } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  await approveContentForReview(
    {
      contentPackageId: String(form.get("contentPackageId") ?? ""),
      reviewerId: String(form.get("reviewerId") ?? ""),
      reason: String(form.get("reason") ?? "")
    },
    await getOperatorRuntimeOptions()
  );

  return Response.redirect(new URL("/review", request.url), 303);
}
