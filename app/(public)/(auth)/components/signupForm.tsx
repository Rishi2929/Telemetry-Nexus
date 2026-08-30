"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { authClient } from "@/lib/auth/authClient";

import { Terminal, Loader2, AlertCircle, AtSign, KeyRound, User, ShieldCheck, CheckCircle2 } from "lucide-react";

export function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setEmailError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/dashboard",
      });

      console.log("Better Auth signup response:", result);

      if (result.error) {
        console.log("Better Auth signup error:", result.error);
        console.log("Error code:", result.error.code);
        console.log("Error message:", result.error.message);

        const code = result.error.code?.toUpperCase() || "";
        const message = result.error.message?.toLowerCase() || "";

        if (
          code === "USER_ALREADY_EXISTS" ||
          code === "EMAIL_ALREADY_EXISTS" ||
          message.includes("already exists") ||
          message.includes("already registered") ||
          message.includes("user already exists") ||
          message.includes("email already exists")
        ) {
          setEmailError("An account with this email already exists.");
        } else {
          setError(result.error.message || "Unable to create account.");
        }

        return;
      }
      router.push("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[220px] bg-emerald-500/10 blur-[110px] pointer-events-none rounded-full" />

      <Card className="relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-2xl font-sans text-left">
        <TerminalHeader />

        <CardContent className="p-6 space-y-5">
          <FormHeader />

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormFields
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              emailError={emailError}
              setEmailError={setEmailError}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
            />

            {error && <ErrorAlert message={error} />}

            <SubmitButton pending={pending} />

            <LoginFooter />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function TerminalHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-muted/70 border-b border-border/60">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>

        <span className="text-[11px] font-mono text-muted-foreground pl-2 flex items-center gap-1.5">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          register@telemetry-nexus
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
  );
}

function FormHeader() {
  return (
    <div className="space-y-1">
      <h1 className="text-xl font-extrabold tracking-tight text-foreground">Create Account</h1>

      <p className="text-xs font-mono text-muted-foreground">Provision developer credentials for real-time API monitoring.</p>
    </div>
  );
}

function FormFields({
  name,
  setName,
  email,
  setEmail,
  emailError,
  setEmailError,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}: {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  emailError: string;
  setEmailError: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
}) {
  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-foreground font-medium flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          Full Name
        </label>

        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          className="text-xs h-10 bg-black/40 border-border/80 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500 transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-foreground font-medium flex items-center gap-1.5">
          <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
          Email Address
        </label>

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);

            if (emailError) {
              setEmailError("");
            }
          }}
          placeholder="developer@company.com"
          required
          aria-invalid={!!emailError}
          className={`text-xs h-10 bg-black/40 transition-all ${
            emailError
              ? "border-rose-500/60 focus-visible:ring-rose-500/30 focus-visible:border-rose-500"
              : "border-border/80 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500"
          }`}
        />

        {emailError && (
          <div className="flex items-center gap-1.5 text-[10px] text-rose-400 animate-in fade-in-50">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{emailError}</span>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-foreground font-medium flex items-center gap-1.5">
          <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
          Password
        </label>

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          required
          className="text-xs h-10 bg-black/40 border-border/80 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500 transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirm-password" className="text-foreground font-medium flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
          Confirm Password
        </label>

        <Input
          id="confirm-password"
          name="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••••••"
          required
          className="text-xs h-10 bg-black/40 border-border/80 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500 transition-all"
        />
      </div>
    </div>
  );
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 font-mono text-xs animate-in fade-in-50">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-11 font-mono text-xs bg-emerald-500 text-black hover:bg-emerald-400 font-semibold transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Provisioning Account...
        </span>
      ) : (
        <span className="flex items-center justify-between w-full px-1">
          <span>Create Account</span>

          <div className="flex items-center gap-1 text-[10px] opacity-70 bg-black/20 px-1.5 py-0.5 rounded">
            <span>⌘</span>
            <span>↵</span>
          </div>
        </span>
      )}
    </Button>
  );
}

function LoginFooter() {
  return (
    <div className="text-center text-xs font-mono text-muted-foreground pt-3 border-t border-border/40">
      Already have an account?{" "}
      <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
        Sign in
      </Link>
    </div>
  );
}
