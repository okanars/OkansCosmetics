// Samtida Cosmetics — çoklu dil (TR / EN / RU)
// Türkçe metinler doğrudan HTML'de durur; EN ve RU sözlükleri js/lang/*.js dosyalarındadır.
// Kullanım: data-i18n (metin), data-i18n-html (HTML), data-i18n-ph (placeholder), data-i18n-aria (aria-label)
(function () {
    const SUPPORTED = ['tr', 'en', 'ru'];
    const STORAGE_KEY = 'samtidaLang';

    let lang = 'tr';
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (SUPPORTED.includes(saved)) lang = saved;
    } catch (e) { /* depolama kapalı olabilir */ }

    function dict() {
        if (lang === 'en') return window.SAMTIDA_LANG_EN || {};
        if (lang === 'ru') return window.SAMTIDA_LANG_RU || {};
        return {};
    }

    function t(key, fallback) {
        const value = dict()[key];
        return value != null ? value : fallback;
    }

    function pick(obj) {
        if (!obj || typeof obj !== 'object') return obj;
        return obj[lang] || obj.tr;
    }

    function apply(root) {
        root = root || document;
        document.documentElement.lang = lang;
        if (lang === 'tr') return;
        const d = dict();
        root.querySelectorAll('[data-i18n]').forEach(el => {
            const v = d[el.dataset.i18n];
            if (v != null) el.textContent = v;
        });
        root.querySelectorAll('[data-i18n-html]').forEach(el => {
            const v = d[el.dataset.i18nHtml];
            if (v != null) el.innerHTML = v;
        });
        root.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const v = d[el.dataset.i18nPh];
            if (v != null) el.placeholder = v;
        });
        root.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const v = d[el.dataset.i18nAria];
            if (v != null) el.setAttribute('aria-label', v);
        });
        const titleKey = document.body && document.body.dataset.title;
        if (titleKey && d[titleKey]) document.title = d[titleKey];
    }

    function set(next) {
        if (!SUPPORTED.includes(next) || next === lang) return;
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* yok say */ }
        window.location.reload();
    }

    window.SamtidaI18n = { get lang() { return lang; }, supported: SUPPORTED, t, pick, apply, set };
})();
