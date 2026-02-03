import * as React from "react"
import { cn } from "@/lib/utils"

const Toggle-group = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Toggle-group.displayName = "Toggle-group"

export { Toggle-group }