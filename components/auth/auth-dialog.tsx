"use client";

import { useState } from "react";
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
import { authClient } from "@/lib/auth-client";
import { setUsername } from "@/lib/profile-actions";

export function AuthDialog({
  open,
  onOpenChange,
  getRedirect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Returns the post-login path to forward to after OAuth, if any. */
  getRedirect?: () => string | null;
}) {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);

  function callbackPath() {
    const next = getRedirect?.();
    return next && next.startsWith("/") ? next : "/";
  }

  async function oauth(provider: "google" | "github" | "gitlab") {
    setPending(true);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: callbackPath(),
    });
    if (error) {
      toast.error(error.message ?? t("auth.failed"));
      setPending(false);
    }
  }

  async function emailAuth(mode: "signin" | "signup", form: FormData) {
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setPending(true);
    try {
      if (mode === "signup") {
        const username = String(form.get("username") ?? "")
          .trim()
          .toLowerCase();
        if (!/^[a-z0-9_-]{3,20}$/.test(username)) {
          toast.error(t("auth.usernameInvalid"));
          setPending(false);
          return;
        }
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: username,
        });
        if (error) throw new Error(error.message ?? t("auth.failed"));
        // Apply the chosen username (overrides the auto-generated one).
        const res = await setUsername(username);
        if (res.error === "username_taken") toast.error(t("auth.usernameTaken"));
        toast.success(t("auth.welcomeBack"));
        onOpenChange(false);
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) throw new Error(error.message ?? t("auth.failed"));
        toast.success(t("auth.welcomeBack"));
        onOpenChange(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.failed"));
    } finally {
      setPending(false);
    }
  }

  async function forgotPassword(form: FormData) {
    const email = String(form.get("email") ?? "");
    if (!email) {
      toast.error(t("auth.emailPlaceholder"));
      return;
    }
    setPending(true);
    await authClient.requestPasswordReset({
      email,
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : "/reset-password",
    });
    setPending(false);
    // Generic message regardless of whether the email exists (no enumeration).
    toast.success(t("auth.resetEmailSent"));
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
                {mode === "signin" && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={(e) => {
                      const form = e.currentTarget.closest("form");
                      if (form) forgotPassword(new FormData(form));
                    }}
                    className="justify-self-center text-xs text-muted-foreground underline-offset-4 hover:underline"
                  >
                    {t("auth.forgotPassword")}
                  </button>
                )}
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
