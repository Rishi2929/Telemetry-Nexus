import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Terminal, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center text-foreground font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Background Grid & Glow Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-80 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative z-10 flex max-w-md flex-col items-center">
        {/* Illustration Container */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-xl" />
          <Image
            src="/illustrations/404.svg"
            alt="Page not found"
            width={280}
            height={180}
            priority
            className="relative drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* 404 Status Badge */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-xs font-semibold text-rose-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>ERR_ROUTE_NOT_FOUND (404)</span>
        </div>

        {/* Heading & Subtext */}
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Page Not Found</h1>

        <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed">
          The requested route does not exist or has been moved to another path in the pipeline.
        </p>

        {/* Action Controls using buttonVariants */}
        <div className="mt-8 flex items-center gap-3 font-mono text-xs">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 gap-2 border border-emerald-500/40 bg-emerald-500/10 font-semibold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]",
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/docs"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-9 gap-1.5 border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground",
            )}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Docs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
