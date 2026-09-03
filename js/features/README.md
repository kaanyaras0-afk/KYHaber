# Özellikler

Uygulamanın kullanıcıya görünen davranışları bu katmana taşınır. İlk refactor
adımında çalışan akışların bozulmaması için mevcut event ve ekran kontrolü
`app/app-controller.js` altında birlikte tutuldu. Yeni özellik eklenirken
aşağıdaki sınırlar kullanılmalıdır:

- arama ve filtreleme: `news/`
- dünya animasyonu: `world/`
- uygulama başlatma ve mevcut akışların koordinasyonu: `app/`

Sonraki güvenli adım, `app-controller.js` içindeki event gruplarını tek tek
özellik klasörlerine taşımaktır.
