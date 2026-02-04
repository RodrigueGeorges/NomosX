const React = require('react');
const {cn} = require('@/lib/utils');

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
Carousel.displayName = "Carousel"

module.exports.Carousel = Carousel;