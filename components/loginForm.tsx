"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authClient } from "@/lib/authClient";




export function LoginForm() {

  // const router = useRouter();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard"
      })

      if (error) {
        setError(error.message ?? "Unable to sign in ");
        setPending(false);
        return;
      }
    }
    catch{
      setError("Something went wrong");
    }
    finally{
      setPending(false);
    }


    // router.push("/dashboard");
    // router.refresh();
  }


  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>

              <Input
                name="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>

              <Input
                name="password"
                type="password"
                required
              />
            </Field>

            {error && (
              <FieldDescription className="text-destructive">
                {error}
              </FieldDescription>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full"
            >
              {pending ? "Signing in..." : "Sign In"}
            </Button>

            <FieldDescription className="text-center">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}