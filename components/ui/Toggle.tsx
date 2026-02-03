const React = require('react');
const React = require('react');
const {cn} = require('@/lib/utils');

const Toggle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Toggle.displayName = "Toggle"

module.exports.Toggle = Toggle;