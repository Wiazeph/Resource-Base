"use client";

import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";

/**
 * Client-side guard for protected pages: while auth resolves it shows a spinner;
 * if signed out it renders a sign-in prompt instead of the content. This is the
 * UX layer — the server-side getUser() check in the page is what actually
 * prevents protected data from being fetched or leaked.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { user, loading, openAuth } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="size-5 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Lock className="size-5" />
        </span>
        <h1 className="text-xl font-semibold">{t("auth.requiredTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("auth.requiredBody")}
        </p>
        <Button className="mt-6" onClick={() => openAuth()}>
          {t("header.signIn")}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
