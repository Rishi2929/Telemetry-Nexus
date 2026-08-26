import ArchitecturePipeline from "@/app/components/ArchitecturePipeline";
import BenchmarkTable from "@/app/components/BenchmarkTable";
import CTASection from "@/app/components/CTASection";
import TerminalHero from "@/app/components/TerminalHero";

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <TerminalHero />
        <ArchitecturePipeline />
        <BenchmarkTable />
        <CTASection />
      </main>
    </>
  );
}
