export type AdminNavigationItem = {
  label: string;
  href: string | null;
};

export const adminNavigationItems: readonly AdminNavigationItem[] = [
  { label: "Genel Bakış", href: "/admin" },
  { label: "Turlar", href: "/admin/turlar" },
  { label: "Blog", href: null },
  { label: "Talepler", href: "/admin/talepler" },
  { label: "Destinasyonlar", href: null },
  { label: "Ayarlar", href: null },
];
