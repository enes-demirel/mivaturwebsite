import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type CardProps = ComponentPropsWithoutRef<"div">;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-[0_14px_36px_rgb(37_35_41_/_0.08)]",
        className,
      )}
      {...props}
    />
  );
}
