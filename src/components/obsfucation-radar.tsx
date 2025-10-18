"use client";

import * as React from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
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
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
};

// Base chart with zeros
const baseChartData = [
  { metric: "truncated_in", count: 0 },
  { metric: "removed_zero_width", count: 0 },
  { metric: "unicode_nfkc", count: 0 },
  { metric: "homoglyph_folds", count: 0 },
  { metric: "decoded", count: 0 },
  { metric: "clamped_runs", count: 0 },
  { metric: "truncated_out", count: 0 },
];

export function ObfuscationRadar() {
  const [chartData, setChartData] = React.useState(baseChartData);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/obsfucated/chart");
        const stats: SanitizationStats = res.data;

        const updatedChartData = chartData.map((d) => ({
          ...d,
          count: stats[d.metric as keyof SanitizationStats] ?? 0,
        }));

        // animate to real values
        setTimeout(() => setChartData(updatedChartData), 100);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch obfuscation stats");
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
            <RadarChart data={chartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <Radar
                dataKey="count"
                stroke="var(--color-count)"
                fill="var(--color-chart-1)"
                fillOpacity={0.6}
                isAnimationActive={true}
                animationDuration={800}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
