import { Project } from "@/app/generated/prisma/client";
import { ProjectCard } from "./project-card";


type ProjectsListProps = {
  projects: Project[];
};

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
   <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
  {projects.map((project) => (
    <ProjectCard key={project.id} project={project} />
  ))}
</div>
  );
}