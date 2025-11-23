// Çoklu Dil Yönetimi
(function() {
  // Desteklenen diller ve kısaltmaları
  const LANGS = [
    { code: 'tr', abbr: 'TR' },
    { code: 'en', abbr: 'EN' },
    { code: 'de', abbr: 'DE' }
  ];
  
  const LANG_FILES = {
    tr: '/js/lang/tr.js',
    en: '/js/lang/en.js',
    de: '/js/lang/de.js'
  };

  // Varsayılan dil
  let currentLang = localStorage.getItem('siteLang') || 'tr';
  let translations = {};

  // Dil dosyasını yükle
  function loadLang(lang, cb) {
    if (!LANGS.find(l => l.code === lang)) lang = 'tr';
    const script = document.createElement('script');
    script.src = LANG_FILES[lang];
    script.onload = function() {
      translations = window['translations' + lang.toUpperCase()];
      if (typeof cb === 'function') cb();
    };
    script.onerror = function() {
        console.error(`Dil dosyası yüklenemedi: ${lang}`);
    }
    document.head.appendChild(script);
  }

  // Sayfadaki metinleri güncelle
  async function updateTexts(lang) {
    if (!lang || !LANGS.find(l => l.code === lang)) {
      console.error(`Geçersiz veya desteklenmeyen dil: ${lang}`);
      return;
    }

    // data-i18n olan tüm elemanları çevir
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const keyParts = key.split('.');
        
        // `reduce` ile çeviri nesnesinde derinlemesine arama yap
        let value = keyParts.reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : undefined, translations);

        if (value) {
            // İkonları (<i>) korumak için, sadece metin düğümlerini güncelle
            const iconNode = el.querySelector('i');
            
            // Sadece metin içeriğini bul ve değiştir
            Array.from(el.childNodes).forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                    node.textContent = value;
                }
            });

            // Eğer hiç metin düğümü yoksa (örn. sadece ikon varsa), metni sona ekle
            if (!Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== '')) {
                 if (iconNode) {
                    el.innerHTML = iconNode.outerHTML + ' ' + value;
                 } else {
                    el.textContent = value;
                 }
            }
        }
    });

    // Placeholder çevirileri
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        const translationScope = translations.general || translations;
        const value = translationScope[key];
        if (value) {
            el.placeholder = value;
        }
    });

    // Sayfa başlığını güncelle
    if (translations.pageTitle) {
      document.title = translations.pageTitle;
    }

    // HTML lang attribute'unu güncelle
    document.documentElement.lang = lang;
    
    // RTL desteği için Arapça (kaldırıldı ama altyapı kalabilir)
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }

    updateLangSelector(lang);
  }

  // Dil seçici oluştur
  function createLangSelector() {
    const wrapper = document.getElementById('lang-selector-wrapper');
    if (!wrapper) {
        console.error("#lang-selector-wrapper elementi bulunamadı.");
        return;
    }

    const currentLangData = LANGS.find(l => l.code === currentLang);
    if (!currentLangData) {
        console.error("Mevcut dil verisi bulunamadı: ", currentLang);
        return;
    }

    let optionsHTML = '';
    LANGS.forEach(lang => {
      optionsHTML += `
        <div class="lang-option" data-lang="${lang.code}">
          <span>${lang.abbr}</span>
        </div>
      `;
    });

    const selectorHTML = `
      <div class="lang-selector" id="lang-selector">
        <div class="selected-lang">
          <span id="selected-lang-text">${currentLangData.abbr}</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="lang-options">
          ${optionsHTML}
        </div>
      </div>
    `;
    
    wrapper.innerHTML = selectorHTML;

    const langSelector = document.getElementById('lang-selector');
    if (!langSelector) return;
    
    const selectedLang = langSelector.querySelector('.selected-lang');
    const langOptions = langSelector.querySelector('.lang-options');

    selectedLang.addEventListener('click', (e) => {
      e.stopPropagation();
      langOptions.classList.toggle('show');
    });

    langOptions.addEventListener('click', (e) => {
      const option = e.target.closest('.lang-option');
      if (option) {
        const lang = option.getAttribute('data-lang');
        setLang(lang);
      }
    });

    document.addEventListener('click', () => {
      if (langOptions.classList.contains('show')) {
        langOptions.classList.remove('show');
      }
    });
  }

  // Dili değiştir
  function setLang(lang) {
    if (!LANGS.find(l => l.code === lang)) lang = 'tr';
    localStorage.setItem('siteLang', lang);
    currentLang = lang;
    
    // Sayfayı yeniden yükle
    location.reload();
  }

  function updateLangSelector(lang) {
    const selectedLangText = document.getElementById('selected-lang-text');
    const currentLangData = LANGS.find(l => l.code === lang);

    if (currentLangData) {
      if (selectedLangText) selectedLangText.textContent = currentLangData.abbr;
    }
  }

  // Sayfa yüklendiğinde
  document.addEventListener('DOMContentLoaded', function() {
    createLangSelector();
    loadLang(currentLang, function() {
      updateTexts(currentLang);
    });
  });

})(); 