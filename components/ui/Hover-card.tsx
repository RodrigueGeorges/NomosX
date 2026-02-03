import * as React from "react"
import { cn } from "@/lib/utils"

const Hover-card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Hover-card.displayName = "Hover-card"

export { Hover-card }