const React = require('react');
const React = require('react');
const {cn} = require('@/lib/utils');

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full", className)}
    {...props}
  />
))
Tabs.displayName = "Tabs"

module.exports.Tabs = Tabs;