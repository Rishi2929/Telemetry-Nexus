import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteProjectDialog } from "./delete-project-dialog";
import type { ProjectWithApiKeys } from "@/lib/type";

type ProjectDetailsCardProps = {
  project: ProjectWithApiKeys;
};

export function ProjectDetailsCard({ project }: ProjectDetailsCardProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{project.name}</CardTitle>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Link href={`/projects/${project.id}/edit`}>Edit</Link>
            </Button>

            <DeleteProjectDialog projectId={project.id} projectName={project.name} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p>{project.description ?? "No description provided"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Project ID</p>
            <p className="font-mono text-sm">{project.id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p>
              {project.createdAt.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
