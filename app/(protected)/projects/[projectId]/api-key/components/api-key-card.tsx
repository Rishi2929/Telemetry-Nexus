"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Key, ShieldAlert, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ApiKeyCardProps = {
  projectId: string;
};

export default function ApiKeyCard({ projectId }: ApiKeyCardProps) {
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    async function fetchApiKey() {
      try {
        const response = await fetch("/api/flash-api-key");
        const data = await response.json();

        if (data.apiKey) {
          setApiKey(data.apiKey);
        } else {
          router.push(`/projects/${projectId}`);
        }
      } catch (error) {
        console.error("Failed to fetch API key:", error);
        router.push(`/projects/${projectId}`);
      } finally {
        setLoading(false);
      }
    }

    fetchApiKey();
  }, [projectId, router]);

  async function handleCopyKey() {
    if (!apiKey) return;

    await navigator.clipboard.writeText(apiKey);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!apiKey) {
    return null;
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 font-sans text-left">
      <Card className="w-full max-w-xl relative overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md shadow-2xl">
        <CardHeaderSection />

        <CardContent className="p-6 space-y-5">
          <SecurityNotice />

          <KeyDisplayArea
            apiKey={apiKey}
            showKey={showKey}
            copied={copied}
            onToggleShow={() => setShowKey((prev) => !prev)}
            onCopy={handleCopyKey}
          />

          <div className="pt-2 flex justify-end border-t border-border/50">
            <Link
              href={`/projects/${projectId}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-2 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-xs font-semibold hover:bg-emerald-500/20 hover:text-emerald-300 transition-all shadow-sm",
              )}
            >
              <span>CONTINUE TO DASHBOARD</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* Sub-Components */

function CardHeaderSection() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Key className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-base font-extrabold tracking-tight text-foreground font-sans">API Secret Provisioned</h2>
          <Badge
            variant="outline"
            className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4"
          >
            ACTIVE
          </Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">Ingestion credentials generated for API runtime authentication.</p>
      </div>
    </div>
  );
}

function SecurityNotice() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-mono text-amber-300/90">
      <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
      <div className="space-y-0.5">
        <span className="font-bold text-amber-400 uppercase tracking-wide">One-Time Secret Notice:</span>
        <p className="text-[11px] leading-relaxed text-amber-200/80">
          This token is displayed <strong>only once</strong>. Store it securely in your environment parameters before navigating away.
        </p>
      </div>
    </div>
  );
}

function KeyDisplayArea({
  apiKey,
  showKey,
  copied,
  onToggleShow,
  onCopy,
}: {
  apiKey: string;
  showKey: boolean;
  copied: boolean;
  onToggleShow: () => void;
  onCopy: () => void;
}) {
  const maskedKey = apiKey.slice(0, 8) + "•".repeat(24) + apiKey.slice(-4);

  return (
    <div className="space-y-1.5 font-mono">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">API Secret Key</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={showKey ? apiKey : maskedKey}
            readOnly
            className="font-mono text-xs bg-black/50 border-border/70 text-emerald-400 pr-9 selection:bg-emerald-500/30"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleShow}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
        </div>

        <Button
          onClick={onCopy}
          size="sm"
          variant="outline"
          className="h-9 gap-1.5 border-zinc-700/80 bg-zinc-900/60 text-zinc-300 font-mono text-xs hover:bg-zinc-800 hover:text-foreground shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-zinc-400" />
              <span>COPY</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center font-mono">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
        <span>Provisioning telemetry credentials...</span>
      </div>
    </div>
  );
}
