"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Activity, BarChart3, Settings } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Activity },
    { href: "/logs", label: "Logs", icon: Terminal },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2 ml-4">
          <div className="flex h-8 w-8 mr-3 items-center justify-center rounded border border-neon-green bg-primary/10">
            <Terminal className="h-5 w-5 text-primary" />
          </div>

          <Link href='/' className="mr-2">
            <span className="font-mono text-xl font-semibold text-foreground">
              Telemetry<span className="text-primary">Nexus</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Status */}
        {/* <div className="rounded-full border border-success/30 bg-success/10 px-3 py-1">
  <div className="flex items-center gap-2">
    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
    <span className="text-xs font-mono text-primary">LIVE</span>
  </div>

</div> */}

        <div>
          <Link
            href="/login"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >Login</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;