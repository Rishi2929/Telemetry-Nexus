import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "@/lib/auth/session";
import { Plus, Terminal, FolderKanban, Layers } from "lucide-react";
import Link from "next/link";
import { ProjectsList } from "./[projectId]/components/project-list";

export default async function ProjectsPage() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="relative space-y-8 max-w-7xl mx-auto font-sans text-left">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Projects Overview</h1>
            <Badge
              variant="outline"
              className="font-mono text-[9px] px-2 py-0.5 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1"
            >
              <Layers className="h-2.5 w-2.5" />
              {projects.length} MONITORED
            </Badge>
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            Manage monitored applications, API endpoints, and operational telemetry.
          </p>
        </div>

        {/* Action Button */}
        <Link href="/projects/new">
          <Button
            size="sm"
            className="font-mono text-xs h-9 bg-emerald-500 text-black hover:bg-emerald-400 font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Main Content Area */}
      {projects.length === 0 ? (
        <EmptyProjectsState />
      ) : (
        <div className="space-y-6">
          <ProjectsList projects={projects} />
        </div>
      )}
    </div>
  );
}

{
  /* Terminal-Styled Empty State Component */
}
function EmptyProjectsState() {
  return (
    <Card className="relative overflow-hidden border border-dashed border-border/80 bg-card/60 backdrop-blur-md shadow-xl font-sans text-left p-8">
      <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto py-6 font-mono">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <FolderKanban className="h-6 w-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-foreground font-sans">No projects detected</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Create your first workspace project to start logging API metrics, payload latencies, and server error rates.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/projects/new">
            <Button
              size="sm"
              className="font-mono text-xs h-9 bg-emerald-500 text-black hover:bg-emerald-400 font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Initialize First Project
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
