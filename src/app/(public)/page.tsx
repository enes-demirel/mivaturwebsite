import { AboutSection } from "@/components/home/about-section";
import { FeaturedToursSection } from "@/components/home/featured-tours-section";
import { GoogleReviewsSection } from "@/components/home/google-reviews-section";
import { HomeFaqSection } from "@/components/home/home-faq-section";
import { LatestBlogSection } from "@/components/home/latest-blog-section";
import { WhyMivaturSection } from "@/components/home/why-mivatur-section";
import { WorldMapHero } from "@/components/home/world-map-hero";
import { getToursByType } from "@/data/demo-tours";

export default function HomePage() {
  return (
    <div>
      <WorldMapHero />
      <FeaturedToursSection
        eyebrow="Yurtdışını Keşfet"
        title="Öne Çıkan Yurtdışı Turları"
        description="Yeni kültürleri ve unutulmaz rotaları Mivatur'un özenle hazırlanan programlarıyla keşfedin."
        tours={getToursByType("international")}
        viewAllHref="/yurtdisi-turlari"
        viewAllLabel="Tüm Yurtdışı Turlarını Gör"
        gridVariant="four-column"
        className="border-t border-border/70 bg-surface"
      />
      <FeaturedToursSection
        eyebrow="Türkiye'yi Keşfet"
        title="Öne Çıkan Yurtiçi Turları"
        description="Türkiye'nin doğasını, tarihini ve benzersiz şehirlerini keşfedeceğiniz rotalar."
        tours={getToursByType("domestic")}
        viewAllHref="/yurtici-turlari"
        viewAllLabel="Tüm Yurtiçi Turlarını Gör"
        gridVariant="two-column"
      />
      <GoogleReviewsSection />
      <WhyMivaturSection />
      <AboutSection />
      <LatestBlogSection />
      <HomeFaqSection />
    </div>
  );
}
