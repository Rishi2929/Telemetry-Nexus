"use client";

import { useTransition } from "react";
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
import { Trash2, AlertOctagon, Loader2 } from "lucide-react";

type DeleteProjectDialogProps = {
  projectId: string;
  projectName: string;
};

export function DeleteProjectDialog({ projectId, projectName }: DeleteProjectDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const formData = new FormData();
    formData.append("projectId", projectId);

    startTransition(async () => {
      await deleteProject(formData);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          variant="destructive"
          className="bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white font-mono text-xs gap-2 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete Project</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-zinc-950 border-border/80 font-sans text-zinc-100 max-w-md">
        <AlertDialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertOctagon className="h-4 w-4 shrink-0" />
            <span>Destructive Action</span>
          </div>

          <AlertDialogTitle className="text-lg font-black tracking-tight text-white">Delete Project</AlertDialogTitle>

          <AlertDialogDescription className="text-xs text-zinc-400 font-mono leading-relaxed">
            Are you sure you want to delete <span className="text-zinc-100 font-bold underline decoration-rose-500/50">{projectName}</span>?
            All associated telemetry logs, alert rules, and incident records will be permanently erased.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel className="font-mono text-xs bg-zinc-900 border-border/80 text-zinc-300 hover:bg-zinc-800">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="font-mono text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white gap-2 border-0"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Confirm Delete</span>
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
