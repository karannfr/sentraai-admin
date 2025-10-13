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
  DropdownMenuItem
} from "./ui/dropdown-menu"

import { ChevronUp } from "lucide-react"
import Image from "next/image"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"


export async function AppSidebar() {
  const session = await auth.api.getSession({
      headers: await headers()
  }) 
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="mb-4">
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <SidebarMenuButton>
                    <Image src={session?.user.image as string} alt="Image" width={24} height={24} className="rounded-full"/>
                    {session?.user.name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-full cursor-pointer"
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer"> 
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}