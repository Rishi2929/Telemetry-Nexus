import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LatencySummaryProps = {
  latency: {
    average: number;
    p50: number;
    p95: number;
    p99: number;
  };
};

export function LatencySummary({ latency }: LatencySummaryProps) {
  const values = [
    {
      label: "Average",
      value: latency.average,
    },
    {
      label: "P50",
      value: latency.p50,
    },
    {
      label: "P95",
      value: latency.p95,
    },
    {
      label: "P99",
      value: latency.p99,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latency Analysis</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {values.map((item) => (
            <div key={item.label}>
              <p className="text-sm text-muted-foreground">{item.label}</p>

              <p className="mt-1 text-2xl font-semibold">{Math.round(item.value)} ms</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
