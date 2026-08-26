import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Terminal, AlertTriangle, ShieldAlert, ArrowUpRight } from "lucide-react";
import type { RecentError } from "@/lib/db/dashboard";

type RecentErrorsProps = {
  errors: RecentError[];
};

export function RecentErrors({ errors }: RecentErrorsProps) {
  return (
    <Card className="relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <ComponentHeader count={errors.length} />

      <CardContent className="p-0">
        {errors.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <Table className="font-mono text-xs">
              <TableHeader className="bg-muted/40 border-b border-border/60">
                <TableRow className="hover:bg-transparent border-border/60">
                  <TableHead className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">Project</TableHead>
                  <TableHead className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">Method</TableHead>
                  <TableHead className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">Endpoint</TableHead>
                  <TableHead className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">Status</TableHead>
                  <TableHead className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">Level</TableHead>
                  <TableHead className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider text-right">Time</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {errors.map((error) => (
                  <ErrorRow key={error.id} error={error} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

{
  /* Sub-Components */
}

function ComponentHeader({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-muted/20">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-400" />
          <h2 className="text-base font-extrabold tracking-tight text-foreground font-sans">Recent Errors</h2>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Recent 4xx and 5xx HTTP exception logs across monitored endpoints.</p>
      </div>

      <Badge
        variant="outline"
        className="font-mono text-[10px] px-2.5 py-0.5 border-rose-500/30 text-rose-400 bg-rose-500/10 flex items-center gap-1.5"
      >
        <ShieldAlert className="h-3 w-3" />
        <span>{count} INCIDENTS</span>
      </Badge>
    </div>
  );
}

function ErrorRow({ error }: { error: RecentError }) {
  return (
    <TableRow className="hover:bg-muted/40 transition-colors border-border/40">
      <TableCell className="font-sans font-medium">
        <Link
          href={`/projects/${error.projectId}`}
          className="inline-flex items-center gap-1 hover:text-emerald-400 transition-colors group"
        >
          <span>{error.projectName}</span>
          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
        </Link>
      </TableCell>

      <TableCell>
        <MethodBadge method={error.method} />
      </TableCell>

      <TableCell className="max-w-64 truncate font-mono text-xs text-foreground">{error.endpoint}</TableCell>

      <TableCell>
        <Badge
          variant="outline"
          className={`font-mono text-[10px] ${
            error.statusCode >= 500
              ? "border-rose-500/30 text-rose-400 bg-rose-500/10"
              : "border-amber-500/30 text-amber-400 bg-amber-500/10"
          }`}
        >
          {error.statusCode}
        </Badge>
      </TableCell>

      <TableCell>
        <Badge variant="outline" className="font-mono text-[10px] border-border/80 bg-black/30 text-muted-foreground uppercase">
          {error.level}
        </Badge>
      </TableCell>

      <TableCell className="whitespace-nowrap text-right text-xs text-muted-foreground font-mono">
        {new Date(error.createdAt).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TableCell>
    </TableRow>
  );
}

function MethodBadge({ method }: { method: string }) {
  const upperMethod = method.toUpperCase();
  let colorStyle = "border-border/80 text-muted-foreground bg-black/20";

  if (upperMethod === "GET") colorStyle = "border-emerald-500/30 text-emerald-400 bg-emerald-500/10";
  if (upperMethod === "POST") colorStyle = "border-sky-500/30 text-sky-400 bg-sky-500/10";
  if (upperMethod === "PUT" || upperMethod === "PATCH") colorStyle = "border-amber-500/30 text-amber-400 bg-amber-500/10";
  if (upperMethod === "DELETE") colorStyle = "border-rose-500/30 text-rose-400 bg-rose-500/10";

  return (
    <Badge variant="outline" className={`font-mono text-[9px] px-1.5 py-0 ${colorStyle}`}>
      {upperMethod}
    </Badge>
  );
}

function EmptyState() {
  return (
    <div className="p-8 text-center font-mono space-y-2">
      <Terminal className="h-6 w-6 text-muted-foreground mx-auto opacity-50" />
      <p className="text-xs text-muted-foreground">No recent API exceptions or errors logged.</p>
    </div>
  );
}
