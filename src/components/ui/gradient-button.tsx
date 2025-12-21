import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "accent" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  glow?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", size = "default", glow = true, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          // Variants
          variant === "primary" && "gradient-primary text-primary-foreground",
          variant === "accent" && "gradient-accent text-accent-foreground",
          variant === "outline" && "border-2 border-primary bg-transparent text-primary hover:bg-primary/10",
          variant === "ghost" && "bg-transparent text-foreground hover:bg-muted",
          // Sizes
          size === "default" && "h-11 px-6 py-2",
          size === "sm" && "h-9 px-4 text-sm",
          size === "lg" && "h-12 px-8 text-lg",
          size === "icon" && "h-10 w-10",
          // Glow effect
          glow && (variant === "primary" || variant === "accent") && "hover:glow-primary",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
GradientButton.displayName = "GradientButton";

export { GradientButton };
