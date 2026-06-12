import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  username?: string | null;
  showEmail?: boolean;
  [key: string]: unknown;
};

/** Current session user, or null. Use in public / optional-auth paths. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  return (session?.user as SessionUser) ?? null;
}

/**
 * The RLS replacement. Every server action / route handler touching user-owned
 * data MUST call this and filter queries by the returned `id`. Throws 401 if
 * unauthenticated.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Response("Unauthorized", { status: 401 });
  return user;
}
