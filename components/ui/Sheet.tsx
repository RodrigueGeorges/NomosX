const React = require('react');
const {cn} = require('@/lib/utils');

const Sheet = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Sheet.displayName = "Sheet"

module.export { Sheet as Sheet };