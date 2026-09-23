// Samtida Cosmetics — sayfa etkileşimleri
(function () {
    const I18N = window.SamtidaI18n;
    const t = I18N.t;
    const pick = I18N.pick;
    const CONFIG = window.SAMTIDA_CONFIG;
    const CATEGORIES = window.SAMTIDA_CATEGORIES || [];
    const PRODUCTS = window.SAMTIDA_PRODUCTS || [];
    const SERIES = window.SAMTIDA_SERIES || {};

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const categoryBySlug = slug => CATEGORIES.find(c => c.slug === slug);
    const productUrl = p => `/urunler/detay.html?id=${encodeURIComponent(p.id)}`;
    const categoryUrl = slug => `/urunler/index.html?kategori=${slug}`;

    document.documentElement.classList.remove('no-js');

    /* ------------------------------------------------------------------
       Header: şeffaftan beyaza geçiş
       ------------------------------------------------------------------ */
    const header = $('#siteHeader');
    const toTop = $('.to-top');
    function onScroll() {
        const y = window.scrollY;
        header.classList.toggle('fixed', y > 60);
        toTop.classList.toggle('show', y > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ------------------------------------------------------------------
       Mobil menü
       ------------------------------------------------------------------ */
    const menuToggle = $('.menu-toggle');
    function setNav(open) {
        document.body.classList.toggle('nav-open', open);
        document.body.classList.toggle('no-scroll', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    }
    menuToggle.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
    $$('[data-nav-close]').forEach(el => el.addEventListener('click', () => setNav(false)));
    $$('.sub-toggle').forEach(btn => btn.addEventListener('click', () => btn.parentElement.classList.toggle('sub-open')));
    window.addEventListener('resize', () => { if (window.innerWidth > 1100) setNav(false); });

    /* ------------------------------------------------------------------
       Dil seçici
       ------------------------------------------------------------------ */
    $$('.lang-switch button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === I18N.lang);
        btn.addEventListener('click', () => I18N.set(btn.dataset.lang));
    });

    /* ------------------------------------------------------------------
       Teklif modalı
       ------------------------------------------------------------------ */
    const quoteModal = $('#quoteModal');
    let lastFocus = null;

    function openLayer(layer) {
        lastFocus = document.activeElement;
        layer.classList.add('open');
        layer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    }
    function closeLayer(layer) {
        layer.classList.remove('open');
        layer.setAttribute('aria-hidden', 'true');
        if (!document.body.classList.contains('nav-open')) document.body.classList.remove('no-scroll');
        if (lastFocus) lastFocus.focus();
    }

    function openQuote(productName) {
        setNav(false);
        const form = $('.samtida-form', quoteModal);
        const success = $('.form-success', quoteModal);
        form.hidden = false;
        success.hidden = true;
        if (productName) {
            setFormType(form, 'price');
            form.elements.message.value = t('form.productPrefill', '{product} ürünü için fiyat teklifi almak istiyorum.').replace('{product}', productName);
        }
        openLayer(quoteModal);
        setTimeout(() => form.elements.name.focus(), 250);
    }

    document.addEventListener('click', e => {
        const trigger = e.target.closest('[data-open-quote]');
        if (trigger) {
            e.preventDefault();
            openQuote(trigger.dataset.product);
        }
    });
    $$('[data-close]', quoteModal).forEach(el => el.addEventListener('click', () => closeLayer(quoteModal)));

    /* ------------------------------------------------------------------
       İletişim sayfası: kartlar ve form ortak şablondan doldurulur
       ------------------------------------------------------------------ */
    const contactForm = $('#contactForm');
    if (contactForm) {
        contactForm.innerHTML = `
            <div class="form-type" role="tablist">
                <button type="button" class="active" data-type="info" data-i18n="form.infoForm">Bilgi Formu</button>
                <button type="button" data-type="price" data-i18n="form.priceForm">Fiyat Formu</button>
            </div>` + window.SAMTIDA_FORM_FIELDS('contact');
    }
    const contactCards = $('#contactCards');
    if (contactCards) {
        const c = CONFIG;
        contactCards.innerHTML = `
            <div class="contact-card"><i class="fas fa-map-marker-alt"></i><div><h3 data-i18n="footer.hq">Merkez Ofis & Fabrika</h3><p>${c.address}</p></div></div>
            <div class="contact-card"><i class="fas fa-phone"></i><div><h3 data-i18n="footer.phone">Telefon</h3><a href="tel:${c.phoneHref}">${c.phone}</a></div></div>
            <div class="contact-card"><i class="fas fa-envelope"></i><div><h3 data-i18n="footer.email">E-posta</h3><a href="mailto:${c.email}">${c.email}</a></div></div>
            <div class="contact-card"><i class="fas fa-shopping-bag"></i><div><h3 data-i18n="footer.orders">Sipariş</h3><a href="mailto:${c.orderEmail}">${c.orderEmail}</a></div></div>
            <div class="contact-card"><i class="fab fa-whatsapp"></i><div><h3>WhatsApp</h3><a href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener">${c.phone}</a></div></div>`;
    }

    /* ------------------------------------------------------------------
       Formlar (modal + iletişim sayfası)
       ------------------------------------------------------------------ */
    function setFormType(form, type) {
        form.dataset.formType = type;
        $$('.form-type button', form).forEach(b => b.classList.toggle('active', b.dataset.type === type));
    }

    function validate(form) {
        let ok = true;
        const check = (name, valid) => {
            const field = form.elements[name].closest('.field');
            field.classList.toggle('invalid', !valid);
            if (!valid) ok = false;
        };
        const val = name => form.elements[name].value.trim();
        check('name', val('name').length > 1);
        check('surname', val('surname').length > 1);
        check('email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('email')));
        check('phone', val('phone').replace(/\D/g, '').length >= 10);
        check('message', val('message').length > 2);
        const consent = form.elements.consent;
        consent.closest('.consent').classList.toggle('invalid', !consent.checked);
        if (!consent.checked) ok = false;
        return ok;
    }

    $$('.samtida-form').forEach(form => {
        $$('.form-type button', form).forEach(btn => btn.addEventListener('click', () => setFormType(form, btn.dataset.type)));
        form.addEventListener('input', e => {
            const field = e.target.closest('.field');
            if (field) field.classList.remove('invalid');
        });
        form.addEventListener('submit', e => {
            e.preventDefault();
            if (!validate(form)) {
                const firstInvalid = $('.invalid input, .invalid textarea, .consent.invalid input', form);
                if (firstInvalid) firstInvalid.focus();
                return;
            }
            const isPrice = form.dataset.formType === 'price';
            const f = form.elements;
            const subject = `[Samtida] ${isPrice ? 'Fiyat Formu' : 'Bilgi Formu'} - ${f.company.value.trim() || f.name.value.trim() + ' ' + f.surname.value.trim()}`;
            const body = [
                `Ad Soyad: ${f.name.value.trim()} ${f.surname.value.trim()}`,
                `E-posta: ${f.email.value.trim()}`,
                `Telefon: ${f.phone.value.trim()}`,
                `Firma: ${f.company.value.trim() || '-'}`,
                '',
                f.message.value.trim()
            ].join('\n');
            window.location.href = `mailto:${isPrice ? CONFIG.orderEmail : CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            form.reset();
            form.hidden = true;
            const success = form.parentElement.querySelector('.form-success');
            if (success) success.hidden = false;
        });
    });

    /* ------------------------------------------------------------------
       Arama
       ------------------------------------------------------------------ */
    const searchOverlay = $('#searchOverlay');
    const searchInput = $('#searchInput');
    const searchResults = $('#searchResults');
    const normalize = s => s.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');

    function renderSearch() {
        const q = normalize(searchInput.value.trim());
        if (q.length < 2) { searchResults.innerHTML = ''; return; }
        const hits = PRODUCTS.filter(p => {
            const cat = categoryBySlug(p.category);
            const hay = [p.name.tr, pick(p.name), cat.name.tr, pick(cat.name), SERIES[p.series].tr].join(' ');
            return normalize(hay).includes(q);
        }).slice(0, 8);
        searchResults.innerHTML = hits.length
            ? hits.map(p => `
                <a class="search-result" href="${productUrl(p)}">
                    <img src="${p.image}" alt="" loading="lazy">
                    <div><strong>${pick(p.name)}</strong><span>${pick(categoryBySlug(p.category).name)} · ${p.size}</span></div>
                </a>`).join('')
            : `<p>${t('search.empty', 'Aramanızla eşleşen ürün bulunamadı.')}</p>`;
    }
    searchInput.addEventListener('input', renderSearch);
    $$('[data-open-search]').forEach(btn => btn.addEventListener('click', () => {
        openLayer(searchOverlay);
        setTimeout(() => searchInput.focus(), 200);
    }));
    $$('[data-close]', searchOverlay).forEach(el => el.addEventListener('click', () => closeLayer(searchOverlay)));

    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        if (quoteModal.classList.contains('open')) closeLayer(quoteModal);
        else if (searchOverlay.classList.contains('open')) closeLayer(searchOverlay);
        else if (document.body.classList.contains('nav-open')) setNav(false);
    });

    /* ------------------------------------------------------------------
       Kart şablonları
       ------------------------------------------------------------------ */
    function productCard(p) {
        const cat = categoryBySlug(p.category);
        const name = pick(p.name);
        return `
        <article class="product-card">
            <div class="product-card-img">
                <a href="${productUrl(p)}" tabindex="-1"><img src="${p.image}" alt="${name}" loading="lazy"></a>
                <span class="tag">${pick(SERIES[p.series])}</span>
                <div class="product-card-actions">
                    <a href="${productUrl(p)}">${t('common.details', 'İncele')}</a>
                    <button type="button" data-open-quote data-product="${name}">${t('common.requestQuote', 'Teklif İste')}</button>
                </div>
            </div>
            <div class="product-card-body">
                <span class="cat">${pick(cat.name)}</span>
                <h3><a href="${productUrl(p)}">${name}</a></h3>
                <span class="size">${p.size}</span>
            </div>
        </article>`;
    }

    // Anasayfa: ürün grupları carousel
    $$('[data-render="groups"]').forEach(wrap => {
        wrap.innerHTML = CATEGORIES.map((c, i) => `
            <a class="swiper-slide group-card" href="${categoryUrl(c.slug)}">
                <div class="group-card-img">
                    <img src="${c.image}" alt="${pick(c.name)}" loading="lazy">
                    <span class="num">0${i + 1}</span>
                </div>
                <div class="group-card-body">
                    <h3>${pick(c.name)}</h3>
                    <p>${pick(c.desc)}</p>
                    <span class="link-more">${t('common.explore', 'İncele')} <i class="fas fa-arrow-right"></i></span>
                </div>
            </a>`).join('');
    });

    // Markalar: seriye ait ürünler
    $$('[data-series-products]').forEach(wrap => {
        const list = PRODUCTS.filter(p => p.series === wrap.dataset.seriesProducts).slice(0, 4);
        wrap.innerHTML = list.map(productCard).join('');
    });

    /* ------------------------------------------------------------------
       Ürün kataloğu
       ------------------------------------------------------------------ */
    const catalog = $('[data-catalog]');
    if (catalog) {
        const filterBar = $('.filter-bar', catalog);
        const grid = $('.product-grid', catalog);
        const params = new URLSearchParams(window.location.search);
        let active = categoryBySlug(params.get('kategori')) ? params.get('kategori') : 'all';

        const filters = [{ slug: 'all', label: t('catalog.all', 'Tümü'), count: PRODUCTS.length }]
            .concat(CATEGORIES.map(c => ({ slug: c.slug, label: pick(c.name), count: PRODUCTS.filter(p => p.category === c.slug).length })));

        filterBar.innerHTML = filters.map(f =>
            `<button type="button" class="filter-btn" data-filter="${f.slug}">${f.label}<span class="count">(${f.count})</span></button>`).join('');

        function renderCatalog() {
            $$('.filter-btn', filterBar).forEach(b => b.classList.toggle('active', b.dataset.filter === active));
            const list = active === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === active);
            grid.innerHTML = list.length ? list.map(productCard).join('') : `<p class="empty-state">${t('search.empty', 'Ürün bulunamadı.')}</p>`;
            const cat = categoryBySlug(active);
            const title = $('[data-catalog-title]');
            const desc = $('[data-catalog-desc]');
            if (title) title.textContent = cat ? pick(cat.name) : t('catalog.title', 'Ürün Gruplarımız');
            if (desc) desc.textContent = cat ? pick(cat.desc) : t('catalog.lead', 'Konaklama sektörünün tüm banyo ve misafir ihtiyaçları için geliştirilen ürünlerimizi keşfedin.');
        }

        filterBar.addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            active = btn.dataset.filter;
            const url = active === 'all' ? '/urunler/index.html' : categoryUrl(active);
            history.replaceState(null, '', url);
            renderCatalog();
        });
        renderCatalog();
    }

    /* ------------------------------------------------------------------
       Ürün detay
       ------------------------------------------------------------------ */
    const detail = $('[data-product-detail]');
    if (detail) {
        const id = new URLSearchParams(window.location.search).get('id');
        const p = PRODUCTS.find(x => x.id === id);
        if (!p) {
            detail.innerHTML = `
                <div class="empty-state">
                    <h2>${t('detail.notFound', 'Ürün bulunamadı')}</h2>
                    <a class="btn btn-color btn-plus" href="/urunler/index.html">${t('common.allProducts', 'Tüm Ürünler')}</a>
                </div>`;
        } else {
            const cat = categoryBySlug(p.category);
            const name = pick(p.name);
            document.title = `${name} | Samtida Cosmetics`;
            $('[data-detail-title]').textContent = name;
            const crumbCat = $('[data-detail-cat]');
            crumbCat.textContent = pick(cat.name);
            crumbCat.href = categoryUrl(cat.slug);

            detail.innerHTML = `
                <div class="detail-grid">
                    <div class="detail-img" data-anim="fade-left"><img src="${p.image}" alt="${name}"></div>
                    <div class="detail-info" data-anim="fade-right">
                        <span class="eyebrow">${pick(cat.name)}</span>
                        <h1>${name}</h1>
                        <p class="lead">${pick(p.desc)}</p>
                        <table class="spec-table">
                            <tr><th>${t('detail.series', 'Seri')}</th><td>Samtida ${pick(SERIES[p.series])}</td></tr>
                            <tr><th>${t('detail.size', 'Hacim / Ölçü')}</th><td>${p.size}</td></tr>
                            <tr><th>${t('detail.moq', 'Minimum Sipariş')}</th><td>${p.moq.toLocaleString(I18N.lang)} ${t('detail.pcs', 'adet')}</td></tr>
                            <tr><th>${t('detail.custom', 'Özel Baskı')}</th><td>${t('detail.customValue', 'Logo baskı ve özel ambalaj seçeneği')}</td></tr>
                        </table>
                        <div class="btn-row">
                            <button type="button" class="btn btn-color btn-plus" data-open-quote data-product="${name}">${t('common.requestQuote', 'Teklif İste')}</button>
                            <a class="btn btn-outline" href="${categoryUrl(cat.slug)}">${t('detail.back', 'Kategoriye Dön')}</a>
                        </div>
                    </div>
                </div>`;

            const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
            const relWrap = $('[data-related]');
            if (relWrap) relWrap.innerHTML = related.map(productCard).join('');
        }
    }

    /* ------------------------------------------------------------------
       Çeviri — dinamik içerikler oluşturulduktan sonra uygulanır
       ------------------------------------------------------------------ */
    I18N.apply();

    /* ------------------------------------------------------------------
       Slider'lar (Swiper)
       ------------------------------------------------------------------ */
    if (window.Swiper) {
        if ($('.hero-swiper')) {
            new Swiper('.hero-swiper', {
                effect: 'fade',
                fadeEffect: { crossFade: true },
                loop: true,
                speed: 1200,
                autoplay: { delay: 6500, disableOnInteraction: false },
                pagination: { el: '.hero-pagination', clickable: true },
                navigation: { prevEl: '.hero-prev', nextEl: '.hero-next' },
                keyboard: { enabled: true }
            });
        }
        if ($('.groups-swiper')) {
            new Swiper('.groups-swiper', {
                slidesPerView: 1.15,
                spaceBetween: 18,
                speed: 700,
                grabCursor: true,
                navigation: { prevEl: '.groups-prev', nextEl: '.groups-next' },
                pagination: { el: '.groups-progress', type: 'progressbar' },
                breakpoints: {
                    600: { slidesPerView: 2.2, spaceBetween: 24 },
                    1000: { slidesPerView: 3, spaceBetween: 28 },
                    1300: { slidesPerView: 4, spaceBetween: 30 }
                }
            });
        }
    }

    const scrollDown = $('.scroll-down');
    if (scrollDown) scrollDown.addEventListener('click', e => {
        e.preventDefault();
        const target = $(scrollDown.getAttribute('href'));
        if (target) window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
    });

    /* ------------------------------------------------------------------
       Sekmeler (Misyon / Vizyon)
       ------------------------------------------------------------------ */
    $$('.tabs').forEach(tabs => {
        const scope = tabs.parentElement;
        $$('.tab-btn', tabs).forEach(btn => btn.addEventListener('click', () => {
            $$('.tab-btn', tabs).forEach(b => b.classList.toggle('active', b === btn));
            $$('.tab-panel', scope).forEach(p => p.classList.toggle('active', p.id === btn.dataset.tab));
        }));
    });

    /* ------------------------------------------------------------------
       Scroll animasyonları & sayaçlar
       ------------------------------------------------------------------ */
    function countUp(el) {
        const target = parseInt(el.dataset.count, 10);
        const start = performance.now();
        const dur = 1600;
        (function step(now) {
            const k = Math.min((now - start) / dur, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(step);
        })(start);
    }

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('in-view');
                if (entry.target.dataset.count) countUp(entry.target);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        $$('[data-anim], [data-count]').forEach(el => io.observe(el));
    } else {
        $$('[data-anim]').forEach(el => el.classList.add('in-view'));
    }
})();
