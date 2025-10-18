"use client";

import * as React from "react";
import axios from "axios";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  safe: {
    label: "Safe Chats",
    color: "var(--chart-1)",
  },
  malicious: {
    label: "Malicious Chats",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function DashboardLine() {
  type ChatStat = {
    date: string;
    safe: number;
    malicious: number;
  };

  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState<ChatStat[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/dashboard/lines");
        // Sort by date ascending
        const sorted = res.data.slice().sort((a: ChatStat, b: ChatStat) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setChartData(sorted);
      } catch (err) {
        console.error("Error fetching chat stats:", err);
      }
    };
    fetchData();
  }, []);

  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];

    const lastDate = new Date(chartData[chartData.length - 1].date);
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(lastDate);
    startDate.setDate(startDate.getDate() - daysToSubtract + 1);

    // Create a map for fast lookup
    const dataMap = new Map(
      chartData.map((item) => [new Date(item.date).toDateString(), item])
    );

    // Fill missing days with zeros
    const filledData: ChatStat[] = [];
    for (let i = 0; i < daysToSubtract; i++) {
      const currDate = new Date(startDate);
      currDate.setDate(startDate.getDate() + i);
      const key = currDate.toDateString();
      if (dataMap.has(key)) filledData.push(dataMap.get(key)!);
      else
        filledData.push({
          date: currDate.toISOString(),
          safe: 0,
          malicious: 0,
        });
    }

    return filledData;
  }, [chartData, timeRange]);

  return (
    <Card className="pt-0 w-full bg-transparent mb-8">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Chat Classification Over Time</CardTitle>
          <CardDescription>
            Safe vs Malicious chats in the selected timeframe
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSafe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMalicious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="safe"
              type="natural"
              fill="url(#fillSafe)"
              fillOpacity={0.6}
              stroke="var(--chart-1)"
              stackId="a"
            />
            <Area
              dataKey="malicious"
              type="natural"
              fill="url(#fillMalicious)"
              fillOpacity={0.6}
              stroke="var(--chart-2)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
