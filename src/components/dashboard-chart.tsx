"use client";

import * as React from "react";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const chartConfig: ChartConfig = {
  obfuscation: { label: "Obfuscation", color: "var(--blue-500)" },
  injection: { label: "Injection", color: "var(--orange-500)" },
  flagged: { label: "Flagged Chats", color: "var(--red-500)" },
};

export function DashboardChart() {
  const [chartData, setChartData] = React.useState<
    { type: string; count: number; fill: string }[]
  >([
    { type: "Obfuscation", count: 0, fill: "var(--color-chart-1)" },
    { type: "Injection", count: 0, fill: "var(--color-chart-2)" },
    { type: "Flagged Chats", count: 0, fill: "var(--color-chart-3)" },
  ]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/dashboard/pie");
        setChartData([
          { type: "Obfuscation", count: res.data.obfuscation, fill: "var(--color-chart-1)" },
          { type: "Injection", count: res.data.injection, fill: "var(--color-chart-2)" },
          { type: "Flagged Chats", count: res.data.flagged, fill: "var(--color-chart-3)" },
        ]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch overview counts");
      }
    };
    fetchData();
  }, []);

  return (
    <Card className="flex flex-col h-72 bg-transparent">
      <Toaster position="top-right" reverseOrder={false} />
      <CardHeader className="items-center pb-0">
        <CardTitle>Overview</CardTitle>
        <CardDescription>Message and chat stats</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 -mt-28">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[320px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="type" outerRadius={100}>
              {chartData.map((entry) => (
                <Cell key={entry.type} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
