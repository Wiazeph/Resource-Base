import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isProtectedPage } from "@/lib/protected-routes";

/** API routes that require a signed-in user. */
const PROTECTED_APIS = ["/api/submit", "/api/user"];

/**
 * Refreshes the Supabase session cookie AND gates protected routes. Public
 * browsing (home, categories, category, tag, public profiles) stays open;
 * account-only pages/APIs require a session — the outermost defense layer on
 * top of per-page getUser() checks and Supabase RLS.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh + read the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user) {
    // Protected APIs → 401 (no redirect).
    if (PROTECTED_APIS.some((p) => pathname.startsWith(p))) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Protected pages → bounce home with a flag so the UI can prompt sign-in.
    if (isProtectedPage(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "?auth=required";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
