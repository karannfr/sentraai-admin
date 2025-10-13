"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import { CgGoogle } from "react-icons/cg"

import toast from "react-hot-toast";

import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient();

const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",      // for existing users
      errorCallbackURL: "/",     // on error
      newUserCallbackURL: "/dashboard", // on first-time user
    });
};

const GoogleSignIn = () => {
  return (
    <Card className="w-full max-w-md p-6 shadow-lg border border-border/40">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-semibold">Welcome, Admin</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in with your registered Google account to access the Admin Dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center mt-4">
          <Button
            className="flex items-center gap-2 w-full justify-center bg-white text-black hover:bg-gray-100 border border-gray-300 shadow-sm transition cursor-pointer"
            onClick={(e) => {e.preventDefault(); signIn();}}
          >
            <CgGoogle className="w-5 h-5" />
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground mt-2">
          Only authorized admin accounts are allowed to access this portal.
        </CardFooter>
    </Card>
  )
}

export default GoogleSignIn