import { redirect, notFound } from "next/navigation";

import { getServerSession } from "@/lib/auth/session";
import { getIncident } from "@/lib/db/incidents";
import { IncidentActions } from "./components/IncidentActions";

type IncidentDetailPageProps = {
  params: Promise<{
    incidentId: string;
  }>;
};

export default async function IncidentDetailPage({ params }: IncidentDetailPageProps) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const { incidentId } = await params;

  const incident = await getIncident(incidentId, session.user.id);

  console.log("Incident Details Page : ", incident);

  if (!incident) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{incident.title}</h1>

            <p className="text-muted-foreground">{incident.project.name}</p>
          </div>

          <IncidentActions incidentId={incident.id} resolved={incident.resolved} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Severity</p>

          <p className="mt-1 font-medium">{incident.severity}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Status</p>

          <p className="mt-1 font-medium">{incident.resolved ? "Resolved" : "Open"}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Occurrences</p>

          <p className="mt-1 font-medium">{incident.occurrenceCount}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Endpoint</p>

          <p className="mt-1 font-medium">{incident.endpoint ?? "Multiple routes"}</p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="font-semibold">Description</h2>

        <p className="mt-2 text-muted-foreground">{incident.description ?? "No description available."}</p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="font-semibold">Affected Routes</h2>

        {incident.affectedRoutes.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No affected routes found.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {incident.affectedRoutes.map((route) => (
              <div key={route.endpoint} className="flex items-center justify-between border-b pb-3 last:border-0">
                <span className="font-mono text-sm">{route.endpoint}</span>

                <span className="text-sm text-muted-foreground">{route.occurrences} occurrences</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>First detected: {incident.createdAt.toLocaleString()}</p>

        <p>Last detected: {incident.lastSeenAt?.toLocaleString() ?? "Unknown"}</p>

        {incident.resolvedAt && <p>Resolved: {incident.resolvedAt.toLocaleString()}</p>}
      </div>
    </div>
  );
}
