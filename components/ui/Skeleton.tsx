
import { cn } from "./cn";

type Props = { 
  className?: string;
  variant?: "pulse" | "shimmer";
};

export default function Skeleton({ className, variant = "shimmer" }: Props) {
  const variants = {
    pulse: "animate-pulse bg-white/5",
    shimmer: "animate-shimmer overflow-hidden"
  };
  
  return (
    <div 
      className={cn(
        "rounded-2xl", 
        variants[variant],
        className
      )} 
    />
  );
}
