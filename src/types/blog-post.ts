export type BlogPostStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  order: number;
  relatedTourSlugs: readonly string[];
  status: BlogPostStatus;
};
