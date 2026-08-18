import Link from "next/link";

import { Container } from "@/components/ui/container";
import { navigationItems } from "@/data/navigation";
import { siteConfig } from "@/data/site-config";
import { Logo } from "@/components/layout/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-(--header-height) border-b border-border/80 bg-surface/95 backdrop-blur-md">
      <Container className="flex h-full items-center justify-between gap-4">
        <Logo priority className="shrink-0" />
        <div className="hidden min-w-0 items-center gap-3 xl:flex 2xl:gap-5">
        <nav aria-label="Ana navigasyon">
          <ul className="flex items-center gap-3 2xl:gap-5">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs font-semibold whitespace-nowrap text-text transition-colors duration-200 hover:text-brand 2xl:text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a href={`tel:${siteConfig.phone}`} aria-label={`Mivatur'u ara: ${siteConfig.phoneDisplay}`} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-border px-3 text-xs font-extrabold whitespace-nowrap text-text transition hover:border-brand hover:text-brand 2xl:text-sm"><PhoneIcon /><span className="hidden min-[1380px]:inline">{siteConfig.phoneDisplay}</span></a>
        </div>
        <MobileMenu items={navigationItems} />
      </Container>
    </header>
  );
}

function PhoneIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.2 3.5 10 8.4 7.8 10a15.5 15.5 0 0 0 6.2 6.2l1.6-2.2 4.9 2.8-.8 3a2 2 0 0 1-2.1 1.5C9.7 20.4 3.6 14.3 2.7 6.4a2 2 0 0 1 1.5-2.1l3-.8Z" /></svg>; }
