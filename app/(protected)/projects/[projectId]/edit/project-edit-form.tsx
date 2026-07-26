"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProject } from "@/server/project-actions";

type ProjectEditFormProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
  };
};

export function ProjectEditForm({ project }: ProjectEditFormProps) {
  return (
    <form className="space-y-6" action={updateProject}>
      <input type="hidden" name="projectId" value={project.id} />

      <div className="space-y-2">
        <Label htmlFor="name">
          Project Name <span className="text-destructive">*</span>
        </Label>

        <Input id="name" name="name" defaultValue={project.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <Textarea id="description" name="description" defaultValue={project.description ?? ""} rows={5} />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">
          <Link href={`/projects/${project.id}`}>Cancel</Link>
        </Button>

        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
