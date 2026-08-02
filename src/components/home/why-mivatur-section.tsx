import { BenefitCard } from "@/components/home/benefit-card";
import { Section } from "@/components/ui/section";
import { homeBenefits, whyMivaturContent } from "@/data/home-benefits";

export function WhyMivaturSection() {
  const benefits = [...homeBenefits].sort(
    (benefitA, benefitB) => benefitA.order - benefitB.order,
  );

  return (
    <Section
      aria-labelledby="why-mivatur-title"
      className="bg-background py-14 sm:py-16 lg:py-20"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-extrabold tracking-[0.18em] text-brand uppercase sm:text-sm">
          {whyMivaturContent.eyebrow}
        </p>
        <h2
          id="why-mivatur-title"
          className="mt-3 text-3xl leading-tight font-extrabold tracking-[-0.025em] text-text sm:text-4xl lg:text-[2.75rem]"
        >
          {whyMivaturContent.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          {whyMivaturContent.description}
        </p>
      </div>
      <div className="mt-8 grid items-stretch gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 xl:gap-6">
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} />
        ))}
      </div>
    </Section>
  );
}
