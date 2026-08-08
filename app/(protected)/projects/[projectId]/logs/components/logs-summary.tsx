import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  totalRequests: number;
  totalErrors: number;
  averageLatency: number;
  lastLog?: Date;
};

export function LogsSummary({ totalRequests, totalErrors, averageLatency, lastLog }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Total Requests</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">{totalRequests}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Total Errors</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">{totalErrors}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Avg. Latency</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">{averageLatency.toFixed(2)} ms</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Last Log</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm">{lastLog ? lastLog.toLocaleString() : "No logs"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
