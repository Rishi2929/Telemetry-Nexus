import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import type { DashboardProject } from "@/lib/db/dashboard";

type ProjectSummaryProps = {
  projects: DashboardProject[];
};

export function ProjectSummary({ projects }: ProjectSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Summary</CardTitle>
        <CardDescription>API performance across your projects.</CardDescription>
      </CardHeader>

      <CardContent>
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Errors</TableHead>
                  <TableHead>Error Rate</TableHead>
                  <TableHead>Avg. Latency</TableHead>
                  <TableHead>Health</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {projects.map((project) => {
                  const health = project.errorRate >= 0.05 ? "Critical" : project.errorRate >= 0.02 ? "Warning" : "Healthy";

                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                          {project.name}
                        </Link>
                      </TableCell>

                      <TableCell>{project.totalRequests.toLocaleString()}</TableCell>

                      <TableCell>{project.totalErrors.toLocaleString()}</TableCell>

                      <TableCell>{(project.errorRate * 100).toFixed(1)}%</TableCell>

                      <TableCell>{Math.round(project.averageLatency)} ms</TableCell>

                      <TableCell>
                        <Badge variant={health === "Critical" ? "destructive" : health === "Warning" ? "secondary" : "outline"}>
                          {health}
                        </Badge>
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
