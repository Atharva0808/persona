import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-neutral-700 bg-neutral-800 text-neutral-300",
        success: "border-emerald-800 bg-emerald-950 text-emerald-400",
        warning: "border-amber-800 bg-amber-950 text-amber-400",
        destructive: "border-red-800 bg-red-950 text-red-400",
        info: "border-blue-800 bg-blue-950 text-blue-400",
        outline: "border-neutral-700 text-neutral-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
