import * as React from "react"
import { cn } from "@/lib/utils"

const Scroll-area = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Scroll-area.displayName = "Scroll-area"

export { Scroll-area }