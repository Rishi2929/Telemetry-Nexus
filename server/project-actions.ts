"use server";

import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { createApiKey, generateApiKey, hashApiKey } from "@/lib/api-key";
import { cookies } from "next/headers";

export async function createProject(formData: FormData) {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }
  console.log("Session ID: ", session.user.id);

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
          keyHash,
        },
      },
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

export async function updateProject(formData: FormData) {
  const projectId = formData.get("projectId")?.toString();
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;

  if (!projectId || !name) {
    throw new Error("Invalid form Data");
  }

  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.updateMany({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    data: {
      name,
      description,
    },
  });

  if (project.count === 0) {
    notFound();
  }

  redirect(`/projects/${projectId}`);
}

export async function deleteProject(formData: FormData) {
  const projectId = formData.get("projectId")?.toString();
  if (!projectId) {
    throw new Error("Invalid project ID");
  }
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.project.deleteMany({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
  });

  if (result.count === 0) {
    notFound();
  }

  redirect("/projects");
}

export async function regenerateApiKey(formData: FormData) {
  const projectId = formData.get("projectId")?.toString();

  if (!projectId) {
    throw new Error("Project Id is required");
  }

  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    include: {
      apiKeys: true,
    },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  const existingApiKey = project.apiKeys[0];

  if (!existingApiKey) {
    throw new Error("API key not found.");
  }

  const { apiKey, keyHash } = await createApiKey();
  await prisma.apiKey.update({
    where: {
      id: existingApiKey.id,
    },
    data: {
      keyHash,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set("new-api-key", apiKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 5,
    path: "/",
  });

  redirect(`/projects/${project.id}/api-key`);
}
