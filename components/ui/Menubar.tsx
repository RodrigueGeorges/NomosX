const React = require('react');
const {cn} = require('@/lib/utils');

const Menubar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Menubar.displayName = "Menubar"

module.export { Menubar as Menubar };