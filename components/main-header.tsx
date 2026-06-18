"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

type MainHeaderProps = {
  title?: string;
};

export function MainHeader({ title }: MainHeaderProps) {
  const { isMobile, state } = useSidebar();
  const showTrigger = isMobile || state === "collapsed";

  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 px-4">
      {showTrigger ? <SidebarTrigger className="-ml-1" /> : null}
      {title ? (
        <h1 className="text-foreground min-w-0 truncate text-sm font-medium">
          {title}
        </h1>
      ) : null}
    </header>
  );
}
