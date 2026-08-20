import type { NavigationItem } from "@/types/navigation";

export const navigationItems = [
  { label: "Yurtdışı Turlar", href: "/yurtdisi-turlari" },
  { label: "Yurtiçi Turlar", href: "/yurtici-turlari" },
  { label: "Özel Tur Talebi", href: "/ozel-tur-talebi" },
  { label: "Blog", href: "/blog" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
  { label: "SSS", href: "/sikca-sorulan-sorular" },
] as const satisfies readonly NavigationItem[];
