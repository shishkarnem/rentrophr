import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border bg-card px-4 py-3 text-base font-medium transition-all duration-200",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:bg-[hsl(223_17%_90%)] disabled:text-[hsl(218_11%_65%)]",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          error 
            ? "border-[hsl(0_100%_65%)] focus:ring-[hsl(0_100%_65%)/0.2] focus:border-[hsl(0_100%_65%)]" 
            : "border-border focus:ring-accent/20 focus:border-accent",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
