"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/server/project-actions";

export function ProjectForm() {
    
  return (
    <form action={createProject} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Project Name <span className="text-destructive">*</span>
        </Label>

        <Input
          id="name"
          name="name"
          placeholder="My Production API"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <Textarea
          id="description"
          name="description"
          placeholder="Telemetry for my production backend..."
          rows={5}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button  variant="outline">
          <Link href="/projects">Cancel</Link>
        </Button>

        <Button type="submit">
          Create Project
        </Button>
      </div>
    </form>
  );
}