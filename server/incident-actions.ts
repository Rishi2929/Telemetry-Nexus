"use server";

import { revalidatePath } from "next/cache";

import { getServerSession } from "@/lib/auth/session";
import { resolveIncident, reopenIncident } from "@/lib/db/incidents";

export async function resolveIncidentAction(incidentId: string) {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  await resolveIncident(incidentId, session.user.id);

  revalidatePath("/incidents");
  revalidatePath(`/incidents/${incidentId}`);
}

export async function reopenIncidentAction(incidentId: string) {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  await reopenIncident(incidentId, session.user.id);

  revalidatePath("/incidents");
  revalidatePath(`/incidents/${incidentId}`);
}
