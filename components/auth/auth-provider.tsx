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
import { migrateLocalFavorites } from "@/lib/favorites";

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

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" && session?.user) {
        // One-time: pull any anonymous localStorage favorites into the account.
        migrateLocalFavorites(supabase, session.user.id);
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
