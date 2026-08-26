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
import { LogOut } from "lucide-react";

export function LogoutDialog({ onLogout }: { onLogout: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-start font-mono text-xs h-9 border-border/80 bg-black/20 hover:bg-rose-500/10 hover:border-rose-500/30 text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Log Out
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border border-border/80 bg-card/95 backdrop-blur-md font-sans">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-extrabold tracking-tight text-foreground">Terminate Active Session?</AlertDialogTitle>
          <AlertDialogDescription className="text-xs font-mono text-muted-foreground">
            You will be signed out of your Telemetry Nexus session and redirected to access authorization.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="font-mono text-xs">
          <AlertDialogCancel className="h-9 border-border/80 text-xs">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onLogout} className="h-9 bg-rose-500 text-white hover:bg-rose-600 font-semibold text-xs">
            Confirm Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
