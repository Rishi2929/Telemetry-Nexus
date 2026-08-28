"use client";

import { useState, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Layers } from "lucide-react";

type RequestData = {
  date: string; // Expected ISO string or standard date format
  count: number;
};

type Props = {
  data: RequestData[];
};

type TimeRange = "24h" | "7d" | "30d";

export function RequestChart({ data }: Props) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  // Filter dataset based on selected time range tab
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Slice data directly or filter by date offset if dataset is dense
    const rangeLimits: Record<TimeRange, number> = {
      "24h": 24,
      "7d": 7,
      "30d": 30,
    };

    const limit = rangeLimits[timeRange];
    return data.slice(-limit);
  }, [data, timeRange]);

  const totalRequests = useMemo(() => filteredData.reduce((acc, curr) => acc + curr.count, 0), [filteredData]);

  return (
    <Card className="border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <HeaderSection totalRequests={totalRequests} timeRange={timeRange} onTimeRangeChange={setTimeRange} />

      <CardContent className="p-5">
        {filteredData.length === 0 || totalRequests === 0 ? (
          <EmptyState />
        ) : (
          <div className="h-[280px] w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />

                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />

                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
                />

                <Tooltip content={<CustomTooltipContent />} cursor={{ stroke: "rgba(16, 185, 129, 0.4)", strokeDasharray: "3 3" }} />

                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#requestGradient)"
                  activeDot={{ r: 4, fill: "#10b981", stroke: "#09090b", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* Sub-Components */

type HeaderSectionProps = {
  totalRequests: number;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
};

function HeaderSection({ totalRequests, timeRange, onTimeRangeChange }: HeaderSectionProps) {
  const ranges: TimeRange[] = ["24h", "7d", "30d"];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-b border-border/60 bg-muted/20">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-extrabold tracking-tight text-foreground font-sans">Requests Over Time</h2>
        <Badge
          variant="outline"
          className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4 ml-1"
        >
          {totalRequests.toLocaleString()} TOTAL
        </Badge>
      </div>

      {/* Time Range Selector Tabs */}
      <div className="flex items-center bg-zinc-900/80 p-0.5 rounded-md border border-border/60 self-start sm:self-auto font-mono text-[11px]">
        {ranges.map((range) => {
          const isActive = timeRange === range;
          return (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`px-2.5 py-0.5 rounded-sm transition-colors duration-150 ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/40"
                  : "text-zinc-400 hover:text-foreground hover:bg-zinc-800/50"
              }`}
            >
              {range}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number; payload: RequestData }>;
};

function CustomTooltipContent({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-border/80 bg-zinc-950/95 p-2.5 shadow-2xl backdrop-blur-md font-mono text-xs space-y-1">
      <div className="text-zinc-400 font-semibold">{data.date}</div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Requests: <strong className="text-emerald-400">{data.count.toLocaleString()}</strong>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center gap-1 text-muted-foreground font-mono text-xs">
      <Layers className="h-5 w-5 text-zinc-600 mb-1" />
      <span>No request time-series telemetry available for this range.</span>
    </div>
  );
}
