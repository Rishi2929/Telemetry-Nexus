"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, BarChart3, Bell } from "lucide-react";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    projectId: string;
  }>;
};

export default function ProjectLayout({ children, params }: Props) {
  return (
    <div className="min-w-0 max-w-full space-y-6 font-sans text-left">
      <ProjectNavigationTabs params={params} />
      <main className="min-w-0">{children}</main>
    </div>
  );
}

/* Sub-Components */

import { use } from "react";

function ProjectNavigationTabs({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: `/projects/${projectId}`,
      exact: true,
      icon: LayoutDashboard,
    },
    {
      label: "Logs",
      href: `/projects/${projectId}/logs`,
      exact: false,
      icon: FileText,
    },
    {
      label: "Analytics",
      href: `/projects/${projectId}/analytics`,
      exact: false,
      icon: BarChart3,
    },
    {
      label: "Alerts",
      href: `/projects/${projectId}/alerts`,
      exact: false,
      icon: Bell,
    },
  ];

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">PROJECT NAVIGATION</span>
          <Badge
            variant="outline"
            className="font-mono text-[9px] px-1.5 py-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 h-4"
          >
            ACTIVE SESSION
          </Badge>
        </div>
      </div>

      <nav className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-8 gap-1.5 px-3 font-mono text-xs transition-all border",
                isActive
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold shadow-sm hover:bg-emerald-500/20 hover:text-emerald-300"
                  : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground hover:border-border/50",
              )}
            >
              <Icon className={cn("h-3.5 w-3.5 transition-colors", isActive ? "text-emerald-400" : "text-zinc-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
