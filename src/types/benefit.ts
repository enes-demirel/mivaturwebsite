export type BenefitIcon = "route" | "guide" | "support" | "transparent";

export type Benefit = {
  id: string;
  title: string;
  description: string;
  icon: BenefitIcon;
  order: number;
};
