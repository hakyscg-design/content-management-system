import { submitInvalidPublishingAttempt } from "@ftv/local-runtime";

export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json(await submitInvalidPublishingAttempt());
}
