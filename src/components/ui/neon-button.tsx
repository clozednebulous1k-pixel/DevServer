"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const neonButtonVariants = cva(
  "relative mx-auto rounded-full border text-center text-foreground group",
  {
    variants: {
      variant: {
        default: "border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/0",
        solid: "border-transparent bg-blue-500 text-white transition-all duration-200 hover:border-foreground/50 hover:bg-blue-600",
        ghost: "border-transparent bg-transparent hover:border-zinc-600 hover:bg-white/10",
      },
      size: {
        default: "px-7 py-1.5",
        sm: "px-4 py-0.5",
        lg: "px-10 py-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neonButtonVariants> {
  neon?: boolean;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, neon = true, size, variant, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(neonButtonVariants({ variant, size }), className)} {...props}>
        <span
          className={cn(
            "absolute inset-x-0 inset-y-0 mx-auto hidden h-px w-3/4 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100 dark:via-blue-500",
            neon && "block",
          )}
        />
        {children}
        <span
          className={cn(
            "absolute inset-x-0 -bottom-px mx-auto hidden h-px w-3/4 bg-gradient-to-r from-transparent via-blue-600 to-transparent transition-all duration-500 ease-in-out group-hover:opacity-30 dark:via-blue-500",
            neon && "block",
          )}
        />
      </button>
    );
  },
);
NeonButton.displayName = "NeonButton";

export { NeonButton, neonButtonVariants };
