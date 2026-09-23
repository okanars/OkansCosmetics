// Samtida Cosmetics — ortak sayfa iskeleti
// Header, footer, teklif modalı, arama ve WhatsApp butonu tüm sayfalara buradan eklenir.
(function () {
    const CONFIG = window.SAMTIDA_CONFIG = {
        phone: '+90 212 552 00 39',
        phoneHref: '+902125520039',
        whatsapp: '902125520039',
        email: 'info@samtida.com',
        orderEmail: 'siparis@samtida.com',
        address: 'Halide Edip Adıvar Cd. No:21, Esenyurt / İstanbul',
        instagram: '#',
        linkedin: '#',
        facebook: '#'
    };

    const path = window.location.pathname.replace(/\/index\.html$/, '/');
    const isActive = (...prefixes) => prefixes.some(p => path === p || (p.endsWith('/') && path.startsWith(p))) ? ' active' : '';

    const categoryLinks = [
        ['dispenserler', 'cat.dispenserler', 'Dispenserler'],
        ['sabunlar', 'cat.sabunlar', 'Sabunlar'],
        ['siseler', 'cat.siseler', 'Şişeler'],
        ['kisisel-bakim', 'cat.kisisel-bakim', 'Kişisel Bakım Ürünleri'],
        ['tamamlayici', 'cat.tamamlayici', 'Tamamlayıcı Ürünler']
    ].map(([slug, key, label]) => `<a href="/urunler/index.html?kategori=${slug}" data-i18n="${key}">${label}</a>`).join('');

    const seriesLinks = [
        ['pure-blanc', 'Samtida Pure Blanc'],
        ['ambre-noir', 'Samtida Ambre Noir'],
        ['lavanda', 'Samtida Lavanda']
    ].map(([id, label]) => `<a href="/markalar.html#${id}">${label}</a>`).join('');

    const logo = (extra = '') => `
        <a href="/index.html" class="logo ${extra}" aria-label="Samtida Cosmetics">
            <span class="logo-word">SAMTIDA<span class="logo-dot"></span></span>
            <span class="logo-sub">COSMETICS</span>
        </a>`;

    const langSwitch = () => `
        <div class="lang-switch" role="group" aria-label="Language">
            <button type="button" data-lang="tr">TR</button><span>|</span>
            <button type="button" data-lang="en">EN</button><span>|</span>
            <button type="button" data-lang="ru">RU</button>
        </div>`;

    const header = `
    <header class="site-header" id="siteHeader">
        <div class="header-inner container-wide">
            ${logo()}
            <nav class="main-nav" id="mainNav" aria-label="Ana menü">
                <div class="mobile-nav-head">
                    ${logo()}
                    <button class="modal-close" type="button" data-nav-close aria-label="Kapat" data-i18n-aria="common.close"><i class="fas fa-times"></i></button>
                </div>
                <ul class="nav-list">
                    <li class="nav-item"><a class="nav-link${isActive('/hakkimizda.html')}" href="/hakkimizda.html" data-i18n="nav.about">Hakkımızda</a></li>
                    <li class="nav-item"><a class="nav-link${isActive('/uretim.html')}" href="/uretim.html" data-i18n="nav.production">Üretim</a></li>
                    <li class="nav-item"><a class="nav-link${isActive('/dispenser.html')}" href="/dispenser.html" data-i18n="nav.dispenser">Dispenser</a></li>
                    <li class="nav-item has-sub">
                        <a class="nav-link${isActive('/urunler/')}" href="/urunler/index.html"><span data-i18n="nav.groups">Ürün Grupları</span> <i class="fas fa-chevron-down"></i></a>
                        <button class="sub-toggle" type="button" aria-label="Alt menü"><i class="fas fa-chevron-down"></i></button>
                        <div class="dropdown">${categoryLinks}</div>
                    </li>
                    <li class="nav-item has-sub">
                        <a class="nav-link${isActive('/markalar.html')}" href="/markalar.html"><span data-i18n="nav.brands">Markalarımız</span> <i class="fas fa-chevron-down"></i></a>
                        <button class="sub-toggle" type="button" aria-label="Alt menü"><i class="fas fa-chevron-down"></i></button>
                        <div class="dropdown">${seriesLinks}</div>
                    </li>
                    <li class="nav-item"><a class="nav-link${isActive('/surdurulebilirlik.html')}" href="/surdurulebilirlik.html" data-i18n="nav.sustainability">Sürdürülebilirlik</a></li>
                    <li class="nav-item"><a class="nav-link${isActive('/iletisim.html')}" href="/iletisim.html" data-i18n="nav.contact">İletişim</a></li>
                </ul>
                <div class="mobile-nav-foot">
                    ${langSwitch()}
                    <button type="button" class="btn btn-color" data-open-quote data-i18n="common.getQuote">Teklif Al</button>
                </div>
            </nav>
            <div class="header-actions">
                <button type="button" class="icon-btn" data-open-search aria-label="Ara" data-i18n-aria="common.search"><i class="fas fa-search"></i></button>
                ${langSwitch()}
                <button type="button" class="btn btn-color header-cta" data-open-quote data-i18n="common.getQuote">Teklif Al</button>
                <button type="button" class="menu-toggle" aria-label="Menü" aria-controls="mainNav" aria-expanded="false"><span></span><span></span><span></span></button>
            </div>
        </div>
    </header>
    <div class="nav-backdrop" data-nav-close></div>`;

    const footer = `
    <footer class="site-footer">
        <div class="container-wide footer-top">
            <div>
                ${logo()}
                <p data-i18n="footer.about">Samtida Cosmetics; otel, spa ve konaklama sektörüne özel dispenser sistemleri, banyo kozmetikleri ve tamamlayıcı ürünleri tek çatı altında tasarlar ve üretir.</p>
                <div class="certs" aria-label="Sertifikalar">
                    <div class="cert"><b>ISO</b><small>9001</small></div>
                    <div class="cert"><b>ISO</b><small>14001</small></div>
                    <div class="cert"><b>GMP</b><small>22716</small></div>
                    <div class="cert"><b>HALAL</b><small>CERT</small></div>
                </div>
                <div class="socials">
                    <a href="${CONFIG.instagram}" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="${CONFIG.linkedin}" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    <a href="${CONFIG.facebook}" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                </div>
            </div>
            <div>
                <h4 data-i18n="footer.sitemap">Site Haritası</h4>
                <ul class="footer-links">
                    <li><a href="/index.html" data-i18n="nav.home">Anasayfa</a></li>
                    <li><a href="/hakkimizda.html" data-i18n="nav.about">Hakkımızda</a></li>
                    <li><a href="/uretim.html" data-i18n="nav.production">Üretim</a></li>
                    <li><a href="/dispenser.html" data-i18n="nav.dispenser">Dispenser</a></li>
                    <li><a href="/urunler/index.html" data-i18n="nav.products">Ürünler</a></li>
                    <li><a href="/markalar.html" data-i18n="nav.brands">Markalarımız</a></li>
                    <li><a href="/surdurulebilirlik.html" data-i18n="nav.sustainability">Sürdürülebilirlik</a></li>
                    <li><a href="/iletisim.html" data-i18n="nav.contact">İletişim</a></li>
                </ul>
            </div>
            <div>
                <h4 data-i18n="nav.groups">Ürün Grupları</h4>
                <ul class="footer-links">${categoryLinks.replace(/<a /g, '<li><a ').replace(/<\/a>/g, '</a></li>')}</ul>
            </div>
            <div>
                <h4 data-i18n="nav.contact">İletişim</h4>
                <ul class="footer-contact">
                    <li><i class="fas fa-map-marker-alt"></i><span><small data-i18n="footer.hq">Merkez Ofis & Fabrika</small>${CONFIG.address}</span></li>
                    <li><i class="fas fa-phone"></i><span><small data-i18n="footer.phone">Telefon</small><a href="tel:${CONFIG.phoneHref}">${CONFIG.phone}</a></span></li>
                    <li><i class="fas fa-envelope"></i><span><small data-i18n="footer.email">E-posta</small><a href="mailto:${CONFIG.email}">${CONFIG.email}</a></span></li>
                    <li><i class="fas fa-shopping-bag"></i><span><small data-i18n="footer.orders">Sipariş</small><a href="mailto:${CONFIG.orderEmail}">${CONFIG.orderEmail}</a></span></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container-wide">
                <span>&copy; ${new Date().getFullYear()} Samtida Cosmetics. <span data-i18n="footer.rights">Tüm hakları saklıdır.</span></span>
                <span>Powered by <a href="/index.html">Samtida</a></span>
            </div>
        </div>
    </footer>`;

    const formFields = (prefix) => `
        <div class="form-grid">
            <div class="field"><label for="${prefix}-name" data-i18n="form.name">Ad</label><input id="${prefix}-name" name="name" autocomplete="given-name" required><div class="error" data-i18n="form.required">Bu alan zorunludur.</div></div>
            <div class="field"><label for="${prefix}-surname" data-i18n="form.surname">Soyad</label><input id="${prefix}-surname" name="surname" autocomplete="family-name" required><div class="error" data-i18n="form.required">Bu alan zorunludur.</div></div>
            <div class="field"><label for="${prefix}-email" data-i18n="form.email">E-posta</label><input id="${prefix}-email" name="email" type="email" autocomplete="email" required><div class="error" data-i18n="form.emailError">Geçerli bir e-posta adresi girin.</div></div>
            <div class="field"><label for="${prefix}-phone" data-i18n="form.phone">Telefon</label><input id="${prefix}-phone" name="phone" type="tel" autocomplete="tel" required><div class="error" data-i18n="form.phoneError">Geçerli bir telefon numarası girin.</div></div>
            <div class="field full"><label for="${prefix}-company" data-i18n="form.company">Firma Adı</label><input id="${prefix}-company" name="company" autocomplete="organization"></div>
            <div class="field full"><label for="${prefix}-message" data-i18n="form.message">Mesajınız</label><textarea id="${prefix}-message" name="message" required></textarea><div class="error" data-i18n="form.required">Bu alan zorunludur.</div></div>
            <label class="consent full"><input type="checkbox" name="consent" required> <span data-i18n="form.consent">Kişisel verilerimin talebime yanıt verilmesi amacıyla işlenmesini kabul ediyorum.</span></label>
        </div>
        <div class="form-actions"><button type="submit" class="btn btn-color btn-plus" data-i18n="form.submit">Gönder</button></div>`;

    window.SAMTIDA_FORM_FIELDS = formFields;

    const modal = `
    <div class="modal" id="quoteModal" aria-hidden="true">
        <div class="modal-backdrop" data-close></div>
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="quoteTitle">
            <button class="modal-close" type="button" data-close aria-label="Kapat" data-i18n-aria="common.close"><i class="fas fa-times"></i></button>
            <span class="eyebrow" lang="en" data-i18n="modal.eyebrow">Samtida Cosmetics</span>
            <h3 id="quoteTitle" data-i18n="modal.title">Bilgi & Teklif Formu</h3>
            <p data-i18n="modal.text">Formu doldurun, satış ekibimiz en geç bir iş günü içinde size dönüş yapsın.</p>
            <form class="samtida-form" data-form-type="info" novalidate>
                <div class="form-type" role="tablist">
                    <button type="button" class="active" data-type="info" data-i18n="form.infoForm">Bilgi Formu</button>
                    <button type="button" data-type="price" data-i18n="form.priceForm">Fiyat Formu</button>
                </div>
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
            <p class="search-hint" data-i18n="search.hint">Örn. dispenser, sabun, şampuan, vanity seti</p>
            <div class="search-results" id="searchResults"></div>
        </div>
    </div>`;

    const floating = `
    <a class="whatsapp-btn" href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
    <button class="to-top" type="button" aria-label="Yukarı çık" data-i18n-aria="common.toTop"><i class="fas fa-arrow-up"></i></button>`;

    document.body.insertAdjacentHTML('afterbegin', header);
    document.body.insertAdjacentHTML('beforeend', footer + modal + search + floating);
})();
