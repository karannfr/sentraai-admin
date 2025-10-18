"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, AlertTriangle } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

type DashboardCardProps = {
  heading: string;
  type: "totalMessages" | "flaggedChats"; // type decides what to fetch
};

const DashboardCard = ({ heading, type }: DashboardCardProps) => {
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get("/api/dashboard/overview");
        if (type === "totalMessages") setCount(res.data.totalMessages);
        else if (type === "flaggedChats") setCount(res.data.flaggedChats);
      } catch (err) {
        console.error(err);
        toast.error(`Failed to fetch ${heading}`);
      }
    };
    fetchCount();
  }, [type, heading]);

  const Icon = type === "totalMessages" ? LayoutDashboard : AlertTriangle;

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Card className="w-72 h-72 flex flex-col items-center justify-center bg-transparent p-4">
        <Icon className="w-8 h-8 mb-2 text-primary-foreground" />
        <span className="text-lg font-medium">{heading}</span>
        <span className="text-3xl font-bold mt-2">{count}</span>
      </Card>
    </>
  );
};

export default DashboardCard;
