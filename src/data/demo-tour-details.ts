import { demoTours } from "@/data/demo-tours";
import type { Tour } from "@/types/tour";
import type { TourDeparture, TourDetail, TourItineraryDay } from "@/types/tour-detail";

// Demo-only content. Replace with reviewed operational content from the future admin source.
const gallery = (place: string) => [
  { src: "/images/tours/detail-demo/route-landscape.svg", alt: `${place} rotasından geniş manzara` },
  { src: "/images/tours/detail-demo/city-detail.svg", alt: `${place} rotasından şehir ve mimari detayı` },
  { src: "/images/tours/detail-demo/journey-moment.svg", alt: `${place} yolculuğundan sakin bir gezi anı` },
] as const;

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function createDepartures(tour: Tour): TourDeparture[] {
  return tour.departureDates.map((startDate, index) => ({
    id: `${tour.slug}-departure-${index + 1}`,
    startDate,
    endDate: addDays(startDate, tour.durationDays - 1),
    departureCity: tour.departureCities[index % tour.departureCities.length],
    arrivalPoint: tour.cities[0],
    price: tour.price + index * (tour.currency === "TRY" ? 1000 : 50),
    currency: tour.currency,
    previousPrice: index === 0 ? tour.price + (tour.currency === "TRY" ? 2500 : 100) : undefined,
    airline: tour.transportationType === "plane" ? "Havayolu bilgisi programda paylaşılacaktır" : undefined,
    transportationNote: tour.transportationType === "bus" ? "Tur otobüsü ile ulaşım" : "Gidiş-dönüş ekonomi sınıfı uçuş planlaması",
    status: index === tour.departureDates.length - 1 ? "planned" : "available",
  }));
}

const balkanItinerary: readonly TourItineraryDay[] = [
  { id: "balkan-day-1", dayNumber: 1, title: "Balkanlara İlk Adım", route: "İstanbul → Üsküp", summary: "Üsküp'e varış ve şehrin tarihi merkezine ilk bakış.", description: "Uçuşun ardından rehberle buluşuyor, Üsküp'ün taş köprüsü, meydanı ve Osmanlı döneminden izler taşıyan çarşı bölgesini sakin bir yürüyüşle keşfediyoruz.", highlights: ["Taş Köprü", "Makedonya Meydanı", "Türk Çarşısı"], transportation: "Uçak ve özel tur aracı", accommodation: "Üsküp şehir oteli", meals: "Akşam yemeği" },
  { id: "balkan-day-2", dayNumber: 2, title: "Göl Kıyısında Tarih", route: "Üsküp → Ohrid", summary: "Ohrid'in göl manzarası ve eski şehir dokusuyla tanışma.", description: "Dağ manzaraları eşliğinde Ohrid'e ilerliyor; göl kıyısı, tarihi sokaklar ve kentin önemli kültürel noktalarını rehber anlatımıyla geziyoruz.", highlights: ["Ohrid Gölü", "Eski Şehir", "Aziz Yuhanna Kilisesi"], transportation: "Özel tur aracı", accommodation: "Ohrid bölge oteli", meals: "Kahvaltı ve akşam yemeği" },
  { id: "balkan-day-3", dayNumber: 3, title: "Adriyatik'e Doğru", route: "Ohrid → Tiran → İşkodra", summary: "Arnavutluk'un başkenti ve kuzey rotasında kültürel duraklar.", description: "Sınır geçişinin ardından Tiran merkezini görüyor, meydan ve çevresindeki yapıları keşfettikten sonra İşkodra yönünde devam ediyoruz.", highlights: ["İskender Bey Meydanı", "Ethem Bey Camii", "İşkodra merkezi"], transportation: "Özel tur aracı", accommodation: "İşkodra bölge oteli", meals: "Kahvaltı" },
  { id: "balkan-day-4", dayNumber: 4, title: "Kotor Körfezi", route: "İşkodra → Budva → Kotor", summary: "Adriyatik kıyısında eski şehirler ve körfez manzaraları.", description: "Karadağ sahillerine ulaşıyor; Budva'nın tarihi merkezini ve surlarla çevrili Kotor'u yürüyerek keşfediyoruz.", highlights: ["Budva Eski Şehir", "Kotor Körfezi", "Kotor surları"], transportation: "Özel tur aracı", accommodation: "Karadağ bölge oteli", meals: "Kahvaltı ve akşam yemeği" },
  { id: "balkan-day-5", dayNumber: 5, title: "Mostar'ın İzleri", route: "Kotor → Mostar → Saraybosna", summary: "Taş köprüler ve çok katmanlı Balkan kültürü.", description: "Bosna Hersek'e geçerek Mostar'ın tarihi çarşısını ve simge köprüsünü geziyor, ardından Saraybosna'ya ilerliyoruz.", highlights: ["Mostar Köprüsü", "Kuyumcular Çarşısı", "Neretva Nehri"], transportation: "Özel tur aracı", accommodation: "Saraybosna şehir oteli", meals: "Kahvaltı" },
  { id: "balkan-day-6", dayNumber: 6, title: "Saraybosna Hikâyeleri", route: "Saraybosna", summary: "Başçarşı çevresinde tarih, kültür ve şehir yaşamı.", description: "Saraybosna'nın farklı dönemlerini yansıtan yapıları, Başçarşı'yı ve Miljacka Nehri çevresini rehber eşliğinde inceliyoruz.", highlights: ["Başçarşı", "Sebil", "Latin Köprüsü", "Gazi Hüsrev Bey Camii"], transportation: "Yürüyüş ve özel tur aracı", accommodation: "Saraybosna şehir oteli", meals: "Kahvaltı ve akşam yemeği" },
  { id: "balkan-day-7", dayNumber: 7, title: "Dönüş Yolculuğu", route: "Saraybosna → İstanbul", summary: "Serbest zamanın ardından havalimanı transferi ve dönüş.", description: "Uçuş saatine göre kısa serbest zamanın ardından havalimanına hareket ediyor ve İstanbul'a dönüş yolculuğumuzu gerçekleştiriyoruz.", highlights: ["Saraybosna'da serbest zaman", "Havalimanı transferi"], transportation: "Özel tur aracı ve uçak", accommodation: "Konaklama yok", meals: "Kahvaltı" },
];

function compactItinerary(tour: Tour): readonly TourItineraryDay[] {
  const lastCity = tour.cities.at(-1) ?? tour.cities[0];
  return [
    { id: `${tour.slug}-day-1`, dayNumber: 1, title: "Varış ve İlk Keşif", route: `${tour.departureCities[0]} → ${tour.cities[0]}`, summary: "Varış, rehberle buluşma ve rotaya giriş.", description: `${tour.cities[0]} varışının ardından bölgenin temel noktalarını tanıtan panoramik gezi ve otele transfer planlanır.`, highlights: [tour.cities[0], tour.region], transportation: tour.transportationType === "bus" ? "Tur otobüsü" : "Uçak ve özel araç", accommodation: "Program kapsamındaki otel", meals: "Programda belirtilecektir" },
    { id: `${tour.slug}-day-2`, dayNumber: 2, title: "Rotanın Öne Çıkanları", route: `${tour.cities[0]} → ${lastCity}`, summary: "Kültürel ve doğal durakların keşfi.", description: "Rehber anlatımı eşliğinde rotanın öne çıkan durakları ziyaret edilir; program temposuna göre serbest zaman verilebilir.", highlights: tour.cities.slice(0, 3), transportation: "Özel tur aracı", accommodation: "Program kapsamındaki otel", meals: "Kahvaltı" },
    { id: `${tour.slug}-day-3`, dayNumber: 3, title: "Programın Devamı", route: `${lastCity} → ${tour.departureCities[0]}`, summary: "Son ziyaretler ve dönüş hazırlığı.", description: "Tur süresine göre takip eden ziyaretler gerçekleştirilir ve dönüş programı için transfer sağlanır.", highlights: [lastCity], transportation: tour.transportationType === "bus" ? "Tur otobüsü" : "Özel araç ve uçak", accommodation: tour.durationDays > 3 ? "Program kapsamındaki otel" : "Konaklama yok", meals: "Kahvaltı" },
  ];
}

const commonIncluded = ["Programda belirtilen ulaşım hizmetleri", "Program kapsamındaki konaklamalar", "Profesyonel Türkçe rehberlik", "Programda belirtilen çevre gezileri"];
const commonExcluded = ["Kişisel harcamalar", "Programda ayrıca belirtilen müze ve ören yeri girişleri", "Yurtdışı çıkış harcı ve seyahat belgeleri", "Dahil olduğu açıkça belirtilmeyen öğünler"];
const commonNotes = [
  { title: "Vize ve pasaport", content: "Belge ve giriş koşulları destinasyona ve yolcunun durumuna göre değişebilir. Güncel resmi koşullar seyahat öncesinde kontrol edilmelidir." },
  { title: "Uçuş ve bagaj", content: "Uçuş saatleri, havayolu ve bagaj hakları kesin operasyon planıyla birlikte bildirilir." },
  { title: "İptal ve değişiklik", content: "Değişiklik ve iptal koşulları rezervasyon öncesinde paylaşılan sözleşme ve tur özelindeki şartlara göre değerlendirilir." },
  { title: "Tur programı notları", content: "Program sırası; hava, ulaşım ve operasyon koşulları nedeniyle içerik korunarak değişebilir." },
];

// User-supplied, real tour content. This record must not be treated as demo copy.
const russiaTourDetail: TourDetail = {
  tourSlug: "rusya-turu",
  gallery: gallery("Rusya"),
  shortDescription:
    "Moskova’nın görkemli meydanlarından St. Petersburg’un saraylarına uzanan bu özel programda Rusya’nın tarihini, sanatını ve mimarisini yakından keşfedin.",
  longDescription:
    "Rusya Turu; Moskova ve St. Petersburg’un öne çıkan tarihi, kültürel ve mimari duraklarını altı günlük kapsamlı bir programla bir araya getirir. Türk Hava Yolları uçuşları, iki şehir arasındaki Sapsan hızlı tren yolculuğu, dört yıldızlı oteller ve profesyonel rehberlik hizmetleriyle planlanan turda Rusya’nın simgesel meydanları, sarayları, müzeleri ve şehir yaşamı keşfedilir.",
  departures: [
    {
      id: "rusya-turu-2026-08-24",
      startDate: "2026-08-24",
      endDate: "2026-08-29",
      departureCity: "İstanbul",
      arrivalPoint: "Moskova",
      price: 1950,
      currency: "EUR",
      singleRoomSupplement: 450,
      roomOccupancyLabel: "İki veya üç kişilik odada kişi başı",
      airline: "Türk Hava Yolları",
      transportationNote:
        "İstanbul–Moskova ve St. Petersburg–İstanbul THY uçuşları; Moskova–St. Petersburg arası Sapsan hızlı tren",
      bookingTransportationLabel: "THY uçuşları + Sapsan hızlı tren",
      status: "available",
    },
  ],
  itinerary: [
    {
      id: "russia-day-1",
      dayNumber: 1,
      title: "İstanbul’dan Moskova’ya Yolculuk",
      route: "İstanbul → Moskova",
      summary:
        "İstanbul Havalimanı’ndan Moskova’ya uçuşun ardından panoramik şehir turu, Kızıl Meydan ve Kremlin ziyareti.",
      description:
        "İstanbul Havalimanı Dış Hatlar Terminali Giden Yolcu Salonu’nda buluşuyoruz. Bagaj, bilet ve biniş işlemlerinin ardından Türk Hava Yolları’nın 07.15 seferiyle Moskova’ya hareket ediyoruz. Yerel saatle 11.05’te Moskova’ya varışımızın ardından havalimanında karşılanıyor ve özel aracımızla şehir merkezine transfer oluyoruz.\n\nPanoramik Moskova şehir turunda Rusya’nın kalbi olarak kabul edilen Kızıl Meydan’da Kremlin’i ve şehrin önemli simgelerini görüyoruz. UNESCO Dünya Mirası Listesi’nde bulunan Novodevichy Manastırı’nı dışarıdan görüyor, Serçe Tepeleri’nden Moskova’nın panoramik manzarasını izliyor ve Moskova Devlet Üniversitesi binasını görüyoruz. Gün içerisinde Poklonnaya Tepesi’nde bulunan Zafer Parkı’nı ziyaret ederek Rus tarihine dair bilgiler alıyoruz.\n\nÖğle yemeği için verilecek serbest zamanın ardından Kremlin ziyaretimizi gerçekleştiriyoruz. 1156 yılında ahşap bir kale olarak inşa edilen ve günümüzde Rusya Devlet Başkanı’nın resmî merkezi olan Kremlin’de kırmızı tuğlalı surları, tarihi kuleleri ve etkileyici katedralleri görüyoruz. Akşam yemeğinin ardından otelimize yerleşiyoruz.",
      highlights: ["Kızıl Meydan", "Kremlin", "Novodevichy Manastırı", "Serçe Tepeleri", "Moskova Devlet Üniversitesi", "Zafer Parkı"],
      transportation: "THY uçuşu + özel tur aracı",
      accommodation: "Novotel Moscow Centre veya benzeri 4 yıldızlı otel",
      meals: "Akşam yemeği",
    },
    {
      id: "russia-day-2",
      dayNumber: 2,
      title: "Moskova’nın Sanat ve Tarih Durakları",
      route: "Moskova",
      summary:
        "Moskova metrosu, Arbat Caddesi, Tretyakov Galerisi, Novodevichy Mezarlığı ve Moskova Merkez Camii.",
      description:
        "Otelde alacağımız kahvaltının ardından Moskova Metro Turu ile programımıza başlıyoruz. Dünyanın en güzel metro sistemlerinden biri olarak kabul edilen Moskova metrosunda mozaikler, vitraylar, heykeller ve görkemli dekorasyonlarla süslenmiş Komsomolskaya, Kurskaya ve Kievskaya gibi önemli istasyonları görüyoruz.\n\nArdından Moskova’nın en eski caddelerinden biri olan Arbat Caddesi’nde yürüyüş turu gerçekleştiriyoruz. Tarihi yapıları, kafeleri, restoranları, Puşkin Evi’ni ve Rus kültürüne ait simgesel alanları görüyoruz. Sonrasında Rus sanatının en önemli koleksiyonlarından birine sahip Tretyakov Galerisi’ni ziyaret ediyor; Repin, Ayvazovski, Vasnetsov ve Şişkin gibi sanatçıların eserlerini görüyoruz.\n\nÖğle yemeği için verilecek serbest zamanın ardından Anton Çehov ve Nikolay Gogol gibi önemli isimlerin mezarlarının bulunduğu Novodevichy Mezarlığı’nı ziyaret ediyoruz. Günün sonunda 10.000 kişilik kapasitesiyle Avrupa’nın en büyük camilerinden biri olan Moskova Merkez Camii’ni geziyoruz. Akşam yemeğinin ardından otelimize dönüyoruz.",
      highlights: ["Moskova Metrosu", "Komsomolskaya İstasyonu", "Kurskaya İstasyonu", "Kievskaya İstasyonu", "Arbat Caddesi", "Tretyakov Galerisi", "Novodevichy Mezarlığı", "Moskova Merkez Camii"],
      transportation: "Metro + özel tur aracı",
      accommodation: "Novotel Moscow Centre veya benzeri 4 yıldızlı otel",
      meals: "Kahvaltı ve akşam yemeği",
    },
    {
      id: "russia-day-3",
      dayNumber: 3,
      title: "Sapsan Treni ile St. Petersburg’a Geçiş",
      route: "Moskova → St. Petersburg",
      summary:
        "Sapsan hızlı treniyle St. Petersburg’a geçiş ve şehrin önemli simgelerini kapsayan panoramik tur.",
      description:
        "Kahvaltının ardından otelden çıkış yapıyor ve tren garına transfer oluyoruz. Sapsan hızlı treni ile St. Petersburg’a hareket ediyoruz. Varışımızın ardından panoramik şehir turumuza başlıyoruz.\n\nNevsky Prospect boyunca ilerlerken St. Petersburg’un görkemli mimarisini keşfediyoruz. Kazan Katedrali’ni, Rus Çarlarının eski ikametgâhı olan Kışlık Saray’ı ve Hermitage çevresini görüyoruz. Turumuz Vasilevskiy Adası, St. Isaac Katedrali ve şehrin kuruluş noktası olan Peter ve Paul Kalesi ile devam ediyor.\n\nSenato Meydanı’nda bulunan Bronz Atlı heykelini ve şehrin kalbi sayılan Saray Meydanı’nı ziyaret ediyoruz. Akşam yemeğinin ardından otelimize transfer oluyoruz.",
      highlights: ["Nevsky Prospect", "Kazan Katedrali", "Kışlık Saray", "Hermitage çevresi", "Vasilevskiy Adası", "St. Isaac Katedrali", "Peter ve Paul Kalesi", "Senato Meydanı", "Bronz Atlı", "Saray Meydanı"],
      transportation: "Sapsan hızlı tren + özel tur aracı",
      accommodation: "Novotel Saint Petersburg Centre veya benzeri 4 yıldızlı otel",
      meals: "Kahvaltı ve akşam yemeği",
    },
    {
      id: "russia-day-4",
      dayNumber: 4,
      title: "Çarlık Sarayları ve Peterhof",
      route: "St. Petersburg",
      summary:
        "Puşkin bölgesindeki Çariçe Sarayı, Amber Odası ve Peterhof Sarayı gezisi.",
      description:
        "Kahvaltının ardından Puşkin bölgesine hareket ediyoruz. Çarlık döneminin en görkemli yazlık saraylarından biri olan Çariçe Sarayı’nı ziyaret ediyor ve dünyaca ünlü Amber Odası’nı görüyoruz. İkinci Dünya Savaşı sırasında büyük zarar gören ve uzun restorasyon çalışmalarının ardından yeniden eski ihtişamına kavuşan sarayın salonlarını geziyoruz. Sarayın etkileyici parkında yürüyüş yaptıktan sonra öğle yemeği için serbest zaman veriyoruz.\n\nArdından Rus Versailles’ı olarak anılan Peterhof Sarayı ve Parkı’na geçiyoruz. Zarif bahçeleri, görkemli çeşmeleri ve Finlandiya Körfezi manzarasını keşfediyoruz. Büyük Saray’ın ihtişamlı salonlarını gezerken Rus İmparatorluk ailesinin yaşamı hakkında bilgi alıyoruz. Gün sonunda akşam yemeğinin ardından otelimize dönüyoruz.",
      highlights: ["Puşkin Bölgesi", "Çariçe Sarayı", "Amber Odası", "Çariçe Sarayı Parkı", "Peterhof Sarayı", "Peterhof Bahçeleri", "Finlandiya Körfezi"],
      transportation: "Özel tur aracı",
      accommodation: "Novotel Saint Petersburg Centre veya benzeri 4 yıldızlı otel",
      meals: "Kahvaltı ve akşam yemeği",
    },
    {
      id: "russia-day-5",
      dayNumber: 5,
      title: "Hermitage Müzesi ve Neva Nehri",
      route: "St. Petersburg",
      summary:
        "Hermitage Müzesi, St. Petersburg Merkez Camii ve Neva Nehri tekne turu.",
      description:
        "Kahvaltının ardından otelden çıkış yapıyor ve dünyanın en önemli müzelerinden biri olan Hermitage Müzesi’ni ziyaret ediyoruz. Rus Çarlarının eski sarayı olan Kışlık Saray içerisinde Leonardo da Vinci, Raphael ve birçok önemli sanatçının eserlerini görme fırsatı buluyoruz. Müzenin Antik Yunan, Doğu ve Mısır sanatına ait zengin koleksiyonlarını ziyaret ediyoruz.\n\nÖğle yemeği için verilecek serbest zamanın ardından St. Petersburg Merkez Camii’ni ziyaret ediyoruz. Uzun yıllar süren inşası ve Sovyet döneminde depo olarak kullanılmasıyla dikkat çeken yapı, Avrupa’nın en büyük ve etkileyici camilerinden biri olarak kabul edilmektedir.\n\nGünün son bölümünde Neva Nehri ve şehrin kanalları üzerinde tekne turu gerçekleştiriyoruz. Kuzey’in Venedik’i olarak anılan şehirde tarihi köprüleri, kanalları, St. Isaac Katedrali’ni ve Kanlı Kilise gibi önemli yapıları su üzerinden görme fırsatı buluyoruz. Turumuzun ardından havalimanına transfer oluyoruz.",
      highlights: ["Hermitage Müzesi", "Kışlık Saray", "St. Petersburg Merkez Camii", "Neva Nehri", "Şehir kanalları", "St. Isaac Katedrali", "Kanlı Kilise"],
      transportation: "Özel tur aracı + tekne",
      accommodation: "Gece uçuşu nedeniyle otel konaklaması bulunmuyor",
      meals: "Kahvaltı ve akşam yemeği",
    },
    {
      id: "russia-day-6",
      dayNumber: 6,
      title: "İstanbul’a Dönüş",
      route: "St. Petersburg → İstanbul",
      summary: "Türk Hava Yolları uçuşuyla İstanbul’a dönüş.",
      description:
        "Türk Hava Yolları’nın 00.15 seferi ile İstanbul’a hareket ediyoruz. Saat 04.15’te İstanbul Havalimanı’na varışımızla organizasyonumuz sona eriyor. Bir başka Mivatur gezisinde buluşmak üzere vedalaşıyoruz.",
      highlights: ["St. Petersburg Havalimanı", "İstanbul Havalimanı"],
      transportation: "Türk Hava Yolları uçuşu",
      accommodation: "Bulunmuyor",
      meals: "Bulunmuyor",
    },
  ],
  includedServices: [
    "İstanbul–Moskova ve St. Petersburg–İstanbul Türk Hava Yolları dış hat uçak biletleri",
    "Moskova–St. Petersburg arası Sapsan hızlı tren bileti, 2. sınıf",
    "Dört yıldızlı otellerde toplam 4 gece konaklama",
    "Moskova’da 2 gece konaklama",
    "St. Petersburg’da 2 gece konaklama",
    "4 kahvaltı",
    "Helal restoranlarda 5 akşam yemeği",
    "Moskova ve St. Petersburg şehir turları",
    "Profesyonel Türkçe ve lokal rehberlik hizmetleri",
    "Programda belirtilen müze, alan ve aktivite giriş ücretleri",
    "Programda belirtilen tüm transferler",
  ],
  excludedServices: [
    "Rusya vizesi ve hizmet bedeli: 100 €",
    "Diğer şehirlerden İstanbul’a iç hat bağlantı uçuşları",
    "Yurtdışı çıkış harcı",
    "Otel ekstraları",
    "Öğle yemekleri",
    "Yemeklerde alınacak kapalı içecekler",
    "Rehber ve şoför bahşişleri: 25 €",
  ],
  importantNotes: [
    {
      title: "Vize ve pasaport",
      content:
        "Rusya turu için bordo pasaport sahiplerinin vize alması gerekmektedir. Tur bilgilerinde belirtilen vize ve hizmet bedeli 100 €’dur. Yeşil pasaport sahipleri için vize gerekmemektedir. Pasaport geçerlilik süresi ve güncel giriş koşulları rezervasyon öncesinde ayrıca kontrol edilmelidir.",
    },
    ...commonNotes.filter((note) => note.title !== "Vize ve pasaport"),
  ],
  faq: [
    { id: "russia-faq-1", question: "Rusya Turu için vize gerekiyor mu?", answer: "Bordo pasaport sahiplerinin vize alması gerekmektedir. Yeşil pasaport sahipleri için vize gerekmemekle birlikte güncel giriş koşulları rezervasyon öncesinde kontrol edilmelidir.", order: 1 },
    { id: "russia-faq-2", question: "Moskova ile St. Petersburg arasında ulaşım nasıl sağlanıyor?", answer: "İki şehir arasındaki ulaşım Sapsan hızlı treninde 2. sınıf biletle sağlanmaktadır.", order: 2 },
    { id: "russia-faq-3", question: "Turda kaç gece konaklama bulunuyor?", answer: "Moskova’da 2 ve St. Petersburg’da 2 gece olmak üzere toplam 4 gece dört yıldızlı otel konaklaması bulunuyor.", order: 3 },
  ],
  pdfUrl: null,
  similarTourSlugs: ["buyuk-balkan-turu", "japonya-turu", "misir-turu"],
  visitedCountries: ["Rusya"],
  visitedCities: ["Moskova", "St. Petersburg"],
  visaInformation:
    "Bordo pasaport sahiplerinin vize alması gerekmektedir. Yeşil pasaport sahipleri için vize gerekmemektedir; güncel giriş koşulları ayrıca kontrol edilmelidir.",
  hotelInformation: [
    { location: "Moskova", nights: 2, description: "4 yıldızlı Novotel Moscow Centre veya benzeri" },
    { location: "St. Petersburg", nights: 2, description: "4 yıldızlı Novotel Saint Petersburg Centre veya benzeri" },
  ],
  mealInformation: ["4 kahvaltı", "Helal restoranlarda 5 akşam yemeği", "Öğle yemekleri tur ücretine dahil değildir", "Kapalı içecekler tur ücretine dahil değildir"],
  visaFee: 100,
  guideDriverTip: 25,
  realContent: true,
};

export const demoTourDetails: readonly TourDetail[] = demoTours.map((tour) => ({
  ...(tour.slug === "rusya-turu" ? russiaTourDetail : {
  tourSlug: tour.slug,
  gallery: gallery(tour.region),
  shortDescription: `${tour.region} rotasının kültürünü ve öne çıkan duraklarını dengeli bir programla keşfedin.`,
  longDescription: `${tour.title}, ulaşım ve gezi temposunu birlikte ele alan demo bir programdır. Kesin hizmet ve operasyon ayrıntıları rezervasyon öncesinde paylaşılır.`,
  departures: createDepartures(tour),
  itinerary: tour.slug === "buyuk-balkan-turu" ? balkanItinerary : compactItinerary(tour),
  includedServices: commonIncluded,
  excludedServices: commonExcluded,
  importantNotes: commonNotes,
  faq: [
    { id: `${tour.slug}-faq-1`, question: "Tur programındaki ziyaret sırası değişebilir mi?", answer: "Operasyon ve ulaşım koşullarına göre ziyaret sırası, içerik korunarak güncellenebilir.", order: 1 },
    { id: `${tour.slug}-faq-2`, question: "Kesin kalkış bilgileri ne zaman paylaşılır?", answer: "Kesin ulaşım ve buluşma ayrıntıları operasyon planı tamamlandığında katılımcılarla paylaşılır.", order: 2 },
    { id: `${tour.slug}-faq-3`, question: "Fiyata dahil hizmetleri nereden görebilirim?", answer: "Bu sayfadaki dahil ve dahil olmayan hizmetler alanı temel kapsamı gösterir; kesin bilgiler rezervasyon belgelerinde yer alır.", order: 3 },
  ],
  pdfUrl: null,
  similarTourSlugs: demoTours.filter((candidate) => candidate.slug !== tour.slug && candidate.type === tour.type).slice(0, 3).map((candidate) => candidate.slug),
  visitedCountries: tour.countries,
  visitedCities: tour.cities,
  visaInformation: tour.visaStatus === "visa-free" ? "Bu demo program vizesiz rota olarak işaretlenmiştir; güncel giriş koşulları seyahat öncesinde kontrol edilmelidir." : "Vize ve giriş koşulları yolcunun durumuna göre değişebilir; güncel resmi bilgiler seyahat öncesinde kontrol edilmelidir.",
  realContent: false,
  }),
}));

export function getTourDetailBySlug(slug: string) {
  return demoTourDetails.find((detail) => detail.tourSlug === slug);
}
