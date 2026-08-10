import { recordWorkflowRecovery } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  await recordWorkflowRecovery(
    {
      operationId: String(form.get("operationId") ?? ""),
      note: String(form.get("note") ?? "")
    },
    await getOperatorRuntimeOptions()
  );

  return Response.redirect(new URL("/workflow", request.url), 303);
}
