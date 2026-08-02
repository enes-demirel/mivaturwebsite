export type ReviewSource = "google" | "manual";

export type Review = {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  content: string;
  publishedAt: string;
  source: ReviewSource;
  externalUrl?: string;
  featured: boolean;
  order: number;
};

export type ReviewSummary = {
  averageRating: number;
  totalReviewCount: number;
  isDemo: boolean;
};
