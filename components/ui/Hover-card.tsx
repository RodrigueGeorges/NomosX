const React = require('react');
const React = require('react');
const {cn} = require('@/lib/utils');

const HoverCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
HoverCard.displayName = "HoverCard"

module.exports.HoverCard = HoverCard;