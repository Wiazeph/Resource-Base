"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";

function ResetForm() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const linkError = params.get("error");
  const [pending, setPending] = useState(false);

  if (linkError || !token) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("auth.resetLinkInvalid")}
      </p>
    );
  }

  async function submit(form: FormData) {
    const password = String(form.get("password") ?? "");
    if (password.length < 6) {
      toast.error(t("auth.passwordTooShort"));
      return;
    }
    setPending(true);
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token: token!,
    });
    setPending(false);
    if (error) {
      toast.error(error.message ?? t("auth.failed"));
      return;
    }
    toast.success(t("auth.passwordReset"));
    router.push("/?auth=signin");
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit(new FormData(e.currentTarget));
      }}
    >
      <IconInput
        icon={Lock}
        name="password"
        type="password"
        required
        minLength={6}
        placeholder={t("auth.newPasswordPlaceholder")}
        autoComplete="new-password"
      />
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        {t("auth.setNewPassword")}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="mb-1 text-xl font-semibold">{t("auth.resetTitle")}</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {t("auth.resetSubtitle")}
      </p>
      <Suspense>
        <ResetForm />
      </Suspense>
    </div>
  );
}
