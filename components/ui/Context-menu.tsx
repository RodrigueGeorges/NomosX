const React = require('react');
const React = require('react');
const {cn} = require('@/lib/utils');

const ContextMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
ContextMenu.displayName = "ContextMenu"

module.exports.ContextMenu = ContextMenu;