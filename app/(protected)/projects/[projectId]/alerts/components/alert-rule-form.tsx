"use client";

import { useState } from "react";

import { AlertMetric, Severity } from "@/app/generated/prisma/enums";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AlertRuleFormProps = {
  projectId: string;
};

export function AlertRuleForm({ projectId }: AlertRuleFormProps) {
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

      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Rule Name</Label>

        <Input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="High error rate" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metric">Metric</Label>

        <select
          id="metric"
          value={metric}
          onChange={(event) => setMetric(event.target.value as AlertMetric)}
          className="flex h-10 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value={AlertMetric.ERROR_RATE}>Error Rate</option>

          <option value={AlertMetric.LATENCY}>Latency</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="threshold">Threshold</Label>

        <Input
          id="threshold"
          type="number"
          min="0"
          value={threshold}
          onChange={(event) => setThreshold(event.target.value)}
          placeholder={metric === AlertMetric.ERROR_RATE ? "5" : "1000"}
          required
        />

        <p className="text-xs text-muted-foreground">
          {metric === AlertMetric.ERROR_RATE ? "Enter percentage. Example: 5 means 5%." : "Enter latency in milliseconds."}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="severity">Severity</Label>

        <select
          id="severity"
          value={severity}
          onChange={(event) => setSeverity(event.target.value as Severity)}
          className="flex h-10 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value={Severity.LOW}>Low</option>

          <option value={Severity.MEDIUM}>Medium</option>

          <option value={Severity.HIGH}>High</option>

          <option value={Severity.CRITICAL}>Critical</option>
        </select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Alert Rule"}
      </Button>
    </form>
  );
}
