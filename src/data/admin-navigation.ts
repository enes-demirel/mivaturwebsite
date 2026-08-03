export type AdminNavigationItem = {
  label: string;
  href: string | null;
};

export const adminNavigationItems: readonly AdminNavigationItem[] = [
  { label: "Genel Bakış", href: "/admin" },
  { label: "Turlar", href: "/admin/turlar" },
  { label: "Blog", href: null },
  { label: "Rezervasyon Talepleri", href: null },
  { label: "Destinasyonlar", href: null },
  { label: "Ayarlar", href: null },
];
