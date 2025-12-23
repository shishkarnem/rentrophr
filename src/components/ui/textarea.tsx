import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border bg-card px-4 py-3 text-base font-medium transition-all duration-200 resize-none",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:bg-[hsl(223_17%_90%)] disabled:text-[hsl(218_11%_65%)]",
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
Textarea.displayName = "Textarea";

export { Textarea };
