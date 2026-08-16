"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type StatusCodeData = {
  statusCode: number;
  count: number;
};

type StatusCodesChartProps = {
  data: StatusCodeData[];
};

export function StatusCodesChart({ data }: StatusCodesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Codes</CardTitle>
        <CardDescription>Distribution of HTTP response status codes.</CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No status code data available.</div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="statusCode" />

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
