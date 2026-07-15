"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signUpEmail } from "@/server/auth-actions";

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

const initialState = {
  error: "",
};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    signUpEmail,
    initialState
  );

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>

              <Input
                name="name"
                type="text"
                placeholder="John Doe"
                required
              />
            </Field>

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

            <Field>
              <FieldLabel>Confirm Password</FieldLabel>

              <Input
                name="confirm-password"
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
              {pending ? "Creating account..." : "Create Account"}
            </Button>

            <FieldDescription className="text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}