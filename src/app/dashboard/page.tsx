"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import useSessionStore from "@/store/useSessionStore";

export default function ProtectedPage() {
  const router = useRouter();
  const session = useSessionStore((state) => state.session);
  const getSession = useSessionStore((state) => state.getSession);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      await getSession();
      setLoading(false);
    }

    checkSession();
  }, [getSession]);

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/");
    }
  }, [loading, session, router]);

  if (loading || !session) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Toaster position="top-right" reverseOrder={false} />
      <h1>Welcome, {session.user?.email}</h1>
      {/* Your protected content */}
    </div>
  );
}
