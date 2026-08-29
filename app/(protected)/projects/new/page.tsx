import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectForm } from "./components/project-form";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-400 font-sans antialiased py-2">
      <div className="mx-auto max-w-3xl px-2 sm:px-6 space-y-6">
        {/* Navigation & Page Title */}
        <div className="space-y-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-emerald-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Projects</span>
          </Link>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-widest">Environments</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Create New Project</h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-mono">
              Initialize a dedicated API environment to collect, buffer, and monitor endpoint telemetry.
            </p>
          </div>
        </div>

        {/* Main Content Card Container */}
        <Card className="overflow-hidden border border-border/70 bg-card/40 backdrop-blur-md shadow-2xl">
          <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <PlusCircle className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-bold tracking-tight text-foreground font-sans">Project Configuration</CardTitle>
            </div>
            <CardDescription className="font-mono text-xs text-muted-foreground pt-1">
              Provide project details below to issue an ingestion API key.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <ProjectForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
