"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import DashboardCard from "@/components/dashboard-card";
import { DashboardChart } from "@/components/dashboard-chart";
import { DashboardLine } from "@/components/dashboard-line";
import { DashboardTable } from "@/components/dashboard-table";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function Dahsboard() {
  const router = useRouter();

  const {
    data: session,
    isPending, // loading state
  } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Access Denied : Please login first");
      router.replace("/");
    }
  }, [session, isPending, router]);

  if (isPending || !session) return null;
  return (
    <div className="min-h-screen flex flex-col items-center justify-start w-full pl-24 py-8">
      <Toaster position="top-right" reverseOrder={false} />
      <DashboardLine/>
      <DashboardTable/>
      <div className="w-full flex flex-row h-1/2">
        <div className="flex flex-row flex-wrap w-[640px] gap-8">
          <DashboardCard heading="Total Messages" type="totalMessages" />
          <DashboardCard heading="Flagged Chats" type="flaggedChats" />
        </div>
        <div className="flex-1 flex-col flex gap-8">
          <DashboardChart/>
        </div>
      </div>
    </div>
  );
}
