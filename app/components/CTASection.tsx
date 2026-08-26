import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, BookOpen } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 px-4 border-t border-border/40 bg-muted/10 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Build High-Performance Applications Without Observability Lag
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Explore the interactive dashboard sandbox or read through the quickstart documentation to integrate the lightweight SDK into your
          Express application stack.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-4 font-mono text-xs">
          <Button size="lg" className="h-12 px-6 bg-emerald-500 text-black hover:bg-emerald-400 font-semibold">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Play className="h-4 w-4 fill-black" />
              <span>Explore Live Sandbox</span>
            </Link>
          </Button>

          <Button variant="outline" size="lg" className="h-12 px-6 border-border/80 hover:bg-muted font-medium">
            <Link href="/docs" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Read Documentation</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
