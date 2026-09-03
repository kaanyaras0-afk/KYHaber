// =========================
// KATEGORİLER
// =========================

const kategoriler = [
    "Tümü",
    "Gündem",
    "Spor",
    "Finans",
    "Siyaset",
    "Teknoloji",
    "Dünya",
    "Magazin"
];


// =========================
// TÜRKİYE'NİN 81 İLİ
// =========================

const iller = [
    "Adana",
    "Adıyaman",
    "Afyonkarahisar",
    "Ağrı",
    "Aksaray",
    "Amasya",
    "Ankara",
    "Antalya",
    "Ardahan",
    "Artvin",
    "Aydın",
    "Balıkesir",
    "Bartın",
    "Batman",
    "Bayburt",
    "Bilecik",
    "Bingöl",
    "Bitlis",
    "Bolu",
    "Burdur",
    "Bursa",
    "Çanakkale",
    "Çankırı",
    "Çorum",
    "Denizli",
    "Diyarbakır",
    "Düzce",
    "Edirne",
    "Elazığ",
    "Erzincan",
    "Erzurum",
    "Eskişehir",
    "Gaziantep",
    "Giresun",
    "Gümüşhane",
    "Hakkari",
    "Hatay",
    "Iğdır",
    "Isparta",
    "İstanbul",
    "İzmir",
    "Kahramanmaraş",
    "Karabük",
    "Karaman",
    "Kars",
    "Kastamonu",
    "Kayseri",
    "Kilis",
    "Kırıkkale",
    "Kırklareli",
    "Kırşehir",
    "Kocaeli",
    "Konya",
    "Kütahya",
    "Malatya",
    "Manisa",
    "Mardin",
    "Mersin",
    "Muğla",
    "Muş",
    "Nevşehir",
    "Niğde",
    "Ordu",
    "Osmaniye",
    "Rize",
    "Sakarya",
    "Samsun",
    "Siirt",
    "Sinop",
    "Sivas",
    "Şanlıurfa",
    "Şırnak",
    "Tekirdağ",
    "Tokat",
    "Trabzon",
    "Tunceli",
    "Uşak",
    "Van",
    "Yalova",
    "Yozgat",
    "Zonguldak"
];


// =========================
// GEÇİCİ HABERLER
// =========================

const haberler = [

    {
        id: "haber_001",
        baslik: "Türkiye teknoloji sektöründe yeni dönem",
        ozet: "Yerli teknoloji girişimleri yeni yatırımlarla büyümeye devam ediyor.",
        kaynak: "Teknoloji Haber",
        kaynakSayisi: 3,
        il: "İstanbul",
        kategori: "Teknoloji",
        ton: "Pozitif",
        tarih: "2026-09-02T14:00",
        link: "#",
        gorsel: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        okundu: false,
        favori: false,
        tepkiler: {
            sasirdim: 12,
            kizdim: 4,
            begendim: 30
        }
    },

    {
        id: "haber_002",
        baslik: "Piyasalarda hareketli gün",
        ozet: "Döviz ve altın piyasalarında gün içerisinde önemli hareketlilik yaşandı.",
        kaynak: "Finans Gündem",
        kaynakSayisi: 4,
        il: "Ankara",
        kategori: "Finans",
        ton: "Nötr",
        tarih: "2026-09-02T13:30",
        link: "#",
        gorsel: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
        okundu: false,
        favori: false,
        tepkiler: {
            sasirdim: 8,
            kizdim: 2,
            begendim: 21
        }
    },

    {
        id: "haber_003",
        baslik: "Milli takım kritik mücadeleye hazırlanıyor",
        ozet: "Milli takım önemli karşılaşma öncesi hazırlıklarını sürdürüyor.",
        kaynak: "Spor Haber",
        kaynakSayisi: 5,
        il: "İzmir",
        kategori: "Spor",
        ton: "Duygusal",
        tarih: "2026-09-02T12:45",
        link: "#",
        gorsel: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
        okundu: false,
        favori: false,
        tepkiler: {
            sasirdim: 18,
            kizdim: 3,
            begendim: 42
        }
    }

];


// =========================
// EXPORT
// =========================

export {
    kategoriler,
    iller,
    haberler
};