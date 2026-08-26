"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, Activity } from "lucide-react";

import type { RequestTrafficPoint } from "@/lib/db/dashboard";

type RequestTrafficChartProps = {
  data: RequestTrafficPoint[];
};

export function RequestTrafficChart({ data }: RequestTrafficChartProps) {
  return (
    <Card className="relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <ComponentHeader />

      <CardContent className="p-6">
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="h-[320px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {/* Requests Gradient (Emerald) */}
                  <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  {/* Errors Gradient (Rose) */}
                  <linearGradient id="errorsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />

                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  tickLine={false}
                  axisLine={{ stroke: "#27272a" }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  style={{ fontSize: "10px" }}
                />

                <YAxis stroke="#71717a" tickLine={false} axisLine={{ stroke: "#27272a" }} style={{ fontSize: "10px" }} />

                <Tooltip content={<CustomTooltip />} />

                <Area type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={2} fill="url(#requestsGradient)" />

                <Area type="monotone" dataKey="errors" stroke="#f43f5e" strokeWidth={2} fill="url(#errorsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

{
  /* Sub-Components */
}

function ComponentHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-4 border-b border-border/60 bg-muted/20">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h2 className="text-base font-extrabold tracking-tight text-foreground font-sans">Request Traffic</h2>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Historical breakdown of incoming API payloads vs failed execution runs.</p>
      </div>

      <div className="flex items-center gap-3 font-mono text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Requests</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span className="text-muted-foreground">Errors</span>
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-border/80 bg-card/95 backdrop-blur-md p-3 font-mono text-xs shadow-xl space-y-1.5 min-w-[150px]">
        <p className="text-[10px] text-muted-foreground pb-1 border-b border-border/40">
          {new Date(label).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
        <div className="flex items-center justify-between text-emerald-400">
          <span>Requests:</span>
          <span className="font-bold">{payload[0]?.value?.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-rose-400">
          <span>Errors:</span>
          <span className="font-bold">{payload[1]?.value?.toLocaleString()}</span>
        </div>
      </div>
    );
  }

  return null;
}

function EmptyState() {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center font-mono space-y-2 text-center">
      <Terminal className="h-6 w-6 text-muted-foreground opacity-50" />
      <p className="text-xs text-muted-foreground">No telemetry traffic records detected.</p>
    </div>
  );
}
