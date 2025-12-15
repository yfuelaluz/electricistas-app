import * as React from "react";
import { cn } from "../../lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants: Record<string, string> = {
      primary: 'px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg focus:ring-brand-300',
      ghost: 'px-3 py-1.5 md:px-4 md:py-2 text-sm bg-white text-brand-700 border border-transparent hover:bg-brand-50 shadow-sm'
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";