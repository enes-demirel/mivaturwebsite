import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement } from "react";

import { cn } from "@/lib/cn";

const buttonVariants = {
  primary:
    "border-brand bg-brand text-white hover:border-brand-hover hover:bg-brand-hover",
  secondary:
    "border-border bg-transparent text-text hover:border-brand hover:text-brand",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
  asChild?: boolean;
  children: ReactNode;
};

export function Button({
  asChild = false,
  className,
  variant = "primary",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const styles = cn(
    "inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2.5 text-sm font-bold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
    buttonVariants[variant],
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;

    return cloneElement(child, {
      className: cn(styles, child.props.className),
    });
  }

  return (
    <button className={styles} type={type} {...props}>
      {children}
    </button>
  );
}
