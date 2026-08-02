import type { Faq } from "@/types/faq";

export const homeFaqContent = {
  eyebrow: "Merak Ettikleriniz",
  title: "Sıkça sorulan sorular",
  description:
    "Tur programları ve rezervasyon süreciyle ilgili temel soruların yanıtlarını inceleyin.",
} as const;

export const homeFaqs = [
  {
    id: "rezervasyon-talebi",
    question: "Rezervasyon talebi nasıl oluşturulur?",
    answer:
      "İlgilendiğiniz turu seçtikten sonra iletişim kanallarımız üzerinden talebinizi iletebilirsiniz. Güncel uygunluk ve sonraki adımlar ekibimiz tarafından paylaşılır.",
    order: 1,
    category: "Rezervasyon",
    published: true,
  },
  {
    id: "fiyata-dahil-hizmetler",
    question: "Tur fiyatlarına hangi hizmetler dahildir?",
    answer:
      "Dahil ve hariç hizmetler her turun program sayfasında ayrı ayrı belirtilir. Rezervasyon öncesinde ilgili tur detaylarını incelemenizi öneririz.",
    order: 2,
    category: "Tur Detayları",
    published: true,
  },
  {
    id: "odeme-islemleri",
    question: "Ödeme işlemleri nasıl yapılır?",
    answer:
      "Kullanılabilecek ödeme yöntemleri ve ödeme planı seçilen tura göre bildirilir. Kesin bilgiler rezervasyon talebiniz sırasında ekibimizce paylaşılır.",
    order: 3,
    category: "Ödeme",
    published: true,
  },
  {
    id: "vize-islemleri",
    question: "Yurtdışı turlarında vize işlemleri kime aittir?",
    answer:
      "Vize gereklilikleri destinasyona ve yolcunun durumuna göre değişebilir. Sorumluluklar ve varsa sunulan yönlendirmeler seçilen turun detaylarında belirtilir.",
    order: 4,
    category: "Seyahat Belgeleri",
    published: true,
  },
  {
    id: "program-degisiklikleri",
    question: "Tur programları değişebilir mi?",
    answer:
      "Programlar ulaşım, hava koşulları veya operasyonel gereklilikler nedeniyle güncellenebilir. Güncel rota ve önemli notlar ilgili tur sayfasında paylaşılır.",
    order: 5,
    category: "Tur Detayları",
    published: true,
  },
  {
    id: "iletisim",
    question: "Mivatur ile nasıl iletişime geçebilirim?",
    answer:
      "İletişim sayfamızda yer alan güncel kanalları kullanarak ekibimize ulaşabilir, tur programları hakkında bilgi talep edebilirsiniz.",
    order: 6,
    category: "İletişim",
    published: true,
  },
] as const satisfies readonly Faq[];
