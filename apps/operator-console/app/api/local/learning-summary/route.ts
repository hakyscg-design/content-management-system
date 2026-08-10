import { recordManualLearningSummary } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  await recordManualLearningSummary(
    {
      reportId: String(form.get("reportId") ?? ""),
      summary: String(form.get("summary") ?? "")
    },
    await getOperatorRuntimeOptions()
  );

  return Response.redirect(new URL("/performance-analytics", request.url), 303);
}
