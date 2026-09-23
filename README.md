# Samtida Cosmetics — Static Website

Samtida Cosmetics is a static (HTML/CSS/JS) website for hotel cosmetics and dispenser solutions. It needs no backend and can be deployed to any static host.

## Pages

| Page | File |
| --- | --- |
| Home (hero slider, dispenser series, parallax bands, about, product groups carousel, production standards) | `index.html` |
| About us (story, mission/vision/quality, timeline) | `hakkimizda.html` |
| Production (integrated production stages) | `uretim.html` |
| Dispenser (models, technical specifications) | `dispenser.html` |
| Brands (Pure Blanc, Ambre Noir, Lavanda series) | `markalar.html` |
| Sustainability | `surdurulebilirlik.html` |
| Contact (info cards, form, map) | `iletisim.html` |
| Product catalog, filterable by category (`?kategori=`) | `urunler/index.html` |
| Product detail (`?id=`) | `urunler/detay.html` |

## Structure

- `css/style.css` — design system (colors `--site-title-color: #ee6e01`, `--site-color: #656366`, cream `#f8f1e9`; Montserrat + Inter fonts), header, slider, parallax, cards, modal, footer, responsive rules
- `js/layout.js` — shared header, footer, quote modal, search overlay and WhatsApp button, injected into every page. **Contact details (phone, email, address, WhatsApp, social links) are edited in the `CONFIG` object at the top of this file.**
- `js/products.js` — product groups, series and product data (TR/EN/RU text)
- `js/script.js` — sticky header, mobile menu, Swiper sliders, modal/form validation, search, catalog and detail rendering, scroll animations
- `js/lang.js` + `js/lang/en.js`, `js/lang/ru.js` — multilingual support. Turkish text lives in the HTML; EN/RU translations are applied through `data-i18n` keys.
- `images/samtida/` — images (Unsplash-licensed placeholder photos; replace them with real product photos)

Forms have no backend: after validation they open the user's email app with a pre-filled message (`info@` for the information form, `siparis@` for the price form).

## Running locally

Pages use root-relative paths (`/css/...`), so they must be served from a server:

```bash
python3 -m http.server 8000
# http://localhost:8000
```
