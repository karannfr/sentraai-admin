"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

type SanitizationStats = {
  truncated_in: number;
  removed_zero_width: number;
  unicode_nfkc: number;
  homoglyph_folds: number;
  decoded: number;
  clamped_runs: number;
  truncated_out: number;
};

const chartConfig: ChartConfig = {
  count: { label: "Count", color: "var(--chart-1)" },
};

const baseChartData = [
  { metric: "truncated_in", count: 0, fill: "var(--chart-1)" },
  { metric: "removed_zero_width", count: 0, fill: "var(--chart-2)" },
  { metric: "unicode_nfkc", count: 0, fill: "var(--chart-3)" },
  { metric: "homoglyph_folds", count: 0, fill: "var(--chart-4)" },
  { metric: "decoded", count: 0, fill: "var(--chart-5)" },
  { metric: "clamped_runs", count: 0, fill: "var(--chart-6)" },
  { metric: "truncated_out", count: 0, fill: "var(--chart-7)" },
];

export function ObfuscationBarChart() {
  const [chartData, setChartData] = React.useState(baseChartData);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/obsfucated/chart");
        const stats: SanitizationStats = res.data;

        // Map API data into chartData
        const newChartData = chartData.map((d) => ({
          ...d,
          count: stats[d.metric as keyof SanitizationStats] ?? 0,
        }));

        // Slight delay to let animation feel smooth
        setTimeout(() => setChartData(newChartData), 100);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch sanitization stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Card className="flex-1 bg-transparent">
      <Toaster position="top-right" reverseOrder={false} />
      <CardHeader className="items-center">
        <CardTitle>Sanitization Log Stats</CardTitle>
        <CardDescription>
          Counts of different sanitization events in obfuscated messages
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0 w-full">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px] w-full">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="metric"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.replaceAll("_", " ")}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="count"
                radius={8}
                activeIndex={2}
                activeBar={({ ...props }) => (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                )}
                isAnimationActive={true}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
