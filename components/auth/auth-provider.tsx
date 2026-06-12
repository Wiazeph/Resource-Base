"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { isProtectedPage } from "@/lib/protected-routes";

export type AuthUser = NonNullable<
  ReturnType<typeof useSession>["data"]
>["user"];
export type AuthSession = ReturnType<typeof useSession>["data"];

type AuthContextValue = {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  /** Open the sign-in dialog; pass a path to navigate there after success. */
  openAuth: (redirectTo?: string) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;

  const [dialogOpen, setDialogOpen] = useState(false);
  const redirectAfterAuth = useRef<string | null>(null);

  // Reproduce the old onAuthStateChange side effects by watching the user id
  // transition (null -> id = signed in, id -> null = signed out).
  const prevUserId = useRef<string | null>(user?.id ?? null);
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const currentId = user?.id ?? null;
    const previousId = prevUserId.current;
    if (currentId === previousId) return;
    prevUserId.current = currentId;

    if (currentId && !previousId) {
      setDialogOpen(false);
      if (redirectAfterAuth.current) {
        const to = redirectAfterAuth.current;
        redirectAfterAuth.current = null;
        router.push(to);
      }
    }
    if (!currentId && previousId && isProtectedPage(pathnameRef.current)) {
      router.replace("/");
    }
  }, [user?.id, router]);

  const openAuth = useCallback((redirectTo?: string) => {
    redirectAfterAuth.current = redirectTo ?? null;
    setDialogOpen(true);
  }, []);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      session: session ?? null,
      loading: isPending,
      openAuth,
      signOut,
    }),
    [user, session, isPending, openAuth, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        getRedirect={() => redirectAfterAuth.current}
      />
    </AuthContext.Provider>
  );
}
