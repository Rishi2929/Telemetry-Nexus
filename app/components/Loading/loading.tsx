import { Terminal } from "lucide-react";

export function PageLoading() {
  return (
    <div className="relative flex min-h-[400px] w-full flex-col items-center justify-center space-y-4 overflow-hidden rounded-xl border border-border/40 bg-card/20 p-8 font-mono text-xs">
      {/* Background Radial Glow */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[60px]" />

      {/* Terminal Radar / Spinner Indicator */}
      <div className="relative flex h-12 w-12 items-center justify-center">
        {/* Outer Pulsing Ring */}
        <span className="absolute inset-0 rounded-lg border border-emerald-500/30 bg-emerald-500/10 animate-ping opacity-75" />

        {/* Core Terminal Container */}
        <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/40 bg-background shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Terminal className="h-5 w-5 text-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Monospace Status Output */}
      <div className="flex flex-col items-center space-y-1 text-center">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-foreground tracking-tight">INSPECTING_PIPELINE...</span>
        </div>
        <p className="text-[11px] text-muted-foreground">Fetching telemetry stream & metrics</p>
      </div>
    </div>
  );
}
