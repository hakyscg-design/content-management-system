import { createManualAnalyticsReport } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  await createManualAnalyticsReport(
    {
      performanceImportId: String(form.get("performanceImportId") ?? ""),
      title: String(form.get("title") ?? ""),
      narrative: String(form.get("narrative") ?? "")
    },
    await getOperatorRuntimeOptions()
  );

  return Response.redirect(new URL("/performance-analytics", request.url), 303);
}
