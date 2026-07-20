"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

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

  const project = await prisma.project.create({
    data: {
      name,
      description: description || null,
      ownerId: session.user.id,
    },
  });
  // console.log(project)

  redirect("/projects");
}