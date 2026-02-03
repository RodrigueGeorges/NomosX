import * as React from "react"
import { cn } from "@/lib/utils"

const Radio-group = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Radio-group.displayName = "Radio-group"

export { Radio-group }