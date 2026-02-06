const React = require('react');
const {cn} = require('@/lib/utils');

const Command = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Command.displayName = "Command"

module.export { Command as Command };