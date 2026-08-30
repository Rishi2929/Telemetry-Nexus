import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, ShieldCheck, Terminal, Radio, AlertOctagon, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-10 font-sans w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-1 border-b border-border/60 pb-5">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-emerald-400 shrink-0" />
          <h1 className="text-2xl font-black tracking-tight text-foreground">Settings</h1>
        </div>
        <p className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" />
          <span>Manage your TelemetryNexus project configuration and ingestion routes.</span>
        </p>
      </div>

      {/* Main Settings Section */}
      <div className="space-y-10">
        {/* Project Settings Card */}
        <Card className="rounded-lg border border-border/80 bg-card/95 shadow-xl backdrop-blur-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 bg-muted/20 px-5 py-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-sm font-extrabold tracking-tight text-foreground font-mono uppercase">Project Settings</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="project-name" className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Project Name
              </Label>
              <Input
                id="project-name"
                placeholder="TelemetryNexus"
                defaultValue="TelemetryNexus"
                className="font-mono text-xs bg-zinc-900/80 border-border/70 focus-visible:ring-emerald-500/40 text-zinc-200 placeholder:text-zinc-600 h-9"
              />
              <p className="font-mono text-[11px] text-zinc-500 mt-1">The name displayed throughout your TelemetryNexus dashboard.</p>
            </div>

            <Separator className="bg-border/60" />

            <div className="space-y-1.5">
              <Label htmlFor="project-id" className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Project ID
              </Label>
              <Input
                id="project-id"
                value="project-id"
                readOnly
                className="font-mono text-xs bg-zinc-900/40 border-border/60 text-zinc-400 cursor-not-allowed h-9"
              />
              <p className="font-mono text-[11px] text-zinc-500 mt-1">Your unique project identifier. This value cannot be changed.</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button className="font-mono text-xs font-bold h-9 bg-emerald-600 text-white hover:bg-emerald-500 transition-colors gap-2">
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Telemetry Card */}
        <Card className="rounded-lg border border-border/80 bg-card/95 shadow-xl backdrop-blur-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 bg-muted/20 px-5 py-3">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-sm font-extrabold tracking-tight text-foreground font-mono uppercase">
                Telemetry Pipeline
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-1">
              <Label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Telemetry Ingestion</Label>
              <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                Telemetry from your applications is processed through the TelemetryNexus ingestion pipeline.
              </p>
            </div>

            <Separator className="bg-border/60" />

            <div className="space-y-1.5">
              <Label htmlFor="ingestion-endpoint" className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Ingestion Endpoint
              </Label>
              <Input
                id="ingestion-endpoint"
                value="/api/v1/logs"
                readOnly
                className="font-mono text-xs bg-zinc-900/40 border-border/60 text-zinc-300 h-9"
              />
              <p className="font-mono text-[11px] text-zinc-500 mt-1">Send telemetry from your SDK or application to this endpoint.</p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone Card */}
        <Card className="rounded-lg border border-rose-500/30 bg-rose-500/5 shadow-xl overflow-hidden font-mono">
          <CardHeader className="flex flex-row items-center justify-between border-b border-rose-500/20 bg-rose-500/10 px-5 py-3">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertOctagon className="h-4 w-4 shrink-0" />
              <CardTitle className="text-sm font-extrabold tracking-tight uppercase">Danger Zone</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex flex-col gap-4 rounded-md border border-rose-500/20 bg-zinc-950/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-rose-300">Delete Project</h3>
                <p className="text-[11px] font-sans text-zinc-400">Permanently delete this project and its associated telemetry.</p>
              </div>

              <Button
                variant="destructive"
                disabled
                className="font-mono text-xs h-9 bg-rose-600/20 border border-rose-500/30 text-rose-400 opacity-50 cursor-not-allowed"
              >
                Delete Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
