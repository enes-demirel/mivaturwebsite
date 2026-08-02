import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  containerClassName?: string;
};

export function Section({
  children,
  className,
  containerClassName,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-16 sm:py-20 lg:py-24", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
