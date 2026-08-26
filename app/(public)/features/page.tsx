import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Highlights = [
  {
    id: "traffic-spikes",
    tag: "O(1) DETERMINISTIC OVERHEAD",
    title: "Surge-Proof Traffic Ingestion",
    subheading: "Decouple telemetry capture from the database write path.",
    description:
      "When traffic spikes hit, traditional synchronous DB logging blocks the Node.js event loop. TelemetryNexus buffers incoming telemetry with constant-time O(1) overhead, maintaining throughput within 3–5% of unmonitored baseline performance.",
    metric: "12,163 req/sec",
    metricLabel: "Measured at 1000 Concurrency (vs 492 req/s Sync Writes)",
    accent: "border-indigo-500/40 hover:border-indigo-500 hover:shadow-indigo-500/10",
    badgeBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  {
    id: "cloud-cost",
    tag: "BATCHED WRITE ENGINE",
    title: "Dual-Trigger Batch Flushing",
    subheading: "Dramatically lower database write frequency and IOPS.",
    description:
      "Instead of hitting PostgreSQL or MongoDB on every single HTTP request, our background engine flushes logs using dual triggers (500 records or 2-second time windows). This reduces write operations from N to N/B, minimizing lock contention.",
    metric: "N / 500 Writes",
    metricLabel: "Amortized Database Write Operations",
    accent: "border-emerald-500/40 hover:border-emerald-500 hover:shadow-emerald-500/10",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: "bounded-memory",
    tag: "STRICT RESOURCE BOUNDS",
    title: "Deterministic Memory Buffering",
    subheading: "Prevent memory leaks during high concurrency or DB slowdowns.",
    description:
      "Memory growth is strictly bounded by M_max = B × S_record. During database connection slowdowns or transient outages, automated buffer limits drop older telemetry entries to protect the core web application runtime memory.",
    metric: "Bounded Memory",
    metricLabel: "Guaranteed M_max Cap",
    accent: "border-sky-500/40 hover:border-sky-500 hover:shadow-sky-500/10",
    badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  {
    id: "auto-recovery",
    tag: "AUTOMATED RELIABILITY",
    title: "Asynchronous Incident Engine",
    subheading: "Detect latency spikes without runtime evaluation overhead.",
    description:
      "Post-persistence stream evaluation continuously checks request records against active alert rules, tracking latency anomalies and error rate thresholds asynchronously without interrupting primary request pathways.",
    metric: "Non-Blocking",
    metricLabel: "Asynchronous Stream Evaluation",
    accent: "border-rose-500/40 hover:border-rose-500 hover:shadow-rose-500/10",
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
];

export default function FoundersFeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 mx-auto max-w-6xl text-center md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

        <Badge variant="outline" className="mb-6 font-mono text-xs px-3.5 py-1 bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
          ● EMPIRICALLY BENCHMARKED TELEMETRY ARCHITECTURE
        </Badge>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl max-w-4xl mx-auto leading-[1.1]">
          Stop letting telemetry writes <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent font-mono">
            block your application.
          </span>
        </h1>

        <p className="mt-6 text-base text-muted-foreground sm:text-xl max-w-2xl mx-auto leading-relaxed">
          TelemetryNexus is a lightweight monitoring architecture that decouples telemetry ingestion from persistence, preserving
          near-baseline throughput while keeping memory usage strictly bounded.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            className="font-mono text-xs h-12 px-6 bg-emerald-500 text-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Link href="/dashboard">Explore Live Sandbox</Link>
          </Button>
          <Button variant="outline" size="lg" className="font-mono text-xs h-12 px-6 border-border/80 hover:bg-muted">
            <Link href="https://github.com/your-username/telemetry-nexus#benchmarks" target="_blank" rel="noopener noreferrer">
              Read Benchmark Report
            </Link>
          </Button>
        </div>

        {/* Live Architecture Visual Pipeline Banner */}
        <div className="mt-16 p-4 rounded-xl border border-border/60 bg-card/40 backdrop-blur-md max-w-4xl mx-auto text-left font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/40 text-muted-foreground text-[11px]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              TELEMETRY PIPELINE ARCHITECTURE
            </span>
            <span className="text-emerald-400 font-semibold">12,163 req/sec Benchmarked</span>
          </div>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded bg-muted/50 border border-border/40">
              <div className="text-[10px] text-muted-foreground">STEP 1</div>
              <div className="font-semibold text-foreground mt-1">Application SDK</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">O(1) Instrumentation</div>
            </div>

            <div className="p-3 rounded bg-indigo-500/10 border border-indigo-500/30">
              <div className="text-[10px] text-indigo-400">STEP 2</div>
              <div className="font-semibold text-indigo-300 mt-1">Redis Stream</div>
              <div className="text-[10px] text-indigo-400/80 mt-0.5">In-Memory Buffer</div>
            </div>

            <div className="p-3 rounded bg-purple-500/10 border border-purple-500/30">
              <div className="text-[10px] text-purple-400">STEP 3</div>
              <div className="font-semibold text-purple-300 mt-1">Flush Engine</div>
              <div className="text-[10px] text-purple-400/80 mt-0.5">500 Batch / 2s Timer</div>
            </div>

            <div className="p-3 rounded bg-muted/50 border border-border/40">
              <div className="text-[10px] text-muted-foreground">STEP 4</div>
              <div className="font-semibold text-foreground mt-1">Database Batch Persistence</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Amortized Write IOPS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Cards Section */}
      <section className="px-4 py-16 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Empirically Verified Performance</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-2">
            Designed for predictable runtime execution under high concurrency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Highlights.map((item) => (
            <Card
              key={item.id}
              className={`relative flex flex-col justify-between overflow-hidden border bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${item.accent}`}
            >
              <CardHeader className="space-y-3 p-6">
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded border ${item.badgeBg}`}>{item.tag}</span>
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-foreground">{item.metric}</div>
                    <div className="text-[10px] text-muted-foreground">{item.metricLabel}</div>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <CardTitle className="text-xl font-bold tracking-tight">{item.title}</CardTitle>
                  <p className="text-xs font-mono text-emerald-400/90 font-medium">{item.subheading}</p>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pt-2">{item.description}</p>
              </CardHeader>

              <CardContent className="px-6 pb-6 pt-0">
                <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>Architecture Pattern:</span>
                  <span className="text-foreground font-medium">Asynchronous Decoupled Queue</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Direct Benchmark Comparison Section */}
      <section className="px-4 py-16 mx-auto max-w-5xl border-t border-border/60">
        <div className="text-center mb-10">
          <Badge variant="outline" className="font-mono text-[10px] mb-2">
            EMPIRICAL BENCHMARKS (1000 CONCURRENT CONNECTIONS)
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight">Synchronous Persistence vs. TelemetryNexus</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Synchronous / Traditional Option */}
          <div className="p-6 rounded-xl border border-rose-500/20 bg-rose-500/[0.02] space-y-4">
            <div className="text-rose-400 font-bold text-sm">❌ Synchronous / Direct Ingestion</div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span> Direct per-request DB writes block Node.js event loop[cite: 1, 2]
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span> Severe throughput collapse (~492 req/sec)[cite: 1, 2]
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span> High mean latency (~784 ms)[cite: 1, 2]
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span> Database connection pool exhaustion under load[cite: 1, 2]
              </li>
            </ul>
          </div>

          {/* TelemetryNexus Option */}
          <div className="p-6 rounded-xl border border-emerald-500/40 bg-emerald-500/[0.03] space-y-4">
            <div className="text-emerald-400 font-bold text-sm">✓ TelemetryNexus Architecture</div>
            <ul className="space-y-2 text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span> Asynchronous Redis stream buffer[cite: 1, 2]
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span> Sustained near-baseline throughput (12,163 req/sec vs 12,538
                control)[cite: 1, 2]
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span> Low mean latency (~119 ms)[cite: 1, 2]
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span> Batched database flushes with bounded memory limits[cite: 1, 2]
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/60 bg-muted/20 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to test lightweight telemetry?</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Explore our live interactive sandbox or view the source repository to run autocannon benchmarks on your own infrastructure.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="font-mono text-xs bg-emerald-500 text-black hover:bg-emerald-400">
              <Link href="/dashboard">Launch Interactive Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
