import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { generalFaqGroups, generalFaqs } from "@/data/general-faqs";

const title = "Sıkça Sorulan Sorular | Mivatur";
const description = "Mivatur rezervasyon, ödeme, vize, tur programı ve değişiklik süreçleri hakkında sıkça sorulan sorular.";
export const metadata: Metadata = { title:{absolute:title}, description, alternates:{canonical:"https://mivatur.com/sikca-sorulan-sorular"} };

export default function FrequentlyAskedQuestionsPage() {
  const jsonLd = { "@context":"https://schema.org", "@type":"FAQPage", mainEntity:generalFaqs.map((faq)=>({"@type":"Question",name:faq.question,acceptedAnswer:{"@type":"Answer",text:faq.answer}})) };
  return <main className="bg-background py-12 sm:py-16"><Container className="max-w-5xl"><header className="max-w-3xl"><p className="text-sm font-extrabold tracking-[0.14em] text-brand uppercase">Merak Ettikleriniz</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight text-text sm:text-5xl">Sıkça Sorulan Sorular</h1><p className="mt-5 text-lg leading-8 text-muted">Seyahatinizi planlarken ihtiyaç duyabileceğiniz temel bilgileri bir araya getirdik. Tur özelindeki koşullar için ilgili tur sayfasını inceleyebilirsiniz.</p></header><div className="mt-10 space-y-10">{generalFaqGroups.map((group)=><section key={group.title} aria-labelledby={`faq-${group.title}`}><h2 id={`faq-${group.title}`} className="text-2xl font-extrabold text-text">{group.title}</h2><div className="mt-4 divide-y divide-border border-y border-border">{group.items.map((faq)=><details key={faq.question} className="group"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold text-text focus-visible:rounded-sm"><span>{faq.question}</span><span aria-hidden="true" className="text-brand">+</span></summary><p className="max-w-3xl pb-5 pr-8 leading-7 text-muted">{faq.answer}</p></details>)}</div></section>)}</div><div className="mt-12 rounded-lg border border-border bg-surface p-6"><h2 className="text-xl font-extrabold text-text">Başka bir sorunuz mu var?</h2><p className="mt-2 text-muted">Tur programına özel ayrıntılar için Mivatur ekibiyle iletişime geçin.</p><Link href="/iletisim" className="mt-5 inline-flex min-h-11 items-center rounded-md bg-brand px-5 text-sm font-bold text-white">İletişime Geçin</Link></div><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}} /></Container></main>;
}
