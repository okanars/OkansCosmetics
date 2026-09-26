// Samtida Kozmetik — ortak sayfa iskeleti
// Header, footer, teklif modalı, arama ve WhatsApp butonu tüm sayfalara buradan eklenir.
(function () {
    const CONFIG = window.SAMTIDA_CONFIG = {
        company: 'Samtida Kozmetik',
        phone: '0533 255 0586',
        phoneHref: '+905332550586',
        whatsapp: '905332550586',
        email: 'info@samtida.com.tr',
        address: 'Zafer Mah. Doğan Araslı Blv. Ottoman Ofis Rezidans B Blok No:95 İç Kapı No: 109 Esenyurt / İstanbul',
        instagram: 'https://www.instagram.com/samtidakozmetik/',
        // Anasayfa hero videosunu değiştirmek için yol yazın (boşsa index.html'deki data-video kullanılır)
        heroVideo: ''
    };

    const path = window.location.pathname.replace(/\/index\.html$/, '/');
    const isActive = (...paths) => paths.some(p => path === p || (p.length > 1 && p.endsWith('/') && path.startsWith(p))) ? ' active' : '';

    const categories = [
        ['otel-tipi-dispanser', 'cat.otel-tipi-dispanser', 'Otel Tipi Dispenser'],
        ['kraft-kutulu-urunler', 'cat.kraft-kutulu-urunler', 'Kraft Kutulu Ürünler'],
        ['kraft-poset-ambalajli', 'cat.kraft-poset-ambalajli', 'Kraft Poşet Ambalajlı']
    ];
    const categoryLinks = categories
        .map(([slug, key, label]) => `<a href="/urunler/index.html?kategori=${slug}" data-i18n="${key}">${label}</a>`).join('');

    const corporate = [
        ['/hakkimizda.html', 'nav.about', 'Hakkımızda'],
        ['/hizmet-kapsami.html', 'nav.scope', 'Hizmet Kapsamı'],
        ['/standartlarimiz.html', 'nav.standards', 'Standartlarımız'],
        ['/surdurulebilirlik.html', 'nav.sustainability', 'Sürdürülebilirlik'],
        ['/vizyon-misyon.html', 'nav.visionMission', 'Vizyon & Misyon']
    ];
    const corporateLinks = corporate.map(([href, key, label]) => `<a href="${href}" data-i18n="${key}">${label}</a>`).join('');

    // Logo: slider üstünde beyaz, scroll'da siyah (CSS ile değişir)
    const logo = (variant = 'auto') => `
        <a href="/index.html" class="logo logo-${variant}" aria-label="Samtida Kozmetik">
            <img class="logo-light" src="/images/samtida/logo-white.png" alt="Samtida Kozmetik" width="150" height="36">
            <img class="logo-dark" src="/images/samtida/logo-black.png" alt="Samtida Kozmetik" width="150" height="36">
        </a>`;

    const I18N = window.SamtidaI18n;
    const current = I18N.lang;

    // Masaüstü: açılır dil menüsü · Mobil menü: dil ızgarası
    const langMenu = () => `
        <div class="lang-menu">
            <button type="button" class="lang-current" aria-haspopup="true" aria-expanded="false" aria-label="Language">
                <i class="fas fa-globe"></i> ${current} <i class="fas fa-chevron-down"></i>
            </button>
            <div class="lang-list" role="menu">
                ${I18N.languages.map(l => `<button type="button" role="menuitem" data-lang="${l.code}" lang="${l.code}" class="${l.code === current ? 'active' : ''}">${l.label}<small>${l.code.toUpperCase()}</small></button>`).join('')}
            </div>
        </div>`;
    const langGrid = () => `
        <div class="lang-grid" role="group" aria-label="Language">
            ${I18N.languages.map(l => `<button type="button" data-lang="${l.code}" title="${l.label}" class="${l.code === current ? 'active' : ''}">${l.code.toUpperCase()}</button>`).join('')}
        </div>`;
    const themeToggle = (extra = '') => `
        <button type="button" class="icon-btn theme-toggle ${extra}" data-theme-toggle aria-label="Tema" data-i18n-aria="common.theme">
            <i class="fas fa-moon"></i><i class="fas fa-sun"></i>
        </button>`;

    const header = `
    <header class="site-header" id="siteHeader">
        <div class="header-inner container-wide">
            ${logo()}
            <nav class="main-nav" id="mainNav" aria-label="Ana menü">
                <div class="mobile-nav-head">
                    ${logo('dark')}
                    <button class="modal-close" type="button" data-nav-close aria-label="Kapat" data-i18n-aria="common.close"><i class="fas fa-times"></i></button>
                </div>
                <ul class="nav-list">
                    <li class="nav-item"><a class="nav-link${isActive('/')}" href="/index.html" data-i18n="nav.home">Anasayfa</a></li>
                    <li class="nav-item"><a class="nav-link${isActive('/dispenser.html')}" href="/dispenser.html" data-i18n="nav.dispenser">Dispenser</a></li>
                    <li class="nav-item has-sub">
                        <a class="nav-link${isActive('/urunler/')}" href="/urunler/index.html"><span data-i18n="nav.products">Ürünlerimiz</span> <i class="fas fa-chevron-down"></i></a>
                        <button class="sub-toggle" type="button" aria-label="Alt menü"><i class="fas fa-chevron-down"></i></button>
                        <div class="dropdown">${categoryLinks}</div>
                    </li>
                    <li class="nav-item has-sub">
                        <a class="nav-link${isActive(...corporate.map(c => c[0]))}" href="/hakkimizda.html"><span data-i18n="nav.corporate">Kurumsal</span> <i class="fas fa-chevron-down"></i></a>
                        <button class="sub-toggle" type="button" aria-label="Alt menü"><i class="fas fa-chevron-down"></i></button>
                        <div class="dropdown">${corporateLinks}</div>
                    </li>
                    <li class="nav-item"><a class="nav-link${isActive('/surdurulebilirlik.html')}" href="/surdurulebilirlik.html" data-i18n="nav.sustainability">Sürdürülebilirlik</a></li>
                    <li class="nav-item"><a class="nav-link${isActive('/blog.html', '/blog-yazi.html', '/blog/')}" href="/blog.html" data-i18n="nav.blog">Blog</a></li>
                    <li class="nav-item"><a class="nav-link${isActive('/iletisim.html')}" href="/iletisim.html" data-i18n="nav.contact">İletişim</a></li>
                </ul>
                <div class="mobile-nav-foot">
                    <div class="theme-row"><span data-i18n="common.theme">Tema</span>${themeToggle()}</div>
                    ${langGrid()}
                    <button type="button" class="btn btn-color" data-open-quote data-i18n="common.getQuote">Teklif Al</button>
                </div>
            </nav>
            <div class="header-actions">
                <button type="button" class="icon-btn" data-open-search aria-label="Ara" data-i18n-aria="common.search"><i class="fas fa-search"></i></button>
                ${themeToggle()}
                ${langMenu()}
                <button type="button" class="btn btn-color header-cta" data-open-quote data-i18n="common.getQuote">Teklif Al</button>
                <button type="button" class="menu-toggle" aria-label="Menü" aria-controls="mainNav" aria-expanded="false"><span></span><span></span><span></span></button>
            </div>
        </div>
    </header>
    <div class="nav-backdrop" data-nav-close></div>
    <div class="scroll-progress" aria-hidden="true"><span></span></div>`;

    const footer = `
    <footer class="site-footer">
        <div class="container-wide footer-top">
            <div>
                ${logo('light')}
                <p data-i18n="footer.about">Otel ve kişiye özel logolu buklet ürünleri.</p>
                <div class="certs" aria-label="Sertifikalar">
                    <div class="cert"><b>GMP</b><small>✓</small></div>
                    <div class="cert"><b>ISO</b><small>22716</small></div>
                </div>
                <div class="socials">
                    <a href="${CONFIG.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
            <div>
                <h4 data-i18n="nav.corporate">Kurumsal</h4>
                <ul class="footer-links">
                    <li><a href="/index.html" data-i18n="nav.home">Anasayfa</a></li>
                    ${corporate.map(([href, key, label]) => `<li><a href="${href}" data-i18n="${key}">${label}</a></li>`).join('')}
                    <li><a href="/urunler/index.html" data-i18n="nav.products">Ürünlerimiz</a></li>
                    <li><a href="/blog.html" data-i18n="nav.blog">Blog</a></li>
                    <li><a href="/iletisim.html" data-i18n="nav.contact">İletişim</a></li>
                </ul>
            </div>
            <div>
                <h4 data-i18n="footer.categories">Ürün Kategorileri</h4>
                <ul class="footer-links">${categoryLinks.replace(/<a /g, '<li><a ').replace(/<\/a>/g, '</a></li>')}</ul>
                <h4 style="margin-top:34px" data-i18n="footer.policies">Politikalar</h4>
                <ul class="footer-links">
                    <li><a href="/gizlilik-politikasi.html" data-i18n="nav.privacy">Gizlilik Politikası</a></li>
                    <li><a href="/kullanim-kosullari.html" data-i18n="nav.terms">Kullanım Koşulları</a></li>
                </ul>
            </div>
            <div>
                <h4 data-i18n="nav.contact">İletişim</h4>
                <ul class="footer-contact">
                    <li><i class="fas fa-map-marker-alt"></i><span><small data-i18n="footer.address">Adres</small>${CONFIG.address}</span></li>
                    <li><i class="fas fa-phone"></i><span><small data-i18n="footer.phone">Telefon</small><a href="tel:${CONFIG.phoneHref}">${CONFIG.phone}</a></span></li>
                    <li><i class="fas fa-envelope"></i><span><small data-i18n="footer.email">E-posta</small><a href="mailto:${CONFIG.email}">${CONFIG.email}</a></span></li>
                    <li><i class="fab fa-instagram"></i><span><small>Instagram</small><a href="${CONFIG.instagram}" target="_blank" rel="noopener">@samtidakozmetik</a></span></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container-wide">
                <span>&copy; ${new Date().getFullYear()} ${CONFIG.company}. <span data-i18n="footer.rights">Tüm hakları saklıdır.</span></span>
                <span><a href="/gizlilik-politikasi.html" data-i18n="nav.privacy">Gizlilik Politikası</a> · <a href="/kullanim-kosullari.html" data-i18n="nav.terms">Kullanım Koşulları</a></span>
            </div>
        </div>
    </footer>`;

    // samtida.com.tr formu: Talep Türü, Ad Soyad, E-posta, Telefon (opsiyonel), Mesaj
    const formFields = (prefix) => `
        <div class="form-type" role="tablist">
            <button type="button" class="active" data-type="general" data-i18n="form.typeGeneral">Genel Mesaj</button>
            <button type="button" data-type="quote" data-i18n="form.typeQuote">Teklif Talebi</button>
            <button type="button" data-type="sample" data-i18n="form.typeSample">Numune Talebi</button>
        </div>
        <div class="form-grid">
            <div class="field full"><label for="${prefix}-name" data-i18n="form.fullName">Ad Soyad</label><input id="${prefix}-name" name="name" autocomplete="name" required><div class="error" data-i18n="form.required">Bu alan zorunludur.</div></div>
            <div class="field"><label for="${prefix}-email" data-i18n="form.email">E-posta</label><input id="${prefix}-email" name="email" type="email" autocomplete="email" required><div class="error" data-i18n="form.emailError">Geçerli bir e-posta adresi girin.</div></div>
            <div class="field"><label for="${prefix}-phone" data-i18n="form.phoneOptional">Telefon (opsiyonel)</label><input id="${prefix}-phone" name="phone" type="tel" autocomplete="tel"><div class="error" data-i18n="form.phoneError">Geçerli bir telefon numarası girin.</div></div>
            <div class="field full"><label for="${prefix}-message" data-i18n="form.message">Mesajınız</label><textarea id="${prefix}-message" name="message" required></textarea><div class="error" data-i18n="form.required">Bu alan zorunludur.</div></div>
            <label class="consent full"><input type="checkbox" name="consent" required> <span><a href="/gizlilik-politikasi.html" target="_blank" data-i18n="nav.privacy">Gizlilik Politikası</a><span data-i18n="form.consent">'nı okudum, kişisel verilerimin talebime yanıt verilmesi amacıyla işlenmesini kabul ediyorum.</span></span></label>
        </div>
        <div class="form-actions"><button type="submit" class="btn btn-color btn-plus" data-i18n="form.submit">Gönder</button></div>`;

    window.SAMTIDA_FORM_FIELDS = formFields;

    const modal = `
    <div class="modal" id="quoteModal" aria-hidden="true">
        <div class="modal-backdrop" data-close></div>
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="quoteTitle">
            <button class="modal-close" type="button" data-close aria-label="Kapat" data-i18n-aria="common.close"><i class="fas fa-times"></i></button>
            <span class="eyebrow">SAMTIDA KOZMETİK</span>
            <h3 id="quoteTitle" data-i18n="modal.title">Numune / Teklif İste</h3>
            <p data-i18n="modal.text">Formu doldurun, ekibimiz en kısa sürede size dönüş yapsın.</p>
            <form class="samtida-form" data-form-type="general" novalidate>
                ${formFields('modal')}
            </form>
            <div class="form-success" hidden>
                <i class="fas fa-check-circle"></i>
                <h3 data-i18n="form.successTitle">Teşekkürler!</h3>
                <p data-i18n="form.successText">Talebiniz e-posta uygulamanızda hazırlandı. Gönderdikten sonra ekibimiz sizinle iletişime geçecek.</p>
            </div>
        </div>
    </div>`;

    const search = `
    <div class="search-overlay" id="searchOverlay" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Arama">
        <button class="modal-close" type="button" data-close aria-label="Kapat" data-i18n-aria="common.close"><i class="fas fa-times"></i></button>
        <div class="search-inner">
            <div class="search-field">
                <input type="search" id="searchInput" placeholder="Ürün ara..." data-i18n-ph="search.placeholder" autocomplete="off">
                <i class="fas fa-search"></i>
            </div>
            <p class="search-hint" data-i18n="search.hint">Örn. şampuan, terlik, diş seti, kraft kutu</p>
            <div class="search-results" id="searchResults"></div>
        </div>
    </div>`;

    // Mobil hızlı erişim çubuğu
    const mobileBar = `
    <nav class="mobile-bar" aria-label="Hızlı erişim">
        <a href="/index.html" class="${isActive('/').trim()}"><i class="fas fa-house"></i><span data-i18n="nav.home">Anasayfa</span></a>
        <a href="/dispenser.html" class="${isActive('/dispenser.html').trim()}"><i class="fas fa-pump-soap"></i><span data-i18n="nav.dispenser">Dispenser</span></a>
        <button type="button" class="mb-cta" data-open-quote><i class="fas fa-paper-plane"></i><span data-i18n="common.getQuote">Teklif Al</span></button>
        <a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i><span>WhatsApp</span></a>
        <button type="button" data-open-menu><i class="fas fa-bars-staggered"></i><span data-i18n="common.menu">Menü</span></button>
    </nav>`;

    const floating = mobileBar + `
    <a class="whatsapp-btn" href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
    <button class="to-top" type="button" aria-label="Yukarı çık" data-i18n-aria="common.toTop"><i class="fas fa-arrow-up"></i></button>`;

    document.body.insertAdjacentHTML('afterbegin', header);
    document.body.insertAdjacentHTML('beforeend', footer + modal + search + floating);
})();
