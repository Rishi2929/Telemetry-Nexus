"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Copy, Search, Menu, X, ChevronRight, Terminal, Layers, Cpu, Wrench, Rocket, AlertTriangle, Server } from "lucide-react";

// Section definitions with sub-links and icons
const docSections = [
  {
    title: "Getting Started",
    icon: Rocket,
    links: [
      { label: "Overview", href: "#overview" },
      { label: "Prerequisites", href: "#prerequisites" },
      { label: "Installation", href: "#installation" },
      { label: "Quickstart", href: "#quickstart" },
      { label: "Architecture", href: "#architecture" },
    ],
  },
  {
    title: "Core Concepts",
    icon: Cpu,
    links: [
      { label: "Telemetry SDK", href: "#sdk" },
      { label: "Ingestion API", href: "#ingestion" },
      { label: "Redis Streams", href: "#redis" },
      { label: "Telemetry Worker", href: "#worker" },
      { label: "Batch Processing", href: "#batching" },
      { label: "Incident Engine", href: "#incidents" },
    ],
  },
  {
    title: "Development",
    icon: Wrench,
    links: [
      { label: "Environment Variables", href: "#env-vars" },
      { label: "Running Locally", href: "#local-development" },
      { label: "Testing Telemetry", href: "#testing" },
      { label: "Redis Inspection", href: "#redis-inspection" },
      { label: "Troubleshooting", href: "#troubleshooting" },
    ],
  },
  {
    title: "Deployment",
    icon: Server,
    links: [
      { label: "Production Architecture", href: "#production" },
      { label: "Docker", href: "#docker" },
      { label: "Railway", href: "#railway" },
      { label: "Vercel", href: "#vercel" },
    ],
  },
];

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-3 overflow-hidden rounded-lg border border-border/70 bg-zinc-950 font-mono text-xs text-zinc-100 dark:border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-4 py-1.5 text-[11px] text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          Terminal
        </span>
        <Button size="icon" variant="ghost" className="h-6 w-6 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" onClick={handleCopy}>
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="whitespace-pre-wrap leading-relaxed">{children}</pre>
      </div>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="relative pl-8 sm:pl-10 space-y-2 border-l-2 border-border/60 pb-6 last:pb-0 last:border-l-transparent">
      <div className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background font-mono text-xs font-bold text-emerald-500 shadow-sm">
        {number}
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export default function DocsPage() {
  const [activeHash, setActiveHash] = useState("#overview");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keybindings (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Intersection Observer for Active TOC Link Highlights
  useEffect(() => {
    const allLinks = docSections.flatMap((s) => s.links.map((l) => l.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-10% 0px -75% 0px" },
    );

    allLinks.forEach((href) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const filteredLinks = docSections.flatMap((section) =>
    section.links
      .filter((link) => link.label.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((link) => ({ ...link, section: section.title })),
  );

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              TelemetryNexus
              <span className="text-xs font-normal text-muted-foreground">/ docs</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-1 font-mono text-xs text-muted-foreground hover:bg-muted/70 transition-all sm:flex"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search documentation...</span>
              <kbd className="rounded border bg-muted px-1.5 text-[10px]">⌘K</kbd>
            </button>

            <Button size="sm" variant="outline" className="font-mono text-xs h-8">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-border/60">
            <DialogTitle className="sr-only">Search Documentation</DialogTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search guide, configuration, deployment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/60"
                autoFocus
              />
            </div>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto p-2 space-y-1 font-mono text-xs">
            {filteredLinks.length > 0 ? (
              filteredLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-emerald-500" />
                    {link.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50 border border-border px-1.5 py-0.5 rounded">{link.section}</span>
                </a>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-6 text-xs font-mono">No docs matching "{searchQuery}"</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Grid Layout */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-8 md:grid-cols-12">
        {/* Desktop Sidebar */}
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] overflow-y-auto border-r border-border/40 pr-4 md:col-span-3 md:block">
          <div className="space-y-6">
            {docSections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <div key={section.title} className="space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                    <SectionIcon className="h-3.5 w-3.5 text-emerald-500" />
                    {section.title}
                  </div>

                  <ul className="space-y-1 font-mono text-xs border-l border-border/40 ml-1.5 pl-2">
                    {section.links.map((link) => {
                      const isActive = activeHash === link.href;
                      return (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            className={`block rounded px-2.5 py-1 transition-all ${
                              isActive
                                ? "bg-emerald-500/10 text-emerald-500 font-medium border-l-2 border-emerald-500 -ml-[11px] pl-[17px]"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                            }`}
                          >
                            {link.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Documentation Content */}
        <main className="space-y-16 md:col-span-9 lg:col-span-8">
          {/* Overview Section */}
          <section id="overview" className="scroll-mt-20 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs">
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 bg-emerald-500/10">
                v1.0.0
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Production Specs</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">TelemetryNexus Documentation</h1>

            <p className="text-base leading-relaxed text-muted-foreground">
              TelemetryNexus is an enterprise-grade telemetry ingestion and monitoring platform designed to decouple ingestion from
              persistence. It accepts API logs, buffers them through Redis Streams, and persists them into PostgreSQL using background
              workers.
            </p>

            <Card className="border-emerald-500/30 bg-emerald-500/[0.03]">
              <CardContent className="space-y-2 p-4 font-mono text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Core Architecture Guarantee
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  Ingress operations maintain O(1) latency under heavy load by offloading storage operations into high-throughput batch
                  workers.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Prerequisites */}
          <section id="prerequisites" className="scroll-mt-20 space-y-4 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Prerequisites</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ensure you have Node.js (=18), npm, PostgreSQL, and Redis installed locally.
            </p>
            <CodeBlock>{`brew install redis postgresql`}</CodeBlock>
            <p className="text-xs text-muted-foreground font-mono">Verify runtime binaries:</p>
            <CodeBlock>{`node --version\nnpm --version\nredis-server --version\npsql --version`}</CodeBlock>
          </section>

          {/* Installation Steps */}
          <section id="installation" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Installation</h2>
            <div className="mt-4 space-y-4">
              <Step number={1} title="Clone repository">
                <CodeBlock>{`git clone https://github.com/telemetry-nexus/telemetry-nexus.git\ncd telemetry-nexus`}</CodeBlock>
              </Step>
              <Step number={2} title="Install dependencies">
                <CodeBlock>{`npm install`}</CodeBlock>
              </Step>
              <Step number={3} title="Generate Prisma Client & Run Migrations">
                <CodeBlock>{`npx prisma generate\nnpx prisma migrate dev`}</CodeBlock>
              </Step>
            </div>
          </section>

          {/* Quickstart */}
          <section id="quickstart" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Quickstart</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Run local processes across separate terminals to handle ingestion and worker batching simultaneously.
            </p>

            <Step number={1} title="Start Redis Stream & Database">
              <CodeBlock>{`brew services start redis\nredis-cli ping # Should return PONG`}</CodeBlock>
            </Step>

            <Step number={2} title="Run Telemetry Server">
              <CodeBlock>{`npm run dev`}</CodeBlock>
            </Step>

            <Step number={3} title="Run Background Worker Process">
              <CodeBlock>{`npx tsx lib/redis/worker/telemetry-worker.ts`}</CodeBlock>
            </Step>
          </section>

          {/* Architecture */}
          <section id="architecture" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Architecture</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              TelemetryNexus separates ingestion from database persistence. Redis acts as the intermediate buffer and the telemetry worker
              performs asynchronous batch persistence.
            </p>
            <CodeBlock>{`Express application
       │
       │ telemetry request
       ▼
TelemetryNexus API
       │
       │ XADD
       ▼
Redis Stream: "telemetry"
       │
       │ XREAD
       ▼
Telemetry Worker
       │
       │ in-memory buffer
       ▼
processTelemetryBatch()
       │
       │ createManyAndReturn()
       ▼
PostgreSQL
       │
       ├── ApiLog
       │
       └── Incident Engine
              │
              ├── Incident
              └── IncidentOccurrence`}</CodeBlock>
          </section>

          {/* Telemetry SDK */}
          <section id="sdk" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Telemetry SDK</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The SDK is installed inside an application that you want to monitor. It captures telemetry and sends it to the TelemetryNexus
              ingestion API.
            </p>
            <CodeBlock>{`npm install @telemetry-nexus/sdk`}</CodeBlock>
            <p className="text-sm text-muted-foreground">
              <CodeBlock>{`import { telemetryMiddleware } from "@telemetry-nexus/sdk";

app.use(
  telemetryMiddleware({
    apiKey: process.env.TELEMETRY_API_KEY,
    endpoint: "https://your-deployment.vercel.app/api/v1/logs",
  })
);`}</CodeBlock>
            </p>
          </section>

          {/* Ingestion API */}
          <section id="ingestion" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Ingestion API</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Telemetry is received by the API, authenticated using an API key, validated using the log schema, and then published to Redis.
            </p>
            <CodeBlock>{`HTTP request
    ↓
Authenticate API key
    ↓
Parse request body
    ↓
Validate with Zod
    ↓
publishTelemetry()
    ↓
Redis XADD
    ↓
HTTP 201 response`}</CodeBlock>
            <p className="text-sm text-muted-foreground">
              The ingestion API does not perform the PostgreSQL telemetry insertion directly. Persistence is fully handled asynchronously by
              the worker.
            </p>
          </section>

          {/* Redis Streams */}
          <section id="redis" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Redis Streams</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Telemetry is stored in a Redis Stream named{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">telemetry</code>.
            </p>
            <CodeBlock>{`redis-cli XLEN telemetry\nredis-cli XRANGE telemetry - +`}</CodeBlock>
          </section>

          {/* Telemetry Worker */}
          <section id="worker" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Telemetry Worker</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The worker is a separate Node.js process. It reads telemetry from Redis and sends it to the batch persistence layer.
            </p>
            <CodeBlock>{`npx tsx lib/redis/worker/telemetry-worker.ts`}</CodeBlock>
            <Card className="border-emerald-500/30 bg-emerald-500/[0.03]">
              <CardContent className="space-y-1 p-4 font-mono text-xs text-muted-foreground">
                <div className="font-semibold text-emerald-400">Worker Requirement</div>
                <p>
                  The worker is not automatically started by the Next.js development server. Keep the worker process running while testing
                  asynchronous telemetry ingestion.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Batch Processing */}
          <section id="batching" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Batch Processing</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The worker uses an in-memory buffer with two distinct flush conditions to prevent continuous database IOPS overhead.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="space-y-2 p-4">
                  <h3 className="font-mono text-xs font-bold text-emerald-500">Capacity Trigger</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    When the in-memory buffer reaches 500 logs, it flushes to PostgreSQL immediately.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-2 p-4">
                  <h3 className="font-mono text-xs font-bold text-emerald-500">Timer Trigger</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A 2-second timer flushes any buffered logs to prevent low-volume telemetry from sitting indefinitely in memory.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Incident Engine */}
          <section id="incidents" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Incident Engine</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              After telemetry is persisted, the incident engine evaluates enabled alert rules for the relevant project.
            </p>
            <CodeBlock>{`ApiLog
  ↓
AlertRule
  ↓
Condition triggered?
  │
  ├── No → stop
  │
  └── Yes
       ↓
Existing unresolved Incident?
       │
       ├── Yes → update occurrenceCount / lastSeenAt
       │
       └── No  → create Incident
                    ↓
             create IncidentOccurrence`}</CodeBlock>
          </section>

          {/* Environment Variables */}
          <section id="env-vars" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Environment Variables</h2>
            <p className="text-sm text-muted-foreground">
              Configure your local <code className="font-mono text-xs">.env</code> file with the required service endpoints:
            </p>
            <CodeBlock>{`DATABASE_URL="postgresql://YOUR_USER@localhost:5432/telemetry_nexus"
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
REDIS_URL="redis://localhost:6379"`}</CodeBlock>
          </section>

          {/* Local Development */}
          <section id="local-development" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Running Locally</h2>
            <p className="text-sm text-muted-foreground">
              For a full local stack, run these three processes concurrently across separate terminal tabs:
            </p>
            <div className="space-y-3">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <span className="font-mono text-xs font-bold text-foreground">Terminal 1 — Web Next.js Server</span>
                  <CodeBlock>{`npm run dev`}</CodeBlock>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <span className="font-mono text-xs font-bold text-foreground">Terminal 2 — Telemetry Worker</span>
                  <CodeBlock>{`npx tsx lib/redis/worker/telemetry-worker.ts`}</CodeBlock>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <span className="font-mono text-xs font-bold text-foreground">Terminal 3 — Redis Instance</span>
                  <CodeBlock>{`brew services start redis`}</CodeBlock>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Testing Telemetry */}
          <section id="testing" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Testing Telemetry</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The repository contains a sample Express application to generate real HTTP telemetry:
            </p>
            <CodeBlock>{`cd sample-express-app\nnpm install\nnpm run dev`}</CodeBlock>
          </section>

          {/* Redis Inspection */}
          <section id="redis-inspection" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Inspecting Redis</h2>
            <CodeBlock>{`redis-cli ping\nredis-cli XLEN telemetry\nredis-cli XRANGE telemetry - +`}</CodeBlock>
          </section>

          {/* Production Architecture */}
          <section id="production" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Production Architecture</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Production deployments isolate the web application, background worker, Redis stream, and PostgreSQL cluster into scalable
              standalone infrastructure services.
            </p>
            <CodeBlock>{`Users / SDK
     │
     ▼
Web / Ingestion API
     │
     ▼
Managed Redis
     │
     ▼
Telemetry Worker
     │
     ▼
Managed PostgreSQL`}</CodeBlock>
          </section>

          {/* Docker */}
          <section id="docker" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Docker</h2>
            <p className="text-sm text-muted-foreground">
              Containerized deployment should execute the web application and telemetry worker as long-running processes.
            </p>
          </section>

          {/* Railway */}
          <section id="railway" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Railway</h2>
            <p className="text-sm text-muted-foreground">
              Deploy Railway services for PostgreSQL, Redis, Next.js web application, and background telemetry worker.
            </p>
          </section>

          {/* Vercel */}
          <section id="vercel" className="scroll-mt-20 space-y-6 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Vercel</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Vercel can host the Next.js API/Web frontend. However, the background worker requires a continuous Node.js runtime environment
              (e.g., Railway, Render, EC2) rather than short-lived serverless functions.
            </p>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting" className="scroll-mt-20 space-y-4 pt-6 border-t border-border/40">
            <h2 className="text-2xl font-bold tracking-tight">Troubleshooting</h2>

            <div className="space-y-4">
              <Card className="border-amber-500/30 bg-amber-500/[0.02]">
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-xs text-amber-500 font-mono">
                    <AlertTriangle className="h-4 w-4" />
                    Worker processes skipping logs?
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ensure the background process running <code className="font-mono text-foreground">telemetry-worker.ts</code> is distinct
                    from the primary Next.js server instance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
