"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Layers } from "lucide-react";

type LevelData = {
  level: string;
  count: number;
};

type Props = {
  data: LevelData[];
};

// Color mapping for standard log levels in telemetry
const LEVEL_COLORS: Record<string, string> = {
  ERROR: "#f43f5e", // Rose-500
  CRITICAL: "#e11d48", // Rose-600
  WARN: "#fbbf24", // Amber-400
  WARNING: "#fbbf24", // Amber-400
  INFO: "#38bdf8", // Sky-400
  DEBUG: "#a1a1aa", // Zinc-400
  TRACE: "#71717a", // Zinc-500
};

export function LevelChart({ data }: Props) {
  const totalLogs = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <HeaderSection totalLogs={totalLogs} />

      <CardContent className="p-5">
        {data.length === 0 || totalLogs === 0 ? (
          <EmptyState />
        ) : (
          <div className="h-[280px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />

                <XAxis
                  dataKey="level"
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
                    const levelKey = entry.level.toUpperCase();
                    const fill = LEVEL_COLORS[levelKey] || "#38bdf8";
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

function HeaderSection({ totalLogs }: { totalLogs: number }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/20">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-extrabold tracking-tight text-foreground font-sans">Log Severity Distribution</h2>
      </div>

      <Badge variant="outline" className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4">
        {totalLogs.toLocaleString()} TOTAL EVENTS
      </Badge>
    </div>
  );
}

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number; payload: LevelData }>;
};

function CustomTooltipContent({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const levelKey = data.level.toUpperCase();
  const color = LEVEL_COLORS[levelKey] || "#38bdf8";

  return (
    <div className="rounded-lg border border-border/80 bg-zinc-950/95 p-2.5 shadow-2xl backdrop-blur-md font-mono text-xs space-y-1">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-bold text-foreground">{levelKey}</span>
      </div>
      <div className="text-muted-foreground">
        Occurrences: <strong className="text-foreground">{data.count.toLocaleString()}</strong>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center gap-1 text-muted-foreground font-mono text-xs">
      <Layers className="h-5 w-5 text-zinc-600 mb-1" />
      <span>No log severity telemetry available for this range.</span>
    </div>
  );
}
