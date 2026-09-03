# Yerel depolama

`storage.js`, mevcut localStorage anahtarlarını ve geriye dönük davranışı
koruyan tek giriş noktasıdır. Yeni kodun doğrudan `localStorage` kullanması
yerine bu modülü kullanması gerekir.

Dosya büyüdüğünde güvenli ayrım:

- `preferences-storage.js`: tema ve yazı boyutu
- `location-storage.js`: seçili/favori şehir
- `news-library-storage.js`: favori, okunan ve okuma listesi