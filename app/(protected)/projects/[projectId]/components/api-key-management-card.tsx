"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RegenerateApiKeyDialog } from "./regenerate-api-key-dialog";
import { Key, Calendar, Copy, Check, ShieldCheck, Terminal } from "lucide-react";
import type { ProjectWithApiKeys } from "@/lib/types/type";

type ApiKeyManagementCardProps = {
  projectId: string;
  apiKey?: ProjectWithApiKeys["apiKeys"][number];
};

export function ApiKeyManagementCard({ projectId, apiKey }: ApiKeyManagementCardProps) {
  if (!apiKey) {
    return <EmptyApiKeyCard projectId={projectId} />;
  }

  return (
    <Card className="relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-xl font-sans text-left">
      <ComponentHeader />

      <CardContent className="p-5 space-y-4">
        <KeyDisplayBlock />

        <div className="grid gap-4 sm:grid-cols-2">
          <MetaBlock
            icon={Calendar}
            label="Created At"
            value={apiKey.createdAt.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          />

          <MetaBlock icon={ShieldCheck} label="Access Level" value="Full Ingestion & Read" />
        </div>
      </CardContent>

      <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-5 py-3">
        <span className="text-[10px] font-mono text-muted-foreground">Rotate credentials periodically to maintain telemetry security.</span>
        <RegenerateApiKeyDialog projectId={projectId} />
      </div>
    </Card>
  );
}

{
  /* Sub-Components */
}

function ComponentHeader() {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-muted/20">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Key className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-base font-extrabold tracking-tight text-foreground font-sans">API Credentials</h2>
          <Badge
            variant="outline"
            className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4"
          >
            ACTIVE
          </Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Authentication keys required for payload ingestion & SDK clients.</p>
      </div>
    </div>
  );
}

function KeyDisplayBlock() {
  const [copied, setCopied] = useState(false);
  const maskedKey = "tn_live_********************************";

  const handleCopy = () => {
    navigator.clipboard.writeText(maskedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1.5 rounded-md border border-border/60 bg-black/40 p-3">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Primary Live Key</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 px-2 text-[10px] font-mono text-muted-foreground hover:text-emerald-400 hover:bg-muted/40 cursor-pointer"
        >
          {copied ? (
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <Check className="h-3 w-3" /> Copied
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Copy className="h-3 w-3" /> Copy Mask
            </span>
          )}
        </Button>
      </div>
      <p className="font-mono text-xs font-semibold tracking-wider text-emerald-400 select-all">{maskedKey}</p>
    </div>
  );
}

function MetaBlock({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-md border border-border/40 bg-muted/10 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3 text-emerald-400" />
        <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs font-mono font-medium text-foreground">{value}</p>
    </div>
  );
}

function EmptyApiKeyCard({ projectId }: { projectId: string }) {
  return (
    <Card className="relative overflow-hidden border border-dashed border-border/80 bg-card/60 backdrop-blur-md shadow-xl font-sans text-left p-6">
      <div className="flex flex-col items-center justify-center text-center space-y-3 font-mono">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <Terminal className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground font-sans">No API Keys Provisioned</h3>
          <p className="text-xs text-muted-foreground">Generate an API key to allow this project to transmit logs and server metrics.</p>
        </div>
        <div className="pt-2">
          <RegenerateApiKeyDialog projectId={projectId} />
        </div>
      </div>
    </Card>
  );
}
