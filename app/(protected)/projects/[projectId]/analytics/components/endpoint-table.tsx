import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type EndpointStats = {
  endpoint: string;
  requests: number;
  errors: number;
  averageLatency: number;
};

type Props = {
  endpoints: EndpointStats[];
};

export function EndpointTable({ endpoints }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Endpoint Performance</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead>Errors</TableHead>
                <TableHead>Avg. Latency</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {endpoints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No endpoint data available.
                  </TableCell>
                </TableRow>
              ) : (
                endpoints.map((endpoint) => (
                  <TableRow key={endpoint.endpoint}>
                    <TableCell className="font-medium">{endpoint.endpoint}</TableCell>

                    <TableCell>{endpoint.requests.toLocaleString()}</TableCell>

                    <TableCell>{endpoint.errors.toLocaleString()}</TableCell>

                    <TableCell>{endpoint.averageLatency.toFixed(0)} ms</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
