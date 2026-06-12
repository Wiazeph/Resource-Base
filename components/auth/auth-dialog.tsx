"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AtSign, Loader2, Lock, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
import { GoogleIcon, GithubIcon, GitlabIcon } from "@/components/brand-icons";
import { createClient } from "@/lib/supabase/client";

export function AuthDialog({
  open,
  onOpenChange,
  getRedirect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Returns the post-login path to forward to (via OAuth ?next=), if any. */
  getRedirect?: () => string | null;
}) {
  const { t } = useTranslation();
  const supabase = useMemo(() => createClient(), []);
  const [pending, setPending] = useState(false);

  // OAuth leaves the page, so the post-login redirect must travel through the
  // callback's ?next= param (only same-origin paths are honored server-side).
  function callbackUrl() {
    if (typeof window === "undefined") return undefined;
    const base = `${window.location.origin}/auth/callback`;
    const next = getRedirect?.();
    return next ? `${base}?next=${encodeURIComponent(next)}` : base;
  }

  async function oauth(provider: "google" | "github" | "gitlab") {
    setPending(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl() },
    });
    if (error) {
      toast.error(error.message);
      setPending(false);
    }
  }

  async function emailAuth(mode: "signin" | "signup", form: FormData) {
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setPending(true);
    try {
      if (mode === "signup") {
        const username = String(form.get("username") ?? "").trim().toLowerCase();
        if (!/^[a-z0-9_-]{3,20}$/.test(username)) {
          toast.error(t("auth.usernameInvalid"));
          setPending(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          // Metadata flows into the profiles row via the handle_new_user trigger.
          options: { emailRedirectTo: callbackUrl(), data: { username } },
        });
        if (error) throw error;
        toast.success(t("auth.confirmEmail"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success(t("auth.welcomeBack"));
        onOpenChange(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.failed"));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("auth.title")}</DialogTitle>
          <DialogDescription>{t("auth.subtitle")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => oauth("google")}
          >
            <GoogleIcon className="size-4" />
            {t("auth.google")}
          </Button>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => oauth("github")}
          >
            <GithubIcon className="size-4" />
            {t("auth.github")}
          </Button>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => oauth("gitlab")}
          >
            <GitlabIcon className="size-4" />
            {t("auth.gitlab")}
          </Button>
        </div>

        <div className="relative my-1 text-center text-xs text-muted-foreground">
          <span className="relative z-10 bg-popover px-2">{t("auth.or")}</span>
          <span className="absolute inset-x-0 top-1/2 z-0 h-px bg-border" />
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{t("auth.signIn")}</TabsTrigger>
            <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
          </TabsList>

          {(["signin", "signup"] as const).map((mode) => (
            <TabsContent key={mode} value={mode}>
              <form
                className="grid gap-3 pt-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  emailAuth(mode, new FormData(e.currentTarget));
                }}
              >
                {mode === "signup" && (
                  <IconInput
                    icon={AtSign}
                    name="username"
                    required
                    minLength={3}
                    maxLength={20}
                    pattern="[a-zA-Z0-9_\-]{3,20}"
                    placeholder={t("auth.usernamePlaceholder")}
                    autoComplete="username"
                  />
                )}
                <IconInput
                  icon={Mail}
                  name="email"
                  type="email"
                  required
                  placeholder={t("auth.emailPlaceholder")}
                />
                <IconInput
                  icon={Lock}
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder={t("auth.passwordPlaceholder")}
                />
                <Button type="submit" disabled={pending}>
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  {mode === "signin"
                    ? t("auth.signIn")
                    : t("auth.createAccount")}
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
