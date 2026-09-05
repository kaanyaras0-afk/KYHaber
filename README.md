# KYHaber 📰

Modern ve modüler yapıda geliştirilmiş, **Vanilla JavaScript tabanlı haber ve finans platformu.**

KYHaber; güncel haberleri kategori, şehir ve arama seçenekleriyle sunarken aynı zamanda finans verilerini de tek bir arayüz üzerinden göstermeyi amaçlar.
---
## 🌐 Canlı Demo

**https://kaanyaras0-afk.github.io/KYHaber/**

---

## 🚀 Özellikler

* 📰 Güncel haberler
* 🔎 Haber arama
* 🏙️ Şehir bazlı haberler
* 🗂️ Haber kategorileri
* 📄 Sayfalama
* 💰 Finans verileri
* 🌍 3D dünya/ülke bölümü
* ⭐ Favori haberler
* 📚 Okuma listesi
* 💾 LocalStorage ile veri saklama
* 📱 Responsive arayüz
* ⚡ Vanilla JavaScript
* 🧩 Modüler JavaScript mimarisi
* 🔐 API anahtarının frontend'de tutulmaması

---

## 🛠️ Kullanılan Teknolojiler

* HTML5
* CSS3
* JavaScript (ES6+)
* Bootstrap
* Font Awesome
* NewsData.io
* Cloudflare Workers
* GitHub Pages
* LocalStorage

---

## 🏗️ Proje Mimarisi

```text
KYHaber/
│
├── css/
│
├── js/
│   ├── app.js
│   ├── api.js
│   ├── data.js
│   ├── filters.js
│   ├── world.js
│   │
│   ├── core/
│   │   └── dom.js
│   │
│   ├── data/
│   │   └── catalogs.js
│   │
│   ├── features/
│   │   ├── app/
│   │   │   └── app-controller.js
│   │   │
│   │   ├── news/
│   │   │   └── filters.js
│   │   │
│   │   └── world/
│   │       └── world.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── storage/
│   │   └── storage.js
│   │
│   └── ui/
│       └── news-ui.js
│
├── index.html
├── .gitignore
└── README.md
```

> Aktif giriş zinciri: index.html → js/app.js → js/features/app/app-controller.js. Haber ve finans servislerinin aktif uygulaması js/services/api.js dosyasındadır. Repodaki bazı kök seviye modül dosyaları eski/uyumluluk dosyaları olarak birlikte tutulmaktadır.

---

## 🔐 API Güvenliği

KYHaber'in frontend tarafında **NewsData API anahtarı tutulmaz.**

İstek yapısı:

```text
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

API anahtarı Cloudflare Worker üzerinde **Secret** olarak saklanır.

Frontend yalnızca Worker'a istek gönderir.

Bu sayede API anahtarının GitHub Pages üzerinde kullanıcıya açık şekilde gönderilmesi engellenir.

> Not: Worker'ın deploy edilmiş endpoint'i bu projede kullanılır; Worker kaynak kodu ve deploy konfigürasyonu bu repository içinde bulunmamaktadır.

> Daha önce açığa çıkmış API anahtarlarının güvenlik nedeniyle yenilenmesi önerilir.

---

## 💰 Finans Veri Akışı

Finans verileri de frontend tarafından doğrudan üçüncü taraf servise gönderilmez.

```text
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

```text
doviz
table
altin
news
```

---

## ⚙️ Cloudflare Worker

KYHaber'in backend/proxy katmanı Cloudflare Workers üzerinde çalışmaktadır.

Worker'ın temel görevleri:

* NewsData API isteklerini yönetmek
* API anahtarını gizli tutmak
* Finans API isteklerini yönlendirmek
* CORS kontrolü yapmak
* Frontend ile harici API'ler arasında güvenli bir ara katman oluşturmak

Frontend tarafında API anahtarı bulunmaz.

---

## 💻 Lokal Çalıştırma

Projeyi bilgisayarınıza klonlayın:

```bash
git clone https://github.com/kaanyaras0-afk/KYHaber.git
```

Proje klasörüne girin:

```bash
cd KYHaber
```

Ardından projeyi **Live Server** gibi bir statik sunucu ile çalıştırın.

JavaScript ES Modules kullanıldığı için `index.html` dosyasını doğrudan:

```text
file://
```

üzerinden açmak yerine HTTP üzerinden çalıştırmanız gerekir.

Örneğin:

```text
http://127.0.0.1:5500/
```

---

## 📦 Veri Yönetimi

Uygulamada tarayıcı tarafında LocalStorage kullanılarak bazı kullanıcı verileri saklanmaktadır.

Örneğin:

* Favoriler
* Okuma listesi
* Kullanıcı tercihleri
* Cache verileri

---

## 📌 Proje Durumu

KYHaber aktif olarak geliştirilmektedir.

Mevcut mimaride temel uygulama yapısı modüllere ayrılmıştır.

Amaç; mevcut kullanıcı deneyimini ve işlevleri korurken kodun sürdürülebilirliğini artırmaktır.

---

## 🔮 Gelecek Geliştirmeler

* Daha gelişmiş haber filtreleme
* Kullanıcı hesap sistemi
* Backend tabanlı kullanıcı verileri
* Daha gelişmiş finans ekranı
* Performans optimizasyonları
* Daha kapsamlı hata yönetimi
* Daha gelişmiş responsive tasarım
* Test altyapısı

---

## 👨‍💻 Geliştirici

**Kaan Yaraş**

GitHub:

https://github.com/kaanyaras0-afk

---

## 📄 Lisans

Bu proje eğitim, portföy ve geliştirme amacıyla oluşturulmuştur.
