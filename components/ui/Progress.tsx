const React = require('react');
const {cn} = require('@/lib/utils');

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Progress.displayName = "Progress"

module.export { Progress as Progress };