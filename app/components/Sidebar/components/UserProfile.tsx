"use client";

import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth/authClient";
import { ShieldCheck } from "lucide-react";

export function UserProfile() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="space-y-1.5 font-mono p-1 animate-pulse">
        <div className="h-3.5 w-24 bg-muted/80 rounded" />
        <div className="h-3 w-32 bg-muted/40 rounded" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between font-mono text-left px-1">
      <div className="space-y-0.5 max-w-[170px]">
        <p className="text-xs font-bold text-foreground truncate">{session?.user?.name ?? "Developer"}</p>
        <p className="text-[10px] text-muted-foreground truncate">{session?.user?.email ?? "dev@telemetrynexus.io"}</p>
      </div>
      <Badge variant="outline" className="px-1.5 py-0.2 border-emerald-500/30 text-[9px] text-emerald-400 bg-emerald-500/10 font-mono">
        <ShieldCheck className="h-2.5 w-2.5" />
      </Badge>
    </div>
  );
}
