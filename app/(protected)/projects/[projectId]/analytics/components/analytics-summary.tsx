import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  totalRequests: number;
  totalErrors: number;
  errorRate: number;
  averageLatency: number;
};

export function AnalyticsSummary({ totalRequests, totalErrors, errorRate, averageLatency }: Props) {
  const cards = [
    {
      title: "Total Requests",
      value: totalRequests.toLocaleString(),
    },
    {
      title: "Total Errors",
      value: totalErrors.toLocaleString(),
    },
    {
      title: "Error Rate",
      value: `${errorRate.toFixed(2)}%`,
    },
    {
      title: "Average Latency",
      value: `${averageLatency.toFixed(0)} ms`,
    },
  ];

  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
