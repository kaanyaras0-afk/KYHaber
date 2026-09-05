# KYHaber 📰

Modern ve modüler yapıda geliştirilmiş, **Vanilla JavaScript tabanlı haber ve finans platformu.**

KYHaber; güncel haberleri kategori, şehir ve arama seçenekleriyle sunarken aynı zamanda finans verilerini de tek bir arayüz üzerinden göstermeyi amaçlar.

## 🌐 Canlı Demo

**https://kaanyaras0-afk.github.io/KYHaber/**

---

## 🚀 Özellikler

- 📰 Güncel haberler
- 🔎 Haber arama
- 🏙️ Şehir bazlı haberler
- 🗂️ Haber kategorileri
- 📄 Sayfalama
- 💰 Finans verileri (dolar, euro, altın, BIST)
- 🌍 3D dünya/ülke bölümü
- ⭐ Favori haberler / favori şehir / favori kategori
- 📚 Okuma listesi + okunan haber takibi
- 🎧 Sesli okuma (Web Speech API)
- 🌗 Tema ve yazı boyutu tercihi
- 💾 LocalStorage ile veri saklama
- 📱 Responsive arayüz
- ⚡ Vanilla JavaScript, framework bağımlılığı yok
- 🔐 API anahtarının frontend'de tutulmaması

---

## 🛠️ Kullanılan Teknolojiler

- HTML5
- CSS3 (custom design tokens / CSS variables — framework kullanılmıyor)
- JavaScript (ES6+, native ES Modules)
- Three.js (3D dünya bölümü, CDN üzerinden)
- Font Awesome
- NewsData.io
- Cloudflare Workers (backend proxy)
- Midas API (finans verisi)
- GitHub Pages
- LocalStorage

> Not: Önceki sürümlerde teknoloji listesinde Bootstrap yer alıyordu; proje artık
> Bootstrap kullanmıyor, tüm arayüz kendi `style.css` / `responsive.css` dosyalarıyla
> oluşturuluyor. Liste gerçek bağımlılıkları yansıtacak şekilde güncellendi.

---

## 🏗️ Proje Mimarisi

```
KYHaber/
│
├── css/
│   ├── style.css
│   └── responsive.css
│
├── js/
│   ├── app.js                     # Tek giriş noktası (DOMContentLoaded → baslat)
│   ├── world.js                   # Geriye dönük uyumluluk shim'i
│   ├── config.example.js          # Yerel API anahtarı için örnek şablon (gerçek anahtar İÇERMEZ)
│   │
│   ├── core/
│   │   └── dom.js                 # Ortak DOM erişim yardımcıları
│   │
│   ├── data/
│   │   └── catalogs.js            # Sabit kataloglar: şehirler, kategoriler
│   │
│   ├── features/
│   │   ├── app/
│   │   │   └── app-controller.js  # Uygulama akışı, event yönetimi, ekran güncellemeleri
│   │   ├── news/
│   │   │   └── filters.js         # Haber filtreleme mantığı
│   │   └── world/
│   │       └── world.js           # 3D dünya animasyonu (Three.js)
│   │
│   ├── services/
│   │   └── api.js                 # Haber + finans API istekleri, cache, veri dönüşümü
│   │
│   ├── storage/
│   │   └── storage.js             # Tüm localStorage erişimi tek giriş noktasından
│   │
│   └── ui/
│       └── news-ui.js             # Haber kartlarının DOM'a basılması
│
├── index.html
├── .gitignore
└── README.md
```

Aktif giriş zinciri: `index.html` → `js/app.js` → `js/features/app/app-controller.js`.
Haber ve finans servislerinin fiili uygulaması `js/services/api.js` dosyasındadır.

`js/world.js`, kök dizinde duran tek dosyadır ve sadece geriye dönük uyumluluk
için `features/world/world.js` dosyasını yeniden dışa aktarır — kendi başına
mantık içermez. Önceki mimari diyagramında `data.js`, `api.js`, `filters.js`
gibi dosyalar hem kök dizinde hem `features/` altında ayrı ayrı gösteriliyordu;
bu yanlıştı ve karışıklığa yol açıyordu. Gerçek yapı yukarıdaki gibidir: her
modülün **tek** bir konumu vardır.

### 📁 Katman sorumlulukları ve planlanan bölünmeler

Her alt klasörde kendi `README.md` dosyası bulunur ve o katmanın sorumluluğunu
açıklar. Özet:

- **`core/`** — Sadece DOM erişim yardımcıları (`elemanSec`, `elemanlariSec`).
- **`data/`** — Sabit kataloglar. Mock/test verisi büyürse `catalogs.js` ve
  `fixtures.js` olarak ikiye ayrılabilir.
- **`features/app/app-controller.js`** — İlk refactor adımında, çalışan akışın
  bozulmaması için tüm event ve ekran kontrolü kasıtlı olarak burada tek dosyada
  tutuldu. Şu an dosya büyük (~3.700 satır); bu bilinen bir teknik borçtur.
  Sonraki güvenli adım, event gruplarının (favoriler, arama, sesli okuma, tema,
  finans ekranı) kendi özellik klasörlerine taşınmasıdır. Yeni özellik eklerken
  yeni kod doğrudan buraya değil, ilgili özellik klasörüne yazılmalıdır.
- **`services/api.js`** — Servisler DOM'a dokunmaz, sadece veri alır/dönüştürür.
  Haber ve finans akışları birbirinden bağımsız değişmeye başlarsa `news-api.js`
  ve `finance-api.js` olarak ayrılabilir.
- **`storage/storage.js`** — Tüm localStorage anahtarlarına tek giriş noktası.
  Yeni kod doğrudan `localStorage` çağırmamalı, bu modülü kullanmalıdır. Dosya
  büyürse `preferences-storage.js`, `location-storage.js`,
  `news-library-storage.js` olarak bölünebilir.
- **`ui/news-ui.js`** — Sadece haber kartlarının DOM'a basılmasından sorumludur;
  veri çekmez, filtrelemez.

---

## 🔐 API Güvenliği

KYHaber'in frontend tarafında **NewsData API anahtarı tutulmaz.**

İstek yapısı:

```
KYHaber Frontend
       │
       ▼
Cloudflare Worker
       │
       │  NEWSDATA_API_KEY
       │  (Worker Secret)
       ▼
NewsData.io
```

API anahtarı Cloudflare Worker üzerinde **Secret** olarak saklanır. Frontend
yalnızca Worker'a istek gönderir. Bu sayede API anahtarının GitHub Pages
üzerinde kullanıcıya açık şekilde gönderilmesi engellenir.

> **Not:** Worker'ın deploy edilmiş endpoint'i bu projede kullanılır; Worker
> kaynak kodu ve deploy konfigürasyonu bu repository içinde bulunmamaktadır.

---

## 💰 Finans Veri Akışı

Finans verileri de frontend tarafından doğrudan üçüncü taraf servise gönderilmez.

```
KYHaber
   │
   ▼
Cloudflare Worker
   │
   ▼
Midas API
   │
   ▼
Finans verileri
```

Worker üzerinden desteklenen veri türleri:

```
doviz
table
altin
news
```

Canlı veriye ulaşılamadığında uygulama, `localStorage` üzerindeki son bilinen
değerleri gösterip kullanıcıyı boş ekranla karşılamaz.

---

## ⚙️ Cloudflare Worker

KYHaber'in backend/proxy katmanı Cloudflare Workers üzerinde çalışmaktadır.

Worker'ın temel görevleri:

- NewsData API isteklerini yönetmek
- API anahtarını gizli tutmak
- Finans API isteklerini yönlendirmek
- CORS kontrolü yapmak
- Frontend ile harici API'ler arasında güvenli bir ara katman oluşturmak

Frontend tarafında API anahtarı bulunmaz.

---

## 💻 Lokal Çalıştırma

Projeyi bilgisayarınıza klonlayın:

```
git clone https://github.com/kaanyaras0-afk/KYHaber.git
```

Proje klasörüne girin:

```
cd KYHaber
```

Ardından projeyi **Live Server** gibi bir statik sunucu ile çalıştırın.

JavaScript ES Modules kullanıldığı için `index.html` dosyasını doğrudan

```
file://
```

üzerinden açmak yerine HTTP üzerinden çalıştırmanız gerekir. Örneğin:

```
http://127.0.0.1:5500/
```

---

## 📦 Veri Yönetimi

Uygulamada tarayıcı tarafında LocalStorage kullanılarak bazı kullanıcı verileri
saklanmaktadır. Örneğin:

- Favoriler (haber, şehir, kategori)
- Okuma listesi ve okunan haberler
- Kullanıcı tercihleri (tema, yazı boyutu, seçili şehir/kategori)
- Finans cache verileri

---

## 🩹 Bilinen Sorunlar ve Yapılan Düzeltmeler

- **[Düzeltildi]** Kategori filtresi — "Tümü" seçiliyken normalize edilen metin
  ile karşılaştırılan sabit string birbirini tutmuyordu (`"tumu"` yerine
  `"tum"` yazılmıştı), bu yüzden filtre hiçbir zaman "tüm kategoriler"
  durumuna düşmüyordu. Artık orijinal `"Tümü"` değeriyle doğrudan
  karşılaştırılıyor.
- **Bilinen teknik borç:** `app-controller.js` amaçlı olarak tek dosyada
  tutuluyor (yukarıdaki mimari bölümüne bakın); kademeli olarak özellik
  klasörlerine bölünecek.

---

## 📌 Proje Durumu

KYHaber aktif olarak geliştirilmektedir. Mevcut mimaride temel uygulama yapısı
modüllere ayrılmıştır; `app-controller.js` bilinçli olarak geçici bir ara
adımdır. Amaç, mevcut kullanıcı deneyimini ve işlevleri korurken kodun
sürdürülebilirliğini kademeli olarak artırmaktır.

---

## 🔮 Gelecek Geliştirmeler

- `app-controller.js` içindeki event gruplarının özellik klasörlerine taşınması
- Daha gelişmiş haber filtreleme
- Kullanıcı hesap sistemi
- Backend tabanlı kullanıcı verileri
- Daha gelişmiş finans ekranı
- Performans optimizasyonları
- Daha kapsamlı hata yönetimi
- Daha gelişmiş responsive tasarım
- Test altyapısı

---

## 👨‍💻 Geliştirici

**Kaan Yaraş**

GitHub: https://github.com/kaanyaras0-afk

---

## 📄 Lisans

Bu proje eğitim, portföy ve geliştirme amacıyla oluşturulmuştur.
