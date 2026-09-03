# Servis katmanı

Bu klasörde veri kaynakları bulunur. Servisler DOM elemanlarına dokunmaz; veri
alır, dönüştürür ve uygulama katmanına döndürür.

- `api.js`: mevcut haber ve finans API akışının davranışı korunarak taşındı.
- İleride haber ve finans akışları birbirinden bağımsız değiştirilecekse
  `news-api.js` ve `finance-api.js` dosyalarına ayrılabilir.
