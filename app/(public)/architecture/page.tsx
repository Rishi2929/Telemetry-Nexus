import {
  Activity,
  ArrowDown,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  Gauge,
  Layers3,
  Radio,
  Server,
  ShieldCheck,
  Workflow,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

const pipeline = [
  {
    step: "01",
    title: "Application Layer",
    description: "API routes emit structured telemetry asynchronously without coupling analytics processing to the request lifecycle.",
    icon: Server,
    badge: "SDK / Middleware",
  },
  {
    step: "02",
    title: "Telemetry Ingestion",
    description:
      "The ingestion layer receives telemetry payloads, validates authentication, normalizes events, and forwards them to the stream.",
    icon: Radio,
    badge: "Async Ingestion",
  },
  {
    step: "03",
    title: "Redis Streams",
    description: "Redis Streams provide an intermediate buffer between high-volume producers and downstream processing workloads.",
    icon: Database,
    badge: "Stream Buffer",
  },
  {
    step: "04",
    title: "Background Consumers",
    description: "Dedicated consumers process stream events asynchronously, calculate metrics, and handle persistence independently.",
    icon: Workflow,
    badge: "Worker Processing",
  },
  {
    step: "05",
    title: "Analytics & Storage",
    description: "Processed telemetry is persisted and exposed through endpoint performance, latency, error, and traffic analytics.",
    icon: BarChart3,
    badge: "Persistent Analytics",
  },
];

const reliability = [
  {
    title: "Traffic Spikes",
    description:
      "The stream acts as a buffer between incoming telemetry and downstream processing, allowing consumers to catch up independently.",
    icon: Activity,
  },
  {
    title: "Consumer Failure",
    description:
      "Processing is separated from ingestion, so temporary consumer failures do not require the application to perform the analytics work itself.",
    icon: ShieldCheck,
  },
  {
    title: "Database Pressure",
    description: "Persistence is moved behind the processing layer instead of being directly coupled to every incoming telemetry event.",
    icon: Database,
  },
  {
    title: "Independent Scaling",
    description: "Ingestion and background processing can be scaled independently as telemetry volume and processing requirements change.",
    icon: Layers3,
  },
];

const capabilities = [
  {
    title: "Asynchronous Processing",
    description: "Telemetry processing happens outside the primary application request path.",
    icon: Zap,
  },
  {
    title: "Buffered Ingestion",
    description: "Redis Streams absorb bursts between telemetry producers and background workers.",
    icon: Database,
  },
  {
    title: "Consumer-Based Processing",
    description: "Background workers independently consume and process telemetry events.",
    icon: Workflow,
  },
  {
    title: "Granular Metrics",
    description: "Analyze throughput, endpoint behavior, latency, status codes, and errors.",
    icon: Gauge,
  },
];

const stack = [
  ["Application", "Next.js / Node.js"],
  ["Telemetry", "Structured HTTP Events"],
  ["Buffer", "Redis Streams"],
  ["Processing", "Background Consumers"],
  ["Persistence", "Database Storage"],
  ["Visualization", "TelemetryNexus Analytics"],
];

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="absolute left-1/2 top-0 -z-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[130px]" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-8 sm:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-400 backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              System Architecture & Data Pipelines
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Telemetry infrastructure.
              <span className="block text-emerald-400">Decoupled by design.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              TelemetryNexus separates telemetry collection from downstream processing using Redis Streams as an intermediate buffer,
              allowing application traffic and analytics workloads to operate independently.
            </p>
          </div>

          <div className="mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroMetric label="INGESTION" value="ASYNC" />
            <HeroMetric label="BUFFER" value="REDIS" />
            <HeroMetric label="PROCESSING" value="WORKERS" />
            <HeroMetric label="ANALYTICS" value="REAL-TIME" />
          </div>
        </div>
      </section>

      {/* =========================================================
          PIPELINE
      ========================================================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Pipeline Architecture"
          title="From request to insight"
          description="Telemetry moves through isolated stages so collection, buffering, processing, and visualization remain independently manageable."
        />

        <div className="relative mt-12 space-y-4">
          <div className="absolute left-7 top-7 hidden h-[calc(100%-3.5rem)] w-px bg-gradient-to-b from-emerald-500/50 via-border to-transparent md:block" />

          {pipeline.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={item.step}>
                <div className="group relative flex flex-col gap-5 rounded-xl border border-border/70 bg-card/40 p-5 backdrop-blur-md transition-all duration-200 hover:border-emerald-500/40 hover:bg-card/70 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)] sm:flex-row sm:items-start">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-background text-emerald-400 shadow-sm transition-transform duration-200 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-400/70">[{item.step}]</span>

                        <h3 className="text-sm font-semibold tracking-tight sm:text-base">{item.title}</h3>
                      </div>

                      <span className="w-fit rounded border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
                        {item.badge}
                      </span>
                    </div>

                    <p className="mt-3 max-w-3xl text-xs leading-6 text-muted-foreground sm:text-sm">{item.description}</p>
                  </div>
                </div>

                {index < pipeline.length - 1 && (
                  <div className="flex justify-center py-1.5 md:hidden">
                    <ArrowDown className="h-4 w-4 text-emerald-400/50" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          REQUEST PATH VS TELEMETRY PATH
      ========================================================= */}
      <section className="border-y border-border/60 bg-muted/[0.08]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
          <SectionHeading
            eyebrow="Execution Model"
            title="Separate the request path from the telemetry path"
            description="The application remains responsible for serving the request while telemetry moves through an independent processing pipeline."
          />

          <div className="mt-12 overflow-hidden rounded-xl border border-border/70 bg-card/50 shadow-xl">
            <div className="grid lg:grid-cols-2">
              {/* Request path */}
              <div className="border-b border-border/70 p-6 lg:border-b-0 lg:border-r">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Path 01</p>
                    <h3 className="mt-1 text-sm font-semibold">Primary Request Path</h3>
                  </div>

                  <span className="rounded border border-sky-500/20 bg-sky-500/10 px-2 py-1 font-mono text-[9px] text-sky-400">
                    SYNCHRONOUS
                  </span>
                </div>

                <div className="space-y-3">
                  <FlowNode label="Client" value="HTTP Request" icon={<Radio className="h-4 w-4" />} />

                  <FlowArrow />

                  <FlowNode label="Application" value="Execute Route" icon={<Server className="h-4 w-4" />} />

                  <FlowArrow />

                  <FlowNode label="Response" value="Return to Client" icon={<CheckCircle2 className="h-4 w-4" />} />
                </div>
              </div>

              {/* Telemetry path */}
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Path 02</p>
                    <h3 className="mt-1 text-sm font-semibold">Telemetry Processing Path</h3>
                  </div>

                  <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 font-mono text-[9px] text-emerald-400">
                    ASYNCHRONOUS
                  </span>
                </div>

                <div className="space-y-3">
                  <FlowNode label="Telemetry Event" value="Emit" icon={<Activity className="h-4 w-4" />} />

                  <FlowArrow />

                  <FlowNode label="Ingestion API" value="Normalize" icon={<Radio className="h-4 w-4" />} />

                  <FlowArrow />

                  <FlowNode label="Redis Stream" value="Buffer" icon={<Database className="h-4 w-4" />} />

                  <FlowArrow />

                  <FlowNode label="Consumer" value="Process" icon={<Workflow className="h-4 w-4" />} />

                  <FlowArrow />

                  <FlowNode label="Analytics" value="Persist & Visualize" icon={<BarChart3 className="h-4 w-4" />} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TECHNICAL MODEL
      ========================================================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Technical Model"
              title="A buffered event pipeline"
              description="Redis Streams sit between telemetry producers and background consumers, creating a clear boundary between event ingestion and downstream processing."
            />

            <div className="mt-8 space-y-3">
              <TechnicalPoint
                number="01"
                title="Producer isolation"
                description="Applications emit telemetry without directly performing downstream analytics work."
              />

              <TechnicalPoint
                number="02"
                title="Stream buffering"
                description="Events enter a dedicated stream before background processing begins."
              />

              <TechnicalPoint
                number="03"
                title="Consumer processing"
                description="Workers independently consume events and perform aggregation and persistence."
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-border/70 bg-black/60 p-5 font-mono text-xs shadow-2xl">
              <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Workflow className="h-3.5 w-3.5 text-emerald-400" />
                  <span>telemetry_pipeline</span>
                </div>

                <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  pipeline active
                </div>
              </div>

              <ArchitectureNode label="Application Instances" value="Telemetry Producers" icon={<Server className="h-4 w-4" />} />

              <PipelineLine />

              <ArchitectureNode label="Telemetry Ingestion" value="Event Normalization" icon={<Radio className="h-4 w-4" />} />

              <PipelineLine />

              <ArchitectureNode label="Redis Streams" value="Buffered Events" icon={<Database className="h-4 w-4" />} highlighted />

              <PipelineLine />

              <div className="grid gap-2 sm:grid-cols-3">
                <WorkerNode label="Consumer 01" />
                <WorkerNode label="Consumer 02" />
                <WorkerNode label="Consumer N" />
              </div>

              <PipelineLine />

              <ArchitectureNode label="Persistent Storage" value="Processed Metrics" icon={<Database className="h-4 w-4" />} />

              <PipelineLine />

              <ArchitectureNode label="Analytics Dashboard" value="Observability Layer" icon={<BarChart3 className="h-4 w-4" />} />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FAILURE ISOLATION
      ========================================================= */}
      <section className="border-y border-border/60 bg-muted/[0.08]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
          <SectionHeading
            eyebrow="Reliability"
            title="Failure isolation by design"
            description="Separating ingestion from processing prevents every downstream operation from becoming part of the application's critical request path."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {reliability.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-xl border border-border/70 bg-card/40 p-6 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-card/70"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <h3 className="text-sm font-semibold">{item.title}</h3>

                  <p className="mt-2 text-xs leading-6 text-muted-foreground sm:text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          SCALING MODEL
      ========================================================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Scaling Model"
              title="Scale processing independently"
              description="As telemetry volume increases, additional consumers can process the stream without requiring the application layer and processing layer to scale identically."
            />

            <div className="mt-8 rounded-xl border border-border/70 bg-card/40 p-5 font-mono text-xs">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Server className="h-4 w-4 text-sky-400" />
                <span>API INSTANCES</span>
              </div>

              <div className="my-4 flex items-center justify-center">
                <ArrowDown className="h-4 w-4 text-emerald-400/60" />
              </div>

              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-4">
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <span>REDIS STREAM</span>
                </div>

                <p className="mt-2 text-[10px] text-muted-foreground">Shared telemetry buffer</p>
              </div>

              <div className="my-4 flex items-center justify-center">
                <ArrowDown className="h-4 w-4 text-emerald-400/60" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <WorkerNode label="WORKER 01" />
                <WorkerNode label="WORKER 02" />
                <WorkerNode label="WORKER N" />
              </div>

              <div className="my-4 flex items-center justify-center">
                <ArrowDown className="h-4 w-4 text-emerald-400/60" />
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-background/60 px-4 py-3">
                <BarChart3 className="h-4 w-4 text-purple-400" />
                <span>ANALYTICS STORAGE</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ScalingCard
              number="01"
              title="Producer scaling"
              description="Multiple application instances can emit telemetry into the same ingestion pipeline."
            />

            <ScalingCard
              number="02"
              title="Stream buffering"
              description="The stream creates a boundary between event arrival rate and processing throughput."
            />

            <ScalingCard
              number="03"
              title="Worker scaling"
              description="Additional consumers can be introduced as processing demand increases."
            />

            <ScalingCard
              number="04"
              title="Independent workloads"
              description="Application traffic and analytics processing do not need identical scaling characteristics."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          ENGINE SPECS
      ========================================================= */}
      <section className="border-y border-border/60 bg-muted/[0.08]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
          <SectionHeading
            eyebrow="Engine Specs"
            title="Built around observability"
            description="The architecture provides the foundation for collecting and analyzing the signals that matter to API performance."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {capabilities.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-xl border border-border/70 bg-card/40 p-6 transition-all hover:border-emerald-500/30 hover:bg-card/70"
                >
                  <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                    <Icon className="h-4 w-4" />
                  </div>

                  <h3 className="text-sm font-semibold tracking-tight">{item.title}</h3>

                  <p className="mt-2 text-xs leading-6 text-muted-foreground sm:text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          STACK
      ========================================================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Technology Stack"
          title="Core system components"
          description="The architecture is composed of focused layers, each responsible for a specific stage of the telemetry lifecycle."
        />

        <div className="mt-10 overflow-hidden rounded-xl border border-border/70 bg-card/40">
          <div className="grid grid-cols-2 border-b border-border/70 bg-muted/30 px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground sm:grid-cols-[0.7fr_1.3fr] sm:px-6">
            <span>Layer</span>
            <span>Technology / Responsibility</span>
          </div>

          {stack.map(([layer, technology], index) => (
            <div
              key={layer}
              className={`grid grid-cols-2 px-4 py-4 sm:grid-cols-[0.7fr_1.3fr] sm:px-6 ${
                index !== stack.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wide text-emerald-400">{layer}</span>

              <span className="text-xs text-muted-foreground sm:text-sm">{technology}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          FINAL SUMMARY
      ========================================================= */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-8">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">
            <span>Application</span>
            <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
            <span>Ingestion</span>
            <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
            <span>Redis Streams</span>
            <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
            <span>Consumers</span>
            <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
            <span>Analytics</span>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">TelemetryNexus architecture · asynchronous telemetry processing</p>
        </div>
      </section>
    </main>
  );
}

/* ===============================================================
   SUB-COMPONENTS
=============================================================== */

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-2xl">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">{eyebrow}</span>

      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>

      <p className="mt-3 text-xs leading-6 text-muted-foreground sm:text-sm">{description}</p>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 px-4 py-3 backdrop-blur-sm">
      <p className="font-mono text-[8px] font-bold tracking-widest text-muted-foreground">{label}</p>

      <p className="mt-1 font-mono text-[11px] font-semibold text-foreground">{value}</p>
    </div>
  );
}

function FlowNode({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-emerald-400">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>

      <span className="font-mono text-[9px] text-muted-foreground">{value}</span>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center">
      <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/50" />
    </div>
  );
}

function ArchitectureNode({
  label,
  value,
  icon,
  highlighted = false,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
        highlighted ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/60 bg-card/60"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-emerald-400">{icon}</span>
        <span className="text-xs font-medium text-foreground">{label}</span>
      </div>

      <span className="font-mono text-[9px] text-muted-foreground">{value}</span>
    </div>
  );
}

function PipelineLine() {
  return (
    <div className="flex justify-center py-1">
      <ArrowDown className="h-3.5 w-3.5 text-emerald-400/50" />
    </div>
  );
}

function WorkerNode({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-3 text-center">
      <Workflow className="mx-auto mb-2 h-3.5 w-3.5 text-amber-400" />

      <span className="font-mono text-[8px] font-semibold text-muted-foreground">{label}</span>
    </div>
  );
}

function TechnicalPoint({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-4 rounded-lg border border-border/60 bg-card/30 p-4">
      <span className="font-mono text-[10px] font-bold text-emerald-400/70">{number}</span>

      <div>
        <h3 className="text-xs font-semibold">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function ScalingCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-4 rounded-xl border border-border/70 bg-card/40 p-5 transition-colors hover:border-emerald-500/30">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background font-mono text-[9px] font-bold text-emerald-400">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold">{title}</h3>

        <p className="mt-1.5 text-xs leading-6 text-muted-foreground sm:text-sm">{description}</p>
      </div>
    </div>
  );
}
