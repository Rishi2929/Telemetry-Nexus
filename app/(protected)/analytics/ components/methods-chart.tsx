"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Terminal } from "lucide-react";

type MethodData = {
  method: string;
  count: number;
};

type MethodsChartProps = {
  data: MethodData[];
};

// HTTP Method Terminal Color Mapping
const METHOD_COLORS: Record<string, string> = {
  GET: "#38bdf8", // Sky Blue
  POST: "#34d399", // Emerald Green
  PUT: "#fbbf24", // Amber
  DELETE: "#f87171", // Rose Red
  PATCH: "#c084fc", // Purple
};

export function MethodsChart({ data }: MethodsChartProps) {
  const totalRequests = data.reduce((acc, curr) => acc + curr.count, 0);

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

                <XAxis dataKey="method" stroke="#71717a" fontSize={11} tickLine={false} axisLine={{ stroke: "#27272a" }} />

                <YAxis allowDecimals={false} stroke="#71717a" fontSize={11} tickLine={false} axisLine={{ stroke: "#27272a" }} />

                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#27272a", opacity: 0.4 }} />

                <Bar dataKey="count" name="Requests" radius={[4, 4, 0, 0]}>
                  {data.map((entry) => (
                    <Cell key={`method-cell-${entry.method}`} fill={METHOD_COLORS[entry.method.toUpperCase()] ?? "#10b981"} />
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

{
  /* Sub-Components */
}

function ComponentHeader({ total }: { total: number }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-muted/20">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Code2 className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-base font-extrabold tracking-tight text-foreground font-sans">Request Methods</h2>
          <Badge
            variant="outline"
            className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4"
          >
            {total.toLocaleString()} CALLS
          </Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Breakdown of telemetry volume grouped by HTTP method verb.</p>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const dataItem: MethodData = payload[0].payload;
    const color = METHOD_COLORS[dataItem.method.toUpperCase()] ?? "#10b981";

    return (
      <div className="rounded-md border border-border/80 bg-black/90 p-2.5 shadow-xl font-mono text-xs backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-border/40 pb-1.5 mb-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-bold text-foreground">{dataItem.method}</span>
        </div>
        <div className="text-muted-foreground">
          Volume: <span className="text-emerald-400 font-bold">{dataItem.count.toLocaleString()}</span>
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
      <p className="text-xs text-muted-foreground">No request data available.</p>
    </div>
  );
}
