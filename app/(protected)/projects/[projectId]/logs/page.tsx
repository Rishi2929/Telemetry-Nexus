import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getProjectLogs } from "@/lib/db/api-log";
import { getServerSession } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogsSummary } from "./components/logs-summary";
import { LogsTable } from "./components/logs-table";
import { LogsFilter } from "./components/logs-filter";
import { LogLevel, Method } from "@/app/generated/prisma/enums";
import { Activity, Terminal } from "lucide-react";

type Props = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ level?: string; method?: string }>;
};

export default async function LogsPage({ params, searchParams }: Props) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const { projectId } = await params;
  const { level, method } = await searchParams;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
  });

  if (!project) {
    notFound();
  }

  const logs = await getProjectLogs(project.id, {
    level: level as LogLevel | undefined,
    method: method as Method | undefined,
  });

  // Calculate aggregated metrics
  const totalRequests = logs.length;
  const totalErrors = logs.filter((log) => log.statusCode >= 500).length;
  const averageLatency = logs.reduce((sum, log) => sum + log.latency, 0) / Math.max(logs.length, 1);
  const lastLog = logs[0]?.createdAt;

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Aggregate KPI Summary Cards */}
      <LogsSummary totalRequests={totalRequests} totalErrors={totalErrors} averageLatency={averageLatency} lastLog={lastLog} />

      {/* Query Filters */}
      <div className="space-y-2">
        <LogsFilter />
      </div>

      {/* Primary Log Data Stream Table */}
      <Card className="border border-border/80 bg-card/95 backdrop-blur-md shadow-xl">
        <CardHeader className="border-b border-border/60 bg-muted/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-base font-bold tracking-tight">HTTP Telemetry Stream</CardTitle>
            </div>
            <Badge variant="secondary" className="font-mono text-xs bg-zinc-800 text-zinc-300 border border-border/60">
              {logs.length} Log Entries
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Displaying the latest {logs.length} captured request payloads and system execution metrics.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <LogsTable logs={logs} />
        </CardContent>
      </Card>
    </div>
  );
}
