import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Incident = {
  id: string;
  title: string;
  description: string | null;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  endpoint: string | null;
  resolved: boolean;
  occurrenceCount: number;
  lastSeenAt: Date;
  createdAt: Date;
  project: {
    id: string;
    name: string;
  };
};

type IncidentListProps = {
  incidents: Incident[];
};

export function IncidentList({ incidents }: IncidentListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident History</CardTitle>
      </CardHeader>

      <CardContent>
        {incidents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No incidents detected.</p>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{incident.title}</h3>

                    <Badge variant="outline">{incident.severity}</Badge>

                    <Badge variant={incident.resolved ? "outline" : "destructive"}>{incident.resolved ? "Resolved" : "Open"}</Badge>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">{incident.project.name}</p>

                  {incident.endpoint && <p className="mt-1 truncate font-mono text-sm text-muted-foreground">{incident.endpoint}</p>}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {incident.occurrenceCount} {incident.occurrenceCount === 1 ? "occurrence" : "occurrences"}
                    </Badge>

                    <span className="text-xs text-muted-foreground">Last detected {incident.lastSeenAt.toLocaleString()}</span>
                  </div>
                </div>

                <div className="shrink-0 text-sm text-muted-foreground">{incident.createdAt.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
