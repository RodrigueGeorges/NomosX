const React = require('react');
const React = require('react');
const {cn} = require('@/lib/utils');

const Pagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Pagination.displayName = "Pagination"

module.exports.Pagination = Pagination;