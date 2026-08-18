type SiteConfig = {
  googleReviewsUrl: string | null;
  whatsappNumber: string | null;
  phone: string;
  phoneDisplay: string;
};

export const siteConfig: SiteConfig = {
  googleReviewsUrl: null,
  // Add the verified international-format business number when approved.
  whatsappNumber: null,
  phone: "+905051289581",
  phoneDisplay: "+90 505 128 95 81",
};
