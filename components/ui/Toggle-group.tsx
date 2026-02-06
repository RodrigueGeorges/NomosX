const React = require('react');
const {cn} = require('@/lib/utils');

const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
ToggleGroup.displayName = "ToggleGroup"

module.export { ToggleGroup as ToggleGroup };