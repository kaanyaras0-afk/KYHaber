# Arayüz katmanı

`news-ui.js`, haber kartlarının ve haber listesinin DOM’a basılmasından
sorumludur. Veri alma veya filtreleme yapmaz; kart state bilgisini storage
katmanından okur.

İleride kart üretimi büyürse `news-card.js`, `news-list.js` ve
`formatters.js` olarak ayrılabilir.