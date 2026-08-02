import { Section } from "@/components/ui/section";
import { homeFaqContent, homeFaqs } from "@/data/home-faqs";

export function HomeFaqSection() {
  const faqs = homeFaqs
    .filter((faq) => faq.published)
    .sort((faqA, faqB) => faqA.order - faqB.order);

  return (
    <Section
      aria-labelledby="home-faq-title"
      className="border-t border-border/70 bg-surface py-14 sm:py-16 lg:py-20"
      containerClassName="max-w-[960px]"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">
          {homeFaqContent.eyebrow}
        </p>
        <h2
          id="home-faq-title"
          className="mt-3 text-3xl leading-tight font-bold tracking-tight text-text sm:text-4xl"
        >
          {homeFaqContent.title}
        </h2>
        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          {homeFaqContent.description}
        </p>
      </div>

      <div className="mt-8 divide-y divide-border border-y border-border sm:mt-10">
        {faqs.map((faq) => (
          <details key={faq.id} className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-bold text-text outline-none transition-colors hover:text-brand focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-brand/25 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 text-base leading-6 sm:text-lg">
                {faq.question}
              </span>
              <span
                aria-hidden="true"
                className="relative size-5 shrink-0 text-brand"
              >
                <span className="absolute top-1/2 left-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
                <span className="absolute top-1/2 left-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current transition-transform duration-200 group-open:rotate-90 group-open:scale-y-0 motion-reduce:transition-none" />
              </span>
            </summary>
            <div className="max-w-3xl pb-5 pr-9 text-sm leading-7 text-muted sm:text-base">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
