"use server";

export async function createProject(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");

  console.log({
    name,
    description,
  });
}