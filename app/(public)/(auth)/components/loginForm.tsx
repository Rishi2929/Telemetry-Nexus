"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/authClient";
import { Terminal, Loader2, AlertCircle, AtSign, KeyRound, Sparkles, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleFillDemo = () => {
    setEmail("demo@telemetrynexus.io");
    setPassword("DemoDeveloper123!");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (signInError) {
        setError(signInError.message ?? "Unable to authenticate credentials.");
        return;
      }
    } catch {
      setError("Server error during authentication.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[220px] bg-emerald-500/10 blur-[110px] pointer-events-none rounded-full" />

      <Card className="relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-2xl font-sans text-left">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/70 border-b border-border/60">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <span className="text-[11px] font-mono text-muted-foreground pl-2 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              auth@telemetry-nexus
            </span>
          </div>

          <Badge
            variant="outline"
            className="font-mono text-[9px] px-2 py-0.5 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1"
          >
            <ShieldCheck className="h-3 w-3" />
            SECURE AUTH
          </Badge>
        </div>

        <CardContent className="p-6 space-y-7">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-xl font-extrabold tracking-tight text-foreground">Account Sign In</h1>

              <p className="text-xs font-mono text-muted-foreground">Enter your credentials to access project logs.</p>
            </div>

            {/* Demo Login */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFillDemo}
              className="font-mono text-[10px] h-7 px-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 gap-1 shrink-0"
            >
              <Sparkles className="h-3 w-3" />
              Auto-fill Demo
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2.5">
              <label htmlFor="email" className="text-xs font-mono text-foreground font-medium flex items-center gap-1.5">
                <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
                Email Address
              </label>

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                required
                className="font-mono text-xs h-10 bg-black/40 border-border/80 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-mono text-foreground font-medium flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-[10px] font-mono text-muted-foreground hover:text-emerald-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="font-mono text-xs h-10 bg-black/40 border-border/80 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500 transition-all"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 font-mono text-xs animate-in fade-in-50">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={pending}
              className="w-full h-11 font-mono text-xs bg-emerald-500 text-black hover:bg-emerald-400 font-semibold transition-all shadow-lg shadow-emerald-500/20"
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-between w-full px-1">
                  <span>Sign In to Dashboard</span>

                  <div className="flex items-center gap-1 text-[10px] opacity-70 bg-black/20 px-1.5 py-0.5 rounded">
                    <span>⌘</span>
                    <span>↵</span>
                  </div>
                </span>
              )}
            </Button>

            {/* Signup */}
            <div className="text-center text-xs font-mono text-muted-foreground pt-3 border-t border-border/40">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-emerald-400 font-semibold hover:underline">
                Create Account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
