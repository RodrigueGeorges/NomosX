const React = require('react');
const {cn} = require('@/lib/utils');

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Separator.displayName = "Separator"

module.export { Separator as Separator };