import {
  OPERATOR_LANGUAGE_COOKIE,
  resolveOperatorLanguage
} from "../../../i18n.js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const language = resolveOperatorLanguage(String(form.get("language") ?? ""));
  const redirectTo =
    request.headers.get("referer") ?? new URL("/", request.url).toString();

  return new Response(null, {
    status: 303,
    headers: {
      Location: redirectTo,
      "Set-Cookie": `${OPERATOR_LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax`
    }
  });
}
