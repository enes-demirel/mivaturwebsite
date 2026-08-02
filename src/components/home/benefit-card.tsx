import type { Benefit, BenefitIcon } from "@/types/benefit";

export function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <article className="h-full rounded-lg border border-border bg-surface p-5 shadow-[0_8px_24px_rgb(37_35_41_/_0.045)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-brand/15 hover:shadow-[0_12px_28px_rgb(37_35_41_/_0.065)] sm:p-6">
      <span className="flex size-11 items-center justify-center rounded-md border border-brand/12 bg-brand/5 text-brand">
        <BenefitIconGraphic icon={benefit.icon} />
      </span>
      <h3 className="mt-5 text-lg leading-6 font-bold text-text">
        {benefit.title}
      </h3>
      <p className="mt-2.5 text-sm leading-6 text-muted">
        {benefit.description}
      </p>
    </article>
  );
}

function BenefitIconGraphic({ icon }: { icon: BenefitIcon }) {
  const commonProps = {
    width: 23,
    height: 23,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (icon === "route") {
    return (
      <svg {...commonProps}>
        <circle cx="5" cy="18" r="2" />
        <circle cx="19" cy="6" r="2" />
        <path d="M7 18h2.5a2.5 2.5 0 0 0 0-5H8a2.5 2.5 0 0 1 0-5h9" />
      </svg>
    );
  }

  if (icon === "guide") {
    return (
      <svg {...commonProps}>
        <path d="m4 6.5 5-2 6 2 5-2v13l-5 2-6-2-5 2Z" />
        <path d="M9 4.5v13M15 6.5v13" />
        <circle cx="12" cy="10" r="1.5" />
      </svg>
    );
  }

  if (icon === "support") {
    return (
      <svg {...commonProps}>
        <path d="M4.5 13v-2a7.5 7.5 0 0 1 15 0v2" />
        <path d="M4.5 12.5h2.2v5H5.5a2 2 0 0 1-2-2v-1a2 2 0 0 1 1-1.73M19.5 12.5h-2.2v5h1.2a2 2 0 0 0 2-2v-1a2 2 0 0 0-1-1.73M17.3 17.5c-.7 1.2-2 2-3.5 2H12" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M6 3.5h9l3 3V20.5H6Z" />
      <path d="M15 3.5v3h3M9 10h6M9 14h6M9 18h3" />
    </svg>
  );
}
