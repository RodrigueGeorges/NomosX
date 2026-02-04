const React = require('react');
/**
 * Label Component - Suivi de la charte graphique OpenClaw
 */

const LabelPrimitive = require('@radix-ui/react-label');
const {cva,typeVariantProps} = require('class-variance-authority');

const {cn} = require('@/lib/utils');

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-neutral-900",
        secondary: "text-neutral-600",
        accent: "text-primary",
        error: "text-red-600",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, variant, size, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant, size }), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

module.exports.Label = Label;
