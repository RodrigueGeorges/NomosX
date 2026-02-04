const React = require('react');
const {cn} = require('@/lib/utils');

const Calendar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Calendar.displayName = "Calendar"

module.exports.Calendar = Calendar;