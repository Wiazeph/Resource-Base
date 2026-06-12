import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

// Better Auth owns all /api/auth/* routes (sign-in, sign-up, OAuth callbacks,
// session, password reset). Auth instance is built per request (D1 binding).
export async function GET(request: Request) {
  const auth = await getAuth();
  return toNextJsHandler(auth).GET(request);
}

export async function POST(request: Request) {
  const auth = await getAuth();
  return toNextJsHandler(auth).POST(request);
}
