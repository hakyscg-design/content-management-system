import { addLocalMediaFixture } from "@ftv/local-runtime";
import { getOperatorRuntimeOptions } from "../../../project-context.js";

export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json(
    await addLocalMediaFixture(await getOperatorRuntimeOptions())
  );
}
