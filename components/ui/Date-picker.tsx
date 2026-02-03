import * as React from "react"
import { cn } from "@/lib/utils"

const Date-picker = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Date-picker.displayName = "Date-picker"

export { Date-picker }