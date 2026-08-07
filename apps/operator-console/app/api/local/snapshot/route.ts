import { getLocalDashboardView } from "@ftv/local-runtime";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await getLocalDashboardView());
}
