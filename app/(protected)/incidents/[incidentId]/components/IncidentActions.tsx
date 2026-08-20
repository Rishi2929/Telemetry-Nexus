"use client";

import { resolveIncidentAction, reopenIncidentAction } from "@/server/incident-actions";

type IncidentActionsProps = {
  incidentId: string;
  resolved: boolean;
};

export function IncidentActions({ incidentId, resolved }: IncidentActionsProps) {
  return (
    <div className="flex gap-2">
      {resolved ? (
        <button onClick={() => reopenIncidentAction(incidentId)} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
          Reopen Incident
        </button>
      ) : (
        <button
          onClick={() => resolveIncidentAction(incidentId)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Resolve Incident
        </button>
      )}
    </div>
  );
}
