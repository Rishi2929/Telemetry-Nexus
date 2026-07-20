import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectForm } from "./project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-4">
        <Link
          href="/projects"
          className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div>
          <h1 className="text-3xl font-bold">Create Project</h1>
          <p className="text-muted-foreground mt-1">
            Create a new project to start collecting telemetry and monitoring
            your application.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Fill in the information below to create your project.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProjectForm />
        </CardContent>
      </Card>
    </div>
  );
}