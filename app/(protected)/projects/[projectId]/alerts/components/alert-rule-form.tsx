"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertMetric, Severity } from "@/app/generated/prisma/enums";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { BellRing, AlertTriangle, Activity, Gauge, Loader2, ShieldAlert } from "lucide-react";

type AlertRuleFormProps = {
  projectId: string;
};

export function AlertRuleForm({ projectId }: AlertRuleFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [metric, setMetric] = useState<AlertMetric>(AlertMetric.ERROR_RATE);
  const [threshold, setThreshold] = useState("");
  const [severity, setSeverity] = useState<Severity>(Severity.MEDIUM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/alert-rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          metric,
          threshold: Number(threshold),
          severity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create alert rule");
      }

      // Refresh server components without hard page reloads
      setName("");
      setThreshold("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-border/80 bg-card/95 shadow-xl backdrop-blur-md font-sans text-left overflow-hidden">
      <FormHeader />

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Rule Name */}
        <FormFieldGroup label="Rule Identifier" htmlFor="name">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. High Error Rate spike (> 5%)"
            className="font-mono text-xs bg-zinc-900/80 border-border/70 focus-visible:ring-emerald-500/40 text-zinc-200 placeholder:text-zinc-600 h-9"
            required
          />
        </FormFieldGroup>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Target Metric */}
          <FormFieldGroup label="Monitored Metric" htmlFor="metric">
            <Select value={metric} onValueChange={(val) => val && setMetric(val as AlertMetric)}>
              <SelectTrigger id="metric" className="h-9 font-mono text-xs bg-zinc-900/80 border-border/70 text-zinc-200">
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <SelectValue placeholder="Select Metric" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-border/80 font-mono text-xs text-zinc-200">
                <SelectItem value={AlertMetric.ERROR_RATE}>Error Rate (%)</SelectItem>
                <SelectItem value={AlertMetric.LATENCY}>Latency (ms)</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldGroup>

          {/* Alert Severity */}
          <FormFieldGroup label="Severity Trigger" htmlFor="severity">
            <Select value={severity} onValueChange={(val) => val && setSeverity(val as Severity)}>
              <SelectTrigger id="severity" className="h-9 font-mono text-xs bg-zinc-900/80 border-border/70 text-zinc-200">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <SelectValue placeholder="Select Severity" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-border/80 font-mono text-xs text-zinc-200">
                <SelectItem value={Severity.LOW}>LOW</SelectItem>
                <SelectItem value={Severity.MEDIUM}>MEDIUM</SelectItem>
                <SelectItem value={Severity.HIGH}>HIGH</SelectItem>
                <SelectItem value={Severity.CRITICAL}>CRITICAL</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldGroup>
        </div>

        {/* Threshold Value */}
        <FormFieldGroup label="Trigger Threshold" htmlFor="threshold">
          <div className="relative">
            <Input
              id="threshold"
              type="number"
              min="0"
              step="any"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder={metric === AlertMetric.ERROR_RATE ? "5" : "1000"}
              className="font-mono text-xs bg-zinc-900/80 border-border/70 focus-visible:ring-emerald-500/40 text-zinc-200 placeholder:text-zinc-600 h-9 pr-12"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-zinc-500 font-bold uppercase">
              {metric === AlertMetric.ERROR_RATE ? "% RATE" : "MS"}
            </span>
          </div>

          <p className="font-mono text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
            <Gauge className="h-3 w-3 text-emerald-400 shrink-0" />
            <span>
              {metric === AlertMetric.ERROR_RATE
                ? "Triggers when HTTP error responses exceed this percentage."
                : "Triggers when a request exceeds this latency threshold."}
            </span>
          </p>
        </FormFieldGroup>

        {/* Error Feedback Banner */}
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 p-2.5 font-mono text-xs text-rose-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Submission */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-9 font-mono text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Provisioning Rule...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <BellRing className="h-3.5 w-3.5" />
              <span>Create Alert Rule</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}

/* Sub-Components */

function FormHeader() {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/20">
      <div className="flex items-center gap-2">
        <BellRing className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-extrabold tracking-tight text-foreground font-sans">Configure Alert Policy</h2>
      </div>

      <Badge variant="outline" className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4">
        PROVISIONING
      </Badge>
    </div>
  );
}

function FormFieldGroup({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </Label>
      {children}
    </div>
  );
}
