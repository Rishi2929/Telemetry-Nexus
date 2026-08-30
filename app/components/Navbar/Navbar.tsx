"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal, LogIn, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Features", href: "/features" },
  { label: "Architectue", href: "/architecture" },
  { label: "Docs", href: "/docs" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-md font-sans">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition-colors group-hover:border-emerald-500/50 group-hover:bg-emerald-500/20">
            <Terminal className="h-4 w-4" />
          </div>
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            Telemetry<span className="text-emerald-400">Nexus</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center rounded-full border border-border/60 bg-muted/20 px-3 py-1 font-mono text-xs md:flex">
          {navigation.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                  isActive
                    ? "border border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-400"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden items-center gap-3 font-mono text-xs md:flex">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-border/80 bg-zinc-900/60 hover:bg-zinc-800 hover:text-foreground text-zinc-300"
            >
              <LogIn className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
              Sign In
            </Button>
          </Link>

          <Link href="/signup">
            <Button
              size="sm"
              className="h-8 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-sm shadow-emerald-500/20 transition-all"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 fill-black" />
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-card/95 backdrop-blur-md px-6 py-5 md:hidden font-mono text-xs">
          <nav className="flex flex-col gap-2">
            {navigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-zinc-300 transition-colors hover:bg-muted/30 hover:text-emerald-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 pt-4 border-t border-border/40 flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="sm" className="w-full justify-center border-border/80 bg-zinc-900/60 text-zinc-300">
                <LogIn className="mr-2 h-3.5 w-3.5" />
                Sign In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full justify-center bg-emerald-500 hover:bg-emerald-400 text-black font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
