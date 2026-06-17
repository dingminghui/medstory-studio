"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenIcon, PlusIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarRail,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
        <div className="flex min-w-0 items-start gap-2 group-data-[collapsible=icon]:justify-center">
          <Image
            src="/android-chrome-192x192.png"
            alt="MedStory Studio"
            width={192}
            height={192}
            className="hidden size-7 object-contain group-data-[collapsible=icon]:block"
            priority
          />
          <Image
            src="/assets/logo.png"
            alt="MedStory Studio"
            width={2352}
            height={810}
            className="h-12 w-auto min-w-0 object-contain object-left group-data-[collapsible=icon]:hidden"
            priority
          />
          <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/"}
                  className="data-active:text-primary data-active:hover:text-primary data-active:bg-transparent data-active:hover:bg-transparent"
                  tooltip="新增"
                  render={<Link href="/" />}
                >
                  <PlusIcon data-icon="inline-start" />
                  <span>新增</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="text-muted-foreground"
                  tooltip="知识库"
                  onClick={() => {}}
                >
                  <BookOpenIcon data-icon="inline-start" />
                  <span>知识库</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
