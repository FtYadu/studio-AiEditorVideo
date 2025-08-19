"use client"

import { Panel as ResizablePanel, PanelGroup as ResizablePanelGroup, PanelResizeHandle as ResizableHandle } from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroupWrapper = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePanelGroup>) => (
  <ResizablePanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanelWrapper = ResizablePanel

const ResizableHandleWrapper = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizableHandle> & {
  withHandle?: boolean
}) => (
  <ResizableHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-id]]:focus-visible:ring-offset-background",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <div className="h-2.5 w-1 rounded-full bg-muted-foreground" />
      </div>
    )}
  </ResizableHandle>
)

export { ResizablePanelGroupWrapper as ResizablePanelGroup, ResizablePanelWrapper as ResizablePanel, ResizableHandleWrapper as ResizableHandle }
