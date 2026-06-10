"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { AuthDialog } from "@/components/auth/auth-dialog";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  openAuth: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      // On tab refocus Supabase emits TOKEN_REFRESHED (and sometimes SIGNED_IN)
      // with a fresh token but the SAME user. Updating state every time creates
      // a new `user` object reference, which cascades a refetch through every
      // provider that depends on `user` (favorites, submissions, profile,
      // notifications) — the "double-load". So only update state when the
      // identity (user id) or the access token actually changed.
      setSession((prev) => {
        const sameUser = (prev?.user?.id ?? null) === (next?.user?.id ?? null);
        const sameToken = prev?.access_token === next?.access_token;
        if (sameUser && sameToken) return prev;
        return next;
      });
      setUser((prev) => {
        const sameUser = (prev?.id ?? null) === (next?.user?.id ?? null);
        return sameUser ? prev : (next?.user ?? null);
      });
      if (event === "SIGNED_IN" && next?.user) {
        setDialogOpen(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const openAuth = useCallback(() => setDialogOpen(true), []);
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  const value = useMemo(
    () => ({ user, session, loading, openAuth, signOut }),
    [user, session, loading, openAuth, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </AuthContext.Provider>
  );
}
