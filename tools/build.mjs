#!/usr/bin/env node
// Samtida Kozmetik — SEO derlemesi (bağımlılık gerektirmez, Node 18+)
// Kullanım: node tools/build.mjs
//
// Ürün, blog veya sayfa metinleri değiştiğinde çalıştırın. Betik:
//  - Statik sayfaların <title>, açıklama ve <head> SEO bloğunu (kanonik adres, hreflang,
//    Open Graph, yapılandırılmış veri) günceller,
//  - Her ürün için /urunler/<id>.html, her blog yazısı için /blog/<slug>.html üretir
//    (içerik HTML'de hazır gelir; arama motorları ve paylaşım önizlemeleri JavaScript'e bağlı kalmaz),
//  - sitemap.xml ve robots.txt dosyalarını yazar.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://samtida.com.tr';          // yayındaki alan adı
const BRAND = 'Samtida Kozmetik';
const LANGS = ['tr', 'en', 'de', 'fr', 'ru', 'uk', 'ar'];
const DEFAULT_IMAGE = '/images/samtida/og-image.jpg';
const GENERATOR = '<meta name="generator" content="samtida-build">';

const read = p => readFileSync(join(ROOT, p), 'utf8');
const write = (p, s) => { mkdirSync(dirname(join(ROOT, p)), { recursive: true }); writeFileSync(join(ROOT, p), s); };
const mdate = p => statSync(join(ROOT, p)).mtime.toISOString().slice(0, 10);
const load = file => { const ctx = { window: {} }; vm.runInNewContext(read(file), ctx); return ctx.window; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const abs = p => (p.startsWith('http') ? p : SITE + p);
const clip = (text, max = 158) => {
    const s = String(text).replace(/\s+/g, ' ').trim();
    return s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
};

const { SAMTIDA_CATEGORIES: CATEGORIES, SAMTIDA_PRODUCTS: PRODUCTS } = load('js/products.js');
const BLOG = load('js/blog.js').SAMTIDA_BLOG.slice().sort((a, b) => b.date.localeCompare(a.date));
const catOf = p => CATEGORIES.find(c => c.slug === p.category);

// İletişim bilgileri js/layout.js > CONFIG'den okunur
const layoutSrc = read('js/layout.js');
const cfg = key => (layoutSrc.match(new RegExp(`${key}:\\s*'([^']*)'`)) || [])[1];

/* ------------------------------------------------------------------
   Yapılandırılmış veri (schema.org)
   ------------------------------------------------------------------ */
const ORG_ID = `${SITE}/#organization`;
const organization = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: BRAND,
    alternateName: 'Samtida',
    url: `${SITE}/`,
    logo: abs('/images/samtida/icon-512.png'),
    image: abs(DEFAULT_IMAGE),
    description: 'Otel ve konaklama tesislerine özel duvar tipi dispenser sistemleri, kraft ambalajlı buklet ürünleri ve logolu kişisel bakım ürünleri.',
    email: cfg('email'),
    telephone: `+${cfg('phoneHref').replace(/\D/g, '')}`,
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Zafer Mah. Doğan Araslı Blv. Ottoman Ofis Rezidans B Blok No:95 İç Kapı No:109',
        addressLocality: 'Esenyurt',
        addressRegion: 'İstanbul',
        addressCountry: 'TR'
    },
    sameAs: [cfg('instagram')].filter(Boolean),
    contactPoint: [{
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: `+${cfg('phoneHref').replace(/\D/g, '')}`,
        email: cfg('email'),
        areaServed: 'TR',
        availableLanguage: ['Turkish']
    }]
};
const website = {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: `${SITE}/`,
    name: BRAND,
    inLanguage: 'tr-TR',
    publisher: { '@id': ORG_ID }
};
const breadcrumb = items => ({
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) }))
});
const HOME = ['Anasayfa', '/'];

/* ------------------------------------------------------------------
   <head> SEO bloğu
   ------------------------------------------------------------------ */
function seoBlock({ path, title, desc, image = DEFAULT_IMAGE, type = 'website', hreflang = false, noindex = false, graph = [], preload }) {
    const url = abs(path);
    const lines = ['<!-- seo:start — tools/build.mjs tarafından üretilir, elle düzenlemeyin -->'];
    if (noindex) {
        lines.push('<meta name="robots" content="noindex, follow">');
    } else {
        lines.push(`<link rel="canonical" href="${url}">`);
        lines.push('<meta name="robots" content="index, follow, max-image-preview:large">');
        if (hreflang) {
            LANGS.forEach(l => lines.push(`<link rel="alternate" hreflang="${l}" href="${l === 'tr' ? url : `${url}?lang=${l}`}">`));
            lines.push(`<link rel="alternate" hreflang="x-default" href="${url}">`);
        }
    }
    if (preload) lines.push(`<link rel="preload" as="image" href="${preload}" fetchpriority="high">`);
    lines.push(
        `<meta property="og:type" content="${type}">`,
        `<meta property="og:site_name" content="${BRAND}">`,
        '<meta property="og:locale" content="tr_TR">',
        `<meta property="og:title" content="${esc(title)}">`,
        `<meta property="og:description" content="${esc(desc)}">`,
        `<meta property="og:url" content="${url}">`,
        `<meta property="og:image" content="${abs(image)}">`,
        '<meta name="twitter:card" content="summary_large_image">',
        `<meta name="twitter:title" content="${esc(title)}">`,
        `<meta name="twitter:description" content="${esc(desc)}">`,
        `<meta name="twitter:image" content="${abs(image)}">`
    );
    if (graph.length) {
        const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
        lines.push(`<script type="application/ld+json">${json}</script>`);
    }
    lines.push('<!-- seo:end -->');
    return lines.map(l => `    ${l}`).join('\n');
}

// Başlığı, açıklamayı ve SEO bloğunu sayfaya yerleştirir (tekrar çalıştırılabilir)
function applyHead(html, meta) {
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`);
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(meta.desc)}">`);
    html = html.replace(/\n\s*<!-- seo:start[\s\S]*?<!-- seo:end -->/, '');
    html = html.replace(/(<meta name="description" content="[^"]*">)/, `$1\n${seoBlock(meta)}`);
    return html;
}

// <!--pre:ad-->…<!--/pre:ad--> işaretleri arasına önceden çizilmiş içerik koyar
function fill(html, name, content) {
    const re = new RegExp(`<!--pre:${name}-->[\\s\\S]*?<!--/pre:${name}-->`);
    if (!re.test(html)) throw new Error(`"${name}" işareti bulunamadı`);
    return html.replace(re, `<!--pre:${name}-->${content}<!--/pre:${name}-->`);
}

/* ------------------------------------------------------------------
   Önceden çizilen içerik (Türkçe; tarayıcıda script.js aynı alanı yeniden çizer)
   ------------------------------------------------------------------ */
const productUrl = p => `/urunler/${p.id}.html`;
const blogUrl = post => `/blog/${post.slug}.html`;
const BLOG_CATS = { dispenser: 'Dispenser Sistemleri', sustainability: 'Sürdürülebilirlik', brand: 'Marka & Tasarım', operations: 'Operasyon Rehberi', experience: 'Misafir Deneyimi' };
const trDate = d => new Intl.DateTimeFormat('tr', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${d}T12:00:00`));
const readMinutes = post => Math.max(1, Math.round(post.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 180));
const blogMeta = post => `<div class="blog-meta"><span class="blog-cat">${BLOG_CATS[post.category]}</span><span><i class="far fa-calendar"></i><time datetime="${post.date}">${trDate(post.date)}</time></span><span><i class="far fa-clock"></i>${readMinutes(post)} dk okuma</span></div>`;

const productCard = p => {
    const cat = catOf(p);
    return `<article class="product-card"><div class="product-card-img"><a href="${productUrl(p)}" tabindex="-1"><img src="${p.image}" alt="${esc(p.name.tr)}" loading="lazy"></a><span class="tag">${cat.packaging.tr.split(' (')[0]}</span></div><div class="product-card-body"><span class="cat">${cat.name.tr}</span><h3><a href="${productUrl(p)}">${p.name.tr}</a></h3></div></article>`;
};
const blogCard = post => `<a class="blog-card" href="${blogUrl(post)}"><div class="blog-card-img"><img src="${post.image}" alt="" loading="lazy"></div><div class="blog-card-body">${blogMeta(post)}<h3>${post.title}</h3><p>${post.excerpt}</p><span class="link-more">Devamını Oku <i class="fas fa-arrow-right"></i></span></div></a>`;
const dispCard = p => `<a class="disp-card" href="${productUrl(p)}"><div class="disp-card-img"><img src="${p.image}" alt="${esc(p.name.tr)}" loading="lazy"></div><h3>${p.name.tr}</h3><span class="cap">300 · 350 · 400 ml</span></a>`;

/* ------------------------------------------------------------------
   Statik sayfalar
   ------------------------------------------------------------------ */
const DISPENSERS = PRODUCTS.filter(p => p.category === 'otel-tipi-dispanser');
const PAGES = [
    {
        file: 'index.html', path: '/', hreflang: true, preload: '/images/samtida/videos/dispenser-hotel.jpg',
        title: 'Samtida Kozmetik | Otel Tipi Dispenser Sistemleri ve Buklet Ürünleri',
        desc: 'Otel tipi duvar dispenserleri (300–400 ml), logolu şampuan, duş jeli, sıvı sabun ve kraft ambalajlı buklet ürünleri. GMP ve ISO 22716 standartlarında üretim.',
        graph: [organization, website],
        prerender: { dispensers: DISPENSERS.map(dispCard).join(''), 'home-blog': BLOG.slice(0, 3).map(blogCard).join('') }
    },
    {
        file: 'dispenser.html', path: '/dispenser.html', hreflang: true, image: '/images/samtida/videos/dispenser-hotel.jpg', preload: '/images/samtida/videos/dispenser-hotel.jpg',
        title: 'Otel Tipi Dispenser Sistemleri (300–400 ml) | Samtida Kozmetik',
        desc: 'Duvar tipi, yeniden doldurulabilir otel dispenserleri: şampuan, saç kremi, duş jeli, sıvı sabun ve vücut losyonu. Otelinize özel logo, 300, 350 ve 400 ml seçenekleri.',
        crumbs: [['Otel Tipi Dispenser', '/dispenser.html']]
    },
    {
        file: 'urunler/index.html', path: '/urunler/index.html', hreflang: true, image: '/images/samtida/disp/amenities-tray.jpg',
        title: 'Otel Buklet Ürünleri Kataloğu | Samtida Kozmetik',
        desc: 'Otel tipi dispenserler, kraft kutulu ve kraft poşet ambalajlı buklet ürünleri: diş seti, tıraş seti, terlik, duş bonesi ve daha fazlası. Otelinize özel logolu üretim.',
        crumbs: [['Ürünlerimiz', '/urunler/index.html']],
        prerender: { catalog: PRODUCTS.map(productCard).join('') }
    },
    {
        file: 'hakkimizda.html', path: '/hakkimizda.html', hreflang: true,
        title: 'Hakkımızda | Samtida Kozmetik – Otel Buklet Ürünleri',
        desc: 'Samtida Kozmetik; otel ve konaklama tesislerine özel dispenser sistemleri, kraft ambalajlı buklet ürünleri ve logolu kişisel bakım ürünleri sunan bir markadır.',
        crumbs: [['Hakkımızda', '/hakkimizda.html']]
    },
    {
        file: 'hizmet-kapsami.html', path: '/hizmet-kapsami.html', hreflang: true,
        title: 'Hizmet Kapsamı | Samtida Kozmetik',
        desc: 'Samtida Kozmetik hizmet kapsamı: duvar tipi dispenser sistemleri, kraft ambalajlı buklet ürünleri, bakım kitleri, lüks terlikler ve otelinize özel marka uygulaması.',
        crumbs: [['Hizmet Kapsamı', '/hizmet-kapsami.html']]
    },
    {
        file: 'standartlarimiz.html', path: '/standartlarimiz.html', hreflang: true,
        title: 'Üretim Standartlarımız: GMP ve ISO 22716 | Samtida Kozmetik',
        desc: 'Samtida Kozmetik üretim standartları: T.C. Sağlık Bakanlığı onaylı içerikler, GMP – İyi Üretim Uygulamaları ve ISO 22716 Kozmetik Üretim Kalite Sertifikası.',
        crumbs: [['Standartlarımız', '/standartlarimiz.html']]
    },
    {
        file: 'surdurulebilirlik.html', path: '/surdurulebilirlik.html', hreflang: true,
        title: 'Sürdürülebilirlik: Refill ve Kraft Ambalaj | Samtida Kozmetik',
        desc: 'Refill (yeniden dolum) dispenser sistemleri, geri dönüştürülebilir kraft ambalaj ve minimum atık, maksimum etki prensibiyle sürdürülebilir otel buklet ürünleri.',
        crumbs: [['Sürdürülebilirlik', '/surdurulebilirlik.html']]
    },
    {
        file: 'vizyon-misyon.html', path: '/vizyon-misyon.html', hreflang: true,
        title: 'Vizyon & Misyon | Samtida Kozmetik',
        desc: 'Samtida Kozmetik vizyonu ve misyonu: otellere kaliteli, estetik ve sürdürülebilir ürünler sunarak misafir deneyimini güçlendirmek.',
        crumbs: [['Vizyon & Misyon', '/vizyon-misyon.html']]
    },
    {
        file: 'blog.html', path: '/blog.html',
        title: 'Blog: Otel Dispenser ve Buklet Rehberleri | Samtida Kozmetik',
        desc: 'Otel dispenser sistemleri, buklet ürün seçimi, kat hizmetleri, sürdürülebilirlik ve marka deneyimi üzerine uygulamalı rehberler ve yazılar.',
        crumbs: [['Blog', '/blog.html']],
        prerender: { 'blog-grid': BLOG.map(blogCard).join('') }
    },
    {
        file: 'iletisim.html', path: '/iletisim.html', hreflang: true,
        title: 'İletişim ve Teklif | Samtida Kozmetik – Esenyurt, İstanbul',
        desc: `Numune ve teklif için Samtida Kozmetik ile iletişime geçin: ${cfg('phone')} · ${cfg('email')} · Ottoman Ofis Rezidans, Esenyurt / İstanbul.`,
        crumbs: [['İletişim', '/iletisim.html']],
        graph: [organization, { '@type': 'ContactPage', url: abs('/iletisim.html'), name: 'İletişim', about: { '@id': ORG_ID } }]
    },
    {
        file: 'gizlilik-politikasi.html', path: '/gizlilik-politikasi.html',
        title: 'Gizlilik Politikası | Samtida Kozmetik',
        desc: 'Samtida Kozmetik gizlilik politikası: kişisel verilerin toplanması, kullanımı, çerezler ve güvenlik hakkında bilgilendirme.',
        crumbs: [['Gizlilik Politikası', '/gizlilik-politikasi.html']]
    },
    {
        file: 'kullanim-kosullari.html', path: '/kullanim-kosullari.html',
        title: 'Kullanım Koşulları | Samtida Kozmetik',
        desc: 'Samtida Kozmetik web sitesi kullanım koşulları: içerik ve mülkiyet hakları, harici bağlantılar, sorumluluk reddi ve güncellemeler.',
        crumbs: [['Kullanım Koşulları', '/kullanim-kosullari.html']]
    },
    // Eski/yedek şablonlar: dizinlenmez, ziyaretçiyi kalıcı sayfaya yönlendirir
    { file: 'urunler/detay.html', path: '/urunler/detay.html', noindex: true, title: 'Ürün Detayı | Samtida Kozmetik', desc: 'Samtida Kozmetik otel buklet ürünü detayları.' },
    { file: 'blog-yazi.html', path: '/blog-yazi.html', noindex: true, title: 'Blog | Samtida Kozmetik', desc: 'Samtida Kozmetik blog yazısı.' },
    { file: '404.html', path: '/404.html', noindex: true, title: 'Sayfa Bulunamadı | Samtida Kozmetik', desc: 'Aradığınız sayfa bulunamadı.' }
];

for (const page of PAGES) {
    let html = read(page.file);
    const graph = (page.graph || []).slice();
    if (page.crumbs) graph.push(breadcrumb([HOME, ...page.crumbs]));
    html = applyHead(html, { ...page, graph });
    for (const [name, content] of Object.entries(page.prerender || {})) html = fill(html, name, content);
    write(page.file, html);
}

/* ------------------------------------------------------------------
   Ürün sayfaları: /urunler/<id>.html
   ------------------------------------------------------------------ */
const removeGenerated = dir => {
    if (!existsSync(join(ROOT, dir))) return;
    for (const f of readdirSync(join(ROOT, dir))) {
        if (f.endsWith('.html') && read(`${dir}/${f}`).includes(GENERATOR)) unlinkSync(join(ROOT, dir, f));
    }
};
removeGenerated('urunler');
removeGenerated('blog');

const productTpl = read('urunler/detay.html');
for (const p of PRODUCTS) {
    const cat = catOf(p);
    const name = p.name.tr;
    const desc = (p.desc || cat.desc).tr;
    const quoteName = `${name} (${cat.name.tr})`;
    const waText = `Merhaba, ${quoteName} hakkında bilgi almak istiyorum.`;
    const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    const detailHtml = `<div class="detail-grid"><div class="detail-img"><img src="${p.image}" alt="${esc(name)}"></div><div class="detail-info"><span class="eyebrow">${cat.name.tr}</span><h2 class="detail-title">${name}</h2><p class="lead">${desc}</p><table class="spec-table"><tr><th>Kategori</th><td><a href="/urunler/index.html?kategori=${cat.slug}">${cat.name.tr}</a></td></tr><tr><th>Ambalaj</th><td>${cat.packaging.tr}</td></tr><tr><th>Özel Baskı</th><td>Otel kimliğine özel logo baskı ve ambalaj</td></tr><tr><th>Üretim Standardı</th><td>GMP · ISO 22716</td></tr></table><div class="btn-row"><button type="button" class="btn btn-color btn-plus" data-open-quote data-product="${esc(quoteName)}">Numune / Teklif İste</button><a class="btn btn-outline" href="https://wa.me/${cfg('whatsapp')}?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp ile Yaz</a></div></div></div>`;

    let html = applyHead(productTpl, {
        path: productUrl(p), hreflang: true, image: p.image,
        title: `${name} – ${cat.name.tr} | ${BRAND}`,
        desc: clip(desc),
        graph: [breadcrumb([HOME, ['Ürünlerimiz', '/urunler/index.html'], [cat.name.tr, `/urunler/index.html?kategori=${cat.slug}`], [name, productUrl(p)]])]
    });
    html = html.replace('<meta name="description"', `${GENERATOR}\n    <meta name="description"`)
        .replace(/<h1 data-detail-title>[^<]*<\/h1>/, `<h1 data-detail-title>${name}</h1>`)
        .replace(/<a href="[^"]*" data-detail-cat><\/a>/, `<a href="/urunler/index.html?kategori=${cat.slug}" data-detail-cat>${cat.name.tr}</a>`)
        .replace('<div class="container" data-product-detail></div>', `<div class="container" data-product-detail="${p.id}">${detailHtml}</div>`)
        .replace('<div class="product-grid" data-related></div>', `<div class="product-grid" data-related>${related.map(productCard).join('')}</div>`);
    write(productUrl(p).slice(1), html);
}

/* ------------------------------------------------------------------
   Blog yazıları: /blog/<slug>.html
   ------------------------------------------------------------------ */
const blogTpl = read('blog-yazi.html');
for (const post of BLOG) {
    const url = blogUrl(post);
    let html = applyHead(blogTpl, {
        path: url, image: post.image, type: 'article',
        // Uzun başlıklarda marka eki eklenmez (Google ~60 karakterden sonrasını keser)
        title: post.title.length > 45 ? post.title : `${post.title} | ${BRAND}`,
        desc: clip(post.excerpt),
        graph: [
            {
                '@type': 'BlogPosting',
                headline: post.title,
                description: post.excerpt,
                image: [abs(post.image)],
                datePublished: post.date,
                dateModified: post.updated || post.date,
                inLanguage: 'tr-TR',
                articleSection: BLOG_CATS[post.category],
                keywords: (post.tags || []).join(', '),
                author: { '@type': 'Organization', name: BRAND, url: `${SITE}/` },
                publisher: { '@id': ORG_ID },
                mainEntityOfPage: abs(url)
            },
            { ...organization, contactPoint: undefined, address: undefined },
            breadcrumb([HOME, ['Blog', '/blog.html'], [post.title, url]])
        ]
    });
    html = html.replace('<meta name="description"', `${GENERATOR}\n    <meta name="description"`)
        .replace(/(<section class="page-hero" style="background-image:url\(')[^']*/, `$1${post.image}`)
        .replace(/<h1 data-blog-title([^>]*)>[^<]*<\/h1>/, `<h1 data-blog-title$1>${post.title}</h1>`)
        .replace('<div class="article-hero-meta" data-blog-meta></div>', `<div class="article-hero-meta" data-blog-meta>${blogMeta(post)}</div>`)
        .replace('<article class="article" data-blog-post></article>', `<article class="article" data-blog-post="${post.slug}"><div class="article-body" lang="tr">${post.content}</div></article>`);
    write(url.slice(1), html);
}

/* ------------------------------------------------------------------
   sitemap.xml ve robots.txt
   ------------------------------------------------------------------ */
const urls = [
    ...PAGES.filter(p => !p.noindex).map(p => ({ loc: abs(p.path), lastmod: mdate(p.file), priority: p.path === '/' ? '1.0' : p.path === '/dispenser.html' ? '0.9' : '0.7' })),
    ...PRODUCTS.map(p => ({ loc: abs(productUrl(p)), lastmod: mdate('js/products.js'), priority: p.category === 'otel-tipi-dispanser' ? '0.8' : '0.6' })),
    ...BLOG.map(post => ({ loc: abs(blogUrl(post)), lastmod: post.updated || post.date, priority: '0.6' }))
];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

console.log(`Tamam: ${PAGES.length} sayfa, ${PRODUCTS.length} ürün, ${BLOG.length} blog yazısı, sitemap.xml (${urls.length} adres), robots.txt`);
