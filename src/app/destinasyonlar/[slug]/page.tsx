import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDestinationBySlug, mapDestinations } from "@/data/map-destinations";

type DestinationPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return mapDestinations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) notFound();

  return {
    title: destination.name,
    description: `${destination.name} tur programları ve Mivatur seyahat seçenekleri.`,
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) notFound();

  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-16 sm:py-24">
      <p className="text-sm font-bold tracking-[0.14em] text-brand uppercase">
        Destinasyon
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-text sm:text-5xl">
        {destination.name}
      </h1>
      <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
        Bu destinasyona ait tur içerikleri hazırlanıyor.
      </p>
      <Button asChild className="mt-8">
        <Link href="/turlar">Tüm Turları Gör</Link>
      </Button>
    </Container>
  );
}
