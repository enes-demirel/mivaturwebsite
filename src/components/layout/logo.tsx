import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className, priority = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "relative block h-11 w-[132px] shrink-0 overflow-hidden sm:w-[156px]",
        className,
      )}
      aria-label="Mivatur ana sayfa"
    >
      <Image
        src="/images/brand/mivatur-logo.svg"
        alt="Mivatur"
        width={842}
        height={595}
        priority={priority}
        className="absolute top-1/2 left-0 h-auto w-full -translate-y-1/2"
      />
    </Link>
  );
}
