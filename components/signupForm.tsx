"use client";

import Link from "next/link";
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
import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";

const initialState = {
  error: "",
};

export function SignupForm() {
      const router = useRouter();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirm-password")?.toString() ?? "";

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setPending(false);
      return;
    }

    try {

      const {error} = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/"
      })
      // console.log(result);

      if (error) {
        setError(error.message ?? "Unable to create account.");
        setPending(false);
        return;
      }
       router.push("/dashboard");
  router.refresh();
    }
    catch {
      setError("Something went wrong");
    }
    finally {
      setPending(false);
    }
  }


  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
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