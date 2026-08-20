import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/data/site-config";

const quickLinks = [
  { label: "Yurtdışı Turlar", href: "/yurtdisi-turlari" },
  { label: "Yurtiçi Turlar", href: "/yurtici-turlari" },
  { label: "Tüm Turlar", href: "/turlar" },
  { label: "Blog", href: "/blog" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
] as const;

const legalLinks = [
  { label: "KVKK Aydınlatma Metni", href: "/kvkk-aydinlatma-metni" },
  { label: "Çerez Politikası", href: "/cerez-politikasi" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:py-16">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-6 text-muted">
            Unutulmaz rotaları güvenli, özenli ve keyifli seyahat deneyimlerine
            dönüştürüyoruz.
          </p>
        </div>

        <FooterGroup title="Hızlı Linkler">
          {quickLinks.map((link) => (
            <FooterLink key={link.href} {...link} />
          ))}
        </FooterGroup>

        <FooterGroup title="İletişim">
          <li className="text-sm leading-6 text-muted">Akabe Mah., Yeniceler Cad., MyOffice Plaza A3/302, Karatay / Konya</li>
          <li>
            <a className="text-sm text-muted transition-colors hover:text-brand" href={`tel:${siteConfig.phone}`}>
              {siteConfig.phoneDisplay}
            </a>
          </li>
          <li>
            <a className="text-sm text-muted transition-colors hover:text-brand" href="mailto:info@mivatur.com">
              info@mivatur.com
            </a>
          </li>
        </FooterGroup>

        <FooterGroup title="Kurumsal">
          <FooterLink label="Özel Tur Talebi" href="/ozel-tur-talebi" />
          <FooterLink label="Sıkça Sorulan Sorular" href="/sikca-sorulan-sorular" />
        </FooterGroup>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Mivatur. Tüm hakları saklıdır.</p>
          <nav aria-label="Yasal bağlantılar">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link className="transition-colors hover:text-brand" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </footer>
  );
}

function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold text-text">{title}</h2>
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <Link className="text-sm text-muted transition-colors hover:text-brand" href={href}>
        {label}
      </Link>
    </li>
  );
}
