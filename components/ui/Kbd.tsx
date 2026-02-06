const React = require('react');
const {cn} = require('@/lib/utils');

const Kbd = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Kbd.displayName = "Kbd"

module.export { Kbd as Kbd };