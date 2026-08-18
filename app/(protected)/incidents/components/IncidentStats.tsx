import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type IncidentStatsProps = {
  openIncidents: number;
  uniqueIncidents: number;
  totalOccurrences: number;
  criticalIncidents: number;
};

export function IncidentStats({ openIncidents, uniqueIncidents, totalOccurrences, criticalIncidents }: IncidentStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Open Incidents</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">{openIncidents}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Unique Incidents</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">{uniqueIncidents}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Occurrences</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">{totalOccurrences}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">{criticalIncidents}</div>
        </CardContent>
      </Card>
    </div>
  );
}
