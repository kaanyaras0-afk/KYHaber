// ============================================================
// KYHABER APP
// ============================================================

import {
    kategoriler,
    iller
} from "../../data/catalogs.js";

import {
    seciliIlKaydet,
    seciliIlGetir,
    seciliKategoriKaydet,
    seciliKategoriGetir,

    favoriIlEkle,
    favoriIlSil,
    favoriIlMi,

    favoriKategoriEkle,
    favoriKategoriSil,
    favoriKategoriMi,

    favorileriGetir,
    favoriyeEkle,
    favoridenCikar,
    favoriMi,
    favoriHaberleriniGetir,

    haberOkundu,
    haberOkunduMu,

    okumaListesiniGetir,
    okumaListesineEkle,
    okumaListesindenSil,
    okumaListesindeMi,
    okumaListesiHaberleriniGetir,

    temaKaydet,
    temaGetir,

    fontSizeKaydet,
    fontSizeGetir
} from "../../storage/storage.js";

import {
    haberleriGoster
} from "../../ui/news-ui.js";

import {
    haberleriFiltrele
} from "../news/filters.js";

import {
    haberleriGetir,
    finansVerisiniHazirla,
    finansDegeriniFormatla,
    finansDegisiminiFormatla
} from "../../services/api.js";

import {
    elemanSec,
    elemanlariSec
} from "../../core/dom.js";


// ============================================================
// STATE
// ============================================================

let aktifHaberler = [];

let seciliKategori = "Tümü";

let seciliIl = "";

let aramaMetni = "";

let favorilerGosteriliyor = false;

let okunmamisGosteriliyor = false;

let okumaListesiGosteriliyor = false;

let aktifSesButonu = null;

let aramaTimer = null;

let haberIstekId = 0;

let baslatildi = false;


// ============================================================
// HABER ALANINA KAYDIR
// ============================================================

function haberAlaninaKaydir() {

    const hedef =
        elemanSec(
            ".section-header"
        );


    if (!hedef) {
        return;
    }


    setTimeout(
        () => {

            hedef.scrollIntoView({
                behavior:
                    "smooth",
                block:
                    "start"
            });

        },
        50
    );

}


// ============================================================
// BAŞLANGIÇ
// ============================================================

async function baslat() {

    if (baslatildi) {
        return;
    }


    baslatildi = true;


    baslangicAyarlari();

    kategoriButonlariniOlustur();

    kategoriEventleriniBaslat();

    ilAramaEventleriniBaslat();

    haberAramaEventiniBaslat();

    aramaTemizlemeEventleriniBaslat();

    favoriIlEventiniBaslat();

    favoriKategoriEventiniBaslat();

    favoriHaberEventleriniBaslat();

    favorilerEventiniBaslat();

    okunmamisEventiniBaslat();

    okumaListesiEventiniBaslat();

    okumaListesiHaberEventleriniBaslat();

    haberOkumaEventleriniBaslat();

    sesliOkumaEventleriniBaslat();

    temaEventiniBaslat();

    fontSizeEventleriniBaslat();


    await Promise.allSettled([

        haberleriYukle(),

        finansVerisiniGuncelle()

    ]);


    finansOtomatikYenilemeyiBaslat();

}


// ============================================================
// FİNANS — OTOMATİK YENİLEME
// ============================================================

const FINANS_YENILEME_ARALIGI_MS =
    60 * 1000;

let finansYenilemeZamanlayicisi =
    null;

function finansOtomatikYenilemeyiBaslat() {

    if (finansYenilemeZamanlayicisi) {

        clearInterval(
            finansYenilemeZamanlayicisi
        );

    }


    finansYenilemeZamanlayicisi =
        setInterval(
            () => {

                finansVerisiniGuncelle();

            },
            FINANS_YENILEME_ARALIGI_MS
        );

}


// ============================================================
// BAŞLANGIÇ AYARLARI
// ============================================================

function baslangicAyarlari() {

    const kayitliKategori =
        seciliKategoriGetir();


    if (
        kayitliKategori &&
        kategoriler.includes(
            kayitliKategori
        )
    ) {

        seciliKategori =
            kayitliKategori;

    }


    const kayitliIl =
        seciliIlGetir();


    if (
        kayitliIl &&
        iller.includes(
            kayitliIl
        )
    ) {

        seciliIl =
            kayitliIl;

    }


    const citySearch =
        elemanSec(
            "#citySearch"
        );


    if (citySearch) {

        citySearch.value =
            seciliIl;

    }


    const newsSearch =
        elemanSec(
            "#newsSearch"
        );


    if (newsSearch) {

        newsSearch.value =
            aramaMetni;

    }


    temaUygula(
        temaGetir()
    );


    fontSizeUygula(
        fontSizeGetir()
    );


    kategoriButonlariniGuncelle();

    favoriIlButonunuGuncelle();

    favoriKategoriButonunuGuncelle();

    headerButonlariniGuncelle();

    aramaTemizlemeButonlariniGuncelle();

}


// ============================================================
// KATEGORİLER
// ============================================================

function kategoriButonlariniOlustur() {

    const container =
        elemanSec(
            ".category-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    kategoriler.forEach(
        kategori => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "category-btn";


            button.dataset.category =
                kategori;


            button.textContent =
                kategori;


            const aktif =
                kategori ===
                seciliKategori;


            button.classList.toggle(
                "active",
                aktif
            );


            button.setAttribute(
                "aria-pressed",
                String(aktif)
            );


            container.appendChild(
                button
            );

        }
    );

}


function kategoriButonlariniGuncelle() {

    elemanlariSec(
        ".category-btn"
    ).forEach(
        button => {

            const aktif =
                button.dataset.category ===
                seciliKategori;


            button.classList.toggle(
                "active",
                aktif
            );


            button.setAttribute(
                "aria-pressed",
                String(aktif)
            );

        }
    );

}


// ============================================================
// KATEGORİ EVENT
// ============================================================

function kategoriEventleriniBaslat() {

    const container =
        elemanSec(
            ".category-container"
        );


    if (!container) {
        return;
    }


    container.addEventListener(
        "click",
        async event => {

            const button =
                event.target.closest(
                    ".category-btn"
                );


            if (!button) {
                return;
            }


            const kategori =
                button.dataset.category;


            if (!kategori) {
                return;
            }


            if (
                kategori ===
                seciliKategori
            ) {

                return;

            }


            sesliOkumayiDurdur();


            seciliKategori =
                kategori;


            seciliKategoriKaydet(
                seciliKategori
            );


            filtreModlariniSifirla();


            kategoriButonlariniGuncelle();

            favoriKategoriButonunuGuncelle();


            await haberleriYukle();

        }
    );

}


// ============================================================
// FİLTRE MODLARINI SIFIRLA
// ============================================================

function filtreModlariniSifirla() {

    favorilerGosteriliyor =
        false;

    okunmamisGosteriliyor =
        false;

    okumaListesiGosteriliyor =
        false;

    headerButonlariniGuncelle();

}


// ============================================================
// HABERLERİ YÜKLE
// ============================================================

async function haberleriYukle() {

    const mevcutIstekId =
        ++haberIstekId;


    haberYuklemeGoster();


    try {

        const veriler =
            await haberleriGetir({

                kategori:
                    seciliKategori,

                il:
                    seciliIl,

                arama:
                    aramaMetni

            });


        if (
            mevcutIstekId !==
            haberIstekId
        ) {

            return;

        }


        aktifHaberler =
            Array.isArray(veriler)
                ? veriler
                : [];


        haberleriGuncelle();

    } catch (hata) {

        console.error(
            "Haberler yüklenirken hata oluştu:",
            hata
        );


        if (
            mevcutIstekId !==
            haberIstekId
        ) {

            return;

        }


        aktifHaberler =
            [];


        haberleriGuncelle();

    }

}


// ============================================================
// LOADING
// ============================================================

function haberYuklemeGoster() {

    const container =
        elemanSec(
            "#newsContainer"
        );

    const newsCount =
        elemanSec(
            "#newsCount"
        );

    const emptyState =
        elemanSec(
            "#emptyState"
        );


    if (newsCount) {

        newsCount.textContent =
            "Haberler yükleniyor...";

    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

        emptyState.hidden =
            true;

    }


    if (!container) {
        return;
    }


    container.setAttribute(
        "aria-busy",
        "true"
    );


    container.innerHTML =
        "";


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "news-card news-card-loading";


        card.setAttribute(
            "aria-hidden",
            "true"
        );


        card.innerHTML = `
            <div class="news-image-wrapper"></div>

            <div class="news-content">

                <div class="news-meta"></div>

                <div class="news-title"></div>

                <div class="news-summary"></div>

                <div class="news-footer"></div>

            </div>
        `;


        container.appendChild(
            card
        );

    }

}


// ============================================================
// İL ARAMA
// ============================================================

function ilAramaEventleriniBaslat() {

    const input =
        elemanSec(
            "#citySearch"
        );


    const suggestions =
        elemanSec(
            "#citySuggestions"
        );


    if (
        !input ||
        !suggestions
    ) {
        return;
    }


    input.setAttribute(
        "aria-expanded",
        "false"
    );


    input.addEventListener(
        "input",
        () => {

            const arama =
                input.value
                    .trim()
                    .toLocaleLowerCase(
                        "tr-TR"
                    );


            aramaTemizlemeButonlariniGuncelle();


            if (
                input.value.trim() !==
                seciliIl
            ) {

                if (
                    seciliIl !== ""
                ) {

                    seciliIl =
                        "";

                    seciliIlKaydet(
                        ""
                    );

                    favoriIlButonunuGuncelle();

                }

            }


            suggestions.innerHTML =
                "";


            if (
                arama === ""
            ) {

                suggestions.classList.remove(
                    "show"
                );

                input.setAttribute(
                    "aria-expanded",
                    "false"
                );

                return;

            }


            const eslesenIller =
                iller.filter(
                    il =>
                        il
                            .toLocaleLowerCase(
                                "tr-TR"
                            )
                            .includes(arama)
                );


            if (
                eslesenIller.length ===
                0
            ) {

                const noResult =
                    document.createElement(
                        "div"
                    );


                noResult.className =
                    "city-no-result";


                noResult.textContent =
                    "İl bulunamadı";


                suggestions.appendChild(
                    noResult
                );


                suggestions.classList.add(
                    "show"
                );


                input.setAttribute(
                    "aria-expanded",
                    "true"
                );


                return;

            }


            eslesenIller.forEach(
                il => {

                    const item =
                        document.createElement(
                            "button"
                        );


                    item.type =
                        "button";


                    item.className =
                        "city-suggestion";


                    item.textContent =
                        il;


                    item.dataset.city =
                        il;


                    item.setAttribute(
                        "role",
                        "option"
                    );


                    item.setAttribute(
                        "aria-selected",
                        "false"
                    );


                    suggestions.appendChild(
                        item
                    );

                }
            );


            suggestions.classList.add(
                "show"
            );


            input.setAttribute(
                "aria-expanded",
                "true"
            );

        }
    );


    suggestions.addEventListener(
        "click",
        async event => {

            const suggestion =
                event.target.closest(
                    ".city-suggestion"
                );


            if (!suggestion) {
                return;
            }


            const il =
                suggestion.dataset.city;


            if (!il) {
                return;
            }


            sesliOkumayiDurdur();


            seciliIl =
                il;


            seciliIlKaydet(
                seciliIl
            );


            input.value =
                il;


            suggestions.innerHTML =
                "";


            suggestions.classList.remove(
                "show"
            );


            input.setAttribute(
                "aria-expanded",
                "false"
            );


            filtreModlariniSifirla();


            aramaTemizlemeButonlariniGuncelle();

            favoriIlButonunuGuncelle();


            await haberleriYukle();

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(
                    ".location-search"
                )
            ) {

                suggestions.classList.remove(
                    "show"
                );

                input.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                suggestions.classList.remove(
                    "show"
                );

                input.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


// ============================================================
// HABER ARAMA
// ============================================================

function haberAramaEventiniBaslat() {

    const input =
        elemanSec(
            "#newsSearch"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        event => {

            aramaMetni =
                event.target.value.trim();


            aramaTemizlemeButonlariniGuncelle();


            filtreModlariniSifirla();


            clearTimeout(
                aramaTimer
            );


            aramaTimer =
                null;


            if (
                aramaMetni === ""
            ) {

                haberleriYukle();

                return;

            }


            aramaTimer =
                setTimeout(
                    () => {

                        haberleriYukle();

                    },
                    450
                );

        }
    );

}


// ============================================================
// ARAMA TEMİZLEME
// ============================================================

function aramaTemizlemeEventleriniBaslat() {

    const clearCityButton =
        elemanSec(
            "#clearCitySearch"
        );


    const clearNewsButton =
        elemanSec(
            "#clearNewsSearch"
        );


    if (clearCityButton) {

        clearCityButton.addEventListener(
            "click",
            async () => {

                await anaSayfayaDon();

            }
        );

    }


    if (clearNewsButton) {

        clearNewsButton.addEventListener(
            "click",
            async () => {

                await anaSayfayaDon();

            }
        );

    }

}


function aramaTemizlemeButonlariniGuncelle() {

    const cityInput =
        elemanSec(
            "#citySearch"
        );

    const newsInput =
        elemanSec(
            "#newsSearch"
        );

    const clearCityButton =
        elemanSec(
            "#clearCitySearch"
        );

    const clearNewsButton =
        elemanSec(
            "#clearNewsSearch"
        );


    if (
        cityInput &&
        clearCityButton
    ) {

        clearCityButton.hidden =
            cityInput.value.trim() === "";

    }


    if (
        newsInput &&
        clearNewsButton
    ) {

        clearNewsButton.hidden =
            newsInput.value.trim() === "";

    }

}


// ============================================================
// ANA SAYFAYA DÖN
// ============================================================

async function anaSayfayaDon() {

    clearTimeout(
        aramaTimer
    );


    aramaTimer =
        null;


    sesliOkumayiDurdur();


    haberIstekId++;


    aramaMetni =
        "";

    seciliIl =
        "";

    seciliKategori =
        "Tümü";


    seciliIlKaydet(
        ""
    );


    seciliKategoriKaydet(
        "Tümü"
    );


    filtreModlariniSifirla();


    const cityInput =
        elemanSec(
            "#citySearch"
        );


    const newsInput =
        elemanSec(
            "#newsSearch"
        );


    if (cityInput) {

        cityInput.value =
            "";

    }


    if (newsInput) {

        newsInput.value =
            "";

    }


    const suggestions =
        elemanSec(
            "#citySuggestions"
        );


    if (suggestions) {

        suggestions.innerHTML =
            "";

        suggestions.classList.remove(
            "show"
        );

    }


    if (cityInput) {

        cityInput.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    kategoriButonlariniGuncelle();

    aramaTemizlemeButonlariniGuncelle();

    favoriIlButonunuGuncelle();

    favoriKategoriButonunuGuncelle();


    await haberleriYukle();

}


// ============================================================
// FAVORİ İL
// ============================================================

function favoriIlEventiniBaslat() {

    const button =
        elemanSec(
            "#favoriteCityToggle"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            if (!seciliIl) {
                return;
            }


            if (
                favoriIlMi(
                    seciliIl
                )
            ) {

                favoriIlSil(
                    seciliIl
                );

            } else {

                favoriIlEkle(
                    seciliIl
                );

            }


            favoriIlButonunuGuncelle();

            haberleriGuncelle();

        }
    );


    favoriIlButonunuGuncelle();

}


function favoriIlButonunuGuncelle() {

    const button =
        elemanSec(
            "#favoriteCityToggle"
        );


    if (!button) {
        return;
    }


    if (!seciliIl) {

        button.innerHTML =
            '<i class="fa-regular fa-star" aria-hidden="true"></i>';

        button.classList.remove(
            "active"
        );

        button.disabled =
            true;

        button.setAttribute(
            "aria-pressed",
            "false"
        );

        button.setAttribute(
            "aria-label",
            "Şehri favorilere eklemek için önce bir il seç"
        );

        button.title =
            "Önce bir il seç";

        return;

    }


    button.disabled =
        false;


    const favori =
        favoriIlMi(
            seciliIl
        );


    button.innerHTML =
        favori
            ? '<i class="fa-solid fa-star" aria-hidden="true"></i>'
            : '<i class="fa-regular fa-star" aria-hidden="true"></i>';


    button.classList.toggle(
        "active",
        favori
    );


    button.setAttribute(
        "aria-pressed",
        String(favori)
    );


    button.setAttribute(
        "aria-label",
        favori
            ? `${seciliIl} favorilerden çıkar`
            : `${seciliIl} favorilere ekle`
    );


    button.title =
        favori
            ? `${seciliIl} favorilerden çıkar`
            : `${seciliIl} favorilere ekle`;

}


// ============================================================
// FAVORİ KATEGORİ
// ============================================================

function favoriKategoriEventiniBaslat() {

    const button =
        elemanSec(
            "#favoriteCategoryToggle"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            if (
                seciliKategori ===
                "Tümü"
            ) {

                return;

            }


            if (
                favoriKategoriMi(
                    seciliKategori
                )
            ) {

                favoriKategoriSil(
                    seciliKategori
                );

            } else {

                favoriKategoriEkle(
                    seciliKategori
                );

            }


            favoriKategoriButonunuGuncelle();

            haberleriGuncelle();

        }
    );


    favoriKategoriButonunuGuncelle();

}


function favoriKategoriButonunuGuncelle() {

    const button =
        elemanSec(
            "#favoriteCategoryToggle"
        );


    if (!button) {
        return;
    }


    if (
        seciliKategori ===
        "Tümü"
    ) {

        button.disabled =
            true;


        button.innerHTML =
            '<i class="fa-regular fa-star" aria-hidden="true"></i> Favori Kategori';


        button.classList.remove(
            "active"
        );


        button.setAttribute(
            "aria-pressed",
            "false"
        );


        button.setAttribute(
            "aria-label",
            "Favori kategori için önce bir kategori seç"
        );


        button.title =
            "Bir kategori seç";


        return;

    }


    button.disabled =
        false;


    const favori =
        favoriKategoriMi(
            seciliKategori
        );


    button.innerHTML =
        favori
            ? '<i class="fa-solid fa-star" aria-hidden="true"></i> Favori Kategori'
            : '<i class="fa-regular fa-star" aria-hidden="true"></i> Favori Kategori';


    button.classList.toggle(
        "active",
        favori
    );


    button.setAttribute(
        "aria-pressed",
        String(favori)
    );


    button.setAttribute(
        "aria-label",
        favori
            ? `${seciliKategori} kategorisini favorilerden çıkar`
            : `${seciliKategori} kategorisini favorilere ekle`
    );


    button.title =
        favori
            ? "Kategoriyi favorilerden çıkar"
            : "Kategoriyi favorilere ekle";

}


// ============================================================
// FAVORİ HABER
// ============================================================

function favoriHaberEventleriniBaslat() {

    const container =
        elemanSec(
            "#newsContainer"
        );


    if (!container) {
        return;
    }


    container.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".favorite-button"
                );


            if (!button) {
                return;
            }


            event.preventDefault();

            event.stopPropagation();


            const haberId =
                button.dataset.id;


            if (!haberId) {
                return;
            }


            if (
                favoriMi(
                    haberId
                )
            ) {

                favoridenCikar(
                    haberId
                );

            } else {

                const haber =
                    haberBul(
                        haberId
                    );


                if (haber) {

                    favoriyeEkle(
                        haber
                    );

                }

            }


            haberleriGuncelle();

        }
    );

}


// ============================================================
// FAVORİLER
// ============================================================

function favorilerEventiniBaslat() {

    const button =
        elemanSec(
            "#favoritesToggle"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            sesliOkumayiDurdur();


            favorilerGosteriliyor =
                !favorilerGosteriliyor;


            okunmamisGosteriliyor =
                false;


            okumaListesiGosteriliyor =
                false;


            headerButonlariniGuncelle();

            haberleriGuncelle();

            haberAlaninaKaydir();

        }
    );

}


// ============================================================
// OKUNMAMIŞ
// ============================================================

function okunmamisEventiniBaslat() {

    const button =
        elemanSec(
            "#unreadToggle"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            sesliOkumayiDurdur();


            okunmamisGosteriliyor =
                !okunmamisGosteriliyor;


            favorilerGosteriliyor =
                false;


            okumaListesiGosteriliyor =
                false;


            headerButonlariniGuncelle();

            haberleriGuncelle();

            haberAlaninaKaydir();

        }
    );

}


// ============================================================
// OKUMA LİSTESİ
// ============================================================

function okumaListesiEventiniBaslat() {

    const button =
        elemanSec(
            "#readingListToggle"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            sesliOkumayiDurdur();


            okumaListesiGosteriliyor =
                !okumaListesiGosteriliyor;


            favorilerGosteriliyor =
                false;


            okunmamisGosteriliyor =
                false;


            headerButonlariniGuncelle();

            haberleriGuncelle();

            haberAlaninaKaydir();

        }
    );

}


// ============================================================
// HEADER BUTONLARI
// ============================================================

function headerButonlariniGuncelle() {

    const favoritesButton =
        elemanSec(
            "#favoritesToggle"
        );


    const unreadButton =
        elemanSec(
            "#unreadToggle"
        );


    const readingListButton =
        elemanSec(
            "#readingListToggle"
        );


    if (favoritesButton) {

        favoritesButton.classList.toggle(
            "active",
            favorilerGosteriliyor
        );


        favoritesButton.setAttribute(
            "aria-pressed",
            String(
                favorilerGosteriliyor
            )
        );

    }


    if (unreadButton) {

        unreadButton.classList.toggle(
            "active",
            okunmamisGosteriliyor
        );


        unreadButton.setAttribute(
            "aria-pressed",
            String(
                okunmamisGosteriliyor
            )
        );

    }


    if (readingListButton) {

        readingListButton.classList.toggle(
            "active",
            okumaListesiGosteriliyor
        );


        readingListButton.setAttribute(
            "aria-pressed",
            String(
                okumaListesiGosteriliyor
            )
        );

    }

}


// ============================================================
// HABER OKUMA
// ============================================================

function haberOkumaEventleriniBaslat() {

    const container =
        elemanSec(
            "#newsContainer"
        );


    if (!container) {
        return;
    }


    container.addEventListener(
        "click",
        event => {

            const article =
                event.target.closest(
                    ".news-card"
                );


            if (!article) {
                return;
            }


            const haberId =
                article.dataset.id;


            if (!haberId) {
                return;
            }


            const tiklananButon =
                event.target.closest(
                    [
                        ".favorite-button",
                        ".speech-button",
                        ".reading-list-button"
                    ].join(", ")
                );


            if (tiklananButon) {
                return;
            }


            const link =
                event.target.closest(
                    "a"
                );


            if (!link) {
                return;
            }


            if (
                link.getAttribute(
                    "aria-disabled"
                ) ===
                "true"
            ) {

                return;

            }


            haberOkundu(
                haberId
            );


            article.classList.add(
                "is-read"
            );


            /*
             * Okunmamış modu açıksa
             * sayı ve listeyi güncelle.
             */
            if (
                okunmamisGosteriliyor
            ) {

                haberleriGuncelle();

            }

        }
    );

}


// ============================================================
// OKUMA LİSTESİ HABER
// ============================================================

function okumaListesiHaberEventleriniBaslat() {

    const container =
        elemanSec(
            "#newsContainer"
        );


    if (!container) {
        return;
    }


    container.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".reading-list-button"
                );


            if (!button) {
                return;
            }


            event.preventDefault();

            event.stopPropagation();


            const article =
                button.closest(
                    ".news-card"
                );


            if (!article) {
                return;
            }


            const haberId =
                article.dataset.id;


            if (!haberId) {
                return;
            }


            if (
                okumaListesindeMi(
                    haberId
                )
            ) {

                okumaListesindenSil(
                    haberId
                );

            } else {

                const haber =
                    haberBul(
                        haberId
                    );


                if (haber) {

                    okumaListesineEkle(
                        haber
                    );

                }

            }


            haberleriGuncelle();

        }
    );

}


// ============================================================
// SESLİ OKUMA
// ============================================================

function sesliOkumaEventleriniBaslat() {

    const container =
        elemanSec(
            "#newsContainer"
        );


    if (!container) {
        return;
    }


    container.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".speech-button"
                );


            if (!button) {
                return;
            }


            event.preventDefault();

            event.stopPropagation();


            const article =
                button.closest(
                    ".news-card"
                );


            if (!article) {
                return;
            }


            const haberId =
                article.dataset.id;


            if (!haberId) {
                return;
            }


            const haber =
                haberBul(
                    haberId
                );


            if (!haber) {
                return;
            }


            if (
                !(
                    "speechSynthesis"
                    in window
                )
            ) {

                alert(
                    "Tarayıcınız sesli okumayı desteklemiyor."
                );

                return;

            }


            if (
                aktifSesButonu ===
                button
            ) {

                sesliOkumayiDurdur();

                return;

            }


            sesliOkumayiDurdur();


            const okunacakMetin =
                `${haber.baslik}. ${haber.ozet}`;


            const utterance =
                new SpeechSynthesisUtterance(
                    okunacakMetin
                );


            utterance.lang =
                "tr-TR";


            utterance.rate =
                1;


            utterance.pitch =
                1;


            aktifSesButonu =
                button;


            button.classList.add(
                "speaking"
            );


            button.textContent =
                "⏹ Durdur";


            button.setAttribute(
                "aria-pressed",
                "true"
            );


            utterance.onend =
                () => {

                    if (
                        document.body.contains(
                            button
                        )
                    ) {

                        sesliOkumaButonunuSifirla(
                            button
                        );

                    }


                    if (
                        aktifSesButonu ===
                        button
                    ) {

                        aktifSesButonu =
                            null;

                    }

                };


            utterance.onerror =
                () => {

                    if (
                        document.body.contains(
                            button
                        )
                    ) {

                        sesliOkumaButonunuSifirla(
                            button
                        );

                    }


                    if (
                        aktifSesButonu ===
                        button
                    ) {

                        aktifSesButonu =
                            null;

                    }

                };


            window.speechSynthesis.speak(
                utterance
            );

        }
    );

}


function sesliOkumayiDurdur() {

    if (
        "speechSynthesis" in
        window
    ) {

        window.speechSynthesis.cancel();

    }


    if (aktifSesButonu) {

        if (
            document.body.contains(
                aktifSesButonu
            )
        ) {

            sesliOkumaButonunuSifirla(
                aktifSesButonu
            );

        }

    }


    aktifSesButonu =
        null;

}


function sesliOkumaButonunuSifirla(
    button
) {

    if (!button) {
        return;
    }


    button.classList.remove(
        "speaking"
    );


    button.textContent =
        "🔊 Dinle";


    button.setAttribute(
        "aria-pressed",
        "false"
    );

}


// ============================================================
// TEMA
// ============================================================

function temaEventiniBaslat() {

    const button =
        elemanSec(
            "#themeToggle"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const mevcutTema =
                document.body.dataset.theme ===
                "light"
                    ? "light"
                    : "dark";


            const yeniTema =
                mevcutTema ===
                "dark"
                    ? "light"
                    : "dark";


            temaKaydet(
                yeniTema
            );


            temaUygula(
                yeniTema
            );

        }
    );

}


function temaUygula(tema) {

    const gecerliTema =
        tema === "light"
            ? "light"
            : "dark";


    document.body.dataset.theme =
        gecerliTema;


    const button =
        elemanSec(
            "#themeToggle"
        );


    if (!button) {
        return;
    }


    const acikTema =
        gecerliTema ===
        "light";


    button.innerHTML =
        acikTema
            ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';


    button.title =
        acikTema
            ? "Koyu temaya geç"
            : "Açık temaya geç";


    button.setAttribute(
        "aria-label",
        acikTema
            ? "Koyu temaya geç"
            : "Açık temaya geç"
    );


    button.setAttribute(
        "aria-pressed",
        String(acikTema)
    );

}


// ============================================================
// FONT SIZE
// ============================================================

function fontSizeEventleriniBaslat() {

    const small =
        elemanSec(
            "#fontSizeSmall"
        );


    const normal =
        elemanSec(
            "#fontSizeNormal"
        );


    const large =
        elemanSec(
            "#fontSizeLarge"
        );


    if (small) {

        small.addEventListener(
            "click",
            () => {

                fontSizeKaydet(
                    "small"
                );


                fontSizeUygula(
                    "small"
                );

            }
        );

    }


    if (normal) {

        normal.addEventListener(
            "click",
            () => {

                fontSizeKaydet(
                    "normal"
                );


                fontSizeUygula(
                    "normal"
                );

            }
        );

    }


    if (large) {

        large.addEventListener(
            "click",
            () => {

                fontSizeKaydet(
                    "large"
                );


                fontSizeUygula(
                    "large"
                );

            }
        );

    }

}


function fontSizeUygula(size) {

    const gecerliSize =
        [
            "small",
            "normal",
            "large"
        ].includes(size)
            ? size
            : "normal";


    document.body.dataset.fontSize =
        gecerliSize;


    const butonlar = [

        [
            "#fontSizeSmall",
            "small"
        ],

        [
            "#fontSizeNormal",
            "normal"
        ],

        [
            "#fontSizeLarge",
            "large"
        ]

    ];


    butonlar.forEach(
        ([selector, value]) => {

            const button =
                elemanSec(
                    selector
                );


            if (!button) {
                return;
            }


            const aktif =
                value ===
                gecerliSize;


            button.classList.toggle(
                "active",
                aktif
            );


            button.setAttribute(
                "aria-pressed",
                String(aktif)
            );

        }
    );

}


// ============================================================
// HABER BUL
// ============================================================

function haberBul(
    haberId
) {

    return aktifHaberler.find(
        haber =>
            haber.id ===
            haberId
    );

}


// ============================================================
// KAYITLI HABERLERİ AKTİF LİSTEYE EKLE
// ============================================================

function kayitliHaberleriAktifListeyeEkle() {

    const mevcutIdler =
        new Set(
            aktifHaberler.map(
                haber =>
                    haber.id
            )
        );


    /*
     * FAVORİLER
     */

    if (
        favorilerGosteriliyor
    ) {

        const favoriHaberleri =
            favoriHaberleriniGetir();


        favoriHaberleri.forEach(
            haber => {

                if (
                    haber &&
                    haber.id &&
                    !mevcutIdler.has(
                        haber.id
                    )
                ) {

                    aktifHaberler.push(
                        haber
                    );

                    mevcutIdler.add(
                        haber.id
                    );

                }

            }
        );

    }


    /*
     * OKUMA LİSTESİ
     */

    if (
        okumaListesiGosteriliyor
    ) {

        const okumaHaberleri =
            okumaListesiHaberleriniGetir();


        okumaHaberleri.forEach(
            haber => {

                if (
                    haber &&
                    haber.id &&
                    !mevcutIdler.has(
                        haber.id
                    )
                ) {

                    aktifHaberler.push(
                        haber
                    );

                    mevcutIdler.add(
                        haber.id
                    );

                }

            }
        );

    }

}


// ============================================================
// HABERLERİ GÜNCELLE
// ============================================================

function haberleriGuncelle() {

    if (aktifSesButonu) {

        sesliOkumayiDurdur();

    }


    kayitliHaberleriAktifListeyeEkle();


    let gosterilecekHaberler =
        [...aktifHaberler];


    /*
     * FAVORİLER
     */

    if (
        favorilerGosteriliyor
    ) {

        const favoriIdler =
            favorileriGetir();


        gosterilecekHaberler =
            gosterilecekHaberler.filter(
                haber =>
                    favoriIdler.includes(
                        haber.id
                    )
            );

    }


    /*
     * OKUNMAMIŞ
     */

    if (
        okunmamisGosteriliyor
    ) {

        gosterilecekHaberler =
            gosterilecekHaberler.filter(
                haber =>
                    !haberOkunduMu(
                        haber.id
                    )
            );

    }


    /*
     * OKUMA LİSTESİ
     */

    if (
        okumaListesiGosteriliyor
    ) {

        const okumaListesi =
            okumaListesiniGetir();


        gosterilecekHaberler =
            gosterilecekHaberler.filter(
                haber =>
                    okumaListesi.includes(
                        haber.id
                    )
            );

    }


    /*
     * Favori / okuma listesi modlarında
     * haberlerin kendi kayıtlı verilerini
     * göstermek istiyoruz.
     *
     * Genel kategori/şehir filtresini
     * bu modlarda uygulamıyoruz.
     */

    if (
        !favorilerGosteriliyor &&
        !okumaListesiGosteriliyor
    ) {

        gosterilecekHaberler =
            haberleriFiltrele(
                gosterilecekHaberler,
                seciliKategori,
                seciliIl,
                aramaMetni
            );

    }


    /*
     * EKRANA BAS
     */

    haberleriGoster(
        gosterilecekHaberler
    );


    const container =
        elemanSec(
            "#newsContainer"
        );


    if (container) {

        container.setAttribute(
            "aria-busy",
            "false"
        );

    }


    /*
     * HABER SAYISI
     */

    const newsCount =
        elemanSec(
            "#newsCount"
        );


    if (newsCount) {

        newsCount.textContent =
            `${gosterilecekHaberler.length} haber`;

    }


    /*
     * UI
     */

    sectionBasliginiGuncelle();

    favoriSayisiniGuncelle();

    okunmamisSayisiniGuncelle();

    okumaListesiSayisiniGuncelle();

    favoriIlButonunuGuncelle();

    favoriKategoriButonunuGuncelle();

    aramaTemizlemeButonlariniGuncelle();

    headerButonlariniGuncelle();


    emptyStateGuncelle(
        gosterilecekHaberler.length
    );

}


// ============================================================
// SECTION BAŞLIĞI
// ============================================================

function sectionBasliginiGuncelle() {

    const title =
        elemanSec(
            "#sectionTitle"
        );


    const label =
        elemanSec(
            "#sectionLabel"
        );


    if (!title) {
        return;
    }


    if (
        favorilerGosteriliyor
    ) {

        title.textContent =
            "Favori Haberler";


        if (label) {

            label.textContent =
                "KAYDETTİKLERİN";

        }


        return;

    }


    if (
        okunmamisGosteriliyor
    ) {

        title.textContent =
            "Okunmamış Haberler";


        if (label) {

            label.textContent =
                "TAKİPTE KAL";

        }


        return;

    }


    if (
        okumaListesiGosteriliyor
    ) {

        title.textContent =
            "Okuma Listem";


        if (label) {

            label.textContent =
                "DAHA SONRA";

        }


        return;

    }


    if (seciliIl) {

        title.textContent =
            `${seciliIl} Haberleri`;


        if (label) {

            label.textContent =
                "ŞEHİR GÜNDEMİ";

        }


        return;

    }


    if (
        seciliKategori !==
        "Tümü"
    ) {

        title.textContent =
            `${seciliKategori} Haberleri`;


        if (label) {

            label.textContent =
                "GÜNDEM";

        }


        return;

    }


    title.textContent =
        aramaMetni
            ? `"${aramaMetni}" Sonuçları`
            : "Son Haberler";


    if (label) {

        label.textContent =
            aramaMetni
                ? "ARAMA SONUÇLARI"
                : "GÜNDEM";

    }

}


// ============================================================
// SAYILAR
// ============================================================

function favoriSayisiniGuncelle() {

    const count =
        elemanSec(
            "#favoriteCount"
        );


    if (!count) {
        return;
    }


    count.textContent =
        favorileriGetir().length;

}


function okunmamisSayisiniGuncelle() {

    const count =
        elemanSec(
            "#unreadCount"
        );


    if (!count) {
        return;
    }


    const okunmamis =
        aktifHaberler.filter(
            haber =>
                !haberOkunduMu(
                    haber.id
                )
        );


    count.textContent =
        okunmamis.length;

}


function okumaListesiSayisiniGuncelle() {

    const count =
        elemanSec(
            "#readingListCount"
        );


    if (!count) {
        return;
    }


    count.textContent =
        okumaListesiniGetir().length;

}


// ============================================================
// EMPTY STATE
// ============================================================

function emptyStateGuncelle(
    haberSayisi
) {

    const emptyState =
        elemanSec(
            "#emptyState"
        );


    if (!emptyState) {
        return;
    }


    const bos =
        haberSayisi === 0;


    emptyState.classList.toggle(
        "hidden",
        !bos
    );


    emptyState.hidden =
        !bos;

}


// ============================================================
// FİNANS
// ============================================================

async function finansVerisiniGuncelle() {

    finansLoadingGoster();


    try {

        const sonuc =
            await finansVerisiniHazirla();


        finansVerileriniEkranaBas(
            sonuc.finans
        );


        finansSonGuncellemeGoster(
            sonuc.zaman,
            sonuc.kaynak
        );

    } catch (hata) {

        console.error(
            "Finans sistemi hatası:",
            hata
        );


        finansHatasiGoster();

    }

}


// ============================================================
// FİNANS LOADING
// ============================================================

function finansLoadingGoster() {

    const maddeler =
        elemanlariSec(
            ".finance-item"
        );


    maddeler.forEach(
        item => {

            const deger =
                item.querySelector(
                    "strong"
                );


            if (!deger) {
                return;
            }


            deger.textContent =
                "...";


            item.dataset.loading =
                "true";


            item.classList.remove(
                "finance-error"
            );


            const change =
                item.querySelector(
                    ".finance-change"
                );


            if (change) {

                change.textContent =
                    "...";


                change.classList.remove(
                    "finance-up",
                    "finance-down",
                    "finance-neutral"
                );


                change.dataset.direction =
                    "neutral";

            }

        }
    );

}


// ============================================================
// FİNANS EKRANA BAS
// ============================================================

function finansVerileriniEkranaBas(
    finans
) {

    const finansMaddeleri = [

        {
            key:
                "dolar",
            veri:
                finans?.dolar,
            decimal:
                2
        },

        {
            key:
                "euro",
            veri:
                finans?.euro,
            decimal:
                2
        },

        {
            key:
                "altin",
            veri:
                finans?.altin,
            decimal:
                2
        },

        {
            key:
                "bist",
            veri:
                finans?.bist,
            decimal:
                2
        }

    ];


    finansMaddeleri.forEach(
        ({
            key,
            veri,
            decimal
        }) => {

            const item =
                document.querySelector(
                    `.finance-item[data-finance="${key}"]`
                );


            if (!item) {
                return;
            }


            const strong =
                item.querySelector(
                    "strong"
                );


            if (!strong) {
                return;
            }


            const degerGecerli =
                veri &&
                typeof veri.deger ===
                    "number" &&
                Number.isFinite(
                    veri.deger
                );


            if (!degerGecerli) {

                strong.textContent =
                    "-";


                item.dataset.loading =
                    "false";


                item.classList.add(
                    "finance-error"
                );


                finansDegisimAlaniniGuncelle(
                    item,
                    {
                        degisim:
                            null,
                        yon:
                            "neutral"
                    }
                );


                return;

            }


            strong.textContent =
                `${veri.sembol || ""}${finansDegeriniFormatla(
                    veri.deger,
                    decimal
                )}`;


            item.dataset.loading =
                "false";


            item.classList.remove(
                "finance-error"
            );


            finansDegisimAlaniniGuncelle(
                item,
                veri
            );

        }
    );

}


// ============================================================
// FİNANS DEĞİŞİM ALANI
// ============================================================

function finansDegisimAlaniniGuncelle(
    item,
    veri
) {

    let change =
        item.querySelector(
            ".finance-change"
        );


    if (!change) {

        const valueContainer =
            item.querySelector(
                ".finance-value"
            );


        if (!valueContainer) {
            return;
        }


        change =
            document.createElement(
                "span"
            );


        change.className =
            "finance-change";


        valueContainer.appendChild(
            change
        );

    }


    const degisimGecerli =
        veri &&
        veri.degisim !== null &&
        veri.degisim !== undefined &&
        Number.isFinite(
            Number(veri.degisim)
        );


    if (degisimGecerli) {

        change.textContent =
            finansDegisiminiFormatla(
                Number(
                    veri.degisim
                )
            );

    } else {

        change.textContent =
            "-";

    }


    const yon =
        veri?.yon ||
        "neutral";


    change.dataset.direction =
        yon;


    change.classList.toggle(
        "finance-up",
        yon === "up"
    );


    change.classList.toggle(
        "finance-down",
        yon === "down"
    );


    change.classList.toggle(
        "finance-neutral",
        yon === "neutral"
    );

}


// ============================================================
// FİNANS HATA
// ============================================================

function finansHatasiGoster() {

    const maddeler =
        elemanlariSec(
            ".finance-item"
        );


    maddeler.forEach(
        item => {

            const deger =
                item.querySelector(
                    "strong"
                );


            if (deger) {

                deger.textContent =
                    "-";

            }


            const change =
                item.querySelector(
                    ".finance-change"
                );


            if (change) {

                change.textContent =
                    "Veri alınamadı";


                change.classList.remove(
                    "finance-up",
                    "finance-down"
                );


                change.classList.add(
                    "finance-neutral"
                );


                change.dataset.direction =
                    "neutral";

            }


            item.dataset.loading =
                "false";


            item.classList.add(
                "finance-error"
            );

        }
    );


    finansSonGuncellemeGoster(
        null,
        "hata"
    );

}


// ============================================================
// FİNANS — SON GÜNCELLEME GÖSTERİMİ
// ============================================================

function finansSonGuncellemeGoster(
    zaman,
    kaynak
) {

    const eleman =
        elemanSec(
            "#financeUpdated"
        );


    if (!eleman) {
        return;
    }


    if (
        kaynak === "hata" ||
        !zaman
    ) {

        eleman.textContent =
            "Piyasa verileri şu anda alınamıyor.";

        return;

    }


    const saat =
        new Date(zaman)
            .toLocaleTimeString(
                "tr-TR",
                {
                    hour:
                        "2-digit",
                    minute:
                        "2-digit"
                }
            );


    if (kaynak === "onbellek") {

        eleman.textContent =
            `Canlı veriye ulaşılamadı — son bilinen değerler (${saat})`;

        return;

    }


    eleman.textContent =
        `Son güncelleme: ${saat} · BIST verisi ~15 dk gecikmelidir`;

}


export {
    baslat
};
