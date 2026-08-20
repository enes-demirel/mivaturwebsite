export const generalFaqGroups = [
  { title: "Rezervasyon", items: [
    { question: "Tur rezervasyonu nasıl oluşturulur?", answer: "İlgilendiğiniz tur sayfasındaki talep formunu kullanabilir veya Mivatur ile telefon üzerinden iletişime geçebilirsiniz. Kesin rezervasyon, tur koşulları ve uygunluk teyit edildikten sonra tamamlanır." },
    { question: "Rezervasyon için hangi bilgiler gerekir?", answer: "Katılımcıların iletişim ve seyahat bilgilerinin yanında, seçilen turun gerektirdiği pasaport veya kimlik bilgilerinin paylaşılması gerekebilir. İstenen bilgiler turun niteliğine göre değişir." },
  ]},
  { title: "Ödeme", items: [
    { question: "Tur ödemesi nasıl yapılır?", answer: "Ödeme yöntemi, taksit imkânı ve son ödeme tarihleri ilgili turun koşullarına göre paylaşılır. Tur sayfasında taksit planı bulunuyorsa geçerli tarihler ayrıca gösterilir." },
    { question: "Fiyatlara hangi hizmetler dahildir?", answer: "Her turun dahil ve dahil olmayan hizmetleri kendi detay sayfasında ayrı listelenir. Kesin kapsam rezervasyon belgeleriyle birlikte kontrol edilmelidir." },
  ]},
  { title: "Vize ve Pasaport", items: [
    { question: "Vize işlemleri Mivatur tarafından yapılıyor mu?", answer: "Vize gereklilikleri destinasyona ve pasaport türüne göre değişir. Sunulan destek ve ücretler ilgili turun açıklamalarında belirtilir; vize sonucu yetkili makamların değerlendirmesine bağlıdır." },
    { question: "Pasaport geçerlilik süresi ne kadar olmalıdır?", answer: "Gerekli süre ülkenin güncel giriş kurallarına göre değişebilir. Rezervasyon öncesinde resmi kaynakların ve tur özelindeki bilgilendirmenin kontrol edilmesi gerekir." },
  ]},
  { title: "Tur Programı", items: [
    { question: "Programdaki ziyaret sırası değişebilir mi?", answer: "Hava, ulaşım ve operasyon koşulları nedeniyle ziyaret sırası, programın temel içeriği korunarak değişebilir." },
    { question: "Kalkış saatleri ne zaman kesinleşir?", answer: "Kesin buluşma ve ulaşım bilgileri operasyon planı tamamlandığında katılımcılarla paylaşılır." },
  ]},
  { title: "İptal ve Değişiklik", items: [
    { question: "Rezervasyon iptal veya değişiklik koşulları nelerdir?", answer: "Koşullar ilgili tur, ulaşım sağlayıcısı ve rezervasyon tarihine göre değişebilir. Size sunulan sözleşme ve tur özelindeki şartlar esas alınır." },
  ]},
  { title: "İletişim", items: [
    { question: "Mivatur'a nasıl ulaşabilirim?", answer: "Web sitesindeki talep formlarını kullanabilir veya +90 505 128 95 81 numaralı telefondan ekibimize ulaşabilirsiniz." },
  ]},
] as const;

export const generalFaqs: readonly { question: string; answer: string }[] = generalFaqGroups.flatMap((group) => [...group.items]);
