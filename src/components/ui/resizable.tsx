import * as React from "react"
import {
  Panel as PrimitivePanel,
  Group as PrimitivePanelGroup,
  Separator as PrimitiveSeparator,
} from "react-resizable-panels"
import { cn } from "@/lib/utils"

function ResizablePanelGroup({ className, ...props }: React.ComponentProps<typeof PrimitivePanelGroup>) {
  return <PrimitivePanelGroup className={cn("flex", className)} {...props} />
}

function ResizablePanel({ className, ...props }: React.ComponentProps<typeof PrimitivePanel> & { className?: string }) {
  return <PrimitivePanel className={cn("min-w-[120px]", className)} {...props} />
}

function ResizableHandle({ withHandle = false, className, ...props }: { withHandle?: boolean; className?: string } & React.ComponentProps<typeof PrimitiveSeparator>) {
  return (
    <PrimitiveSeparator
      className={cn(
        "group relative flex w-px items-center justify-center bg-border",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 h-4 w-4 rounded-full border bg-background group-hover:bg-muted" />
      )}
    </PrimitiveSeparator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
