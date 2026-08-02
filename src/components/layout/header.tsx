import Link from "next/link";

import { Container } from "@/components/ui/container";
import { navigationItems } from "@/data/navigation";
import { Logo } from "@/components/layout/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-(--header-height) border-b border-border/80 bg-surface/95 backdrop-blur-md">
      <Container className="flex h-full items-center justify-between gap-8">
        <Logo priority className="shrink-0" />
        <nav aria-label="Ana navigasyon" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-8">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-semibold text-text transition-colors duration-200 hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MobileMenu items={navigationItems} />
      </Container>
    </header>
  );
}
