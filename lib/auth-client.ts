"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { getAuth } from "@/lib/auth";

/**
 * Browser auth client (replaces lib/supabase/client.ts). Same-origin.
 * inferAdditionalFields keeps the folded-in profile fields typed on the session.
 */
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<Awaited<ReturnType<typeof getAuth>>>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
