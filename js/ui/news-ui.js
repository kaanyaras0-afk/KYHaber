// ============================================================
// KYHABER
// UI / HABER KARTLARI
// ============================================================

import {
    favoriMi,
    haberOkunduMu,
    okumaListesindeMi
} from "../storage/storage.js";


// ============================================================
// GÜVENLİ URL
// ============================================================

function guvenliUrlGetir(deger) {

    if (
        typeof deger !== "string"
    ) {
        return "";
    }


    const urlMetni =
        deger.trim();


    if (
        !urlMetni
    ) {
        return "";
    }


    /*
       Sadece HTTP ve HTTPS bağlantılarına izin veriyoruz.

       Böylece API'den teorik olarak:
       javascript:
       data:
       vb. zararlı bir değer gelse bile
       doğrudan link olarak kullanılmaz.
    */

    if (
        !/^https?:\/\//i.test(
            urlMetni
        )
    ) {

        return "";
    }


    try {

        const url =
            new URL(
                urlMetni
            );


        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {

            return "";
        }


        return url.href;

    } catch (error) {

        return "";

    }

}


// ============================================================
// HABERLERİ GÖSTER
// ============================================================

function haberleriGoster(
    haberler,
    container =
        document.querySelector(
            "#newsContainer"
        )
) {

    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    if (
        !Array.isArray(
            haberler
        )
    ) {

        return;

    }


    haberler.forEach(
        haber => {

            if (
                !haber ||
                !haber.id
            ) {

                return;

            }


            const kart =
                haberKartiOlustur(
                    haber
                );


            container.appendChild(
                kart
            );

        }
    );

}


// ============================================================
// HABER KARTI OLUŞTUR
// ============================================================

function haberKartiOlustur(
    haber
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "news-card";


    article.dataset.id =
        String(
            haber.id
        );


    // ========================================================
    // OKUNMUŞ
    // ========================================================

    const okunmus =
        haberOkunduMu(
            haber.id
        );


    if (
        okunmus
    ) {

        article.classList.add(
            "is-read"
        );

    }


    // ========================================================
    // FAVORİ
    // ========================================================

    const favoriAktif =
        favoriMi(
            haber.id
        );


    // ========================================================
    // OKUMA LİSTESİ
    // ========================================================

    const okumaListesinde =
        okumaListesindeMi(
            haber.id
        );


    // ========================================================
    // IMAGE WRAPPER
    // ========================================================

    const imageWrapper =
        document.createElement(
            "div"
        );


    imageWrapper.className =
        "news-image-wrapper";


    // ========================================================
    // HABER LINK
    // ========================================================

    const haberLinki =
        guvenliUrlGetir(
            haber.link
        );


    // ========================================================
    // IMAGE LINK
    // ========================================================

    const imageLink =
        document.createElement(
            "a"
        );


    imageLink.className =
        "news-image-link";


    // ========================================================
    // IMAGE
    // ========================================================

    const image =
        document.createElement(
            "img"
        );


    image.className =
        "news-image";


    image.alt =
        String(
            haber.baslik ||
            "Haber görseli"
        );


    image.loading =
        "lazy";


    image.decoding =
        "async";


    const gorselUrl =
        guvenliUrlGetir(
            haber.gorsel
        );


    // ========================================================
    // GÖRSEL VAR
    // ========================================================

    if (
        gorselUrl
    ) {

        image.src =
            gorselUrl;


        image.addEventListener(
            "error",
            () => {

                image.removeAttribute(
                    "src"
                );


                imageWrapper.classList.add(
                    "image-error"
                );

            },
            {
                once:
                    true
            }
        );

    }

    // ========================================================
    // GÖRSEL YOK
    // ========================================================

    else {

        imageWrapper.classList.add(
            "image-error"
        );

    }


    // ========================================================
    // IMAGE LINK
    // ========================================================

    if (
        haberLinki
    ) {

        imageLink.href =
            haberLinki;


        imageLink.target =
            "_blank";


        imageLink.rel =
            "noopener noreferrer";

    }

    else {

        /*
           href="#" kullanmıyoruz.

           Böylece boş haber kartına tıklanınca
           sayfa yukarı sıçramıyor ve URL'ye # eklenmiyor.
        */

        imageLink.setAttribute(
            "aria-disabled",
            "true"
        );


        imageLink.tabIndex =
            -1;

    }


    imageLink.appendChild(
        image
    );


    // ========================================================
    // FAVORİ BUTTON
    // ========================================================

    const favoriteButton =
        document.createElement(
            "button"
        );


    favoriteButton.type =
        "button";


    favoriteButton.className =
        "favorite-button";


    favoriteButton.dataset.id =
        String(
            haber.id
        );


    if (
        favoriAktif
    ) {

        favoriteButton.classList.add(
            "active"
        );

    }


    favoriteButton.textContent =
        favoriAktif
            ? "★"
            : "☆";


    favoriteButton.setAttribute(
        "aria-label",
        favoriAktif
            ? "Favorilerden çıkar"
            : "Favorilere ekle"
    );


    favoriteButton.setAttribute(
        "aria-pressed",
        String(
            favoriAktif
        )
    );


    // ========================================================
    // IMAGE ALANI
    // ========================================================

    imageWrapper.appendChild(
        imageLink
    );


    imageWrapper.appendChild(
        favoriteButton
    );


    // ========================================================
    // READ BADGE
    // ========================================================

    if (
        okunmus
    ) {

        const readBadge =
            document.createElement(
                "span"
            );


        readBadge.className =
            "read-badge";


        readBadge.textContent =
            "Okundu";


        imageWrapper.appendChild(
            readBadge
        );

    }


    // ========================================================
    // CONTENT
    // ========================================================

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "news-content";


    // ========================================================
    // META
    // ========================================================

    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "news-meta";


    // ========================================================
    // CATEGORY
    // ========================================================

    const category =
        document.createElement(
            "span"
        );


    category.className =
        "news-category";


    category.textContent =
        String(
            haber.kategori ||
            "Genel"
        );


    // ========================================================
    // TONE
    // ========================================================

    const tone =
        document.createElement(
            "span"
        );


    tone.className =
        "news-tone";


    tone.textContent =
        String(
            haber.ton ||
            "Nötr"
        );


    meta.appendChild(
        category
    );


    meta.appendChild(
        tone
    );


    // ========================================================
    // TITLE
    // ========================================================

    const title =
        document.createElement(
            "h3"
        );


    title.className =
        "news-title";


    const titleLink =
        document.createElement(
            "a"
        );


    titleLink.textContent =
        String(
            haber.baslik ||
            "Başlıksız haber"
        );


    if (
        haberLinki
    ) {

        titleLink.href =
            haberLinki;


        titleLink.target =
            "_blank";


        titleLink.rel =
            "noopener noreferrer";

    }

    else {

        titleLink.setAttribute(
            "aria-disabled",
            "true"
        );


        titleLink.tabIndex =
            -1;

    }


    title.appendChild(
        titleLink
    );


    // ========================================================
    // SUMMARY
    // ========================================================

    const summary =
        document.createElement(
            "p"
        );


    summary.className =
        "news-summary";


    summary.textContent =
        String(
            haber.ozet ||
            "Bu haber için özet bulunmuyor."
        );


    // ========================================================
    // ACTIONS
    // ========================================================

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "news-actions";


    // ========================================================
    // SPEECH BUTTON
    // ========================================================

    const speechButton =
        document.createElement(
            "button"
        );


    speechButton.type =
        "button";


    speechButton.className =
        "speech-button";


    speechButton.dataset.id =
        String(
            haber.id
        );


    speechButton.textContent =
        "🔊 Dinle";


    speechButton.setAttribute(
        "aria-label",
        "Haberi sesli oku"
    );


    speechButton.setAttribute(
        "aria-pressed",
        "false"
    );


    // ========================================================
    // READING LIST BUTTON
    // ========================================================

    const readingButton =
        document.createElement(
            "button"
        );


    readingButton.type =
        "button";


    readingButton.className =
        "reading-list-button";


    readingButton.dataset.id =
        String(
            haber.id
        );


    if (
        okumaListesinde
    ) {

        readingButton.classList.add(
            "active"
        );

    }


    readingButton.textContent =
        okumaListesinde
            ? "✓ Listede"
            : "📚 Daha Sonra";


    readingButton.setAttribute(
        "aria-label",
        okumaListesinde
            ? "Okuma listesinden çıkar"
            : "Okuma listesine ekle"
    );


    readingButton.setAttribute(
        "aria-pressed",
        String(
            okumaListesinde
        )
    );


    // ========================================================
    // ACTIONS APPEND
    // ========================================================

    actions.appendChild(
        speechButton
    );


    actions.appendChild(
        readingButton
    );


    // ========================================================
    // FOOTER
    // ========================================================

    const footer =
        document.createElement(
            "div"
        );


    footer.className =
        "news-footer";


    // ========================================================
    // SOURCE
    // ========================================================

    const source =
        document.createElement(
            "span"
        );


    source.className =
        "news-source";


    source.textContent =
        String(
            haber.kaynak ||
            "Bilinmeyen kaynak"
        );


    // ========================================================
    // DATE
    // ========================================================

    const date =
        document.createElement(
            "time"
        );


    const tarih =
        tarihFormatla(
            haber.tarih
        );


    date.textContent =
        tarih;


    if (
        haber.tarih
    ) {

        const tarihObjesi =
            new Date(
                haber.tarih
            );


        if (
            !Number.isNaN(
                tarihObjesi.getTime()
            )
        ) {

            date.dateTime =
                tarihObjesi.toISOString();

        }

    }


    // ========================================================
    // FOOTER APPEND
    // ========================================================

    footer.appendChild(
        source
    );


    footer.appendChild(
        date
    );


    // ========================================================
    // CONTENT APPEND
    // ========================================================

    content.appendChild(
        meta
    );


    content.appendChild(
        title
    );


    content.appendChild(
        summary
    );


    content.appendChild(
        actions
    );


    content.appendChild(
        footer
    );


    // ========================================================
    // ARTICLE APPEND
    // ========================================================

    article.appendChild(
        imageWrapper
    );


    article.appendChild(
        content
    );


    return article;

}


// ============================================================
// TARİH FORMATLA
// ============================================================

function tarihFormatla(
    tarih
) {

    if (
        !tarih
    ) {

        return "Tarih belirtilmemiş";

    }


    const date =
        new Date(
            tarih
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Tarih belirtilmemiş";

    }


    return new Intl.DateTimeFormat(
        "tr-TR",
        {

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    ).format(
        date
    );

}


// ============================================================
// EXPORT
// ============================================================

export {

    haberleriGoster,

    haberKartiOlustur

};