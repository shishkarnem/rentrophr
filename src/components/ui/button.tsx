import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground shadow-glass hover:opacity-90 active:scale-[0.98]",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border-2 border-accent/30 bg-transparent text-accent hover:bg-accent/10 hover:border-accent [&_svg]:text-accent",
      secondary: "bg-secondary text-accent shadow-sm hover:bg-secondary/80 [&_svg]:text-accent",
      ghost: "text-accent hover:bg-accent/10 hover:text-accent [&_svg]:text-accent",
      link: "text-accent underline-offset-4 hover:underline [&_svg]:text-accent",
      // CTA Button - Red to Orange gradient
      cta: "gradient-cta text-white font-bold shadow-cta hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
      // Gold variant
      gold: "gradient-gold text-gold-foreground font-bold shadow-gold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
      // Glass variant
      glass: "glass text-foreground hover:bg-white/80 active:scale-[0.98]",
      // Glass dark variant - gold text and icons
      glassDark: "glass-dark text-accent border-accent/20 hover:border-accent/40 active:scale-[0.98] [&_svg]:text-accent"
    },
    size: {
      default: "h-11 px-6 py-2",
      sm: "h-9 rounded-lg px-4 text-xs",
      lg: "h-14 rounded-2xl px-8 text-base",
      xl: "h-16 rounded-2xl px-10 text-lg",
      icon: "h-10 w-10"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant,
  size,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";
export { Button, buttonVariants };