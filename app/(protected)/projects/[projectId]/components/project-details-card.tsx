import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { Folder, Edit3, Calendar, Fingerprint, FileText, Layers } from "lucide-react";
import type { ProjectWithApiKeys } from "@/lib/types/type";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProjectDetailsCardProps = {
  project: ProjectWithApiKeys;
};

export function ProjectDetailsCard({ project }: ProjectDetailsCardProps) {
  return (
    <Card className="relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <CardHeaderSection project={project} />

      <CardContent className="p-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailBlock
            icon={FileText}
            label="Description"
            value={project.description ?? "No description provided for this project."}
            isText
          />

          <DetailBlock icon={Fingerprint} label="Project ID" value={project.id} isMono />

          <DetailBlock
            icon={Calendar}
            label="Created At"
            value={project.createdAt.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            isMono
          />

          <DetailBlock icon={Layers} label="API Keys Count" value={`${project.apiKeys?.length ?? 0} active keys`} isMono />
        </div>
      </CardContent>
    </Card>
  );
}

{
  /* Sub-Components */
}

function CardHeaderSection({ project }: { project: ProjectWithApiKeys }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 border-b border-border/60 bg-muted/20">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Folder className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-base font-extrabold tracking-tight text-foreground font-sans">{project.name}</h2>
          <Badge
            variant="outline"
            className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4"
          >
            ACTIVE
          </Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Application configuration and database telemetry settings.</p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/projects/${project.id}/edit`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "inline-flex items-center font-mono text-xs h-8 border-border/80 bg-black/20 hover:bg-muted/60 text-muted-foreground hover:text-foreground cursor-pointer",
          )}
        >
          <Edit3 className="mr-1.5 h-3 w-3 text-emerald-400" />
          <span>Edit</span>
        </Link>

        <DeleteProjectDialog projectId={project.id} projectName={project.name} />
      </div>
    </div>
  );
}

function DetailBlock({
  icon: Icon,
  label,
  value,
  isMono = false,
  isText = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isMono?: boolean;
  isText?: boolean;
}) {
  return (
    <div className="space-y-1 rounded-md border border-border/40 bg-muted/10 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3 text-emerald-400" />
        <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
      </div>
      <p
        className={`text-xs text-foreground ${
          isMono ? "font-mono" : "font-sans"
        } ${isText ? "leading-relaxed text-muted-foreground" : "font-medium"}`}
      >
        {value}
      </p>
    </div>
  );
}
