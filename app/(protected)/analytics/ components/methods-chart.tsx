"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type MethodData = {
  method: string;
  count: number;
};

type MethodsChartProps = {
  data: MethodData[];
};

export function MethodsChart({ data }: MethodsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Methods</CardTitle>
        <CardDescription>Distribution of requests by HTTP method.</CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No request data available.</div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="method" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar dataKey="count" name="Requests" fill="currentColor" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
