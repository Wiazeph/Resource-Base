"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function AuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [pending, setPending] = useState(false);

  const callbackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : undefined;

  async function oauth(provider: "google" | "github") {
    setPending(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl },
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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: callbackUrl },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        onOpenChange(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Welcome to Resource Base</DialogTitle>
          <DialogDescription>
            Sign in to save favorites and submit resources.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => oauth("google")}
          >
            Continue with Google
          </Button>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => oauth("github")}
          >
            Continue with GitHub
          </Button>
        </div>

        <div className="relative my-1 text-center text-xs text-muted-foreground">
          <span className="relative z-10 bg-background px-2">or</span>
          <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
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
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
                <Input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Password"
                />
                <Button type="submit" disabled={pending}>
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  {mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
