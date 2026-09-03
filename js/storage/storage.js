// ============================================================
// KYHABER STORAGE
// ============================================================

const STORAGE_KEYS = {

    seciliIl: "kyhaber_secili_il",

    seciliKategori: "kyhaber_secili_kategori",

    favoriler: "kyhaber_favoriler",

    favoriHaberVerileri:
        "kyhaber_favori_haber_verileri",

    favoriIller:
        "kyhaber_favori_iller",

    favoriKategoriler:
        "kyhaber_favori_kategoriler",

    okunanHaberler:
        "kyhaber_okunan_haberler",

    okumaListesi:
        "kyhaber_okuma_listesi",

    okumaListesiHaberVerileri:
        "kyhaber_okuma_listesi_haber_verileri",

    tema:
        "kyhaber_tema",

    fontSize:
        "kyhaber_font_size"

};


// ============================================================
// GÜVENLİ JSON OKUMA
// ============================================================

function listeGetir(key) {

    const veriler =
        localStorage.getItem(key);

    if (!veriler) {
        return [];
    }

    try {

        const parsed =
            JSON.parse(veriler);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.warn(
            `KYHaber liste verisi okunamadı: ${key}`,
            error
        );

        return [];

    }

}


// ============================================================
// GÜVENLİ OBJE OKUMA
// ============================================================

function objeGetir(key) {

    const veriler =
        localStorage.getItem(key);

    if (!veriler) {
        return {};
    }

    try {

        const parsed =
            JSON.parse(veriler);

        return (
            parsed &&
            typeof parsed === "object" &&
            !Array.isArray(parsed)
        )
            ? parsed
            : {};

    } catch (error) {

        console.warn(
            `KYHaber obje verisi okunamadı: ${key}`,
            error
        );

        return {};

    }

}


// ============================================================
// LİSTE KAYDET
// ============================================================

function listeKaydet(key, liste) {

    if (!Array.isArray(liste)) {
        return false;
    }

    try {

        localStorage.setItem(
            key,
            JSON.stringify(liste)
        );

        return true;

    } catch (error) {

        console.warn(
            `KYHaber liste kaydedilemedi: ${key}`,
            error
        );

        return false;

    }

}


// ============================================================
// OBJE KAYDET
// ============================================================

function objeKaydet(key, obje) {

    if (
        !obje ||
        typeof obje !== "object" ||
        Array.isArray(obje)
    ) {

        return false;

    }

    try {

        localStorage.setItem(
            key,
            JSON.stringify(obje)
        );

        return true;

    } catch (error) {

        console.warn(
            `KYHaber obje kaydedilemedi: ${key}`,
            error
        );

        return false;

    }

}


// ============================================================
// ŞEHİR
// ============================================================

function seciliIlKaydet(il) {

    if (typeof il !== "string") {
        return;
    }

    localStorage.setItem(
        STORAGE_KEYS.seciliIl,
        il.trim()
    );

}


function seciliIlGetir() {

    return (
        localStorage.getItem(
            STORAGE_KEYS.seciliIl
        ) || ""
    );

}


function seciliIlSil() {

    localStorage.removeItem(
        STORAGE_KEYS.seciliIl
    );

}


// ============================================================
// KATEGORİ
// ============================================================

function seciliKategoriKaydet(kategori) {

    if (typeof kategori !== "string") {
        return;
    }

    localStorage.setItem(
        STORAGE_KEYS.seciliKategori,
        kategori.trim()
    );

}


function seciliKategoriGetir() {

    return (
        localStorage.getItem(
            STORAGE_KEYS.seciliKategori
        ) || "Tümü"
    );

}


// ============================================================
// FAVORİLERİ GETİR
// ============================================================

function favorileriGetir() {

    return listeGetir(
        STORAGE_KEYS.favoriler
    );

}


// ============================================================
// FAVORİ HABER VERİLERİNİ GETİR
// ============================================================

function favoriHaberVerileriniGetir() {

    return objeGetir(
        STORAGE_KEYS.favoriHaberVerileri
    );

}


// ============================================================
// FAVORİ HABERLERİNİ GETİR
// ============================================================

function favoriHaberleriniGetir() {

    const favoriIdler =
        favorileriGetir();

    const haberVerileri =
        favoriHaberVerileriniGetir();


    return favoriIdler

        .map(id => {

            const haber =
                haberVerileri[id];

            if (
                haber &&
                typeof haber === "object"
            ) {

                return haber;

            }

            return null;

        })

        .filter(Boolean);

}


// ============================================================
// FAVORİYE EKLE
// ============================================================

function favoriyeEkle(
    haberVeyaId,
    haberVerisi = null
) {

    let haberId = "";
    let haber = null;


    // --------------------------------------------------------
    // NESNE GELDİ
    // --------------------------------------------------------

    if (
        haberVeyaId &&
        typeof haberVeyaId === "object"
    ) {

        haber =
            haberVeyaId;

        haberId =
            haber.id;

    }

    // --------------------------------------------------------
    // ID GELDİ
    // --------------------------------------------------------

    else {

        haberId =
            haberVeyaId;

        haber =
            haberVerisi;

    }


    if (!haberId) {
        return false;
    }


    // --------------------------------------------------------
    // FAVORİ ID LİSTESİ
    // --------------------------------------------------------

    const favoriler =
        favorileriGetir();


    if (
        !favoriler.includes(haberId)
    ) {

        favoriler.push(
            haberId
        );

        listeKaydet(
            STORAGE_KEYS.favoriler,
            favoriler
        );

    }


    // --------------------------------------------------------
    // HABERİN TAM VERİSİNİ KAYDET
    // --------------------------------------------------------

    if (
        haber &&
        typeof haber === "object"
    ) {

        const haberVerileri =
            favoriHaberVerileriniGetir();


        haberVerileri[haberId] =
            {
                ...haber
            };


        objeKaydet(
            STORAGE_KEYS.favoriHaberVerileri,
            haberVerileri
        );

    }


    return true;

}


// ============================================================
// FAVORİDEN ÇIKAR
// ============================================================

function favoridenCikar(haberId) {

    if (!haberId) {
        return false;
    }


    // --------------------------------------------------------
    // FAVORİ LİSTESİNDEN SİL
    // --------------------------------------------------------

    const favoriler =
        favorileriGetir();


    const yeniFavoriler =
        favoriler.filter(
            id =>
                id !== haberId
        );


    listeKaydet(
        STORAGE_KEYS.favoriler,
        yeniFavoriler
    );


    // --------------------------------------------------------
    // HABER VERİSİNİ SİL
    // --------------------------------------------------------

    const haberVerileri =
        favoriHaberVerileriniGetir();


    delete haberVerileri[
        haberId
    ];


    objeKaydet(
        STORAGE_KEYS.favoriHaberVerileri,
        haberVerileri
    );


    return true;

}


// ============================================================
// FAVORİ Mİ?
// ============================================================

function favoriMi(haberId) {

    if (!haberId) {
        return false;
    }

    return favorileriGetir()
        .includes(haberId);

}


// ============================================================
// FAVORİ SAYISI
// ============================================================

function favoriSayisiniGetir() {

    return favorileriGetir().length;

}


// ============================================================
// FAVORİ ŞEHİRLER
// ============================================================

function favoriIlleriGetir() {

    return listeGetir(
        STORAGE_KEYS.favoriIller
    );

}


function favoriIlEkle(il) {

    if (
        typeof il !== "string" ||
        !il.trim()
    ) {

        return;

    }


    const temizIl =
        il.trim();


    const favoriIller =
        favoriIlleriGetir();


    if (
        !favoriIller.includes(
            temizIl
        )
    ) {

        favoriIller.push(
            temizIl
        );


        listeKaydet(
            STORAGE_KEYS.favoriIller,
            favoriIller
        );

    }

}


function favoriIlKaydet(il) {

    favoriIlEkle(il);

}


function favoriIlSil(il) {

    const favoriIller =
        favoriIlleriGetir();


    const yeniListe =
        favoriIller.filter(
            item =>
                item !== il
        );


    listeKaydet(
        STORAGE_KEYS.favoriIller,
        yeniListe
    );

}


function favoriIlMi(il) {

    return favoriIlleriGetir()
        .includes(il);

}


// ============================================================
// FAVORİ KATEGORİLER
// ============================================================

function favoriKategorileriGetir() {

    return listeGetir(
        STORAGE_KEYS.favoriKategoriler
    );

}


function favoriKategoriEkle(kategori) {

    if (
        typeof kategori !== "string" ||
        !kategori.trim()
    ) {

        return;

    }


    const temizKategori =
        kategori.trim();


    const favoriKategoriler =
        favoriKategorileriGetir();


    if (
        !favoriKategoriler.includes(
            temizKategori
        )
    ) {

        favoriKategoriler.push(
            temizKategori
        );


        listeKaydet(
            STORAGE_KEYS.favoriKategoriler,
            favoriKategoriler
        );

    }

}


function favoriKategoriKaydet(kategori) {

    favoriKategoriEkle(kategori);

}


function favoriKategoriSil(kategori) {

    const favoriKategoriler =
        favoriKategorileriGetir();


    const yeniListe =
        favoriKategoriler.filter(
            item =>
                item !== kategori
        );


    listeKaydet(
        STORAGE_KEYS.favoriKategoriler,
        yeniListe
    );

}


function favoriKategoriMi(kategori) {

    return favoriKategorileriGetir()
        .includes(kategori);

}


// ============================================================
// OKUNAN HABERLER
// ============================================================

function okunanHaberleriGetir() {

    return listeGetir(
        STORAGE_KEYS.okunanHaberler
    );

}


function haberOkundu(haberId) {

    if (!haberId) {
        return;
    }


    const okunanlar =
        okunanHaberleriGetir();


    if (
        !okunanlar.includes(
            haberId
        )
    ) {

        okunanlar.push(
            haberId
        );


        listeKaydet(
            STORAGE_KEYS.okunanHaberler,
            okunanlar
        );

    }

}


function haberOkunduMu(haberId) {

    return okunanHaberleriGetir()
        .includes(haberId);

}


// ============================================================
// OKUMA LİSTESİ
// ============================================================

function okumaListesiniGetir() {

    return listeGetir(
        STORAGE_KEYS.okumaListesi
    );

}


function okumaListesiHaberVerileriniGetir() {

    return objeGetir(
        STORAGE_KEYS.okumaListesiHaberVerileri
    );

}


function okumaListesiHaberleriniGetir() {

    const liste =
        okumaListesiniGetir();


    const haberVerileri =
        okumaListesiHaberVerileriniGetir();


    return liste

        .map(id => {

            const haber =
                haberVerileri[id];

            if (
                haber &&
                typeof haber === "object"
            ) {

                return haber;

            }

            return null;

        })

        .filter(Boolean);

}


// ============================================================
// OKUMA LİSTESİNE EKLE
// ============================================================

function okumaListesineEkle(
    haberVeyaId,
    haberVerisi = null
) {

    let haberId = "";
    let haber = null;


    if (
        haberVeyaId &&
        typeof haberVeyaId === "object"
    ) {

        haber =
            haberVeyaId;

        haberId =
            haber.id;

    }

    else {

        haberId =
            haberVeyaId;

        haber =
            haberVerisi;

    }


    if (!haberId) {
        return false;
    }


    const liste =
        okumaListesiniGetir();


    if (!liste.includes(haberId)) {

        liste.push(
            haberId
        );


        listeKaydet(
            STORAGE_KEYS.okumaListesi,
            liste
        );

    }


    if (
        haber &&
        typeof haber === "object"
    ) {

        const haberVerileri =
            okumaListesiHaberVerileriniGetir();


        haberVerileri[haberId] =
            {
                ...haber
            };


        objeKaydet(
            STORAGE_KEYS.okumaListesiHaberVerileri,
            haberVerileri
        );

    }


    return true;

}


// ============================================================
// OKUMA LİSTESİNDEN SİL
// ============================================================

function okumaListesindenSil(haberId) {

    if (!haberId) {
        return false;
    }


    const liste =
        okumaListesiniGetir();


    const yeniListe =
        liste.filter(
            id =>
                id !== haberId
        );


    listeKaydet(
        STORAGE_KEYS.okumaListesi,
        yeniListe
    );


    const haberVerileri =
        okumaListesiHaberVerileriniGetir();


    delete haberVerileri[
        haberId
    ];


    objeKaydet(
        STORAGE_KEYS.okumaListesiHaberVerileri,
        haberVerileri
    );


    return true;

}


// ============================================================
// OKUMA LİSTESİNDE Mİ?
// ============================================================

function okumaListesindeMi(haberId) {

    if (!haberId) {
        return false;
    }

    return okumaListesiniGetir()
        .includes(haberId);

}


// ============================================================
// TEMA
// ============================================================

function temaKaydet(tema) {

    const gecerliTema =
        tema === "light"
            ? "light"
            : "dark";


    localStorage.setItem(
        STORAGE_KEYS.tema,
        gecerliTema
    );

}


function temaGetir() {

    const tema =
        localStorage.getItem(
            STORAGE_KEYS.tema
        );


    return tema === "light"
        ? "light"
        : "dark";

}


// ============================================================
// FONT SIZE
// ============================================================

function fontSizeKaydet(fontSize) {

    const gecerliBoyut =
        [
            "small",
            "normal",
            "large"
        ].includes(fontSize)

            ? fontSize

            : "normal";


    localStorage.setItem(
        STORAGE_KEYS.fontSize,
        gecerliBoyut
    );

}


function fontSizeGetir() {

    const fontSize =
        localStorage.getItem(
            STORAGE_KEYS.fontSize
        );


    return [
        "small",
        "normal",
        "large"
    ].includes(fontSize)

        ? fontSize

        : "normal";

}


// ============================================================
// EXPORT
// ============================================================

export {

    seciliIlKaydet,
    seciliIlGetir,
    seciliIlSil,

    seciliKategoriKaydet,
    seciliKategoriGetir,

    favorileriGetir,
    favoriyeEkle,
    favoridenCikar,
    favoriMi,
    favoriSayisiniGetir,

    favoriHaberVerileriniGetir,
    favoriHaberleriniGetir,

    favoriIlleriGetir,
    favoriIlEkle,
    favoriIlKaydet,
    favoriIlSil,
    favoriIlMi,

    favoriKategorileriGetir,
    favoriKategoriEkle,
    favoriKategoriKaydet,
    favoriKategoriSil,
    favoriKategoriMi,

    okunanHaberleriGetir,
    haberOkundu,
    haberOkunduMu,

    okumaListesiniGetir,
    okumaListesineEkle,
    okumaListesindenSil,
    okumaListesindeMi,

    okumaListesiHaberVerileriniGetir,
    okumaListesiHaberleriniGetir,

    temaKaydet,
    temaGetir,

    fontSizeKaydet,
    fontSizeGetir

};