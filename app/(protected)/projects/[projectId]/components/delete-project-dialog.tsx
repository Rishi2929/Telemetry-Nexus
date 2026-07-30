"use client";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteProject } from "@/server/project-actions";

type DeleteProjectDialogProps = {
  projectId: string;
  projectName: string;
};

export function DeleteProjectDialog({ projectId, projectName }: DeleteProjectDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive">Delete</Button>} />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete <strong>{projectName}</strong>?
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={deleteProject}>
            <input type="hidden" name="projectId" value={projectId} />

            <AlertDialogAction
              render={
                <Button type="submit" variant="destructive" className="text-white">
                  Delete
                </Button>
              }
            />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
