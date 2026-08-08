import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getProjectLogs } from "@/lib/db/api-log";
import { getServerSession } from "@/lib/auth/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogsSummary } from "./components/logs-summary";
import { LogsTable } from "./components/logs-table";
import { LogLevel, Method } from "@/app/generated/prisma/enums";
import { LogsFilter } from "./components/logs-filter";

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

  const totalRequests = logs.length;

  const totalErrors = logs.filter((log) => log.statusCode >= 500).length;

  const averageLatency = logs.reduce((sum, log) => sum + log.latency, 0) / Math.max(logs.length, 1);

  const lastLog = logs[0]?.createdAt;

  return (
    <div className="space-y-6">
      <LogsSummary totalRequests={totalRequests} totalErrors={totalErrors} averageLatency={averageLatency} lastLog={lastLog} />

      <LogsFilter />

      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <CardDescription>Latest {logs.length} log entries</CardDescription>
        </CardHeader>

        <CardContent>
          <LogsTable logs={logs} />
        </CardContent>
      </Card>
    </div>
  );
}
