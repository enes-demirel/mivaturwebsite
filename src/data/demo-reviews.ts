import type { Review, ReviewSummary } from "@/types/review";

// Demo-only content. Do not use these records for structured data or live ratings.
export const demoReviews = [
  {
    id: "demo-review-001",
    authorName: "Selin A.",
    rating: 5,
    content:
      "Balkan turunda program gayet dengeliydi; hem şehirleri gezmek hem de kendi başımıza vakit geçirmek için yeterli zamanımız oldu. Rehberimizin bölge bilgisi yolculuğu çok daha keyifli hâle getirdi.",
    publishedAt: "2026-06-18",
    source: "manual",
    featured: true,
    order: 1,
  },
  {
    id: "demo-review-002",
    authorName: "Mert K.",
    rating: 5,
    content:
      "Dubai turuna ailece katıldık. Havalimanı karşılamasından otel yerleşimine kadar süreç düzenli ilerledi. Yoğun görünen programın yorucu olmaması bizim için önemliydi.",
    publishedAt: "2026-05-27",
    source: "manual",
    featured: true,
    order: 2,
  },
  {
    id: "demo-review-003",
    authorName: "Ece T.",
    rating: 5,
    content:
      "Kapadokya gezisinde konaklama ve ulaşım beklentimizi karşıladı. Program öncesinde sorularımıza hızlı dönüş yapılması ve gezi boyunca iletişimin açık olması güven verdi.",
    publishedAt: "2026-04-14",
    source: "manual",
    featured: true,
    order: 3,
  },
  {
    id: "demo-review-004",
    authorName: "Burak D.",
    rating: 5,
    content:
      "Mısır turunda görülmesi gereken yerler iyi planlanmıştı. Rehber anlatımları anlaşılır, transferler zamanındaydı. Serbest zamanların programa eklenmiş olmasını ayrıca sevdik.",
    publishedAt: "2026-03-22",
    source: "manual",
    featured: false,
    order: 4,
  },
  {
    id: "demo-review-005",
    authorName: "Nihan Y.",
    rating: 5,
    content:
      "Karadeniz turunun rotası çok güzeldi. Uzun yolculuk günlerinde verilen molalar ve otel seçimleri sayesinde program beklediğimizden daha rahat geçti.",
    publishedAt: "2026-02-09",
    source: "manual",
    featured: false,
    order: 5,
  },
  {
    id: "demo-review-006",
    authorName: "Can O.",
    rating: 5,
    content:
      "Japonya programı öncesindeki bilgilendirme oldukça detaylıydı. Farklı şehirler arasındaki geçişler sorunsuz ilerledi ve kendi keşiflerimiz için de zaman bırakılmıştı.",
    publishedAt: "2026-01-16",
    source: "manual",
    featured: false,
    order: 6,
  },
] as const satisfies readonly Review[];

// Temporary display values until a verified Google Places integration is added.
export const demoReviewSummary: ReviewSummary = {
  averageRating: 5,
  totalReviewCount: 120,
  isDemo: true,
};
