"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Layers } from "lucide-react";

type StatusData = {
  statusCode: number;
  count: number;
};

type Props = {
  data: StatusData[];
};

// Map HTTP status code categories to telemetry accent colors
function getStatusColor(code: number): string {
  if (code >= 200 && code < 300) return "#10b981"; // Emerald-500 (2xx Success)
  if (code >= 300 && code < 400) return "#38bdf8"; // Sky-400 (3xx Redirection)
  if (code >= 400 && code < 500) return "#fbbf24"; // Amber-400 (4xx Client Error)
  if (code >= 500) return "#f43f5e"; // Rose-500 (5xx Server Error)
  return "#a1a1aa"; // Zinc-400 (Default)
}

function getStatusLabel(code: number): string {
  if (code >= 200 && code < 300) return "SUCCESS";
  if (code >= 300 && code < 400) return "REDIRECT";
  if (code >= 400 && code < 500) return "CLIENT ERROR";
  if (code >= 500) return "SERVER ERROR";
  return "UNKNOWN";
}

export function StatusChart({ data }: Props) {
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
                  dataKey="statusCode"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
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
                    const fill = getStatusColor(entry.statusCode);
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
        <ShieldAlert className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-extrabold tracking-tight text-foreground font-sans">HTTP Status Code Breakdown</h2>
      </div>

      <Badge variant="outline" className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4">
        {totalRequests.toLocaleString()} RESPONSES
      </Badge>
    </div>
  );
}

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number; payload: StatusData }>;
};

function CustomTooltipContent({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const color = getStatusColor(data.statusCode);
  const category = getStatusLabel(data.statusCode);

  return (
    <div className="rounded-lg border border-border/80 bg-zinc-950/95 p-2.5 shadow-2xl backdrop-blur-md font-mono text-xs space-y-1">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-bold text-foreground">HTTP {data.statusCode}</span>
        </div>
        <span className="text-[10px] font-semibold tracking-wide text-zinc-400 uppercase">{category}</span>
      </div>
      <div className="text-muted-foreground">
        Total Count: <strong className="text-foreground">{data.count.toLocaleString()}</strong>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center gap-1 text-muted-foreground font-mono text-xs">
      <Layers className="h-5 w-5 text-zinc-600 mb-1" />
      <span>No status code telemetry recorded for this timeframe.</span>
    </div>
  );
}
