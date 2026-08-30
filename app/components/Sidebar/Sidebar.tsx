"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Terminal } from "lucide-react";

import { authClient } from "@/lib/auth/authClient";
import { SidebarContent } from "./components/SidebarContent";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <>
      {/* Mobile Bar */}
      <div className="flex h-16 w-full items-center justify-between border-b border-border/80 bg-card/95 backdrop-blur-md px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 font-mono">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10">
            <Terminal className="h-4 w-4 text-emerald-400" />
          </div>

          <span className="text-sm font-bold tracking-tight text-foreground">
            Telemetry<span className="text-emerald-400">Nexus</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/80 bg-muted/40 text-foreground"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          className="
            fixed inset-0 z-50
            flex h-screen w-full flex-col
            overflow-hidden
            bg-card/95 backdrop-blur-md
            lg:hidden
          "
        >
          {/* CHANGE:
              Added `overflow-hidden` to prevent the drawer itself from
              scrolling and allow SidebarContent to control scrolling. */}

          <SidebarContent onNavigate={() => setOpen(false)} isActive={isActive} onLogout={handleLogout} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/80 bg-card/95 backdrop-blur-md font-sans lg:flex">
        <SidebarContent isActive={isActive} onLogout={handleLogout} />
      </aside>
    </>
  );
}
