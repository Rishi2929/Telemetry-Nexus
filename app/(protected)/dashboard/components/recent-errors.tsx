import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import type { RecentError } from "@/lib/db/dashboard";

type RecentErrorsProps = {
  errors: RecentError[];
};

export function RecentErrors({ errors }: RecentErrorsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Errors</CardTitle>
        <CardDescription>Recent 4xx and 5xx requests across your projects.</CardDescription>
      </CardHeader>

      <CardContent>
        {errors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent errors.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {errors.map((error) => (
                  <TableRow key={error.id}>
                    <TableCell>
                      <Link href={`/projects/${error.projectId}`} className="font-medium hover:underline">
                        {error.projectName}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{error.method}</Badge>
                    </TableCell>

                    <TableCell className="max-w-64 truncate font-mono text-sm">{error.endpoint}</TableCell>

                    <TableCell>
                      <Badge variant="destructive">{error.statusCode}</Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">{error.level}</Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{error.createdAt.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
