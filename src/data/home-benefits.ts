import type { Benefit } from "@/types/benefit";

export const whyMivaturContent = {
  eyebrow: "Neden Mivatur?",
  title: "Yolculuğunuzun her adımını özenle planlıyoruz",
  description:
    "Rota seçiminden seyahat sonuna kadar güvenli, düzenli ve keyifli bir tur deneyimi sunmayı hedefliyoruz.",
} as const;

export const homeBenefits = [
  {
    id: "carefully-planned-routes",
    title: "Özenle Hazırlanan Rotalar",
    description:
      "Her program, gezilecek noktalar ve seyahat temposu dikkate alınarak planlanır.",
    icon: "route",
    order: 1,
  },
  {
    id: "experienced-guidance",
    title: "Deneyimli Rehberlik",
    description:
      "Yolculuk boyunca bölgeyi tanıyan profesyonel rehberlerle keşfedin.",
    icon: "guide",
    order: 2,
  },
  {
    id: "reachable-support",
    title: "Ulaşılabilir Destek",
    description:
      "Tur öncesinde ve seyahat sırasında ihtiyaç duyduğunuzda ekibimize ulaşın.",
    icon: "support",
    order: 3,
  },
  {
    id: "transparent-program",
    title: "Şeffaf Tur Programı",
    description:
      "Fiyata dahil hizmetleri, program detaylarını ve önemli bilgileri açıkça inceleyin.",
    icon: "transparent",
    order: 4,
  },
] as const satisfies readonly Benefit[];
