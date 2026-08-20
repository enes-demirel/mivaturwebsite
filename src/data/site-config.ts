type SiteConfig = {
  googleReviewsUrl: string | null;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  whatsappUrl: string;
  whatsappDefaultMessage: string;
};

const verifiedBusinessNumber = "+905051289581";
const verifiedBusinessNumberDisplay = "+90 505 128 95 81";
const whatsappDigits = verifiedBusinessNumber.replace(/\D/g, "");

export const siteConfig: SiteConfig = {
  googleReviewsUrl: null,
  phone: verifiedBusinessNumber,
  phoneDisplay: verifiedBusinessNumberDisplay,
  whatsapp: verifiedBusinessNumber,
  whatsappDisplay: verifiedBusinessNumberDisplay,
  whatsappUrl: `https://wa.me/${whatsappDigits}`,
  whatsappDefaultMessage: "Merhaba, Mivatur turları hakkında bilgi almak istiyorum.",
};

export function createSiteWhatsAppUrl(message = siteConfig.whatsappDefaultMessage) {
  return `${siteConfig.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
