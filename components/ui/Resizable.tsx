const React = require('react');
const {cn} = require('@/lib/utils');

const Resizable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Resizable.displayName = "Resizable"

module.export { Resizable as Resizable };