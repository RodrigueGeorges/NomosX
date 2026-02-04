const React = require('react');
const {cn} = require('@/lib/utils');

const Accordion = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
Accordion.displayName = "Accordion"

module.exports.Accordion = Accordion;