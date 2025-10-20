// components/home-content.tsx
"use client";

import GoogleSignIn from "@/components/google-signin";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function HomeContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error");

  useEffect(() => {
    if (errorMessage) toast.error(errorMessage.replaceAll("_", " "));
  }, [errorMessage]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Toaster position="top-right" reverseOrder={false} />
      <GoogleSignIn />
    </div>
  );
}
