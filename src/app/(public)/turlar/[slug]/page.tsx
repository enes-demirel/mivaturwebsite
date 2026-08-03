import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TourDetailPage as TourDetailView } from "@/components/tours/detail/tour-detail-page";
import { getTourDetailBySlug } from "@/data/demo-tour-details";
import { demoTours, getTourBySlug } from "@/data/demo-tours";

type TourDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return demoTours.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: TourDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  const detail = getTourDetailBySlug(slug);

  if (!tour || !detail) notFound();

  return {
    title:
      tour.slug === "rusya-turu"
        ? { absolute: "Rusya Turu 2026 | Moskova ve St. Petersburg | Mivatur" }
        : tour.title,
    description:
      tour.slug === "rusya-turu"
        ? "24–29 Ağustos 2026 Rusya Turu ile Moskova ve St. Petersburg’u keşfedin. THY uçuşları, Sapsan hızlı tren, 4 yıldızlı konaklama ve kapsamlı tur programı."
        : detail.shortDescription,
    alternates: { canonical: `/turlar/${tour.slug}` },
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  const detail = getTourDetailBySlug(slug);

  if (!tour || !detail) notFound();

  const similarTours = detail.similarTourSlugs
    .map((similarSlug) => getTourBySlug(similarSlug))
    .filter((similarTour) => similarTour !== undefined);

  return <TourDetailView tour={tour} detail={detail} similarTours={similarTours} />;
}
