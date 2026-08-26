"use client";

import { Activity, BellRing, BookOpen, FolderKanban, LayoutDashboard, Moon, Settings, Terminal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserProfile } from "./UserProfile";
import { LogoutDialog } from "./LogoutDialog";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Analytics", href: "/analytics", icon: Activity },
  { name: "Incidents", href: "/incidents", icon: BellRing },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function SidebarContent({
  onNavigate,
  isActive,
  onLogout,
}: {
  onNavigate?: () => void;
  isActive: (href: string) => boolean;
  onLogout: () => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border/60 px-5 bg-muted/30">
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5 font-mono">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 shadow-sm shadow-emerald-500/10">
            <Terminal className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-foreground">
            Telemetry<span className="text-emerald-400">Nexus</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={onNavigate}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/80 text-muted-foreground hover:text-foreground lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 p-4 font-mono">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                active
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border border-transparent"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-emerald-400" : "text-muted-foreground"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile & Actions */}
      <div className="space-y-3 border-t border-border/60 p-4 bg-muted/20">
        <UserProfile />

        <div className="pt-1">
          <LogoutDialog onLogout={onLogout} />
        </div>
      </div>
    </>
  );
}
