"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

function ScrollArea({
  children,
  className,
  scrollbars = "vertical",
  viewportClassName,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  scrollbars?: "vertical" | "horizontal" | "both" | "none";
  viewportClassName?: string;
}) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative overflow-hidden", className)}
      data-slot="scroll-area"
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className={cn(
          "size-full rounded-[inherit] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
          viewportClassName,
        )}
        data-slot="scroll-area-viewport"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {(scrollbars === "vertical" || scrollbars === "both") && <ScrollBar />}
      {(scrollbars === "horizontal" || scrollbars === "both") && (
        <ScrollBar orientation="horizontal" />
      )}
      {scrollbars === "both" && <ScrollAreaPrimitive.Corner />}
    </ScrollAreaPrimitive.Root>
  );
}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    className={cn(
      "flex touch-none transition-colors select-none",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-px",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-px",
      className,
    )}
    data-orientation={orientation}
    data-slot="scroll-area-scrollbar"
    orientation={orientation}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className="relative flex-1 rounded-full bg-border"
      data-slot="scroll-area-thumb"
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
