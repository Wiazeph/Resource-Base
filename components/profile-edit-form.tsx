"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AtSign, Eye, EyeOff, Globe, Loader2, Mail, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconInput } from "@/components/ui/icon-input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { useProfile } from "@/lib/profile";

export function ProfileEditForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading: authLoading, openAuth } = useAuth();
  const { profile, loading, update, setUsername } = useProfile();
  const [pending, setPending] = useState(false);
  const [username, setUsernameInput] = useState("");
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    if (profile?.username) setUsernameInput(profile.username);
  }, [profile?.username]);
  useEffect(() => {
    setShowEmail(!!profile?.show_email);
  }, [profile?.show_email]);

  if (!authLoading && !user) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">{t("profile.signInPrompt")}</p>
        <Button className="mt-4" onClick={openAuth}>
          {t("header.signIn")}
        </Button>
      </div>
    );
  }

  if (loading || !profile) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <Loader2 className="mx-auto size-5 animate-spin" />
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setPending(true);
    try {
      // Username goes through the validated RPC if it changed.
      const nextUsername = username.trim().toLowerCase();
      if (nextUsername && nextUsername !== profile!.username) {
        const { error } = await setUsername(nextUsername);
        if (error) {
          toast.error(
            error === "username_taken"
              ? t("profile.usernameTaken")
              : error === "invalid_username"
                ? t("auth.usernameInvalid")
                : error,
          );
          setPending(false);
          return;
        }
      }
      const { error } = await update({
        full_name: data.full_name || null,
        bio: data.bio || null,
        portfolio_url: data.portfolio_url || null,
        github_url: data.github_url || null,
        twitter_url: data.twitter_url || null,
        instagram_url: data.instagram_url || null,
        dribbble_url: data.dribbble_url || null,
        show_email: showEmail,
      });
      if (error) throw new Error(error);
      toast.success(t("profile.saved"));
      router.push(`/profile/${nextUsername || profile!.username}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("profile.saveError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{t("profile.editTitle")}</h1>

      {/* Email is read-only (managed by auth) with a public-visibility toggle. */}
      <Field label={t("profile.email")}>
        <div className="flex items-center gap-2">
          <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-muted/40 px-3 text-sm text-muted-foreground">
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{profile.email}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowEmail((v) => !v)}
            className={cn(
              "h-9 w-28 shrink-0 justify-center",
              showEmail && "border-primary text-primary",
            )}
            aria-pressed={showEmail}
          >
            {showEmail ? (
              <Eye className="size-4" />
            ) : (
              <EyeOff className="size-4" />
            )}
            {showEmail ? t("profile.emailPublic") : t("profile.emailHidden")}
          </Button>
        </div>
      </Field>

      <Field label={t("profile.username")}>
        <IconInput
          icon={AtSign}
          value={username}
          onChange={(e) => setUsernameInput(e.target.value)}
          required
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_\-]{3,20}"
          placeholder={t("auth.usernamePlaceholder")}
        />
      </Field>
      <Field label={t("profile.fullName")}>
        <IconInput icon={User} name="full_name" defaultValue={profile.full_name ?? ""} />
      </Field>
      <Field label={t("profile.bio")}>
        <Textarea name="bio" rows={3} defaultValue={profile.bio ?? ""} maxLength={280} />
      </Field>
      <Field label={t("profile.portfolio")}>
        <IconInput icon={Globe} name="portfolio_url" type="url" defaultValue={profile.portfolio_url ?? ""} placeholder="https://…" />
      </Field>
      <Field label="GitHub">
        <IconInput icon={Globe} name="github_url" type="url" defaultValue={profile.github_url ?? ""} placeholder="https://github.com/…" />
      </Field>
      <Field label="X (Twitter)">
        <IconInput icon={Globe} name="twitter_url" type="url" defaultValue={profile.twitter_url ?? ""} placeholder="https://x.com/…" />
      </Field>
      <Field label="Instagram">
        <IconInput icon={Globe} name="instagram_url" type="url" defaultValue={profile.instagram_url ?? ""} placeholder="https://instagram.com/…" />
      </Field>
      <Field label="Dribbble">
        <IconInput icon={Globe} name="dribbble_url" type="url" defaultValue={profile.dribbble_url ?? ""} placeholder="https://dribbble.com/…" />
      </Field>

      <Button type="submit" disabled={pending} size="lg" className="w-full">
        {pending && <Loader2 className="size-4 animate-spin" />}
        {t("profile.save")}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
