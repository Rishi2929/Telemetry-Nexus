"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { RequestTrafficPoint } from "@/lib/db/dashboard";

type RequestTrafficChartProps = {
  data: RequestTrafficPoint[];
};

export function RequestTrafficChart({ data }: RequestTrafficChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Traffic</CardTitle>
        <CardDescription>API requests and server errors over time.</CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No traffic data available.</div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />

                <YAxis />

                <Tooltip />

                <Area type="monotone" dataKey="requests" stroke="currentColor" fill="currentColor" fillOpacity={0.1} />

                <Area type="monotone" dataKey="errors" stroke="currentColor" fill="currentColor" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
