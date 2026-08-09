import { recordPerformanceFeedback } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const input = {
    publishingPackageId: String(form.get("publishingPackageId") ?? ""),
    source: String(form.get("source") ?? ""),
    ...optionalNumberField("views", form.get("views")),
    ...optionalNumberField("likes", form.get("likes")),
    ...optionalNumberField("comments", form.get("comments")),
    ...optionalNumberField("shares", form.get("shares")),
    ...optionalNumberField("watchMinutes", form.get("watchMinutes"))
  };
  const result = await recordPerformanceFeedback(
    input,
    await getOperatorRuntimeOptions()
  );

  if (!result.ok) return Response.json(result, { status: 400 });
  return Response.redirect(new URL("/performance-analytics", request.url), 303);
}

function optionalNumber(value: FormDataEntryValue | null): number | undefined {
  const text = String(value ?? "").trim();
  if (!text) return undefined;
  return Number(text);
}

function optionalNumberField(
  key: "views" | "likes" | "comments" | "shares" | "watchMinutes",
  value: FormDataEntryValue | null
): Partial<Record<typeof key, number>> {
  const numberValue = optionalNumber(value);
  return numberValue === undefined ? {} : { [key]: numberValue };
}
