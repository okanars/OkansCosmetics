// Samtida Kozmetik — dil ve tema altyapısı
// <head> içinde senkron yüklenir: sayfa çizilmeden önce dil, yazı yönü (RTL) ve tema ayarlanır.
// Türkçe metinler doğrudan HTML'de durur; diğer dillerin sözlükleri js/lang/<kod>.js dosyalarındadır.
// Kullanım: data-i18n (metin), data-i18n-html (HTML), data-i18n-ph (placeholder), data-i18n-aria (aria-label)
(function () {
    const LANGS = [
        { code: 'tr', label: 'Türkçe' },
        { code: 'en', label: 'English' },
        { code: 'de', label: 'Deutsch' },
        { code: 'fr', label: 'Français' },
        { code: 'ru', label: 'Русский' },
        { code: 'uk', label: 'Українська' },
        { code: 'ar', label: 'العربية', rtl: true }
    ];
    const SUPPORTED = LANGS.map(l => l.code);
    const LANG_KEY = 'samtidaLang';
    const THEME_KEY = 'samtidaTheme';
    const root = document.documentElement;

    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* depolama kapalı olabilir */ } }
    };

    // Dil: adresteki ?lang= > kayıtlı tercih > tarayıcı dili (ilk ziyaret) > Türkçe.
    // Arama motoru botları her zaman Türkçe (asıl içerik) görür; diğer diller ?lang= adresleriyle dizinlenir.
    const params = new URLSearchParams(location.search);
    const urlLang = params.get('lang');
    const isBot = /bot|crawl|spider|slurp|yandex|baidu|facebookexternalhit|embedly|whatsapp|telegram|lighthouse|pagespeed/i.test(navigator.userAgent);
    let lang = SUPPORTED.includes(urlLang) ? urlLang : store.get(LANG_KEY);
    if (SUPPORTED.includes(urlLang)) store.set(LANG_KEY, urlLang);
    if (!SUPPORTED.includes(lang)) {
        const browser = isBot ? null : (navigator.languages || [navigator.language || 'tr'])
            .map(l => String(l).slice(0, 2).toLowerCase())
            .find(l => SUPPORTED.includes(l));
        lang = browser || 'tr';
    }
    const meta = LANGS.find(l => l.code === lang);
    root.lang = lang;
    root.dir = meta.rtl ? 'rtl' : 'ltr';

    // Çevrilebilir sayfalarda (hreflang listesi olanlar) ?lang= adresi kendi kanonik adresidir
    if (SUPPORTED.includes(urlLang) && urlLang !== 'tr' && document.querySelector('link[rel="alternate"][hreflang]')) {
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.href = canonical.href.split('?')[0] + '?lang=' + urlLang;
    }

    // Sözlüğü sayfa çizilmeden yükle (aynı origin, küçük dosya)
    if (lang !== 'tr') document.write(`<script src="/js/lang/${lang}.js"><\/script>`);
    if (lang === 'ar') document.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@300;400;500;600&display=swap">');

    // Açılış ekranı: oturum başına bir kez
    try {
        if (!sessionStorage.getItem('samtidaSplash')) {
            root.classList.add('splash-on');
            sessionStorage.setItem('samtidaSplash', '1');
        }
    } catch (e) { /* yok say */ }

    // Tema: kayıtlı tercih > işletim sistemi tercihi
    function systemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    let theme = store.get(THEME_KEY);
    if (theme !== 'dark' && theme !== 'light') theme = null;
    root.dataset.theme = theme || systemTheme();

    function dict() {
        return window['SAMTIDA_LANG_' + lang.toUpperCase()] || {};
    }

    function t(key, fallback) {
        if (lang === 'tr') return fallback;
        const value = dict()[key];
        return value != null ? value : fallback;
    }

    // Çok dilli veri nesnesinden ({ tr, en, ... }) aktif dili seç
    function pick(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        return obj[lang] || obj.en || obj.tr;
    }

    function apply(scope) {
        scope = scope || document;
        if (lang === 'tr') return;
        const d = dict();
        scope.querySelectorAll('[data-i18n]').forEach(el => {
            const v = d[el.dataset.i18n];
            if (v != null) el.textContent = v;
        });
        scope.querySelectorAll('[data-i18n-html]').forEach(el => {
            const v = d[el.dataset.i18nHtml];
            if (v != null) el.innerHTML = v;
        });
        scope.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const v = d[el.dataset.i18nPh];
            if (v != null) el.placeholder = v;
        });
        scope.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const v = d[el.dataset.i18nAria];
            if (v != null) el.setAttribute('aria-label', v);
        });
        const titleKey = document.body && document.body.dataset.title;
        if (titleKey && d[titleKey]) document.title = d[titleKey];
        const descMeta = document.querySelector('meta[name="description"]');
        if (titleKey && descMeta && d[titleKey + '.desc']) descMeta.content = d[titleKey + '.desc'];
    }

    // Dil değişince adres de güncellenir (?lang=), böylece her dil paylaşılabilir ve dizinlenebilir
    function setLang(next) {
        if (!SUPPORTED.includes(next) || next === lang) return;
        store.set(LANG_KEY, next);
        const url = new URL(location.href);
        if (next === 'tr') url.searchParams.delete('lang'); else url.searchParams.set('lang', next);
        location.href = url.toString();
    }

    function setTheme(next) {
        root.dataset.theme = next;
        store.set(THEME_KEY, next);
        document.dispatchEvent(new CustomEvent('samtida:theme', { detail: next }));
    }

    // Kullanıcı seçim yapmadıysa işletim sistemi tema değişikliğini izle
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!store.get(THEME_KEY)) {
                root.dataset.theme = e.matches ? 'dark' : 'light';
                document.dispatchEvent(new CustomEvent('samtida:theme', { detail: root.dataset.theme }));
            }
        });
    }

    window.SamtidaI18n = {
        get lang() { return lang; },
        get theme() { return root.dataset.theme; },
        languages: LANGS,
        supported: SUPPORTED,
        isRtl: !!meta.rtl,
        t, pick, apply,
        set: setLang,
        setTheme
    };
})();
