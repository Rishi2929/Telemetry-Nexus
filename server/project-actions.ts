"use server";

import { getServerSession } from "@/lib/session";

export async function createProject(formData: FormData) {
  const session = await getServerSession();

  if(!session){
      throw new Error("Unauthorized");
  }
  const name = formData.get("name");
  const description = formData.get("description");

  console.log(session)

  console.log(name);
  console.log(description)
}