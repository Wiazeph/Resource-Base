import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Only allow same-origin internal redirects. Rejects absolute URLs and
 * protocol-relative (`//evil.com`) / backslash tricks that would otherwise
 * turn the `next` param into an open redirect (phishing vector).
 */
function safeNext(raw: string | null): string {
  const next = raw ?? "/";
  if (
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.startsWith("/\\")
  ) {
    return "/";
  }
  return next;
}

/**
 * OAuth / email-confirmation callback: exchanges the PKCE `code` for a session,
 * then redirects to a safe internal path (defaults to home).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
