import * as React from "react"
import { cn } from "@/lib/utils"

const Navigation-menu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Navigation-menu.displayName = "Navigation-menu"

export { Navigation-menu }