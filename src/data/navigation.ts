import type { NavigationItem } from "@/types/navigation";

export const navigationItems = [
  { label: "Yurtdışı Turlar", href: "/yurtdisi-turlari" },
  { label: "Yurtiçi Turlar", href: "/yurtici-turlari" },
  { label: "Tüm Turlar", href: "/turlar" },
  { label: "Blog", href: "/blog" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
] as const satisfies readonly NavigationItem[];
