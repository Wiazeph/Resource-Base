"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Globe, Mail, Pencil, Send, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ResourceGrid } from "@/components/resource-grid";
import { MySubmissions } from "@/components/my-submissions";
import { useAuth } from "@/components/auth/auth-provider";
import { fetchPublicEmail } from "@/lib/profile";
import type { Category, PublicProfile, Resource } from "@/lib/types";

// Lucide 1.x dropped brand marks — inline brand SVGs for recognizable icons.
function GithubIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 496 512" className="size-4" aria-hidden="true">
      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 512 512" className="size-4" aria-hidden="true">
      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 448 512" className="size-4" aria-hidden="true">
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

function DribbbleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
      <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
      <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
    </svg>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
    >
      {children}
    </a>
  );
}

export function PublicProfileView({
  profile,
  resources,
  categories,
}: {
  profile: PublicProfile;
  resources: Resource[];
  categories: Category[];
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isOwner = user?.id === profile.id;
  const name = profile.full_name || `@${profile.username}`;

  // Email display: the owner always sees their own (from the session) with an
  // eye/eye-off marking whether it's public; other visitors see it only if the
  // owner opted in (fetched via the public_email RPC, never the raw column).
  const [publicEmail, setPublicEmail] = useState<string | null>(null);
  useEffect(() => {
    if (!isOwner && profile.show_email) {
      fetchPublicEmail(profile.id).then(setPublicEmail);
    }
  }, [isOwner, profile.show_email, profile.id]);
  const email = isOwner ? (user?.email ?? null) : publicEmail;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid size-20 place-items-center overflow-hidden rounded-full border border-border bg-muted">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" className="size-full object-cover" />
          ) : (
            <UserIcon className="size-8 text-muted-foreground" />
          )}
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          {email && (
            <p className="mt-1 inline-flex items-start gap-1.5 text-sm text-muted-foreground">
              {!isOwner && <Mail className="mt-0.5 size-3.5" />}
              <span className="relative">
                {email}
                {/* Owner-only visibility marker, pinned to the top-right. */}
                {isOwner && (
                  <span
                    className="absolute -right-[18px] -top-1 text-muted-foreground"
                    title={
                      profile.show_email
                        ? t("profile.emailPublic")
                        : t("profile.emailHidden")
                    }
                  >
                    {profile.show_email ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeOff className="size-4" />
                    )}
                  </span>
                )}
              </span>
            </p>
          )}
        </div>
        {isOwner && (
          <Button asChild size="sm" variant="outline">
            <Link href="/profile/edit">
              <Pencil className="size-3.5" /> {t("profile.editTitle")}
            </Link>
          </Button>
        )}
        {profile.bio && (
          <p className="max-w-md text-balance text-sm text-muted-foreground">
            {profile.bio}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {profile.portfolio_url && (
            <SocialLink href={profile.portfolio_url} label="Portfolio">
              <Globe className="size-4" />
            </SocialLink>
          )}
          {profile.github_url && (
            <SocialLink href={profile.github_url} label="GitHub">
              <GithubIcon />
            </SocialLink>
          )}
          {profile.twitter_url && (
            <SocialLink href={profile.twitter_url} label="X">
              <XIcon />
            </SocialLink>
          )}
          {profile.instagram_url && (
            <SocialLink href={profile.instagram_url} label="Instagram">
              <InstagramIcon />
            </SocialLink>
          )}
          {profile.dribbble_url && (
            <SocialLink href={profile.dribbble_url} label="Dribbble">
              <DribbbleIcon />
            </SocialLink>
          )}
        </div>
      </div>

      {/* Contributions */}
      <div className="mt-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("profile.contributions", { count: resources.length })}
        </h2>
        {resources.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            {t("profile.noContributions")}
          </p>
        ) : (
          <ResourceGrid resources={resources} />
        )}
      </div>

      {/* My submissions — owner only, so users can track pending/rejected
          items and resubmit, right where they look for their own activity. */}
      {isOwner && (
        <div className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <Send className="size-5 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("submissions.title")}
            </h2>
          </div>
          <MySubmissions categories={categories} />
        </div>
      )}
    </div>
  );
}
