"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { generateApiKey, hashApiKey } from "@/lib/api-key";
import { cookies } from "next/headers";


export async function createProject(formData: FormData) {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";

  if (!name) {
    throw new Error("Project name is required");
  }

   const apiKey = generateApiKey();
  const keyHash = await hashApiKey(apiKey);

  const cookieStore = await cookies();


  const project = await prisma.project.create({
    data: {
      name,
      description: description || null,
      ownerId: session.user.id,
      apiKeys: {
        create: {
          keyHash
        }
      }
    },
  });

  cookieStore.set("new-api-key", apiKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 5,
    path: "/",
  });


  redirect(`/projects/${project.id}/api-key`);
}