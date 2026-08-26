"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { reopenIncidentAction, resolveIncidentAction } from "@/server/incident-actions";
import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";

type IncidentActionsProps = {
  incidentId: string;
  resolved: boolean;
};

export function IncidentActions({ incidentId, resolved }: IncidentActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      if (resolved) {
        await reopenIncidentAction(incidentId);
      } else {
        await resolveIncidentAction(incidentId);
      }
    });
  };

  return (
    <div className="flex items-center gap-2 font-mono">
      {resolved ? (
        <ReopenButton isPending={isPending} onClick={handleToggle} />
      ) : (
        <ResolveButton isPending={isPending} onClick={handleToggle} />
      )}
    </div>
  );
}

/* Sub-Components */

function ResolveButton({ onClick, isPending }: { onClick: () => void; isPending: boolean }) {
  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      size="sm"
      className="h-8 gap-1.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold hover:bg-emerald-500/20 hover:text-emerald-300 transition-all shadow-sm"
    >
      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
      <span>{isPending ? "RESOLVING..." : "MARK RESOLVED"}</span>
    </Button>
  );
}

function ReopenButton({ onClick, isPending }: { onClick: () => void; isPending: boolean }) {
  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      variant="outline"
      size="sm"
      className="h-8 gap-1.5 border-zinc-700/80 bg-zinc-900/60 text-zinc-300 font-mono text-xs hover:bg-zinc-800 hover:text-foreground transition-all shadow-sm"
    >
      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" /> : <RotateCcw className="h-3.5 w-3.5 text-amber-400" />}
      <span>{isPending ? "REOPENING..." : "REOPEN INCIDENT"}</span>
    </Button>
  );
}
