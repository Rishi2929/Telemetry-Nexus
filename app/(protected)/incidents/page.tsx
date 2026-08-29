import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth/session";
import { getUserIncidents } from "@/lib/db/incidents";
import { IncidentStats } from "./components/IncidentStats";
import { IncidentList } from "./components/IncidentList";
import { AlertTriangle, ShieldAlert } from "lucide-react";

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

  // console.log("Incidents", incidents);

  return (
    <div className="space-y-10 font-sans max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-border/60 pb-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
          <h1 className="text-2xl font-black tracking-tight text-foreground">Incidents</h1>
        </div>
        <p className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-zinc-500" />
          <span>Monitor active and resolved API telemetry incidents across projects.</span>
        </p>
      </div>

      {/* Overview Metric Cards */}
      <IncidentStats
        openIncidents={openIncidents.length}
        uniqueIncidents={uniqueIncidents}
        totalOccurrences={totalOccurrences}
        criticalIncidents={criticalIncidents.length}
      />

      {/* Incidents Data Table */}
      <IncidentList incidents={incidents} />
    </div>
  );
}
