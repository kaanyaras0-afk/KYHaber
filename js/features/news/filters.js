// ============================================================
// HABER FİLTRELEME
// ============================================================

function metniNormalizeEt(metin) {
    return String(metin || "")
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


// ============================================================
// HABERLERİ FİLTRELE
// ============================================================

function haberleriFiltrele(
    haberler,
    seciliKategori,
    seciliIl,
    aramaMetni = ""
) {

    // Haber listesi yoksa boş liste döndür
    if (!Array.isArray(haberler)) {
        return [];
    }


    // --------------------------------------------------------
    // SEÇİMLER
    // --------------------------------------------------------

    const kategori =
        seciliKategori || "Tümü";

    const normalizeKategori =
        metniNormalizeEt(kategori);

    const il =
        metniNormalizeEt(seciliIl);

    const arama =
        metniNormalizeEt(aramaMetni);


    // --------------------------------------------------------
    // FİLTRELE
    // --------------------------------------------------------

    return haberler.filter(haber => {

        if (!haber) {
            return false;
        }


        // ----------------------------------------------------
        // KATEGORİ
        // ----------------------------------------------------

        const haberKategori =
            metniNormalizeEt(
                haber.kategori
            );


        /*
         * Tümü seçiliyse kategori filtresi uygulama.
         *
         * ÖNCEKİ HATALI HAL:
         *
         * normalizeKategori === "tum"
         *
         * "Tümü" normalize edilince "tumu" olduğu için
         * hiçbir haber geçmiyordu.
         */

        const kategoriUygun =
            kategori === "Tümü" ||
            haberKategori === normalizeKategori;


        // ----------------------------------------------------
        // İL
        // ----------------------------------------------------

        const haberIl =
            metniNormalizeEt(
                haber.il
            );


        const ilUygun =
            il === "" ||
            haberIl === il;


        // ----------------------------------------------------
        // KATEGORİ VE İL UYGUN DEĞİLSE
        // ----------------------------------------------------

        if (
            !kategoriUygun ||
            !ilUygun
        ) {

            return false;

        }


        // ----------------------------------------------------
        // ARAMA YOKSA
        // ----------------------------------------------------

        if (
            arama === ""
        ) {

            return true;

        }


        // ----------------------------------------------------
        // ARANACAK METİNLER
        // ----------------------------------------------------

        const aranacakMetin = [

            haber.baslik,

            haber.ozet,

            haber.kaynak,

            haber.kategori,

            haber.il,

            haber.ton

        ]

            .filter(Boolean)

            .map(metniNormalizeEt)

            .join(" ");


        // ----------------------------------------------------
        // ARAMA SONUCU
        // ----------------------------------------------------

        return aranacakMetin.includes(
            arama
        );

    });

}


// ============================================================
// EXPORT
// ============================================================

export {
    haberleriFiltrele
};