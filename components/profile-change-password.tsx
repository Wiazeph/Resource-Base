"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
import { authClient } from "@/lib/auth-client";

const PW_MIN = 8;
const PW_MAX = 64;

/**
 * Change-password section for the profile editor. Only shown to users who have
 * a password (a `credential` account); OAuth-only users see an explanatory note.
 */
export function ProfileChangePassword() {
  const { t } = useTranslation();
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    authClient.listAccounts().then((res) => {
      if (!active) return;
      const accounts = (res?.data ?? []) as { providerId?: string }[];
      setHasPassword(accounts.some((a) => a.providerId === "credential"));
    });
    return () => {
      active = false;
    };
  }, []);

  if (hasPassword === null) return null; // still loading — render nothing

  if (!hasPassword) {
    return (
      <section className="rounded-xl border border-border p-4">
        <h2 className="text-sm font-semibold">{t("auth.changePassword")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("auth.noPasswordSet")}
        </p>
      </section>
    );
  }

  const valid =
    current.length >= PW_MIN &&
    next.length >= PW_MIN &&
    next === confirm &&
    !pending;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setPending(true);
    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: true,
    });
    setPending(false);
    if (error) {
      toast.error(error.message ?? t("auth.failed"));
      return;
    }
    toast.success(t("auth.passwordChanged"));
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <section className="rounded-xl border border-border p-4">
      <h2 className="text-sm font-semibold">{t("auth.changePassword")}</h2>
      <form className="mt-3 grid gap-3" onSubmit={submit}>
        <IconInput
          icon={Lock}
          type="password"
          required
          minLength={PW_MIN}
          maxLength={PW_MAX}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder={t("auth.currentPassword")}
          autoComplete="current-password"
        />
        <IconInput
          icon={Lock}
          type="password"
          required
          minLength={PW_MIN}
          maxLength={PW_MAX}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          placeholder={t("auth.newPasswordPlaceholder")}
          autoComplete="new-password"
        />
        <IconInput
          icon={Lock}
          type="password"
          required
          minLength={PW_MIN}
          maxLength={PW_MAX}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={t("auth.confirmPasswordPlaceholder")}
          autoComplete="new-password"
        />
        {confirm.length > 0 && next !== confirm && (
          <p className="text-xs text-destructive">{t("auth.passwordMismatch")}</p>
        )}
        <Button type="submit" disabled={!valid} className="w-fit">
          {pending && <Loader2 className="size-4 animate-spin" />}
          {t("auth.changePassword")}
        </Button>
      </form>
    </section>
  );
}
