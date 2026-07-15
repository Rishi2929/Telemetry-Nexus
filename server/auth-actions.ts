"use server";

import { auth } from "@/lib/auth";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// export async function signInEmail( _: { error?: string } | null,formData: FormData) {
//   const email = formData.get("email")?.toString().trim();
//   const password = formData.get("password")?.toString();

//   if (!email || !password) {
//     return {
//       error: "Email and password are required.",
//     };
//   }

//   try {
//     const result = await auth.api.signInEmail({
//       body: {
//         email,
//         password,
//       },
//       headers: await headers(),
//     });
//     console.log(result);
//   } catch(error) {
//     console.error(error);
    
//     return{
//       error:
//         error instanceof Error ? error.message : "Invalid email or Password",
//     }
      
//   }

//   redirect("/dashboard");
// }




export async function signUpEmail(
  _: { error?: string } | null,
  formData: FormData
) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData
    .get("confirm-password")
    ?.toString();

  if (!name || !email || !password || !confirmPassword) {
    return {
      error: "All fields are required.",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match.",
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: await headers(),
    });
  } catch {
    return {
      error: "Unable to create account.",
    };
  }

  redirect("/dashboard");
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/login");
}