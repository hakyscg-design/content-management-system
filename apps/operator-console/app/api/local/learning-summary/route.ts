import { recordManualLearningSummary } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const result = await recordManualLearningSummary(
    {
      reportId: String(form.get("reportId") ?? ""),
      summary: String(form.get("summary") ?? "")
    },
    await getOperatorRuntimeOptions()
  );

  if (!result.ok) return Response.json(result, { status: 400 });
  return Response.redirect(new URL("/performance-analytics", request.url), 303);
}
