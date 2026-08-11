"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  data: {
    statusCode: number;
    count: number;
  }[];
};

export function StatusChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Codes</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="statusCode" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="count" name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
