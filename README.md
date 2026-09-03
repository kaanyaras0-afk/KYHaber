# KYHaber — Modülerleştirilmiş sürüm

Bu paket, mevcut Vanilla JavaScript haber uygulamasının ana HTML yapısını,
CSS sınıflarını ve kullanıcı akışlarını koruyarak düzenlenmiş halidir.

## Yapılanlar

- `app.js` artık yalnızca uygulamanın giriş noktasıdır.
- Mevcut uygulama kontrolü `js/features/app/app-controller.js` içine taşındı.
- DOM yardımcıları `js/core/dom.js` içine ayrıldı.
- API kodu `js/services/` altında konumlandırıldı.
- Local storage kodu `js/storage/` altında konumlandırıldı.
- Veri katalogları `js/data/` altında konumlandırıldı.
- Haber arayüzü `js/ui/` altında konumlandırıldı.
- Haber filtreleri `js/features/news/` altında konumlandırıldı.
- 3D dünya kodu `js/features/world/` altında konumlandırıldı.
- Eski import yolları için kök seviyede uyumluluk dosyaları bırakıldı.

## Çalıştırma

`index (3).html` dosyasını bir statik sunucu üzerinden açın. Modül importları
nedeniyle dosyayı doğrudan `file://` ile açmak yerine Live Server benzeri bir
sunucu kullanın.

API anahtarı güvenlik nedeniyle arşive eklenmemiştir. Anahtar yokken uygulama
mock haberlerle çalışır. Canlı kullanımda API anahtarını frontend'e eklemeyin;
NewsData isteklerini backend proxy üzerinden geçirin ve daha önce açığa çıkmış
anahtarınızı yenileyin.

## Kademeli sonraki adım

`app-controller.js` davranış açısından korunmuştur; bu bilinçli bir karardır.
Bir sonraki refactor adımında event grupları şu sırayla ayrı feature modüllerine
taşınabilir:

1. preferences
2. city-search
3. news-search
4. favorites ve reading-list
5. finance
6. speech

Her adımda yalnızca bir özellik taşınarak mevcut ekran ve CSS yapısı korunur.