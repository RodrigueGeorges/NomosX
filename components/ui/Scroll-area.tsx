const React = require('react');
const {cn} = require('@/lib/utils');

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
ScrollArea.displayName = "ScrollArea"

module.export { ScrollArea as ScrollArea };