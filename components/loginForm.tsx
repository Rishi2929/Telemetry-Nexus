"use client";

import { useActionState } from "react";



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
import { signInEmail } from "@/server/auth-actions";
import Link from "next/link";


const initialState = {
  error: "",
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    signInEmail,
    initialState
  );

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction}>
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

            {state?.error && (
              <FieldDescription className="text-destructive">
                {state.error}
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