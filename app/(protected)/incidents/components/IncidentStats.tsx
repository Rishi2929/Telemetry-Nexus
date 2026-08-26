"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertOctagon, Activity, Hash, LucideIcon } from "lucide-react";

type IncidentStatsProps = {
  openIncidents: number;
  uniqueIncidents: number;
  totalOccurrences: number;
  criticalIncidents: number;
};

type StatCardConfig = {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  badgeText: string;
  theme: {
    border: string;
    iconBg: string;
    iconColor: string;
    badge: string;
    valueColor: string;
  };
};

export function IncidentStats({ openIncidents, uniqueIncidents, totalOccurrences, criticalIncidents }: IncidentStatsProps) {
  const stats: StatCardConfig[] = [
    {
      title: "Open Incidents",
      value: openIncidents,
      subtitle: "Unresolved system alerts",
      icon: AlertCircle,
      badgeText: "ACTIVE",
      theme: {
        border: "hover:border-amber-500/40",
        iconBg: "bg-amber-500/10 border-amber-500/30",
        iconColor: "text-amber-400",
        badge: "border-amber-500/30 text-amber-400 bg-amber-500/10",
        valueColor: openIncidents > 0 ? "text-amber-400" : "text-foreground",
      },
    },
    {
      title: "Critical Incidents",
      value: criticalIncidents,
      subtitle: "High priority breaches",
      icon: AlertOctagon,
      badgeText: "P0 / P1",
      theme: {
        border: "hover:border-rose-500/40",
        iconBg: "bg-rose-500/10 border-rose-500/30",
        iconColor: "text-rose-400",
        badge: "border-rose-500/30 text-rose-400 bg-rose-500/10",
        valueColor: criticalIncidents > 0 ? "text-rose-400" : "text-foreground",
      },
    },
    {
      title: "Unique Incidents",
      value: uniqueIncidents,
      subtitle: "Distinct error signatures",
      icon: Hash,
      badgeText: "SIGNATURES",
      theme: {
        border: "hover:border-sky-500/40",
        iconBg: "bg-sky-500/10 border-sky-500/30",
        iconColor: "text-sky-400",
        badge: "border-sky-500/30 text-sky-400 bg-sky-500/10",
        valueColor: "text-foreground",
      },
    },
    {
      title: "Total Occurrences",
      value: totalOccurrences,
      subtitle: "Cumulative hit volume",
      icon: Activity,
      badgeText: "TELEMETRY",
      theme: {
        border: "hover:border-emerald-500/40",
        iconBg: "bg-emerald-500/10 border-emerald-500/30",
        iconColor: "text-emerald-400",
        badge: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
        valueColor: "text-emerald-400",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans text-left">
      {stats.map((stat) => (
        <StatItemCard key={stat.title} config={stat} />
      ))}
    </div>
  );
}

/* Sub-Components */

function StatItemCard({ config }: { config: StatCardConfig }) {
  const Icon = config.icon;

  return (
    <Card
      className={`relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-xl transition-all duration-150 ${config.theme.border}`}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-md border ${config.theme.iconBg} ${config.theme.iconColor}`}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">{config.title}</span>
          </div>

          <Badge variant="outline" className={`font-mono text-[9px] px-1.5 py-0 h-4 ${config.theme.badge}`}>
            {config.badgeText}
          </Badge>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className={`text-3xl font-bold font-mono tracking-tight ${config.theme.valueColor}`}>{config.value.toLocaleString()}</div>
        </div>

        <p className="mt-1 text-[11px] font-mono text-muted-foreground/80">{config.subtitle}</p>
      </CardContent>
    </Card>
  );
}
