import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

type EndpointData = {
  endpoint: string;
  requests: number;
  errors: number;
  averageLatency: number;
};

type EndpointTableProps = {
  data: EndpointData[];
};

export function EndpointTable({ data }: EndpointTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Endpoint Performance</CardTitle>
        <CardDescription>Performance across all API endpoints.</CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No endpoint data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Errors</TableHead>
                  <TableHead>Error Rate</TableHead>
                  <TableHead>Avg. Latency</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((endpoint) => {
                  const errorRate = endpoint.requests > 0 ? (endpoint.errors / endpoint.requests) * 100 : 0;

                  return (
                    <TableRow key={endpoint.endpoint}>
                      <TableCell className="font-mono text-sm">{endpoint.endpoint}</TableCell>

                      <TableCell>{endpoint.requests.toLocaleString()}</TableCell>

                      <TableCell>{endpoint.errors.toLocaleString()}</TableCell>

                      <TableCell>{errorRate.toFixed(1)}%</TableCell>

                      <TableCell>
                        <Badge variant="outline">{Math.round(endpoint.averageLatency)} ms</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
