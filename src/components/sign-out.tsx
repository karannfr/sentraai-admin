"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation"; 
import React from "react";
import toast from "react-hot-toast";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed Out");
          router.push("/");
        },
      },
    });
  };

  return (
    <Button variant="destructive" onClick={handleSignOut} className="cursor-pointer">
      Sign Out
    </Button>
  );
};

export default SignOutButton;
