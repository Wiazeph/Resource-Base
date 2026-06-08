"use client";

import Link from "next/link";
import { Bell, LogOut, Plus, Star, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/auth-provider";
import { useNotifications } from "@/lib/notifications";

export function UserMenu() {
  const { user, loading, openAuth, signOut } = useAuth();
  const { unread } = useNotifications();

  if (loading) {
    return <div className="size-9 animate-pulse rounded-full bg-muted" />;
  }

  if (!user) {
    return (
      <Button size="sm" variant="outline" onClick={openAuth}>
        Sign in
      </Button>
    );
  }

  const name =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    user.email ||
    "Account";
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-border bg-muted text-sm"
          aria-label="Account menu"
        >
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="size-full object-cover" />
          ) : (
            <UserIcon className="size-4" />
          )}
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-primary ring-2 ring-background" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notifications">
            <Bell className="size-4" /> Notifications
            {unread > 0 && (
              <span className="ml-auto rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground">
                {unread}
              </span>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/favorites">
            <Star className="size-4" /> Favorites
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/submit">
            <Plus className="size-4" /> Submit a resource
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
