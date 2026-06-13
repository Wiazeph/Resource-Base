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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { data: session, isPending } = useSession();
  const user = session?.user ?? null;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const redirectAfterAuth = useRef<string | null>(null);

  // Catch OAuth/auth redirects landing on the page with a query flag:
  //  - ?error=account_not_linked → open the dialog with a helpful notice
  //  - ?auth=required | ?auth=signin → open the dialog (e.g. bounced from a
  //    protected page, or returning from a password reset)
  // Read from window.location (in an effect, client-only) rather than
  // useSearchParams() so static pages don't need a Suspense bailout.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const auth = params.get("auth");
    if (error === "account_not_linked") {
      setNotice(t("auth.accountNotLinked"));
      setDialogOpen(true);
      router.replace(window.location.pathname);
    } else if (auth === "required" || auth === "signin") {
      setDialogOpen(true);
      router.replace(window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
    setNotice(null);
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
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setNotice(null);
        }}
        getRedirect={() => redirectAfterAuth.current}
        notice={notice}
      />
    </AuthContext.Provider>
  );
}
