// ============================================================
// KYHABER API
// ============================================================


// ============================================================
// API CONFIG
// ============================================================

const API_CONFIG = {

    // Haberler artık doğrudan NewsData.io'ya gitmez.
    // Cloudflare Worker üzerinden alınır.
    baseUrl:
        "https://kyhaber-finans-proxy.kaanyaras0.workers.dev",

    timeout:
        10000,

    cacheDuration:
        15 * 60 * 1000,

    cachePrefix:
        "kyhaber_api_cache_",

    maxPages:
        5,

    maxNews:
        30

};


// ============================================================
// CACHE
// ============================================================

function cacheAnahtariOlustur(url) {

    return (
        API_CONFIG.cachePrefix +
        encodeURIComponent(url)
    );

}


function cacheGetir(url) {

    const key =
        cacheAnahtariOlustur(url);

    const veri =
        localStorage.getItem(key);

    if (!veri) {

        return null;

    }


    try {

        const parsed =
            JSON.parse(veri);


        if (
            !parsed ||
            !parsed.timestamp
        ) {

            localStorage.removeItem(key);

            return null;

        }


        const gecmisSure =
            Date.now() -
            parsed.timestamp;


        if (
            gecmisSure >
            API_CONFIG.cacheDuration
        ) {

            localStorage.removeItem(key);

            return null;

        }


        return parsed.data;

    } catch (error) {

        localStorage.removeItem(key);

        return null;

    }

}


function cacheKaydet(url, data) {

    const key =
        cacheAnahtariOlustur(url);


    try {

        localStorage.setItem(

            key,

            JSON.stringify({

                timestamp:
                    Date.now(),

                data

            })

        );

    } catch (error) {

        console.warn(
            "KYHaber cache kaydedilemedi:",
            error
        );

    }

}


// ============================================================
// MOCK HABERLER
// ============================================================

const MOCK_HABERLER = [

    {

        id:
            "mock_001",

        baslik:
            "Türkiye teknoloji sektöründe yeni dönem",

        ozet:
            "Yerli teknoloji girişimleri yeni yatırımlarla büyümeye devam ediyor.",

        kaynak:
            "Teknoloji Haber",

        kaynakSayisi:
            3,

        il:
            "İstanbul",

        kategori:
            "Teknoloji",

        ton:
            "Pozitif",

        tarih:
            "2026-09-02T14:00",

        link:
            "#",

        gorsel:
            "https://images.unsplash.com/photo-1518770660439-4636190af475",

        okundu:
            false,

        favori:
            false,

        tepkiler: {

            sasirdim:
                12,

            kizdim:
                4,

            begendim:
                30

        }

    },


    {

        id:
            "mock_002",

        baslik:
            "Piyasalarda hareketli gün",

        ozet:
            "Döviz ve altın piyasalarında gün içerisinde önemli hareketlilik yaşandı.",

        kaynak:
            "Finans Gündem",

        kaynakSayisi:
            4,

        il:
            "Ankara",

        kategori:
            "Finans",

        ton:
            "Nötr",

        tarih:
            "2026-09-02T13:30",

        link:
            "#",

        gorsel:
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",

        okundu:
            false,

        favori:
            false,

        tepkiler: {

            sasirdim:
                8,

            kizdim:
                2,

            begendim:
                21

        }

    },


    {

        id:
            "mock_003",

        baslik:
            "Milli takım kritik mücadeleye hazırlanıyor",

        ozet:
            "Milli takım önemli karşılaşma öncesi hazırlıklarını sürdürüyor.",

        kaynak:
            "Spor Haber",

        kaynakSayisi:
            5,

        il:
            "İzmir",

        kategori:
            "Spor",

        ton:
            "Duygusal",

        tarih:
            "2026-09-02T12:45",

        link:
            "#",

        gorsel:
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",

        okundu:
            false,

        favori:
            false,

        tepkiler: {

            sasirdim:
                18,

            kizdim:
                3,

            begendim:
                42

        }

    }

];


// ============================================================
// KATEGORİ MAP
// ============================================================

const kategoriMap = {

    "Tümü":
        null,

    "Gündem":
        "top",

    "Spor":
        "sports",

    "Finans":
        "business",

    "Siyaset":
        "politics",

    "Teknoloji":
        "technology",

    "Dünya":
        "world",

    "Magazin":
        "entertainment"

};


// ============================================================
// API KATEGORİ → KYHABER KATEGORİ
// ============================================================

const apiKategoriMap = {

    top:
        "Gündem",

    sports:
        "Spor",

    sport:
        "Spor",

    business:
        "Finans",

    politics:
        "Siyaset",

    technology:
        "Teknoloji",

    tech:
        "Teknoloji",

    world:
        "Dünya",

    entertainment:
        "Magazin"

};


function apiKategorisiniDonustur(

    kategoriKodlari,

    istenenKategori = "Tümü"

) {

    if (

        istenenKategori &&

        istenenKategori !== "Tümü" &&

        kategoriMap[istenenKategori]

    ) {

        return istenenKategori;

    }


    if (
        !Array.isArray(kategoriKodlari)
    ) {

        return "Gündem";

    }


    for (
        const kod of kategoriKodlari
    ) {

        const temizKod =

            String(kod || "")
                .trim()
                .toLowerCase();


        if (
            apiKategoriMap[temizKod]
        ) {

            return apiKategoriMap[
                temizKod
            ];

        }

    }


    return "Gündem";

}


// ============================================================
// İL ALTERNATİFLERİ
// ============================================================

const ilAlternatifleri = {

    "Adana":
        ["Adana"],

    "Adıyaman":
        ["Adıyaman"],

    "Afyonkarahisar":
        ["Afyonkarahisar", "Afyon"],

    "Ağrı":
        ["Ağrı"],

    "Aksaray":
        ["Aksaray"],

    "Amasya":
        ["Amasya"],

    "Ankara":
        ["Ankara"],

    "Antalya":
        ["Antalya"],

    "Ardahan":
        ["Ardahan"],

    "Artvin":
        ["Artvin"],

    "Aydın":
        ["Aydın"],

    "Balıkesir":
        ["Balıkesir"],

    "Bartın":
        ["Bartın"],

    "Batman":
        ["Batman"],

    "Bayburt":
        ["Bayburt"],

    "Bilecik":
        ["Bilecik"],

    "Bingöl":
        ["Bingöl"],

    "Bitlis":
        ["Bitlis"],

    "Bolu":
        ["Bolu"],

    "Burdur":
        ["Burdur"],

    "Bursa":
        ["Bursa"],

    "Çanakkale":
        ["Çanakkale"],

    "Çankırı":
        ["Çankırı"],

    "Çorum":
        ["Çorum"],

    "Denizli":
        ["Denizli"],

    "Diyarbakır":
        ["Diyarbakır", "Diyarbakir"],

    "Düzce":
        ["Düzce"],

    "Edirne":
        ["Edirne"],

    "Elazığ":
        ["Elazığ", "Elazig"],

    "Erzincan":
        ["Erzincan"],

    "Erzurum":
        ["Erzurum"],

    "Eskişehir":
        ["Eskişehir", "Eskisehir"],

    "Gaziantep":
        ["Gaziantep"],

    "Giresun":
        ["Giresun"],

    "Gümüşhane":
        ["Gümüşhane", "Gumushane"],

    "Hakkari":
        ["Hakkari"],

    "Hatay":
        ["Hatay"],

    "Iğdır":
        ["Iğdır", "Igdir"],

    "Isparta":
        ["Isparta"],

    "İstanbul":
        ["İstanbul", "Istanbul"],

    "İzmir":
        ["İzmir", "Izmir"],

    "Kahramanmaraş":
        ["Kahramanmaraş", "Kahramanmaras"],

    "Karabük":
        ["Karabük", "Karabuk"],

    "Karaman":
        ["Karaman"],

    "Kars":
        ["Kars"],

    "Kastamonu":
        ["Kastamonu"],

    "Kayseri":
        ["Kayseri"],

    "Kilis":
        ["Kilis"],

    "Kırıkkale":
        ["Kırıkkale", "Kirikkale"],

    "Kırklareli":
        ["Kırklareli", "Kirklareli"],

    "Kırşehir":
        ["Kırşehir", "Kirsehir"],

    "Kocaeli":
        ["Kocaeli", "İzmit", "Izmit"],

    "Konya":
        ["Konya"],

    "Kütahya":
        ["Kütahya", "Kutahya"],

    "Malatya":
        ["Malatya"],

    "Manisa":
        ["Manisa"],

    "Mardin":
        ["Mardin"],

    "Mersin":
        ["Mersin"],

    "Muğla":
        [
            "Muğla",
            "Mugla",
            "Bodrum",
            "Fethiye",
            "Marmaris"
        ],

    "Muş":
        ["Muş", "Mus"],

    "Nevşehir":
        ["Nevşehir", "Nevsehir"],

    "Niğde":
        ["Niğde", "Nigde"],

    "Ordu":
        ["Ordu"],

    "Osmaniye":
        ["Osmaniye"],

    "Rize":
        ["Rize"],

    "Sakarya":
        [
            "Sakarya",
            "Adapazarı",
            "Adapazari"
        ],

    "Samsun":
        ["Samsun"],

    "Siirt":
        ["Siirt"],

    "Sinop":
        ["Sinop"],

    "Sivas":
        ["Sivas"],

    "Şanlıurfa":
        [
            "Şanlıurfa",
            "Sanliurfa",
            "Urfa"
        ],

    "Şırnak":
        [
            "Şırnak",
            "Sirnak"
        ],

    "Tekirdağ":
        [
            "Tekirdağ",
            "Tekirdag"
        ],

    "Tokat":
        ["Tokat"],

    "Trabzon":
        ["Trabzon"],

    "Tunceli":
        ["Tunceli"],

    "Uşak":
        [
            "Uşak",
            "Usak"
        ],

    "Van":
        ["Van"],

    "Yalova":
        ["Yalova"],

    "Yozgat":
        ["Yozgat"],

    "Zonguldak":
        ["Zonguldak"]

};


// ============================================================
// URL OLUŞTUR
// ============================================================

function haberApiUrlOlustur({

    kategori =
        "Tümü",

    il =
        "",

    arama =
        "",

    page =
        null

} = {}) {

    const params =
        new URLSearchParams();


    // ========================================================
    // CLOUDFLARE WORKER
    // ========================================================

    params.set(
        "return",
        "news"
    );


    // ========================================================
    // KATEGORİ
    // ========================================================

    const apiKategori =
        kategoriMap[kategori];


    if (apiKategori) {

        params.set(
            "category",
            apiKategori
        );

    }


    // ========================================================
    // ARAMA
    // ========================================================

    const temizIl =

        il
            ? String(il).trim()
            : "";


    const temizArama =

        arama
            ? String(arama).trim()
            : "";


    if (
        temizIl &&
        temizArama
    ) {

        params.set(
            "q",
            `${temizIl} ${temizArama}`
        );

    }

    else if (temizIl) {

        params.set(
            "q",
            temizIl
        );

    }

    else if (temizArama) {

        params.set(
            "q",
            temizArama
        );

    }


    // ========================================================
    // PAGINATION
    // ========================================================

    if (page) {

        params.set(
            "page",
            page
        );

    }


    return (

        `${API_CONFIG.baseUrl}?` +

        params.toString()

    );

}


// ============================================================
// FETCH
// ============================================================

async function apiIstegiYap(url) {

    const controller =
        new AbortController();


    const timeout =
        setTimeout(

            () => {

                controller.abort();

            },

            API_CONFIG.timeout

        );


    try {

        const response =
            await fetch(

                url,

                {

                    method:
                        "GET",

                    signal:
                        controller.signal,

                    headers: {

                        Accept:
                            "application/json"

                    }

                }

            );


        clearTimeout(
            timeout
        );


        let data =
            null;


        try {

            data =
                await response.json();

        } catch {

            data =
                null;

        }


        if (!response.ok) {

            const mesaj =

                data?.results?.message ||

                data?.message ||

                data?.hata ||

                `HTTP ${response.status}`;


            throw new Error(
                mesaj
            );

        }


        if (
            data?.status ===
            "error"
        ) {

            throw new Error(

                data?.results?.message ||

                data?.message ||

                data?.hata ||

                "NewsData API hata döndürdü."

            );

        }


        return data;

    } catch (error) {

        clearTimeout(
            timeout
        );


        if (
            error.name ===
            "AbortError"
        ) {

            throw new Error(
                "Haber API isteği zaman aşımına uğradı."
            );

        }


        throw error;

    }

}


// ============================================================
// KARARLI HABER ID
// ============================================================

function kararliHaberIdOlustur(haber) {

    if (
        haber?.article_id
    ) {

        return (
            `news_${haber.article_id}`
        );

    }


    const kaynak =

        haber?.source_id ||

        haber?.source_name ||

        "kaynak";


    const link =

        haber?.link ||

        "";


    const baslik =

        haber?.title ||

        "";


    const tarih =

        haber?.pubDate ||

        "";


    const ham =
        `${kaynak}|${link}|${baslik}|${tarih}`;


    let hash =
        0;


    for (
        let i = 0;
        i < ham.length;
        i++
    ) {

        hash =

            (
                (hash << 5) -
                hash
            ) +
            ham.charCodeAt(i);


        hash |=
            0;

    }


    return (
        `news_${Math.abs(hash)}`
    );

}


// ============================================================
// NEWS DATA HABER DÖNÜŞTÜR
// ============================================================

function newsDataHaberiDonustur(

    haber,

    istenenKategori =
        "Tümü"

) {

    if (!haber) {

        return null;

    }


    const kategoriKodlari =

        Array.isArray(
            haber.category
        )

            ? haber.category

            : [];


    const kategori =

        apiKategorisiniDonustur(

            kategoriKodlari,

            istenenKategori

        );


    const sentiment =

        String(
            haber.sentiment || ""
        ).toLowerCase();


    let ton =
        "Nötr";


    if (
        sentiment ===
        "positive"
    ) {

        ton =
            "Pozitif";

    }

    else if (
        sentiment ===
        "negative"
    ) {

        ton =
            "Negatif";

    }


    const id =
        kararliHaberIdOlustur(
            haber
        );


    return {

        id,

        kaynakId:
            haber.article_id ||
            "",

        baslik:
            haber.title ||
            "Başlıksız haber",

        ozet:
            haber.description ||
            haber.ai_summary ||
            "Bu haber için açıklama bulunmuyor.",

        kaynak:
            haber.source_name ||
            haber.source_id ||
            "Bilinmeyen kaynak",

        kaynakSayisi:
            1,

        il:
            "",

        kategori,

        ton,

        tarih:
            haber.pubDate ||
            new Date().toISOString(),

        link:
            haber.link ||
            "#",

        gorsel:
            haber.image_url ||
            "",

        okundu:
            false,

        favori:
            false,

        tepkiler: {

            sasirdim:
                0,

            kizdim:
                0,

            begendim:
                0

        },


        apiData: {

            article_id:
                haber.article_id ||
                "",

            source_id:
                haber.source_id ||
                "",

            source_name:
                haber.source_name ||
                "",

            source_url:
                haber.source_url ||
                "",

            category:

                Array.isArray(
                    haber.category
                )

                    ? haber.category

                    : [],

            country:

                Array.isArray(
                    haber.country
                )

                    ? haber.country

                    : [],

            language:
                haber.language ||
                "",

            sentiment:
                haber.sentiment ||
                ""

        }

    };

}


// ============================================================
// TEK SAYFA GETİR
// ============================================================

async function newsDataSayfaGetir(
    options = {}
) {

    const url =
        haberApiUrlOlustur(
            options
        );


    const cached =
        cacheGetir(
            url
        );


    if (cached) {

        return cached;

    }


    const response =
        await apiIstegiYap(
            url
        );


    cacheKaydet(
        url,
        response
    );


    return response;

}


// ============================================================
// GENEL SAYFALI HABER GETİRME
// ============================================================

async function newsDataHaberleriGetir(
    options = {}
) {

    const {

        kategori =
            "Tümü",

        il =
            "",

        arama =
            "",

        maxPages =
            API_CONFIG.maxPages

    } =
        options;


    const haberler =
        [];


    const benzersizIdler =
        new Set();


    let page =
        null;


    for (

        let sayfa = 0;

        sayfa < maxPages;

        sayfa++

    ) {

        const response =

            await newsDataSayfaGetir({

                kategori,

                il,

                arama,

                page

            });


        const results =

            Array.isArray(
                response?.results
            )

                ? response.results

                : [];


        results.forEach(

            rawHaber => {

                const haber =

                    newsDataHaberiDonustur(

                        rawHaber,

                        kategori

                    );


                if (
                    !haber
                ) {

                    return;

                }


                if (
                    benzersizIdler.has(
                        haber.id
                    )
                ) {

                    return;

                }


                benzersizIdler.add(
                    haber.id
                );


                haberler.push(
                    haber
                );

            }

        );


        if (
            haberler.length >=
            API_CONFIG.maxNews
        ) {

            break;

        }


        const sonrakiSayfa =
            response?.nextPage;


        if (!sonrakiSayfa) {

            break;

        }


        page =
            sonrakiSayfa;

    }


    return haberler.slice(

        0,

        API_CONFIG.maxNews

    );

}


// ============================================================
// ŞEHİR HABERLERİ
// ============================================================

async function sehirHaberleriniGetir(
    options = {}
) {

    const {

        kategori =
            "Tümü",

        il =
            "",

        arama =
            ""

    } =
        options;


    if (!il) {

        return [];

    }


    const alternatifler =

        ilAlternatifleri[il] ||

        [il];


    const haberler =
        [];


    const benzersizIdler =
        new Set();


    try {

        const direct =

            await newsDataHaberleriGetir({

                kategori,

                il:
                    alternatifler[0],

                arama,

                maxPages:
                    2

            });


        direct.forEach(

            haber => {

                if (
                    !haber ||
                    benzersizIdler.has(
                        haber.id
                    )
                ) {

                    return;

                }


                benzersizIdler.add(
                    haber.id
                );


                haber.il =
                    il;


                haberler.push(
                    haber
                );

            }

        );

    } catch (error) {

        console.warn(

            `${il} doğrudan sorgusunda hata:`,

            error

        );

    }


    for (

        let i = 1;

        i < alternatifler.length;

        i++

    ) {

        if (
            haberler.length >=
            API_CONFIG.maxNews
        ) {

            break;

        }


        try {

            const alternatifHaberler =

                await newsDataHaberleriGetir({

                    kategori,

                    il:
                        alternatifler[i],

                    arama,

                    maxPages:
                        1

                });


            alternatifHaberler.forEach(

                haber => {

                    if (
                        !haber ||
                        benzersizIdler.has(
                            haber.id
                        )
                    ) {

                        return;

                    }


                    benzersizIdler.add(
                        haber.id
                    );


                    haber.il =
                        il;


                    haberler.push(
                        haber
                    );

                }

            );

        } catch (error) {

            console.warn(

                `${alternatifler[i]} sorgusunda hata:`,

                error

            );

        }

    }


    return haberler.slice(

        0,

        API_CONFIG.maxNews

    );

}


// ============================================================
// ANA HABER GETİRME
// ============================================================

async function haberleriGetir(
    options = {}
) {

    const {

        kategori =
            "Tümü",

        il =
            "",

        arama =
            ""

    } =
        options;


    if (il) {

        return sehirHaberleriniGetir({

            kategori,

            il,

            arama

        });

    }


    try {

        const haberler =

            await newsDataHaberleriGetir({

                kategori,

                il:
                    "",

                arama,

                maxPages:
                    API_CONFIG.maxPages

            });


        if (
            haberler.length > 0
        ) {

            return haberler;

        }

    } catch (error) {

        console.error(

            "NewsData API hatası:",

            error

        );

    }


    return MOCK_HABERLER.filter(

        haber => {

            const kategoriUygun =

                kategori ===
                "Tümü" ||

                haber.kategori ===
                kategori;


            const aramaUygun =

                !arama ||

                haber.baslik

                    .toLocaleLowerCase(
                        "tr-TR"
                    )

                    .includes(

                        arama

                            .toLocaleLowerCase(
                                "tr-TR"
                            )

                    );


            return (

                kategoriUygun &&

                aramaUygun

            );

        }

    );

}


// ============================================================
// GERÇEK HABERLER
// ============================================================

async function gercekHaberleriGetir(
    options = {}
) {

    const {

        kategori =
            "Tümü",

        il =
            "",

        arama =
            ""

    } =
        options;


    if (il) {

        return sehirHaberleriniGetir({

            kategori,

            il,

            arama

        });

    }


    return newsDataHaberleriGetir({

        kategori,

        il:
            "",

        arama,

        maxPages:
            API_CONFIG.maxPages

    });

}


// ============================================================
// KATEGORİ GETİR
// ============================================================

function haberKategoriGetir(haber) {

    return (

        haber?.kategori ||

        "Gündem"

    );

}


// ============================================================
// İL GETİR
// ============================================================

function haberIlGetir(haber) {

    return (

        haber?.il ||

        ""

    );

}


// ============================================================
// KAYNAK GETİR
// ============================================================

function haberKaynakGetir(haber) {

    return (

        haber?.kaynak ||

        "Bilinmeyen kaynak"

    );

}


// ============================================================
// FİNANS
// ============================================================

const FINANS_CONFIG = {

    baseUrl:
        "https://www.getmidas.com/wp-json/midas-api/v1/midas_table_data",

    timeout:
        8000,

    cacheKey:
        "kyhaber_finans_cache_v1",

    bistGecikmeDakika:
        15

};


// ============================================================
// FİNANS — TEK BİR MIDAS ENDPOINT'İNİ ÇEK
// ============================================================

async function finansEndpointGetir(returnTuru) {

    const controller =
        new AbortController();


    const timeout =
        setTimeout(
            () => controller.abort(),
            FINANS_CONFIG.timeout
        );


    try {

        const url =
            `${FINANS_CONFIG.baseUrl}?sortId=&return=${returnTuru}`;


        const response =
            await fetch(
                url,
                {
                    method:
                        "GET",

                    signal:
                        controller.signal,

                    headers: {
                        Accept:
                            "application/json"
                    }
                }
            );


        clearTimeout(timeout);


        if (!response.ok) {

            throw new Error(
                `Finans verisi alınamadı (${returnTuru}): HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                `Finans verisi beklenmeyen formatta (${returnTuru})`
            );

        }


        return data;

    } catch (error) {

        clearTimeout(timeout);

        throw error;

    }

}


// ============================================================
// FİNANS — LİSTE İÇİNDEN KOD/İSİMLE KAYIT BUL
// ============================================================

function finansKaydiBul(liste, eslesenler) {

    return liste.find(kayit => {

        const kod =
            String(
                kayit?.Code || ""
            ).toUpperCase();


        const isim =
            String(
                kayit?.Name || ""
            ).toUpperCase();


        return eslesenler.some(
            aranan =>
                kod === aranan ||
                isim.includes(aranan)
        );

    }) || null;

}


// ============================================================
// FİNANS — GRAM ALTIN KAYDINI BUL
// ============================================================

function finansGramAltinKaydiBul(liste) {

    const tamEslesme =
        liste.find(kayit => {

            const isim =
                String(
                    kayit?.Name || ""
                ).toUpperCase();


            return (

                isim ===
                "ALTIN (GRAM)" ||

                isim ===
                "GRAM ALTIN"

            );

        });


    if (tamEslesme) {

        return tamEslesme;

    }


    return liste.find(kayit => {

        const isim =
            String(
                kayit?.Name || ""
            ).toUpperCase();


        const ayarVeyaBilezikMi =

            isim.includes("AYAR") ||

            isim.includes("BİLEZİK") ||

            isim.includes("BILEZIK");


        return (

            isim.includes("GRAM") &&

            !ayarVeyaBilezikMi

        );

    }) || null;

}


// ============================================================
// FİNANS — KAYITTAN GÖSTERİM OBJESİ ÜRET
// ============================================================

function finansKaydiDonustur(kayit, sembol) {

    if (

        !kayit ||

        typeof kayit.Last !== "number" ||

        !Number.isFinite(
            kayit.Last
        )

    ) {

        return null;

    }


    const degisim =

        typeof kayit.DailyChangePercent ===
        "number"

            ? kayit.DailyChangePercent

            : 0;


    return {

        deger:
            kayit.Last,

        sembol,

        degisim,

        yon:

            degisim > 0

                ? "up"

                : degisim < 0

                    ? "down"

                    : "neutral"

    };

}


// ============================================================
// FİNANS — ÖNBELLEK
// ============================================================

function finansOnbellekYaz(finans) {

    try {

        localStorage.setItem(

            FINANS_CONFIG.cacheKey,

            JSON.stringify({

                finans,

                zaman:
                    Date.now()

            })

        );

    } catch (error) {

        console.warn(

            "Finans önbelleği yazılamadı:",

            error

        );

    }

}


function finansOnbellekOku() {

    try {

        const ham =
            localStorage.getItem(
                FINANS_CONFIG.cacheKey
            );


        if (!ham) {

            return null;

        }


        const parsed =
            JSON.parse(ham);


        if (

            !parsed ||

            !parsed.finans ||

            !parsed.zaman

        ) {

            return null;

        }


        return parsed;

    } catch (error) {

        return null;

    }

}


// ============================================================
// FİNANS — ANA FONKSİYON
// ============================================================

async function finansVerisiniHazirla() {

    try {

        const [

            doviz,

            table,

            altin

        ] =

            await Promise.all([

                finansEndpointGetir(
                    "doviz"
                ),

                finansEndpointGetir(
                    "table"
                ),

                finansEndpointGetir(
                    "altin"
                )

            ]);


        const usdKaydi =
            finansKaydiBul(

                doviz,

                [
                    "USDTRY"
                ]

            );


        const eurKaydi =
            finansKaydiBul(

                doviz,

                [
                    "EURTRY"
                ]

            );


        const bistKaydi =
            finansKaydiBul(

                table,

                [
                    "XU100",
                    "BIST 100"
                ]

            );


        const altinKaydi =
            finansGramAltinKaydiBul(
                altin
            );


        const finans = {

            dolar:

                finansKaydiDonustur(

                    usdKaydi,

                    "$"

                ),

            euro:

                finansKaydiDonustur(

                    eurKaydi,

                    "€"

                ),

            altin:

                finansKaydiDonustur(

                    altinKaydi,

                    "₺"

                ),

            bist:

                finansKaydiDonustur(

                    bistKaydi,

                    ""

                )

        };


        const hicVeriYok =

            !finans.dolar &&

            !finans.euro &&

            !finans.altin &&

            !finans.bist;


        if (hicVeriYok) {

            throw new Error(

                "Finans kaynağından hiçbir değer ayrıştırılamadı."

            );

        }


        finansOnbellekYaz(
            finans
        );


        return {

            finans,

            kaynak:
                "canli",

            zaman:
                Date.now()

        };

    } catch (error) {

        console.warn(

            "Finans verisi canlı alınamadı, önbellek deneniyor:",

            error

        );


        const onbellek =
            finansOnbellekOku();


        if (onbellek) {

            return {

                finans:
                    onbellek.finans,

                kaynak:
                    "onbellek",

                zaman:
                    onbellek.zaman

            };

        }


        throw error;

    }

}


// ============================================================
// FİNANS DEĞER FORMATLA
// ============================================================

function finansDegeriniFormatla(

    deger,

    decimal = 2

) {

    if (

        typeof deger !==
            "number" ||

        !Number.isFinite(
            deger
        )

    ) {

        return "-";

    }


    return new Intl.NumberFormat(

        "tr-TR",

        {

            minimumFractionDigits:
                decimal,

            maximumFractionDigits:
                decimal

        }

    ).format(

        deger

    );

}


// ============================================================
// FİNANS DEĞİŞİM FORMATLA
// ============================================================

function finansDegisiminiFormatla(
    degisim
) {

    if (

        typeof degisim !==
            "number" ||

        !Number.isFinite(
            degisim
        )

    ) {

        return "-";

    }


    const isaret =

        degisim > 0

            ? "+"

            : "";


    return (

        `${isaret}${degisim.toFixed(2)}%`

    );

}


// ============================================================
// EXPORT
// ============================================================

export {

    haberleriGetir,

    gercekHaberleriGetir,

    haberKategoriGetir,

    haberIlGetir,

    haberKaynakGetir,

    finansVerisiniHazirla,

    finansDegeriniFormatla,

    finansDegisiminiFormatla

};
