import Link from "next/link";

import { Container } from "@/components/ui/container";
import { navigationItems } from "@/data/navigation";
import { siteConfig } from "@/data/site-config";
import { Logo } from "@/components/layout/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-(--header-height) border-b border-border/80 bg-surface/95 backdrop-blur-md">
      <Container className="flex h-full max-w-[1400px] items-center justify-between gap-5 xl:grid xl:grid-cols-[156px_minmax(0,1fr)_auto] xl:px-6">
        <Logo priority className="shrink-0" />
        <nav aria-label="Ana navigasyon" className="hidden min-w-0 justify-self-end xl:block">
          <ul className="flex items-center gap-3 min-[1400px]:gap-4 min-[1600px]:gap-5">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[13px] font-semibold whitespace-nowrap text-text transition-colors duration-200 hover:text-brand min-[1400px]:text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a href={`tel:${siteConfig.phone}`} aria-label={`Mivatur'u ara: ${siteConfig.phoneDisplay}`} className="hidden h-11 shrink-0 items-center gap-2.5 justify-self-end rounded-md bg-brand px-4 text-[13px] font-extrabold whitespace-nowrap text-white transition-colors hover:bg-[var(--color-brand-hover)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand xl:inline-flex min-[1400px]:text-sm"><PhoneIcon /><span>{siteConfig.phoneDisplay}</span></a>
        <MobileMenu items={navigationItems} />
      </Container>
    </header>
  );
}

function PhoneIcon() { return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-[18px] shrink-0 text-white"><path d="M7.2 3.5 10 8.4 7.8 10a15.5 15.5 0 0 0 6.2 6.2l1.6-2.2 4.9 2.8-.8 3a2 2 0 0 1-2.1 1.5C9.7 20.4 3.6 14.3 2.7 6.4a2 2 0 0 1 1.5-2.1l3-.8Z" fill="none" stroke="currentColor" /></svg>; }
