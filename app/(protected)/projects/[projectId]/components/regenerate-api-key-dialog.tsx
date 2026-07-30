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
import { regenerateApiKey } from "@/server/project-actions";

type RegenerateApiKeyDialogProps = {
  projectId: string;
};

export function RegenerateApiKeyDialog({ projectId }: RegenerateApiKeyDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>Regenerate API Key</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Regenerate API Key?</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently invalidate your current API key. Any applications using it will stop working until they are updated with
            the newly generated key.
            <br />
            <br />
            The new API key will only be shown once.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form action={regenerateApiKey}>
          <input type="hidden" name="projectId" value={projectId} />

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction type="submit">Regenerate</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
