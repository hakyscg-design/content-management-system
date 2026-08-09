import { resolveLocalProject } from "@ftv/local-runtime";
import { OPERATOR_PROJECT_COOKIE } from "../../../project-cookie.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const projectId = String(form.get("projectId") ?? "");

  try {
    const project = resolveLocalProject(projectId);
    return new Response(null, {
      status: 303,
      headers: {
        Location: new URL("/", request.url).toString(),
        "Set-Cookie": `${OPERATOR_PROJECT_COOKIE}=${project.id}; Path=/; HttpOnly; SameSite=Lax`
      }
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown CMS project.";
    return Response.json({ ok: false, message }, { status: 400 });
  }
}
