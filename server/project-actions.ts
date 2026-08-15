"use server";

import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/session";
import { createApiKey } from "@/lib/auth/api-key";
import { cookies } from "next/headers";

async function generateAndAttachApiKey(projectId: string) {
  const { publicId, apiKey, keyHash } = await createApiKey();

  // 1. Create the API key record linked to the given project
  const createdApiKey = await prisma.apiKey.create({
    data: {
      projectId,
      publicId,
      keyHash,
    },
  });

  // 2. Set the cookie for temporary client-side display
  const cookieStore = await cookies();
  cookieStore.set("new-api-key", apiKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 5,
    path: "/",
  });

  return createdApiKey;
}

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

  // 1. Create the project record
  const project = await prisma.project.create({
    data: {
      name,
      description: description || null,
      ownerId: session.user.id,
    },
  });

  // 2. Delegate key generation, DB creation, and cookie setting
  await generateAndAttachApiKey(project.id);

  // 3. Redirect to reveal page
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

  const { publicId, apiKey, keyHash } = await createApiKey();

  await prisma.apiKey.update({
    where: {
      id: existingApiKey.id,
    },
    data: {
      publicId,
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
