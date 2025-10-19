"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"

import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./ui/dropdown-menu"

import { ChevronUp } from "lucide-react"
import Image from "next/image"

import { authClient } from "@/lib/auth-client";
import Link from "next/link"

import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  Shield,
} from "lucide-react";

export function AppSidebar() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-2xl font-semibold tracking-tight px-3 mt-3">SentraAI</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {[
            { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
            { icon: Activity, label: "Behavioral Monitor", path: "/behavioral" },
            { icon: AlertTriangle, label: "Flagged Prompts", path: "/flagged" },
            { icon: Shield, label: "Obfuscation Attempts", path: "/obfuscation" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
              hover:bg-slate-200/60 dark:hover:bg-slate-800"
            >
              <item.icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <div className="text-slate-700 dark:text-slate-200">{item.label}</div>
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>
      {!isPending && session?.user && <SidebarFooter>
        <SidebarMenu className="mb-4">
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer h-fit">
                  <SidebarMenuButton>
                    <Image src={session?.user.image as string} alt="Image" width={32} height={32} className="rounded-full"/>
                    {session?.user.name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-full cursor-pointer"
                >
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>}
    </Sidebar>
  )
}