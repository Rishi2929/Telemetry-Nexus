"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, Terminal, ArrowRight } from "lucide-react";

const mockLogs = [
  { method: "GET", path: "/api/v1/users", status: 200, time: "1.2ms", timestamp: "14:32:01", batch: "Batch #104" },
  { method: "POST", path: "/api/v1/auth/login", status: 201, time: "3.4ms", timestamp: "14:32:03", batch: "Batch #104" },
  { method: "GET", path: "/api/v1/dashboard", status: 200, time: "0.8ms", timestamp: "14:32:05", batch: "Batch #104" },
  { method: "PUT", path: "/api/v1/users/123", status: 404, time: "1.1ms", timestamp: "14:32:08", batch: "Batch #105" },
  { method: "GET", path: "/api/v1/analytics", status: 200, time: "2.1ms", timestamp: "14:32:10", batch: "Batch #105" },
];

export default function TerminalHero() {
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [displayedLogs, setDisplayedLogs] = useState<typeof mockLogs>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentLogIndex < mockLogs.length) {
        setDisplayedLogs((prev) => [...prev, mockLogs[currentLogIndex]]);
        setCurrentLogIndex((prev) => prev + 1);
      } else {
        setDisplayedLogs([]);
        setCurrentLogIndex(0);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [currentLogIndex]);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-emerald-400";
    if (status >= 400 && status < 500) return "text-amber-400";
    if (status >= 500) return "text-rose-400";
    return "text-muted-foreground";
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-16 px-4 md:pt-28 md:pb-24 max-w-7xl mx-auto">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Copy & Calls to Action */}
        <div className="space-y-6 text-left">
          <Badge variant="outline" className="font-mono text-xs px-3 py-1 bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            ● NON-BLOCKING TELEMETRY PIPELINE
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Lightweight API Observability <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent font-mono">
              Without Database Bottlenecks
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            TelemetryNexus captures API telemetry with minimal O(1) overhead, using Redis and background workers to keep your APIs fast
            under heavy traffic.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs">
            <Button
              size="lg"
              className="h-12 px-6 bg-emerald-500 text-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 font-semibold"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <Play className="mr-2 h-4 w-4 fill-black" /> Explore Live Sandbox
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="h-12 px-6 border-border/80 hover:bg-muted font-medium">
              <Link href="/docs" className="flex items-center gap-2">
                <span>View Documentation</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Micro Specs Bar */}
          {/* <div className="pt-6 grid grid-cols-3 gap-4 border-t border-border/40 font-mono text-xs">
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">Ingestion Speed</div>
              <div className="text-foreground font-semibold mt-0.5">O(1) Constant Time[cite: 1, 2]</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">Flush Strategy</div>
              <div className="text-foreground font-semibold mt-0.5">500 Batch / 2s Window[cite: 1]</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">Memory Limit</div>
              <div className="text-foreground font-semibold mt-0.5">Bounded M_max[cite: 1]</div>
            </div>
          </div> */}
        </div>

        {/* Right Side: Animated Mock Terminal */}
        <div className="relative">
          <div className="rounded-xl border border-border/80 bg-card/90 backdrop-blur-md shadow-2xl overflow-hidden font-mono text-xs">
            {/* Terminal Top Window Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border/60">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-[11px] text-muted-foreground pl-2 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" /> node-telemetry-worker
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-bold">
                BUFFERING ACTIVE
              </span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 h-80 overflow-hidden text-left bg-black/40 space-y-2 leading-relaxed">
              <div className="text-emerald-400">$ telemetry-nexus-worker --stream=redis</div>
              <div className="text-muted-foreground">[init] Ingestion buffer initialized at threshold B=500[cite: 1]</div>
              <div className="text-muted-foreground">[init] Consumer worker listening for incoming streams...</div>
              <div className="border-t border-border/40 my-2"></div>

              {/* Streaming Logs */}
              <div className="space-y-1.5">
                {displayedLogs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between text-[11px] font-mono border-b border-border/10 pb-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-muted-foreground">{log.timestamp}</span>
                      <span
                        className={`font-bold ${
                          log.method === "GET" ? "text-sky-400" : log.method === "POST" ? "text-indigo-400" : "text-amber-400"
                        }`}
                      >
                        {log.method}
                      </span>
                      <span className="text-foreground truncate">{log.path}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={getStatusColor(log.status)}>{log.status}</span>
                      <span className="text-muted-foreground text-[10px]">{log.time}</span>
                      <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-emerald-400 border border-border/40">
                        {log.batch}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Blinking Cursor Prompt */}
                <div className="flex items-center gap-2 pt-1 text-emerald-400">
                  <span>$</span>
                  <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse"></span>
                </div>
              </div>
            </div>

            {/* Terminal Footer Status Bar */}
            <div className="px-4 py-2 bg-muted/40 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Status: Stream Connected</span>
              <span className="text-emerald-400 font-semibold">Overhead: &lt; 0.1ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
