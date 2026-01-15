import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        "rounded-2xl border bg-card text-card-foreground shadow-glass transition-all duration-300",
        className
      )} 
      {...props} 
    />
  )
);
Card.displayName = "Card";

const CardGlass = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        "glass rounded-3xl text-foreground transition-all duration-300",
        className
      )} 
      {...props} 
    />
  )
);
CardGlass.displayName = "CardGlass";

// Enhanced CardGlassDark with gold accent support
interface CardGlassDarkProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Add hover lift animation */
  hover?: boolean;
}

const CardGlassDark = React.forwardRef<HTMLDivElement, CardGlassDarkProps>(
  ({ className, hover = false, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        "glass-dark rounded-3xl text-white/80 transition-all duration-300",
        hover && "hover:-translate-y-1 hover:shadow-lg",
        className
      )} 
      {...props} 
    />
  )
);
CardGlassDark.displayName = "CardGlassDark";

// Gold header for dark cards
interface CardGlassDarkHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  iconClassName?: string;
}

const CardGlassDarkHeader = React.forwardRef<HTMLDivElement, CardGlassDarkHeaderProps>(
  ({ className, icon: Icon, title, iconClassName, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("flex items-center gap-3 mb-6", className)} 
      {...props}
    >
      {Icon && (
        <span className="text-accent">
          <Icon className={cn("w-6 h-6", iconClassName)} />
        </span>
      )}
      <h2 className="text-2xl font-bold text-accent">{title}</h2>
    </div>
  )
);
CardGlassDarkHeader.displayName = "CardGlassDarkHeader";

// Gold title for dark cards (standalone)
interface CardGlassDarkTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  icon?: LucideIcon;
  iconClassName?: string;
}

const CardGlassDarkTitle = React.forwardRef<HTMLHeadingElement, CardGlassDarkTitleProps>(
  ({ className, icon: Icon, iconClassName, children, ...props }, ref) => (
    <h3 
      ref={ref} 
      className={cn("text-xl font-bold text-accent flex items-center gap-2", className)} 
      {...props}
    >
      {Icon && <Icon className={cn("w-5 h-5", iconClassName)} />}
      {children}
    </h3>
  )
);
CardGlassDarkTitle.displayName = "CardGlassDarkTitle";

// Subtitle for dark cards
const CardGlassDarkSubtitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4 
      ref={ref} 
      className={cn("text-lg font-semibold text-accent/90", className)} 
      {...props} 
    />
  )
);
CardGlassDarkSubtitle.displayName = "CardGlassDarkSubtitle";

// Content wrapper for dark cards
const CardGlassDarkContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("text-white/70 space-y-4", className)} 
      {...props} 
    />
  )
);
CardGlassDarkContent.displayName = "CardGlassDarkContent";

// List item for dark cards with gold bullet
const CardGlassDarkListItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, children, ...props }, ref) => (
    <li 
      ref={ref} 
      className={cn("flex items-start gap-3", className)} 
      {...props}
    >
      <span className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
      <span>{children}</span>
    </li>
  )
);
CardGlassDarkListItem.displayName = "CardGlassDarkListItem";

// Standard card components
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-bold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { 
  Card, 
  CardGlass, 
  CardGlassDark,
  CardGlassDarkHeader,
  CardGlassDarkTitle,
  CardGlassDarkSubtitle,
  CardGlassDarkContent,
  CardGlassDarkListItem,
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
};
