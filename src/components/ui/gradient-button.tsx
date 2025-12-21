import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "accent" | "teal" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  glow?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", size = "default", glow = true, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          // Variants with enhanced gradients
          variant === "primary" && [
            "gradient-primary text-white",
            glow && "shadow-[0_4px_20px_hsl(220_100%_60%/0.4)] hover:shadow-[0_8px_30px_hsl(220_100%_60%/0.6),0_0_50px_hsl(220_100%_60%/0.3)]",
          ],
          variant === "accent" && [
            "gradient-accent text-white",
            glow && "shadow-[0_4px_20px_hsl(270_100%_65%/0.4)] hover:shadow-[0_8px_30px_hsl(270_100%_65%/0.6),0_0_50px_hsl(270_100%_65%/0.3)]",
          ],
          variant === "teal" && [
            "gradient-teal text-white",
            glow && "shadow-[0_4px_20px_hsl(180_100%_50%/0.4)] hover:shadow-[0_8px_30px_hsl(180_100%_50%/0.6),0_0_50px_hsl(180_100%_50%/0.3)]",
          ],
          variant === "outline" && [
            "border-2 border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:border-primary",
            glow && "hover:shadow-[0_0_20px_hsl(220_100%_60%/0.3)]",
          ],
          variant === "ghost" && "bg-transparent text-foreground hover:bg-muted/50",
          // Sizes
          size === "default" && "h-12 px-7 py-3",
          size === "sm" && "h-10 px-5 text-sm",
          size === "lg" && "h-14 px-10 text-lg",
          size === "icon" && "h-11 w-11",
          // Hover transform
          (variant === "primary" || variant === "accent" || variant === "teal") && "hover:-translate-y-0.5",
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