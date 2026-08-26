import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowUpRight, Folder } from "lucide-react";
import type { Project } from "@/app/generated/prisma/client";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group block h-full">
      <Card className="relative flex h-full flex-col justify-between overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 font-sans">
        {/* Card Header & Body Content */}
        <div className="p-3.5 space-y-1.5">
          <CardHeaderInfo name={project.name} />
          <CardDescriptionText description={project.description} />
        </div>

        {/* Card Footer Metadata */}
        <CardFooterMeta createdAt={project.createdAt} />
      </Card>
    </Link>
  );
}

{
  /* Sub-Components */
}

function CardHeaderInfo({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 max-w-[85%]">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <Folder className="h-3 w-3" />
        </div>
        <h3 className="text-sm font-bold tracking-tight text-foreground truncate group-hover:text-emerald-400 transition-colors">{name}</h3>
      </div>

      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-emerald-400 transition-all -translate-x-1 group-hover:translate-x-0" />
    </div>
  );
}

function CardDescriptionText({ description }: { description: string | null }) {
  return (
    <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed font-sans">{description || "No description provided."}</p>
  );
}

function CardFooterMeta({ createdAt }: { createdAt: Date }) {
  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-3.5 py-1.5 font-mono text-[10px] text-muted-foreground">
      <div className="flex items-center gap-1">
        <Calendar className="h-2.5 w-2.5 text-emerald-400" />
        <span>{formattedDate}</span>
      </div>

      <Badge variant="outline" className="font-mono text-[8px] px-1 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4">
        ACTIVE
      </Badge>
    </div>
  );
}
