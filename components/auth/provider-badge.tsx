import { GithubIcon, GoogleIcon } from "@/components/brand-icons";
import { cn } from "@/lib/utils";

/**
 * Small overlay badge for the bottom-right of an avatar showing which OAuth
 * provider the signed-in user authenticated with. Rendered ONLY for the user
 * themselves (never on other people's public profiles), so it's a private hint
 * about your own sign-in method — not public information.
 *
 * Returns null for email sign-ups and unknown providers, so callers can drop it
 * in unconditionally.
 */
export function ProviderBadge({
  provider,
  className,
  iconClassName = "size-3",
}: {
  provider: string | null | undefined;
  className?: string;
  iconClassName?: string;
}) {
  const Icon =
    provider === "google"
      ? GoogleIcon
      : provider === "github"
        ? GithubIcon
        : null;
  if (!Icon) return null;

  return (
    <span
      className={cn(
        "absolute -bottom-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-background ring-2 ring-background",
        className,
      )}
      title={provider === "google" ? "Google" : "GitHub"}
    >
      <Icon className={iconClassName} />
    </span>
  );
}
