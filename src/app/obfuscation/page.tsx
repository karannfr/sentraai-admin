"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { ObfuscationBarChart } from "@/components/obsfucation-chart";
import { ObsfucationTable } from "@/components/obsfucation-table";
import { ObfuscationRadar } from "@/components/obsfucation-radar";

export default function Obfuscation() {
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
    <div className="min-h-screen flex flex-col items-center justify-start w-full pl-12 py-8">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-row gap-8 w-full">
        <ObfuscationBarChart/>
        <ObfuscationRadar/>
      </div>
      <ObsfucationTable/>
    </div>
  );
}
