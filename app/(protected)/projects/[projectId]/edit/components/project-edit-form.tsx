"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProject } from "@/server/project-actions";

import { Save, X, Terminal, Loader2, FileText } from "lucide-react";

type ProjectEditFormProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
  };
};

export function ProjectEditForm({ project }: ProjectEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      await updateProject(formData);
    });
  };

  return (
    <div className="rounded-lg border border-border/80 bg-card/95 shadow-xl backdrop-blur-md overflow-hidden font-sans">
      {/* Component Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/20">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-extrabold tracking-tight text-foreground">Project Configuration</h2>
        </div>
        <span className="font-mono text-[10px] text-zinc-500 uppercase font-semibold">ID: {project.id}</span>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        <input type="hidden" name="projectId" value={project.id} />

        {/* Project Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="name"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between"
          >
            <span>Project Name</span>
            <span className="text-rose-400 font-bold">*</span>
          </Label>

          <Input
            id="name"
            name="name"
            defaultValue={project.name}
            placeholder="e.g. Production Fleet Alpha"
            className="font-mono text-xs bg-zinc-900/80 border-border/70 focus-visible:ring-emerald-500/40 text-zinc-200 placeholder:text-zinc-600 h-9"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label
            htmlFor="description"
            className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"
          >
            <FileText className="h-3 w-3 text-zinc-500" />
            <span>Description</span>
          </Label>

          <Textarea
            id="description"
            name="description"
            defaultValue={project.description ?? ""}
            placeholder="Describe the scope, service architecture, or target telemetry metrics..."
            rows={4}
            className="font-mono text-xs bg-zinc-900/80 border-border/70 focus-visible:ring-emerald-500/40 text-zinc-200 placeholder:text-zinc-600 resize-y min-h-[100px]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/40">
          <Link href={`/projects/${project.id}`} className={buttonVariants({ variant: "outline" })}>
            <X className="h-3.5 w-3.5 mr-1.5" />
            Cancel
          </Link>

          <Button
            type="submit"
            disabled={isPending}
            className="font-mono text-xs font-bold h-9 bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
