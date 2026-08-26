import { Terminal, Database, Cpu, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Terminal,
    title: "1. Express SDK Ingestion",
    description: "Captures latency & status codes with O(1) execution overhead during request handling.",
    metric: "0.1ms overhead",
  },
  {
    icon: Cpu,
    title: "2. Redis Stream Buffer",
    description: "Appends telemetry payloads directly to Redis streams to decouple DB write operations.",
    metric: "In-memory speed",
  },
  {
    icon: ArrowRight,
    title: "3. Dual-Trigger Worker",
    description: "Flushes batches asynchronously when reaching 500 records or a 2-second time window.",
    metric: "N / 500 Writes",
  },
  {
    icon: Database,
    title: "4. PostgreSQL Batch Write",
    description: "Persists formatted metrics into DB via bulk inserts, preserving connection pool availability.",
    metric: "Amortized IOPS",
  },
];

export default function ArchitecturePipeline() {
  return (
    <section className="py-20 px-4 border-t border-border/40 max-w-7xl mx-auto">
      <div className="text-center space-y-3 mb-14">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">SYSTEM DESIGN</h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How TelemetryNexus Handles High Concurrency</h3>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Instead of performing blocking database writes during the request lifecycle, incoming telemetry flows through an isolated, highly
          scalable asynchronous buffer.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              className="p-6 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
            >
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold font-sans text-foreground">{step.title}</h4>
                <p className="text-muted-foreground leading-relaxed font-sans">{step.description}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-border/40 text-[11px] text-emerald-400 font-medium">{step.metric}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
