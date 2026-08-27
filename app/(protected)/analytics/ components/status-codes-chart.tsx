"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Terminal } from "lucide-react";

type StatusCodeData = {
  statusCode: number;
  count: number;
};

type StatusCodesChartProps = {
  data: StatusCodeData[];
};

// Returns color tokens based on standard HTTP status code ranges
function getStatusColor(code: number): string {
  if (code >= 200 && code < 300) return "#34d399"; // Emerald (2xx Success)
  if (code >= 300 && code < 400) return "#38bdf8"; // Sky (3xx Redirection)
  if (code >= 400 && code < 500) return "#fbbf24"; // Amber (4xx Client Error)
  if (code >= 500) return "#f87171"; // Rose (5xx Server Error)
  return "#9ca3af"; // Gray fallback
}

export function StatusCodesChart({ data }: StatusCodesChartProps) {
  const totalRequests = data.reduce((acc, item) => acc + item.count, 0);

  return (
    <Card className="relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <ComponentHeader total={totalRequests} />

      <CardContent className="p-5">
        {data.length === 0 ? (
          <EmptyChartState />
        ) : (
          <div className="h-[280px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />

                <XAxis
                  dataKey="statusCode"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#27272a" }}
                  tickFormatter={(val) => `${val}`}
                />

                <YAxis allowDecimals={false} stroke="#71717a" fontSize={11} tickLine={false} axisLine={{ stroke: "#27272a" }} />

                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#27272a", opacity: 0.4 }} />

                <Bar dataKey="count" name="Requests" radius={[4, 4, 0, 0]}>
                  {data.map((entry) => (
                    <Cell key={`status-cell-${entry.statusCode}`} fill={getStatusColor(entry.statusCode)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* Sub-Components */

function ComponentHeader({ total }: { total: number }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-muted/20">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Activity className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-base font-extrabold tracking-tight text-foreground font-sans">Status Codes</h2>
          <Badge
            variant="outline"
            className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4"
          >
            {total.toLocaleString()} TOTAL
          </Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Distribution of response HTTP status codes across telemetry logs.</p>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const item: StatusCodeData = payload[0].payload;
    const color = getStatusColor(item.statusCode);

    return (
      <div className="rounded-md border border-border/80 bg-black/90 p-2.5 shadow-xl font-mono text-xs backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-border/40 pb-1.5 mb-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-bold text-foreground">HTTP {item.statusCode}</span>
        </div>
        <div className="text-muted-foreground">
          Requests: <span className="text-emerald-400 font-bold">{item.count.toLocaleString()}</span>
        </div>
      </div>
    );
  }

  return null;
}

function EmptyChartState() {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center text-center font-mono space-y-2">
      <Terminal className="h-6 w-6 text-muted-foreground/60" />
      <p className="text-xs text-muted-foreground">No status code data available.</p>
    </div>
  );
}
