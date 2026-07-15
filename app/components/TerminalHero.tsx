'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button";
import { ChevronRight, Play } from "lucide-react";


const mockLogs = [
  { method: "GET", path: "/api/users", status: 200, time: "23ms", timestamp: "14:32:01" },
  { method: "POST", path: "/api/auth/login", status: 201, time: "45ms", timestamp: "14:32:05" },
  { method: "GET", path: "/api/dashboard", status: 200, time: "12ms", timestamp: "14:32:08" },
  { method: "PUT", path: "/api/users/123", status: 404, time: "8ms", timestamp: "14:32:12" },
  { method: "GET", path: "/api/logs", status: 200, time: "67ms", timestamp: "14:32:15" },
];

const TerminalHero = () => {
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [displayedLogs, setDisplayedLogs] = useState<typeof mockLogs>([]);

  useEffect(() => {
    
    const interval = setInterval(() => {
      if (currentLogIndex < mockLogs.length) {
        setDisplayedLogs(prev => [...prev, mockLogs[currentLogIndex]]);
        setCurrentLogIndex(prev => prev + 1);
      } else {
        // Reset and start over
        setDisplayedLogs([]);
        setCurrentLogIndex(0);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentLogIndex]);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-success";
    if (status >= 400 && status < 500) return "text-warning";
    if (status >= 500) return "text-error";
    return "text-muted-foreground";
  };

  return (
    <section className="relative overflow-hidden py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Real-time API
                <span className="block text-primary">Monitoring</span>
                <span className="block text-secondary">Made Simple</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Track, analyze, and debug your API calls with powerful logging and real-time insights.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
             <Button 
             size="lg" 
             className="px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground glow-green">
              <Play className="mr-2 h-4 w-4" />
              Start Monitoring
              </Button>
              <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 border-secondary text-secondary hover:bg-secondary/10">
                View Documentation
                <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
          </div>

          {/* Right Side - Animated Terminal */}
          <div className="relative">
            <div className="bg-card border border-border rounded-lg overflow-hidden glow-cyan">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-error"></div>
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">api-logger@terminal</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">LIVE</div>
              </div>
              
              {/* Terminal Content */}
              <div className="p-4 h-80 overflow-hidden">
                <div className="font-mono text-sm space-y-2">
                  <div className="text-primary">$ npm run monitor --live</div>
                  <div className="text-muted-foreground">🚀 API Logger started...</div>
                  <div className="text-muted-foreground">📡 Listening on port 3000</div>
                  <div className="border-t border-border/30 my-2"></div>
                  
                  {/* Live Logs */}
                  <div className="space-y-1">
                    {displayedLogs.map((log, index) => (
                      <div key={index} className="animate-fade-in-up text-xs">
                        <span className="text-muted-foreground">[{log.timestamp}]</span>
                        <span className={`ml-2 font-semibold ${
                          log.method === 'GET' ? 'text-primary' : 
                          log.method === 'POST' ? 'text-secondary' : 
                          log.method === 'PUT' ? 'text-warning' : 'text-muted-foreground'
                        }`}>
                          {log.method}
                        </span>
                        <span className="ml-2 text-foreground">{log.path}</span>
                        <span className={`ml-2 ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                        <span className="ml-2 text-muted-foreground">({log.time})</span>
                      </div>
                    ))}
                    
                    {/* Blinking Cursor */}
                    <div className="flex items-center">
                      <span className="text-primary">$</span>
                      <div className="terminal-cursor"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TerminalHero;