import * as React from "react"
import { cn } from "@/lib/utils"

const Context-menu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Context-menu.displayName = "Context-menu"

export { Context-menu }