"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenIcon, FileTextIcon, PlusIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useDocumentHistory } from "@/hooks/use-document-history";
import { cn } from "@/lib/utils";
import { formatMonthDay } from "@/lib/utils/date";

export function AppSidebar() {
  const pathname = usePathname();
  const documentHistory = useDocumentHistory();

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
        <SidebarGroup>
          <SidebarGroupLabel>文档历史</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {documentHistory.isPending && (
                <>
                  <DocumentHistorySkeleton className="w-4/5" />
                  <DocumentHistorySkeleton className="w-3/5" />
                  <DocumentHistorySkeleton className="w-2/3" />
                </>
              )}

              {documentHistory.isError && (
                <SidebarMenuItem>
                  <div className="text-muted-foreground px-2 py-1.5 text-xs group-data-[collapsible=icon]:hidden">
                    历史加载失败
                  </div>
                </SidebarMenuItem>
              )}

              {documentHistory.data?.map((document) => {
                const href = `/documents/${document.id}`;

                return (
                  <SidebarMenuItem key={document.id}>
                    <SidebarMenuButton
                      isActive={pathname === href}
                      className="h-auto min-h-12 items-start py-1.5 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:min-h-8"
                      tooltip={document.title}
                      render={<Link href={href} />}
                    >
                      <FileTextIcon
                        className="mt-0.5"
                        data-icon="inline-start"
                      />
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                        <span className="block w-full truncate leading-5">
                          {document.title}
                        </span>
                        <span className="text-muted-foreground text-[11px] leading-4">
                          {formatMonthDay(document.updatedAt)}
                        </span>
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {documentHistory.data?.length === 0 && (
                <SidebarMenuItem>
                  <div className="text-muted-foreground px-2 py-1.5 text-xs group-data-[collapsible=icon]:hidden">
                    暂无历史文档
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function DocumentHistorySkeleton({ className }: { className?: string }) {
  return (
    <SidebarMenuItem>
      <div className="flex h-8 items-center gap-2 rounded-md px-2 group-data-[collapsible=icon]:justify-center">
        <div className="bg-muted size-4 shrink-0 animate-pulse rounded" />
        <div
          className={cn(
            "bg-muted h-4 animate-pulse rounded group-data-[collapsible=icon]:hidden",
            className,
          )}
        />
      </div>
    </SidebarMenuItem>
  );
}
