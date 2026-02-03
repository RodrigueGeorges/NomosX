const React = require('react');
const React = require('react');
const {cn} = require('@/lib/utils');

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
RadioGroup.displayName = "RadioGroup"

module.exports.RadioGroup = RadioGroup;