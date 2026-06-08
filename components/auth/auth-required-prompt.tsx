"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/components/auth/auth-provider";

/**
 * When the middleware bounces a signed-out user off a protected page it adds
 * ?auth=required. This opens the sign-in modal and cleans the URL so the
 * redirect is explained rather than silent.
 */
export function AuthRequiredPrompt() {
  const { t } = useTranslation();
  const { openAuth, loading, user } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handled = useRef(false);

  useEffect(() => {
    if (loading || handled.current) return;
    if (params.get("auth") === "required") {
      handled.current = true;
      if (!user) {
        toast.info(t("auth.requiredBody"));
        openAuth();
      }
      // Strip the param so a refresh doesn't re-trigger.
      router.replace(pathname, { scroll: false });
    }
  }, [params, loading, user, openAuth, router, pathname, t]);

  return null;
}
