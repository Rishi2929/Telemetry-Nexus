"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Layers } from "lucide-react";

type MethodData = {
  method: string;
  count: number;
};

type Props = {
  data: MethodData[];
};

// Standard REST API Method Color Palette
const METHOD_COLORS: Record<string, string> = {
  GET: "#10b981", // Emerald-500
  POST: "#3b82f6", // Blue-500
  PUT: "#f59e0b", // Amber-500
  PATCH: "#8b5cf6", // Purple-500
  DELETE: "#f43f5e", // Rose-500
  OPTIONS: "#64748b", // Slate-500
  HEAD: "#06b6d4", // Cyan-500
};

export function MethodChart({ data }: Props) {
  const totalRequests = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <HeaderSection totalRequests={totalRequests} />

      <CardContent className="p-5">
        {data.length === 0 || totalRequests === 0 ? (
          <EmptyState />
        ) : (
          <div className="h-[280px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />

                <XAxis
                  dataKey="method"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickFormatter={(val) => val.toUpperCase()}
                />

                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
                />

                <Tooltip content={<CustomTooltipContent />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />

                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                  {data.map((entry, index) => {
                    const methodKey = entry.method.toUpperCase();
                    const fill = METHOD_COLORS[methodKey] || "#10b981";
                    return <Cell key={`cell-${index}`} fill={fill} fillOpacity={0.85} />;
                  })}
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

function HeaderSection({ totalRequests }: { totalRequests: number }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/20">
      <div className="flex items-center gap-2">
        <Network className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-extrabold tracking-tight text-foreground font-sans">HTTP Method Volume</h2>
      </div>

      <Badge variant="outline" className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4">
        {totalRequests.toLocaleString()} REQUESTS
      </Badge>
    </div>
  );
}

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number; payload: MethodData }>;
};

function CustomTooltipContent({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const methodKey = data.method.toUpperCase();
  const color = METHOD_COLORS[methodKey] || "#10b981";

  return (
    <div className="rounded-lg border border-border/80 bg-zinc-950/95 p-2.5 shadow-2xl backdrop-blur-md font-mono text-xs space-y-1">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-bold text-foreground">{methodKey}</span>
      </div>
      <div className="text-muted-foreground">
        Requests: <strong className="text-foreground">{data.count.toLocaleString()}</strong>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center gap-1 text-muted-foreground font-mono text-xs">
      <Layers className="h-5 w-5 text-zinc-600 mb-1" />
      <span>No HTTP method telemetry available for this range.</span>
    </div>
  );
}
