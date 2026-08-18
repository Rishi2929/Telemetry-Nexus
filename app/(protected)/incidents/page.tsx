import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth/session";
import { getUserIncidents } from "@/lib/db/incidents";
import { IncidentStats } from "./components/IncidentStats";
import { IncidentList } from "./components/IncidentList";

export default async function IncidentsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const incidents = await getUserIncidents(session.user.id);

  const openIncidents = incidents.filter((incident) => !incident.resolved);

  const criticalIncidents = incidents.filter((incident) => !incident.resolved && incident.severity === "CRITICAL");

  const uniqueIncidents = incidents.length;

  const totalOccurrences = incidents.reduce((total, incident) => total + incident.occurrenceCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Incidents</h1>

        <p className="text-muted-foreground">Monitor active and resolved API incidents.</p>
      </div>

      <IncidentStats
        openIncidents={openIncidents.length}
        uniqueIncidents={uniqueIncidents}
        totalOccurrences={totalOccurrences}
        criticalIncidents={criticalIncidents.length}
      />

      <IncidentList incidents={incidents} />
    </div>
  );
}
