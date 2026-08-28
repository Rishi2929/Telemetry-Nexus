"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertMetric, Severity } from "@/app/generated/prisma/enums";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, Activity, ShieldAlert, Loader2, AlertOctagon, Clock } from "lucide-react";

export type AlertRule = {
  id: string;
  name: string;
  metric: AlertMetric;
  threshold: number;
  severity: Severity;
  createdAt?: string | Date;
};

type AlertRulesListProps = {
  projectId: string;
  rules: AlertRule[];
};

export function AlertRulesList({ projectId, rules }: AlertRulesListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  async function handleDelete(ruleId: string) {
    setError("");
    setDeletingId(ruleId);

    try {
      const response = await fetch(`/api/projects/${projectId}/alert-rules/${ruleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete alert rule");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setDeletingId(null);
    }
  }

  if (!rules || rules.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/80 bg-card/50 p-8 text-center font-sans">
        <Bell className="mx-auto h-8 w-8 text-zinc-500 mb-2 opacity-60" />
        <h3 className="text-sm font-semibold text-zinc-300">No Alert Rules Configured</h3>
        <p className="text-xs text-zinc-500 font-mono mt-1">Create a rule above to monitor telemetry spikes and error conditions.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/80 bg-card/95 shadow-xl backdrop-blur-md overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/20">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-extrabold tracking-tight text-foreground">Active Threshold Policies</h2>
        </div>
        <Badge variant="outline" className="font-mono text-[10px] text-zinc-400 border-border">
          {rules.length} {rules.length === 1 ? "RULE" : "RULES"}
        </Badge>
      </div>

      {/* Delete error feedback */}
      {error && (
        <div className="px-5 pt-3">
          <div className="flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 p-2 font-mono text-xs text-rose-400">
            <AlertOctagon className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Rules Table / List */}
      <div className="divide-y divide-border/40 font-mono text-xs">
        {rules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors gap-4">
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="font-semibold text-zinc-100 truncate">{rule.name}</span>
                <SeverityBadge severity={rule.severity} />
              </div>

              <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-emerald-400 shrink-0" />
                  {rule.metric === AlertMetric.ERROR_RATE ? "Error Rate" : "Latency"}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300 font-bold">
                  {rule.metric === AlertMetric.ERROR_RATE ? `> ${rule.threshold}%` : `> ${rule.threshold} ms`}
                </span>
              </div>
            </div>

            {/* Action */}
            <Button
              variant="ghost"
              size="icon"
              disabled={deletingId === rule.id}
              onClick={() => handleDelete(rule.id)}
              className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 shrink-0 transition-colors"
            >
              {deletingId === rule.id ? <Loader2 className="h-4 w-4 animate-spin text-rose-400" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Sub-Components */

function SeverityBadge({ severity }: { severity: Severity }) {
  const styles: Record<Severity, string> = {
    [Severity.LOW]: "border-sky-500/30 bg-sky-500/10 text-sky-400",
    [Severity.MEDIUM]: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    [Severity.HIGH]: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    [Severity.CRITICAL]: "border-rose-500/40 bg-rose-500/20 text-rose-400 font-bold animate-pulse",
  };

  return (
    <Badge variant="outline" className={`font-mono text-[9px] px-1.5 py-0 h-4 border ${styles[severity]}`}>
      {severity}
    </Badge>
  );
}
