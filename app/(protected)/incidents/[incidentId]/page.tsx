import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth/session";
import { getIncident } from "@/lib/db/incidents";
import { Activity, AlertOctagon, ArrowLeft, CheckCircle2, Clock, Globe, Layers, Route, ShieldAlert, Terminal } from "lucide-react";
import { IncidentActions } from "./components/IncidentActions";

type IncidentDetailPageProps = {
  params: Promise<{
    incidentId: string;
  }>;
};

type IncidentData = NonNullable<Awaited<ReturnType<typeof getIncident>>>;

export default async function IncidentDetailPage({ params }: IncidentDetailPageProps) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const { incidentId } = await params;
  const incident = await getIncident(incidentId, session.user.id);

  if (!incident) {
    notFound();
  }

  return (
    <div className="space-y-6 font-sans text-left">
      <BreadcrumbNavigation />

      <PageHeader incident={incident} />

      <QuickMetricsGrid incident={incident} />

      <DescriptionCard description={incident.description} />

      <AffectedRoutesCard routes={incident.affectedRoutes} />

      <TimestampFooter createdAt={incident.createdAt} lastSeenAt={incident.lastSeenAt} resolvedAt={incident.resolvedAt} />
    </div>
  );
}

/* Sub-Components */

function BreadcrumbNavigation() {
  return (
    <Link
      href="/incidents"
      className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      <span>Back to Incident Log</span>
    </Link>
  );
}

function PageHeader({ incident }: { incident: IncidentData }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans">{incident.title}</h1>

          <SeverityBadge severity={incident.severity} />

          <Badge
            variant="outline"
            className={`font-mono text-[10px] px-2 py-0.5 ${
              incident.resolved
                ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                : "border-rose-500/30 text-rose-400 bg-rose-500/10 animate-pulse"
            }`}
          >
            {incident.resolved ? "RESOLVED" : "OPEN"}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1 text-zinc-300">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            {incident.project.name}
          </span>
          <span>•</span>
          <span className="text-zinc-500">ID: {incident.id}</span>
        </div>
      </div>

      <div className="shrink-0">
        <IncidentActions incidentId={incident.id} resolved={incident.resolved} />
      </div>
    </div>
  );
}

function QuickMetricsGrid({ incident }: { incident: IncidentData }) {
  const metrics = [
    {
      label: "Severity Level",
      value: incident.severity,
      icon: AlertOctagon,
      textColor:
        incident.severity === "CRITICAL"
          ? "text-rose-400"
          : incident.severity === "HIGH"
            ? "text-orange-400"
            : incident.severity === "MEDIUM"
              ? "text-amber-400"
              : "text-sky-400",
    },
    {
      label: "Current Status",
      value: incident.resolved ? "Resolved" : "Active / Open",
      icon: CheckCircle2,
      textColor: incident.resolved ? "text-emerald-400" : "text-rose-400",
    },
    {
      label: "Hit Count",
      value: `${incident.occurrenceCount.toLocaleString()} occurrences`,
      icon: Activity,
      textColor: "text-emerald-400",
    },
    {
      label: "Target Endpoint",
      value: incident.endpoint ?? "Multiple routes",
      icon: Globe,
      textColor: "text-zinc-300 font-mono text-xs truncate",
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <Card key={m.label} className="border border-border/80 bg-card/95 backdrop-blur-md shadow-md">
            <CardContent className="p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span>{m.label}</span>
              </div>
              <p className={`font-mono text-sm font-bold ${m.textColor}`}>{m.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function DescriptionCard({ description }: { description: string | null }) {
  return (
    <Card className="border border-border/80 bg-card/95 backdrop-blur-md shadow-xl">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border/60 bg-muted/20">
        <Terminal className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-extrabold tracking-tight text-foreground font-sans">Incident Overview & Description</h2>
      </div>
      <CardContent className="p-5">
        <p className="text-xs font-mono leading-relaxed text-zinc-300 whitespace-pre-wrap bg-black/40 p-3.5 rounded-md border border-border/50">
          {description ?? "No contextual description provided for this error entry."}
        </p>
      </CardContent>
    </Card>
  );
}

function AffectedRoutesCard({ routes }: { routes: { endpoint: string; occurrences: number }[] }) {
  return (
    <Card className="border border-border/80 bg-card/95 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-muted/20">
        <div className="flex items-center gap-2">
          <Route className="h-4 w-4 text-sky-400" />
          <h2 className="text-sm font-extrabold tracking-tight text-foreground font-sans">Affected Endpoint Routes</h2>
        </div>
        <Badge variant="outline" className="font-mono text-[9px] px-1.5 py-0 border-sky-500/30 text-sky-400 bg-sky-500/10 h-4">
          {routes.length} ROUTES
        </Badge>
      </div>

      <CardContent className="p-5">
        {routes.length === 0 ? (
          <p className="text-xs font-mono text-muted-foreground">No specific routes logged for this incident.</p>
        ) : (
          <div className="divide-y divide-border/40 font-mono text-xs">
            {routes.map((route) => (
              <div key={route.endpoint} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <span className="rounded bg-zinc-800/80 px-2 py-1 text-zinc-300 border border-border/40">{route.endpoint}</span>
                <span className="text-muted-foreground">
                  <strong className="text-emerald-400 font-bold">{route.occurrences.toLocaleString()}</strong> hits
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TimestampFooter({ createdAt, lastSeenAt, resolvedAt }: { createdAt: Date; lastSeenAt: Date | null; resolvedAt: Date | null }) {
  return (
    <div className="rounded-lg border border-border/60 bg-black/30 p-4 font-mono text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-zinc-400" />
        <span>First Detected:</span>
        <span className="text-foreground">{new Date(createdAt).toLocaleString()}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <ShieldAlert className="h-3.5 w-3.5 text-zinc-400" />
        <span>Last Seen:</span>
        <span className="text-zinc-200">{lastSeenAt ? new Date(lastSeenAt).toLocaleString() : "Unknown"}</span>
      </div>

      {resolvedAt && (
        <div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Resolved:</span>
          <span className="font-bold">{new Date(resolvedAt).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}

function SeverityBadge({ severity }: { severity: IncidentData["severity"] }) {
  const styles = {
    LOW: "border-sky-500/30 text-sky-400 bg-sky-500/10",
    MEDIUM: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    HIGH: "border-orange-500/30 text-orange-400 bg-orange-500/10",
    CRITICAL: "border-rose-500/30 text-rose-400 bg-rose-500/10 font-bold",
  };

  return (
    <Badge variant="outline" className={`font-mono text-[10px] px-2 py-0.5 ${styles[severity]}`}>
      {severity}
    </Badge>
  );
}
