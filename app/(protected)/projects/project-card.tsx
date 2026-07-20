import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/app/generated/prisma/client";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="truncate">
            {project.name}
          </CardTitle>

          <CardDescription className="line-clamp-2 min-h-10">
            {project.description || "No description provided"}
          </CardDescription>

          <p className="pt-4 text-xs text-muted-foreground">
            Created{" "}
            {project.createdAt.toLocaleDateString()}
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}