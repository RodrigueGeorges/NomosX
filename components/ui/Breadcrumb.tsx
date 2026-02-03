const React = require('react');
const React = require('react');
const {cn} = require('@/lib/utils');

const Breadcrumb = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Breadcrumb.displayName = "Breadcrumb"

module.exports.Breadcrumb = Breadcrumb;