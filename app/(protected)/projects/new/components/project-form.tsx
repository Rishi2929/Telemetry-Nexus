"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/server/project-actions";
import { FolderPlus, Loader2, ArrowRight } from "lucide-react";

export function ProjectForm() {
  return (
    <form
      action={createProject}
      className="space-y-6 rounded-xl border border-border/70 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl text-left font-sans"
    >
      {/* Form Header */}
      <div className="space-y-1 border-b border-border/60 pb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <FolderPlus className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">Create New Project</h2>
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          Initialize a new project environment to issue API keys and ingest telemetry.
        </p>
      </div>

      {/* Project Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>Project Name</span>
          <span className="text-rose-400 font-mono text-[10px]">* Required</span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Production API Ingress"
          required
          className="h-10 border-border/70 bg-background/60 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
        />
        <p className="text-[11px] font-mono text-muted-foreground">Used to identify metrics across your telemetry dashboards.</p>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs font-semibold text-foreground">
          Description <span className="text-muted-foreground font-normal">(Optional)</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Telemetry collection for high-throughput Express backend..."
          rows={4}
          className="resize-none border-border/70 bg-background/60 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
        />
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40 font-mono text-xs">
        <Button
          type="button"
          variant="outline"
          className="h-9 px-4 border-border/60 bg-muted/20 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        >
          <Link href="/projects">Cancel</Link>
        </Button>

        <SubmitButton />
      </div>
    </form>
  );
}

{
  /* Submit Button with Pending Loading State */
}
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      size="sm"
      className="h-9 gap-1.5 border border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
          <span>Creating...</span>
        </>
      ) : (
        <>
          <span>Create Project</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </>
      )}
    </Button>
  );
}
