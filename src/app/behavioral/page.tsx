"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { BehaviourTable } from "@/components/behavioral-table";
import { authClient } from "@/lib/auth-client";

export default function Behavioral() {
  const router = useRouter();

  const {
    data: session,
    isPending, // loading state
    error,
    refetch,
  } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Access Denied : Please login first");
      router.replace("/");
    }
  }, [session, isPending, router]);

  if (isPending || !session) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start w-full px-24 py-8">
      <Toaster position="top-right" reverseOrder={false} />
      <BehaviourTable />
    </div>
  );
}
