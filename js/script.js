// Samtida Kozmetik — sayfa etkileşimleri
(function () {
    const I18N = window.SamtidaI18n;
    const t = I18N.t;
    const pick = I18N.pick;
    const CONFIG = window.SAMTIDA_CONFIG;
    const CATEGORIES = window.SAMTIDA_CATEGORIES || [];
    const PRODUCTS = window.SAMTIDA_PRODUCTS || [];
    // Blog yazıları: yeniden eskiye
    const BLOG = (window.SAMTIDA_BLOG || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const categoryBySlug = slug => CATEGORIES.find(c => c.slug === slug);
    // Ürün ve yazı sayfaları tools/build.mjs ile statik olarak üretilir (arama motorları için)
    const productUrl = p => `/urunler/${p.id}.html`;
    const categoryUrl = slug => `/urunler/index.html?kategori=${slug}`;
    const blogUrl = post => `/blog/${post.slug}.html`;
    const setMetaDesc = text => {
        const m = document.querySelector('meta[name="description"]');
        if (m && text) m.content = text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, '')}…` : text;
    };

    document.documentElement.classList.remove('no-js');

    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------------------------
       Açılış ekranı: sayfa yüklenince yumuşakça kaybolur
       ------------------------------------------------------------------ */
    if (root.classList.contains('splash-on')) {
        const shownAt = performance.now();
        let hidden = false;
        const hideSplash = () => {
            if (hidden) return;
            hidden = true;
            const wait = Math.max(0, (reducedMotion ? 300 : 1100) - (performance.now() - shownAt));
            setTimeout(() => {
                root.classList.add('splash-out');
                setTimeout(() => root.classList.remove('splash-on', 'splash-out'), 750);
            }, wait);
        };
        window.addEventListener('load', hideSplash);
        setTimeout(hideSplash, 2600);
    }

    /* ------------------------------------------------------------------
       Header: şeffaftan beyaza geçiş, mobilde aşağı kaydırınca gizlenir
       ------------------------------------------------------------------ */
    const header = $('#siteHeader');
    const toTop = $('.to-top');
    const progress = $('.scroll-progress span');
    let lastY = window.scrollY;
    function onScroll() {
        const y = window.scrollY;
        header.classList.toggle('fixed', y > 60);
        toTop.classList.toggle('show', y > 600);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
        if (window.innerWidth <= 820) header.classList.toggle('hide', y > lastY && y > 320);
        else header.classList.remove('hide');
        lastY = y;
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
    $$('[data-open-menu]').forEach(el => el.addEventListener('click', () => setNav(true)));
    $$('[data-nav-close]').forEach(el => el.addEventListener('click', () => setNav(false)));
    $$('.sub-toggle').forEach(btn => btn.addEventListener('click', () => btn.parentElement.classList.toggle('sub-open')));
    window.addEventListener('resize', () => { if (window.innerWidth > 1100) setNav(false); });

    /* ------------------------------------------------------------------
       Dil seçici
       ------------------------------------------------------------------ */
    $$('[data-lang]').forEach(btn => btn.addEventListener('click', () => I18N.set(btn.dataset.lang)));
    $$('.lang-menu').forEach(menu => {
        const btn = $('.lang-current', menu);
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const open = !menu.classList.contains('open');
            menu.classList.toggle('open', open);
            btn.setAttribute('aria-expanded', String(open));
        });
    });
    const closeLangMenus = () => $$('.lang-menu.open').forEach(m => {
        m.classList.remove('open');
        $('.lang-current', m).setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('click', e => { if (!e.target.closest('.lang-menu')) closeLangMenus(); });

    /* ------------------------------------------------------------------
       Karanlık / aydınlık tema
       ------------------------------------------------------------------ */
    const themeMeta = $('meta[name="theme-color"]');
    const syncThemeMeta = () => { if (themeMeta) themeMeta.content = I18N.theme === 'dark' ? '#121011' : '#ffffff'; };
    syncThemeMeta();
    document.addEventListener('samtida:theme', syncThemeMeta);
    $$('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', () => {
        root.classList.add('theme-anim');
        I18N.setTheme(I18N.theme === 'dark' ? 'light' : 'dark');
        setTimeout(() => root.classList.remove('theme-anim'), 600);
    }));

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
            setFormType(form, 'quote');
            form.elements.message.value = t('form.productPrefill', '{product} için numune / teklif almak istiyorum.').replace('{product}', productName);
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
    if (contactForm) contactForm.innerHTML = window.SAMTIDA_FORM_FIELDS('contact');

    const contactCards = $('#contactCards');
    if (contactCards) {
        const c = CONFIG;
        contactCards.innerHTML = `
            <div class="contact-card"><i class="fas fa-map-marker-alt"></i><div><h3 data-i18n="footer.address">Adres</h3><p>${c.address}</p></div></div>
            <div class="contact-card"><i class="fas fa-phone"></i><div><h3 data-i18n="footer.phone">Telefon</h3><a href="tel:${c.phoneHref}">${c.phone}</a></div></div>
            <div class="contact-card"><i class="fas fa-envelope"></i><div><h3 data-i18n="footer.email">E-posta</h3><a href="mailto:${c.email}">${c.email}</a></div></div>
            <div class="contact-card"><i class="fab fa-whatsapp"></i><div><h3>WhatsApp</h3><a href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener">${c.phone}</a></div></div>
            <div class="contact-card"><i class="fab fa-instagram"></i><div><h3>Instagram</h3><a href="${c.instagram}" target="_blank" rel="noopener">@samtidakozmetik</a></div></div>`;
    }

    /* ------------------------------------------------------------------
       Formlar (modal + iletişim sayfası)
       ------------------------------------------------------------------ */
    const FORM_SUBJECTS = { general: 'Genel Mesaj', quote: 'Teklif Talebi', sample: 'Numune Talebi' };

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
        const phoneDigits = val('phone').replace(/\D/g, '').length;
        check('name', val('name').length > 2);
        check('email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('email')));
        check('phone', phoneDigits === 0 || phoneDigits >= 10);
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
            const f = form.elements;
            const subject = `[Samtida] ${FORM_SUBJECTS[form.dataset.formType] || FORM_SUBJECTS.general} - ${f.name.value.trim()}`;
            const body = [
                `Talep Türü: ${FORM_SUBJECTS[form.dataset.formType] || FORM_SUBJECTS.general}`,
                `Ad Soyad: ${f.name.value.trim()}`,
                `E-posta: ${f.email.value.trim()}`,
                `Telefon: ${f.phone.value.trim() || '-'}`,
                '',
                f.message.value.trim()
            ].join('\n');
            window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
            const hay = [p.name.tr, pick(p.name), cat.name.tr, pick(cat.name)].join(' ');
            return normalize(hay).includes(q);
        }).slice(0, 10);
        searchResults.innerHTML = hits.length
            ? hits.map(p => `
                <a class="search-result" href="${productUrl(p)}">
                    <img src="${p.image}" alt="" loading="lazy">
                    <div><strong>${pick(p.name)}</strong><span>${pick(categoryBySlug(p.category).name)}</span></div>
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
        closeLangMenus();
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
                <span class="tag">${pick(cat.packaging).split(' (')[0]}</span>
                <div class="product-card-actions">
                    <a href="${productUrl(p)}">${t('common.details', 'İncele')}</a>
                    <button type="button" data-open-quote data-product="${name} (${pick(cat.name)})">${t('common.requestQuote', 'Teklif İste')}</button>
                </div>
            </div>
            <div class="product-card-body">
                <span class="cat">${pick(cat.name)}</span>
                <h3><a href="${productUrl(p)}">${name}</a></h3>
            </div>
        </article>`;
    }

    // Blog yardımcıları: kategori adı, tarih ve okuma süresi aktif dile göre
    const BLOG_CATS = {
        dispenser: 'Dispenser Sistemleri', sustainability: 'Sürdürülebilirlik', brand: 'Marka & Tasarım',
        operations: 'Operasyon Rehberi', experience: 'Misafir Deneyimi'
    };
    const blogCatName = slug => t(`blog.cat.${slug}`, BLOG_CATS[slug] || slug);
    const blogDate = post => {
        if (!post.date) return '';
        try {
            return new Intl.DateTimeFormat(I18N.lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${post.date}T12:00:00`));
        } catch (e) { return post.date; }
    };
    const readMinutes = post => Math.max(1, Math.round(post.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 180));
    const blogMeta = post => `
        <div class="blog-meta">
            ${post.category ? `<span class="blog-cat">${blogCatName(post.category)}</span>` : ''}
            ${post.date ? `<span><i class="far fa-calendar"></i><time datetime="${post.date}">${blogDate(post)}</time></span>` : ''}
            <span><i class="far fa-clock"></i>${t('blog.readTime', '{n} dk okuma').replace('{n}', readMinutes(post))}</span>
        </div>`;

    function blogCard(post) {
        return `
        <a class="blog-card" href="${blogUrl(post)}">
            <div class="blog-card-img"><img src="${post.image}" alt="" loading="lazy"></div>
            <div class="blog-card-body">
                ${blogMeta(post)}
                <h3 lang="tr" dir="ltr">${post.title}</h3>
                <p lang="tr" dir="ltr">${post.excerpt}</p>
                <span class="link-more">${t('common.readMore', 'Devamını Oku')} <i class="fas fa-arrow-right"></i></span>
            </div>
        </a>`;
    }

    function blogFeatured(post) {
        return `
        <a class="blog-featured" href="${blogUrl(post)}" data-anim="fade-up">
            <div class="blog-featured-img"><img src="${post.image}" alt=""></div>
            <div class="blog-featured-body">
                <span class="eyebrow">${t('blog.featured', 'Öne Çıkan Yazı')}</span>
                ${blogMeta(post)}
                <h2 lang="tr" dir="ltr">${post.title}</h2>
                <p lang="tr" dir="ltr">${post.excerpt}</p>
                <span class="btn btn-color btn-plus">${t('common.readMore', 'Devamını Oku')}</span>
            </div>
        </a>`;
    }

    // Anasayfa: öne çıkan ürünler carousel
    $$('[data-render="featured"]').forEach(wrap => {
        wrap.innerHTML = PRODUCTS.filter(p => p.featured).map((p, i) => `
            <a class="swiper-slide group-card" href="${productUrl(p)}">
                <div class="group-card-img">
                    <img src="${p.image}" alt="${pick(p.name)}" loading="lazy">
                    <span class="num">${String(i + 1).padStart(2, '0')}</span>
                </div>
                <div class="group-card-body">
                    <h3>${pick(p.name)}</h3>
                    <p>${pick(categoryBySlug(p.category).name)}</p>
                    <span class="link-more">${t('common.explore', 'İncele')} <i class="fas fa-arrow-right"></i></span>
                </div>
            </a>`).join('');
    });

    // Anasayfa: dispenser koleksiyonu (ana ürün grubu)
    $$('[data-render="dispensers"]').forEach(wrap => {
        const list = PRODUCTS.filter(p => p.category === 'otel-tipi-dispanser');
        wrap.innerHTML = list.map(p => `
            <a class="disp-card" href="${productUrl(p)}" data-anim="fade-up">
                <div class="disp-card-img">
                    <img src="${p.image}" alt="${pick(p.name)}" loading="lazy">
                    <span class="go"><i class="fas fa-arrow-right"></i></span>
                </div>
                <h3>${pick(p.name)}</h3>
                <span class="cap">300 · 350 · 400 ml</span>
            </a>`).join('') + `
            <a class="disp-card more" href="/dispenser.html" data-anim="fade-up">
                <i class="fas fa-pump-soap"></i>
                <h3>${t('disp.allSystems', 'Tüm Dispenser Sistemleri')}</h3>
                <span class="link-more">${t('common.explore', 'İncele')} <i class="fas fa-arrow-right"></i></span>
            </a>`;
    });

    // Kategoriye göre ürün ızgarası (ör. dispenser sayfası)
    $$('[data-category-products]').forEach(wrap => {
        wrap.innerHTML = PRODUCTS.filter(p => p.category === wrap.dataset.categoryProducts).map(productCard).join('');
    });

    // Dispenser sayfası: ürünler alt alta, özellik listesiyle
    const USE_FALLBACK = { shower: 'Duş', sink: 'Lavabo', room: 'Oda ve lavabo' };
    $$('[data-render="dispenser-rows"]').forEach(wrap => {
        const list = PRODUCTS.filter(p => p.category === 'otel-tipi-dispanser');
        const cat = categoryBySlug('otel-tipi-dispanser');
        const pad = n => String(n).padStart(2, '0');
        const spec = (label, value) => `<div><dt>${label}</dt><dd>${value}</dd></div>`;
        wrap.innerHTML = list.map((p, i) => {
            const name = pick(p.name);
            const use = p.use ? t(`dsp.use.${p.use}`, USE_FALLBACK[p.use]) : '';
            return `
            <article class="dp-row" id="${p.id}">
                <div class="dp-media" data-anim="fade-up">
                    <figure class="dp-main"><img src="${p.image}" alt="${name}" loading="lazy"></figure>
                    ${p.still ? `<figure class="dp-still"><img src="${p.still}" alt="" loading="lazy"></figure>` : ''}
                    <span class="dp-num" aria-hidden="true">${pad(i + 1)}</span>
                </div>
                <div class="dp-info" data-anim="fade-up">
                    <span class="eyebrow">${pick(cat.name)}${use ? ` · ${use}` : ''}</span>
                    <h3 class="dp-title"><a href="${productUrl(p)}">${name}</a></h3>
                    ${p.desc ? `<p>${pick(p.desc)}</p>` : ''}
                    <dl class="dp-specs">
                        ${spec(t('disp.row.capacity', 'Kapasite'), '<bdi>300 · 350 · 400 ml</bdi>')}
                        ${use ? spec(t('dsp.useArea', 'Kullanım Alanı'), use) : ''}
                        ${spec(t('disp.row.mount', 'Montaj'), t('disp.val.wall', 'Duvar tipi'))}
                        ${spec(t('disp.row.refill', 'Dolum'), t('disp.val.refill', 'Yeniden doldurulabilir (refill)'))}
                        ${spec(t('dsp.formula', 'Formül'), t('dsp.formulaVal', 'Paraben ve sülfat içermez'))}
                        ${spec(t('disp.row.print', 'Marka Uygulaması'), t('disp.val.print', 'Otel kimliğine özel logo ve etiket'))}
                    </dl>
                    <div class="dp-actions">
                        <button type="button" class="btn btn-color btn-plus" data-open-quote data-product="${name} (${pick(cat.name)})">${t('detail.sampleQuote', 'Numune / Teklif İste')}</button>
                        <a class="link-more" href="${productUrl(p)}">${t('common.details', 'İncele')} <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </article>`;
        }).join('');
    });

    // Blog kartları (anasayfa: son yazılar)
    $$('[data-blog-list]').forEach(wrap => {
        const limit = parseInt(wrap.dataset.blogList, 10) || BLOG.length;
        wrap.innerHTML = BLOG.slice(0, limit).map(blogCard).join('');
    });

    // Blog sayfası: öne çıkan yazı + kategori filtresi + ızgara
    const blogIndex = $('[data-blog-index]');
    if (blogIndex && BLOG.length) {
        const featuredWrap = $('[data-blog-featured]', blogIndex);
        const filterBar = $('[data-blog-filter]', blogIndex);
        const grid = $('[data-blog-grid]', blogIndex);
        const cats = Object.keys(BLOG_CATS).filter(c => BLOG.some(p => p.category === c));
        const params = new URLSearchParams(location.search);
        let active = cats.includes(params.get('kategori')) ? params.get('kategori') : 'all';

        featuredWrap.innerHTML = blogFeatured(BLOG[0]);
        filterBar.innerHTML = [{ slug: 'all', label: t('catalog.all', 'Tümü'), count: BLOG.length - 1 }]
            .concat(cats.map(c => ({ slug: c, label: blogCatName(c), count: BLOG.filter(p => p.category === c).length })))
            .map(f => `<button type="button" class="filter-btn" data-filter="${f.slug}">${f.label}<span class="count">(${f.count})</span></button>`).join('');

        const renderBlog = () => {
            // "Tümü" görünümünde öne çıkan yazı ızgarada tekrar edilmez
            const list = active === 'all' ? BLOG.slice(1) : BLOG.filter(p => p.category === active);
            featuredWrap.hidden = active !== 'all';
            grid.innerHTML = list.map(blogCard).join('');
            $$('.filter-btn', filterBar).forEach(b => b.classList.toggle('active', b.dataset.filter === active));
        };
        filterBar.addEventListener('click', e => {
            const btn = e.target.closest('[data-filter]');
            if (!btn) return;
            active = btn.dataset.filter;
            const url = new URL(location.href);
            if (active === 'all') url.searchParams.delete('kategori'); else url.searchParams.set('kategori', active);
            history.replaceState(null, '', url);
            renderBlog();
        });
        renderBlog();
    }

    /* ------------------------------------------------------------------
       Blog yazısı
       ------------------------------------------------------------------ */
    const article = $('[data-blog-post]');
    if (article) {
        const slug = article.dataset.blogPost || new URLSearchParams(window.location.search).get('yazi');
        const idx = BLOG.findIndex(b => b.slug === slug);
        // Eski adres (blog-yazi.html?yazi=...) kalıcı yazı sayfasına yönlenir
        if (idx >= 0 && !article.dataset.blogPost) { location.replace(blogUrl(BLOG[idx]) + location.hash); return; }
        if (idx < 0) {
            article.innerHTML = `
                <div class="empty-state">
                    <h2>${t('blog.notFound', 'Yazı bulunamadı')}</h2>
                    <a class="btn btn-color btn-plus" href="/blog.html">${t('blog.all', 'Tüm Yazılar')}</a>
                </div>`;
        } else {
            const post = BLOG[idx];
            const prev = BLOG[idx + 1];
            const next = BLOG[idx - 1];
            const url = encodeURIComponent(location.href);
            $('[data-blog-title]').textContent = post.title;
            const heroMeta = $('[data-blog-meta]');
            if (heroMeta) heroMeta.innerHTML = blogMeta(post);
            $('.page-hero').style.backgroundImage = `url('${post.image}')`;

            // İçindekiler: yazıdaki ara başlıklardan üretilir
            const body = document.createElement('div');
            body.innerHTML = post.content;
            const slugify = str => str.toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const heads = $$('h3', body);
            heads.forEach((h, i) => { h.id = `${slugify(h.textContent) || 'bolum'}-${i + 1}`; });
            const toc = heads.length > 2 ? `
                <nav class="article-toc" aria-label="${t('blog.toc', 'İçindekiler')}">
                    <details open>
                        <summary>${t('blog.toc', 'İçindekiler')}</summary>
                        <ol lang="tr" dir="ltr">${heads.map(h => `<li><a href="#${h.id}">${h.textContent}</a></li>`).join('')}</ol>
                    </details>
                </nav>` : '';
            $$('table', body).forEach(tb => { if (!tb.parentElement.classList.contains('table-scroll')) tb.outerHTML = `<div class="table-scroll">${tb.outerHTML}</div>`; });

            article.innerHTML = `
                <div class="article-layout${toc ? '' : ' no-toc'}">
                    <aside class="article-aside">${toc}</aside>
                    <div class="article-main">
                        <div class="article-body" lang="tr" dir="ltr">${body.innerHTML}</div>
                        ${post.tags && post.tags.length ? `
                        <div class="article-tags">
                            <span>${t('blog.tags', 'Etiketler')}</span>
                            ${post.tags.map(tag => `<span class="tag-chip" lang="tr">${tag}</span>`).join('')}
                        </div>` : ''}
                        <div class="article-foot">
                            <div class="article-share">
                                <span>${t('blog.share', 'Paylaş')}</span>
                                <a href="https://wa.me/?text=${encodeURIComponent(post.title + ' ')}${url}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                                <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                                <a href="https://x.com/intent/post?text=${encodeURIComponent(post.title)}&url=${url}" target="_blank" rel="noopener" aria-label="X"><i class="fab fa-x-twitter"></i></a>
                                <button type="button" data-copy-link aria-label="${t('blog.copy', 'Bağlantıyı Kopyala')}"><i class="fas fa-link"></i></button>
                                <span class="copy-done" role="status" aria-live="polite"></span>
                            </div>
                            <div class="article-nav" lang="tr" dir="ltr">
                                ${prev ? `<a href="${blogUrl(prev)}"><small>${t('blog.prev', 'Önceki Yazı')}</small>${prev.title}</a>` : '<span></span>'}
                                ${next ? `<a class="next" href="${blogUrl(next)}"><small>${t('blog.next', 'Sonraki Yazı')}</small>${next.title}</a>` : ''}
                            </div>
                        </div>
                    </div>
                </div>`;

            const copyBtn = $('[data-copy-link]', article);
            if (copyBtn) copyBtn.addEventListener('click', () => {
                const done = () => { $('.copy-done', article).textContent = t('blog.copied', 'Bağlantı kopyalandı'); };
                if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done).catch(() => {});
            });

            // Okuma sırasında içindekilerde aktif başlığı işaretle
            if (toc && 'IntersectionObserver' in window) {
                const links = $$('.article-toc a', article);
                const tio = new IntersectionObserver(entries => entries.forEach(e => {
                    if (!e.isIntersecting) return;
                    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
                }), { rootMargin: '-20% 0px -70% 0px' });
                $$('.article-body h3', article).forEach(h => tio.observe(h));
            }

            // Yazıda geçen ürünler
            const prodSection = $('[data-blog-products]');
            const prods = (post.products || []).map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
            if (prodSection && prods.length) {
                $('.product-grid', prodSection).innerHTML = prods.slice(0, 4).map(productCard).join('');
                prodSection.hidden = false;
            }

            // İlgili yazılar: önce aynı kategori, sonra en yeniler
            const relSection = $('[data-blog-related]');
            if (relSection) {
                const others = BLOG.filter(p => p !== post);
                const related = others.filter(p => p.category === post.category)
                    .concat(others.filter(p => p.category !== post.category)).slice(0, 3);
                $('.blog-grid', relSection).innerHTML = related.map(blogCard).join('');
                relSection.hidden = !related.length;
            }
        }
    }

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

        // Başlık videosu kategoriye göre: dispenserlerde otel banyosu, diğerlerinde tamamlayıcı ürünler
        const catalogVideo = $('.page-hero .bg-video');
        const syncCatalogVideo = () => {
            if (!catalogVideo) return;
            const base = `/images/samtida/videos/${active === 'otel-tipi-dispanser' ? 'dispenser-hotel' : 'amenities-room'}`;
            if (catalogVideo.dataset.video === `${base}.mp4`) return;
            catalogVideo.dataset.video = `${base}.mp4`;
            catalogVideo.dataset.videoSm = `${base}-sm.mp4`;
            catalogVideo.poster = `${base}.jpg`;
            if (catalogVideo.dataset.loaded) {
                catalogVideo.src = window.matchMedia('(max-width: 820px)').matches ? catalogVideo.dataset.videoSm : catalogVideo.dataset.video;
                catalogVideo.play().catch(() => {});
            }
        };

        function renderCatalog() {
            syncCatalogVideo();
            $$('.filter-btn', filterBar).forEach(b => b.classList.toggle('active', b.dataset.filter === active));
            const list = active === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === active);
            grid.innerHTML = list.length ? list.map(productCard).join('') : `<p class="empty-state">${t('search.empty', 'Ürün bulunamadı.')}</p>`;
            const cat = categoryBySlug(active);
            const title = $('[data-catalog-title]');
            const desc = $('[data-catalog-desc]');
            if (title) title.textContent = cat ? pick(cat.name) : t('catalog.title', 'Ürünlerimiz');
            if (desc) desc.textContent = cat ? pick(cat.desc) : t('catalog.lead', 'Samtida ürünleri ile otel ve kişiye özel logolu şampuan, duş jeli, sıvı sabun ve vücut losyonu seçeneklerini keşfedin. GMP sertifikalı, sürdürülebilir ve tek kullanımlık veya dolumlu ürünlerimizle markanızı banyolara taşıyın.');
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
        const id = detail.dataset.productDetail || new URLSearchParams(window.location.search).get('id');
        const p = PRODUCTS.find(x => x.id === id);
        // Eski adres (detay.html?id=...) kalıcı ürün sayfasına yönlenir
        if (p && !detail.dataset.productDetail) { location.replace(productUrl(p) + location.hash); return; }
        if (!p) {
            detail.innerHTML = `
                <div class="empty-state">
                    <h2>${t('detail.notFound', 'Ürün bulunamadı')}</h2>
                    <a class="btn btn-color btn-plus" href="/urunler/index.html">${t('common.allProducts', 'Tüm Ürünler')}</a>
                </div>`;
        } else {
            const cat = categoryBySlug(p.category);
            const name = pick(p.name);
            const quoteName = `${name} (${pick(cat.name)})`;
            const waText = t('detail.waText', 'Merhaba, {product} hakkında bilgi almak istiyorum.').replace('{product}', quoteName);
            if (I18N.lang !== 'tr') {
                document.title = `${name} – ${pick(cat.name)} | Samtida Kozmetik`;
                setMetaDesc(pick(p.desc || cat.desc));
            }
            $('[data-detail-title]').textContent = name;
            const crumbCat = $('[data-detail-cat]');
            crumbCat.textContent = pick(cat.name);
            crumbCat.href = categoryUrl(cat.slug);

            detail.innerHTML = `
                <div class="detail-grid">
                    <div class="detail-img" data-anim="fade-left"><img src="${p.image}" alt="${name}"></div>
                    <div class="detail-info" data-anim="fade-right">
                        <span class="eyebrow">${pick(cat.name)}</span>
                        <h2 class="detail-title">${name}</h2>
                        <p class="lead">${pick(p.desc || cat.desc)}</p>
                        <table class="spec-table">
                            <tr><th>${t('detail.category', 'Kategori')}</th><td><a href="${categoryUrl(cat.slug)}">${pick(cat.name)}</a></td></tr>
                            <tr><th>${t('detail.packaging', 'Ambalaj')}</th><td>${pick(cat.packaging)}</td></tr>
                            <tr><th>${t('detail.custom', 'Özel Baskı')}</th><td>${t('detail.customValue', 'Otel kimliğine özel logo baskı ve ambalaj')}</td></tr>
                            <tr><th>${t('detail.quality', 'Üretim Standardı')}</th><td>GMP · ISO 22716</td></tr>
                        </table>
                        <div class="btn-row">
                            <button type="button" class="btn btn-color btn-plus" data-open-quote data-product="${quoteName}">${t('detail.sampleQuote', 'Numune / Teklif İste')}</button>
                            <a class="btn btn-outline" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> ${t('detail.whatsapp', 'WhatsApp ile Yaz')}</a>
                        </div>
                    </div>
                </div>`;

            const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
            const relWrap = $('[data-related]');
            if (relWrap) relWrap.innerHTML = related.map(productCard).join('');
        }
    }

    // Yalnızca Türkçe yayınlanan içerikler için dil notu
    $$('[data-lang-note]').forEach(el => { el.hidden = I18N.lang === 'tr'; });

    /* ------------------------------------------------------------------
       Çeviri — dinamik içerikler oluşturulduktan sonra uygulanır
       ------------------------------------------------------------------ */
    I18N.apply();

    /* ------------------------------------------------------------------
       Slider'lar (Swiper)
       ------------------------------------------------------------------ */
    // Videolar: data-video (masaüstü) / data-video-sm (mobil). Hareket azaltma veya veri tasarrufu
    // açıksa yüklenmez; poster (hero'da dispenser vitrini) görünür. Ekran dışındaki videolar durdurulur.
    const saveData = navigator.connection && navigator.connection.saveData;
    const videosAllowed = !reducedMotion && !saveData;
    const smallScreen = window.matchMedia('(max-width: 820px)').matches;
    const loadVideo = video => {
        if (video.dataset.loaded) return;
        video.dataset.loaded = '1';
        video.src = (smallScreen && video.dataset.videoSm) || video.dataset.video;
        video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
    };
    const playVideo = video => { loadVideo(video); video.play().catch(() => {}); };

    const heroVideo = $('.hero-video');
    if (heroVideo) {
        if (CONFIG.heroVideo) heroVideo.dataset.video = CONFIG.heroVideo;
        if (videosAllowed && heroVideo.dataset.video) {
            heroVideo.closest('.hero-slide').classList.add('has-video');
            playVideo(heroVideo);
        }
    }
    const bgVideos = $$('.bg-video');
    if (videosAllowed && bgVideos.length) {
        if ('IntersectionObserver' in window) {
            const vio = new IntersectionObserver(entries => entries.forEach(e => {
                if (e.isIntersecting) playVideo(e.target);
                else if (e.target.dataset.loaded) e.target.pause();
            }), { rootMargin: '200px 0px' });
            bgVideos.forEach(v => vio.observe(v));
        } else bgVideos.forEach(playVideo);
    }

    const HERO_DELAY = 6500;
    if (window.Swiper) {
        if ($('.hero-swiper')) {
            const hero = $('.hero');
            // Slayt süresi: data-swiper-autoplay varsa o (ör. video slaytı), yoksa HERO_DELAY
            const syncHero = sw => {
                const slide = sw.slides[sw.activeIndex];
                hero.style.setProperty('--hero-delay', `${(slide && slide.dataset.swiperAutoplay) || HERO_DELAY}ms`);
                if (heroVideo && heroVideo.dataset.loaded) {
                    if (slide && slide.contains(heroVideo)) { heroVideo.currentTime = 0; heroVideo.play().catch(() => {}); }
                    else heroVideo.pause();
                }
            };
            hero.style.setProperty('--hero-delay', `${HERO_DELAY}ms`);
            new Swiper('.hero-swiper', {
                effect: 'fade',
                fadeEffect: { crossFade: true },
                loop: true,
                speed: 1200,
                autoplay: { delay: HERO_DELAY, disableOnInteraction: false },
                pagination: { el: '.hero-pagination', clickable: true },
                navigation: { prevEl: '.hero-prev', nextEl: '.hero-next' },
                keyboard: { enabled: true },
                on: { init: syncHero, slideChange: syncHero }
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
       Görseller yüklenirken yumuşak belirme
       ------------------------------------------------------------------ */
    $$('main img').forEach(img => {
        if (img.complete) return;
        img.classList.add('img-fade');
        const done = () => img.classList.add('is-loaded');
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
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
