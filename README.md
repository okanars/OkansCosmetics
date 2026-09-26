# Samtida Kozmetik — Static Website

Samtida Kozmetik is a static (HTML/CSS/JS) website for hotel cosmetics and dispenser solutions. It needs no backend and can be deployed to any static host.

## Pages

Content and contact details follow the live site at [samtida.com.tr](https://samtida.com.tr).

| Page | File |
| --- | --- |
| Home (hero slider, product categories, why Samtida, featured products, standards, latest blog posts) | `index.html` |
| Corporate: About us, Scope of services, Our standards, Sustainability, Vision & mission | `hakkimizda.html`, `hizmet-kapsami.html`, `standartlarimiz.html`, `surdurulebilirlik.html`, `vizyon-misyon.html` |
| Hotel dispensers (300 / 350 / 400 ml, refill) | `dispenser.html` |
| Product catalog, filterable by category (`?kategori=`) — 49 products in 3 categories | `urunler/index.html` |
| Product pages, one per product (generated), with sample/quote form and WhatsApp link | `urunler/<id>.html` (template: `urunler/detay.html`) |
| Blog list and posts (generated) — Turkish only | `blog.html`, `blog/<slug>.html` (template: `blog-yazi.html`) |
| Not found page | `404.html` |
| Contact (info cards, request form, map) | `iletisim.html` |
| Privacy policy, Terms of use — Turkish only | `gizlilik-politikasi.html`, `kullanim-kosullari.html` |

## Structure

- `css/style.css` — design system with light/dark theme tokens (`:root` and `:root[data-theme="dark"]`), header, slider, cards, modal, footer, mobile quick bar, splash screen and RTL rules for Arabic
- `js/lang.js` — loaded synchronously in `<head>`: picks the language (saved choice › browser language › Turkish), sets `lang`/`dir`, loads the dictionary, applies the theme (saved choice › OS setting) and the once-per-session splash screen
- `js/lang/{en,de,fr,ru,uk,ar}.js` — translations. Turkish text lives in the HTML and is swapped via `data-i18n` keys.
- `js/layout.js` — shared header (language menu, theme toggle), footer, quote modal, search, mobile quick bar and WhatsApp button. **Contact details and the optional hero video override are edited in the `CONFIG` object at the top of this file.**
- `js/products.js` — product categories and the 49 products in 7 languages; hotel dispensers are the main product line and are listed first
- `js/blog.js` — blog posts (Turkish only). Each post has `category`, `date` (YYYY-MM-DD), optional `updated`, `tags` and `products` (product ids shown under the post); the table of contents is built from the `<h3>` headings. Content can use `p.lead`, `.callout` (`--summary`, `--note`), `ol.steps`, `ul.checklist`, `<figure>`, `<blockquote>`, `<table class="article-table">` and `<details>` for FAQs.
- `js/script.js` — sliders, sticky/auto-hiding header, theme and language switching, forms, search, catalogue, detail and blog rendering, scroll animations
- `manifest.webmanifest` + `images/samtida/icon-*.png` — "add to home screen" support on mobile
- `tools/build.mjs` — SEO build step (see below)
- `images/samtida/` — logos, the social share image (`og-image.jpg`), page images and product photos (`urunler/`) taken from samtida.com.tr; only the refill slider background (`hero-dispenser.jpg`) comes from Unsplash

### Videos

Dispenser videos live in `images/samtida/videos/`, each with a desktop file, a smaller `-sm` file for phones and a `.jpg` poster:

- `dispenser-hotel` — home page hero (first slide, 10 s) and the dispenser page banner.
- `dispenser-public` — home page parallax band and the "Common Areas" section of the dispenser page.
- `amenities-room` — complementary (kraft) products: centre card of the home page "Complementary Products" section and the product catalogue banner (the catalogue switches to `dispenser-hotel` when the dispenser category is selected). Scenes with unreadable AI-generated labels were cut, leaving a 6.5 s loop.

Videos are muted, start only when they scroll into view and pause when they leave it. Visitors with reduced-motion or data-saver settings see the poster instead (on the home hero, the photo showcase). To swap the home hero video, set `heroVideo` in `js/layout.js`. Stills taken from the videos are in `images/samtida/disp/`.

To add a new video, re-encode it without sound, for example:

```bash
ffmpeg -i input.mp4 -an -c:v libx264 -crf 24 -vf scale=1280:-2 -movflags +faststart out.mp4
ffmpeg -i input.mp4 -an -c:v libx264 -crf 26 -vf scale=854:-2 -movflags +faststart out-sm.mp4
```

Forms have no backend: after validation they open the user's email app with a pre-filled message to `info@samtida.com.tr`, with the request type (general message / quote / sample) in the subject.

## SEO and the build step

Product and blog pages are generated as static HTML so that search engines and link previews (WhatsApp, LinkedIn, Facebook) see the content without running JavaScript. **After changing products, blog posts, page titles or contact details, run:**

```bash
node tools/build.mjs
```

The script (Node 18+, no dependencies):

- writes `urunler/<id>.html` for every product and `blog/<slug>.html` for every post, with the Turkish content already in the HTML;
- updates each page's `<title>` and meta description (kept in the `PAGES` list in the script), plus a generated `<head>` block between `<!-- seo:start -->` and `<!-- seo:end -->`: canonical URL, `hreflang` links, Open Graph/Twitter tags and schema.org data (Organization, WebSite, BreadcrumbList, BlogPosting);
- fills the `<!--pre:…-->` placeholders (catalogue, home dispensers and latest posts, blog list) with static links;
- writes `sitemap.xml` and `robots.txt`.

The live domain is set by `SITE` at the top of `tools/build.mjs` (`https://samtida.com.tr`). Do not edit generated files or the `seo:start` block by hand.

Languages and search engines:

- Search engine bots always get the Turkish page. Other languages have their own URLs, `?lang=en`, `?lang=de` and so on, which are listed as `hreflang` alternates; choosing a language in the menu also switches to that URL.
- Visitors still get their browser language on the first visit, and their choice is remembered.
- Old links (`urunler/detay.html?id=…`, `blog-yazi.html?yazi=…`) redirect to the new pages; the templates themselves are `noindex`.

After going live: verify the domain in Google Search Console and submit `https://samtida.com.tr/sitemap.xml`. Make sure the host serves `404.html` for missing pages (automatic on Netlify, Vercel, GitHub Pages and Cloudflare Pages; Apache needs `ErrorDocument 404 /404.html`).

## Running locally

Pages use root-relative paths (`/css/...`), so they must be served from a server:

```bash
python3 -m http.server 8000
# http://localhost:8000
```
