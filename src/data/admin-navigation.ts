export type AdminNavigationItem = {
  label: string;
  href: string | null;
};

export const adminNavigationItems: readonly AdminNavigationItem[] = [
  { label: "Genel Bakış", href: "/admin" },
  { label: "Turlar", href: "/admin/turlar" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Talepler", href: "/admin/talepler" },
  { label: "Destinasyonlar", href: "/admin/destinasyonlar" },
  { label: "Ayarlar", href: null },
];
