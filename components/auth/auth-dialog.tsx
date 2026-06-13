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
import { markSignInIntent } from "@/components/auth/auth-provider";
import { setUsername } from "@/lib/profile-actions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-z0-9_-]{3,20}$/;
const PW_MIN = 8;
const PW_MAX = 64;

function emailOk(v: string) {
  return EMAIL_RE.test(v.trim()) && v.trim().length <= 254;
}

export function AuthDialog({
  open,
  onOpenChange,
  getRedirect,
  notice,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Returns the post-login path to forward to after OAuth, if any. */
  getRedirect?: () => string | null;
  /** Optional warning shown above the form (e.g. account_not_linked). */
  notice?: string | null;
}) {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  const [view, setView] = useState<"auth" | "forgot">("auth");

  // Controlled fields (so buttons can be disabled until valid).
  const [siEmail, setSiEmail] = useState("");
  const [siPw, setSiPw] = useState("");
  const [suUser, setSuUser] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPw, setSuPw] = useState("");
  const [fpEmail, setFpEmail] = useState("");

  function callbackPath() {
    const next = getRedirect?.();
    return next && next.startsWith("/") ? next : "/";
  }

  // Clear form fields after a submit — success or failure — so stale values
  // never linger (requested UX). Each helper resets only its own view's inputs.
  function resetSignIn() {
    setSiEmail("");
    setSiPw("");
  }
  function resetSignUp() {
    setSuUser("");
    setSuEmail("");
    setSuPw("");
  }

  async function oauth(provider: "google" | "github" | "gitlab") {
    setPending(true);
    markSignInIntent();
    // errorCallbackURL must be a plain path (no query string — Better Auth
    // rejects that with "Invalid errorCallbackURL"). Better Auth appends its own
    // ?error=<code> (e.g. account_not_linked), which AuthProvider then handles.
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: callbackPath(),
      errorCallbackURL: "/",
    });
    if (error) {
      toast.error(error.message ?? t("auth.failed"));
      setPending(false);
    }
  }

  async function signin() {
    setPending(true);
    markSignInIntent();
    try {
      const { error } = await authClient.signIn.email({
        email: siEmail.trim(),
        password: siPw,
      });
      if (error) throw new Error(error.message ?? t("auth.failed"));
      // Welcome toast is fired centrally in AuthProvider (on the user-id
      // transition) so it works for both email and OAuth sign-in.
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.failed"));
    } finally {
      setPending(false);
      resetSignIn();
    }
  }

  async function signup() {
    setPending(true);
    markSignInIntent();
    try {
      const username = suUser.trim().toLowerCase();
      const { error } = await authClient.signUp.email({
        email: suEmail.trim(),
        password: suPw,
        name: username,
      });
      if (error) throw new Error(error.message ?? t("auth.failed"));
      const res = await setUsername(username);
      if (res.error === "username_taken") toast.error(t("auth.usernameTaken"));
      // Welcome toast fired centrally in AuthProvider (see signin()).
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.failed"));
    } finally {
      setPending(false);
      resetSignUp();
    }
  }

  async function forgot() {
    setPending(true);
    try {
      await authClient.requestPasswordReset({
        email: fpEmail.trim(),
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/reset-password`
            : "/reset-password",
      });
      toast.success(t("auth.resetEmailSent"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.failed"));
    } finally {
      setPending(false);
      setFpEmail("");
      setView("auth");
    }
  }

  const siValid = emailOk(siEmail) && siPw.length >= PW_MIN;
  const suValid =
    USERNAME_RE.test(suUser.trim().toLowerCase()) &&
    emailOk(suEmail) &&
    suPw.length >= PW_MIN;
  const fpValid = emailOk(fpEmail);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setView("auth");
      }}
    >
      <DialogContent className="sm:max-w-sm">
        {view === "forgot" ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("auth.forgotTitle")}</DialogTitle>
              <DialogDescription>{t("auth.forgotSubtitle")}</DialogDescription>
            </DialogHeader>
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (fpValid && !pending) forgot();
              }}
            >
              <IconInput
                icon={Mail}
                type="email"
                required
                maxLength={254}
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                autoComplete="email"
                autoFocus
              />
              <Button type="submit" disabled={!fpValid || pending}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                {t("auth.sendResetLink")}
              </Button>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="justify-self-center"
                disabled={pending}
                onClick={() => setView("auth")}
              >
                {t("auth.backToSignIn")}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("auth.title")}</DialogTitle>
              <DialogDescription>{t("auth.subtitle")}</DialogDescription>
            </DialogHeader>

            {notice && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                {notice}
              </div>
            )}

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
              <span className="relative z-10 bg-popover px-2">
                {t("auth.or")}
              </span>
              <span className="absolute inset-x-0 top-1/2 z-0 h-px bg-border" />
            </div>

            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">{t("auth.signIn")}</TabsTrigger>
                <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
              </TabsList>

              {/* Sign in */}
              <TabsContent value="signin">
                <form
                  className="grid gap-3 pt-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (siValid && !pending) signin();
                  }}
                >
                  <IconInput
                    icon={Mail}
                    type="email"
                    required
                    maxLength={254}
                    value={siEmail}
                    onChange={(e) => setSiEmail(e.target.value)}
                    placeholder={t("auth.emailPlaceholder")}
                    autoComplete="email"
                  />
                  <IconInput
                    icon={Lock}
                    type="password"
                    required
                    minLength={PW_MIN}
                    maxLength={PW_MAX}
                    value={siPw}
                    onChange={(e) => setSiPw(e.target.value)}
                    placeholder={t("auth.passwordPlaceholder")}
                    autoComplete="current-password"
                  />
                  <Button type="submit" disabled={!siValid || pending}>
                    {pending && <Loader2 className="size-4 animate-spin" />}
                    {t("auth.signIn")}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="justify-self-center"
                    disabled={pending}
                    onClick={() => setView("forgot")}
                  >
                    {t("auth.forgotPassword")}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign up */}
              <TabsContent value="signup">
                <form
                  className="grid gap-3 pt-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (suValid && !pending) signup();
                  }}
                >
                  <IconInput
                    icon={AtSign}
                    required
                    minLength={3}
                    maxLength={20}
                    pattern="[a-zA-Z0-9_\-]{3,20}"
                    value={suUser}
                    onChange={(e) => setSuUser(e.target.value)}
                    placeholder={t("auth.usernamePlaceholder")}
                    autoComplete="username"
                  />
                  <IconInput
                    icon={Mail}
                    type="email"
                    required
                    maxLength={254}
                    value={suEmail}
                    onChange={(e) => setSuEmail(e.target.value)}
                    placeholder={t("auth.emailPlaceholder")}
                    autoComplete="email"
                  />
                  <IconInput
                    icon={Lock}
                    type="password"
                    required
                    minLength={PW_MIN}
                    maxLength={PW_MAX}
                    value={suPw}
                    onChange={(e) => setSuPw(e.target.value)}
                    placeholder={t("auth.passwordPlaceholder")}
                    autoComplete="new-password"
                  />
                  <Button type="submit" disabled={!suValid || pending}>
                    {pending && <Loader2 className="size-4 animate-spin" />}
                    {t("auth.createAccount")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
