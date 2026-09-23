// Samtida Cosmetics — ürün grupları, seriler ve ürün kataloğu
// Metinler { tr, en, ru } şeklinde tutulur; aktif dil SamtidaI18n.pick() ile seçilir.

window.SAMTIDA_CATEGORIES = [
    {
        slug: 'dispenserler',
        image: '/images/samtida/cat-dispenser.jpg',
        name: { tr: 'Dispenserler', en: 'Dispensers', ru: 'Диспенсеры' },
        desc: {
            tr: 'Duş jeli, şampuan ve sıvı sabun için kartuşlu ve doldurulabilir dispenser sistemleri.',
            en: 'Cartridge and refillable dispenser systems for shower gel, shampoo and liquid soap.',
            ru: 'Картриджные и многоразовые диспенсеры для геля для душа, шампуня и жидкого мыла.'
        }
    },
    {
        slug: 'sabunlar',
        image: '/images/samtida/cat-soap.jpg',
        name: { tr: 'Sabunlar', en: 'Soaps', ru: 'Мыло' },
        desc: {
            tr: 'Farklı form, koku ve gramaj seçenekleriyle özel ambalajlı otel sabunları.',
            en: 'Hotel soaps in custom packaging with a choice of shapes, scents and weights.',
            ru: 'Гостиничное мыло в фирменной упаковке разных форм, ароматов и веса.'
        }
    },
    {
        slug: 'siseler',
        image: '/images/samtida/cat-bottle.jpg',
        name: { tr: 'Şişeler', en: 'Bottles', ru: 'Флаконы' },
        desc: {
            tr: 'Şampuan, saç kremi, duş jeli ve losyon için markanıza özel tasarlanmış şişeler.',
            en: 'Bottles for shampoo, conditioner, shower gel and lotion, designed for your brand.',
            ru: 'Флаконы для шампуня, кондиционера, геля для душа и лосьона в дизайне вашего бренда.'
        }
    },
    {
        slug: 'kisisel-bakim',
        image: '/images/samtida/cat-personal.jpg',
        name: { tr: 'Kişisel Bakım Ürünleri', en: 'Personal Care Products', ru: 'Средства личной гигиены' },
        desc: {
            tr: 'El ve vücut kremleri, banyo tuzları ve misafir konforunu artıran bakım ürünleri.',
            en: 'Hand and body creams, bath salts and care products that elevate guest comfort.',
            ru: 'Кремы для рук и тела, соли для ванн и средства ухода для комфорта гостей.'
        }
    },
    {
        slug: 'tamamlayici',
        image: '/images/samtida/cat-complementary.jpg',
        name: { tr: 'Tamamlayıcı Ürünler', en: 'Complementary Products', ru: 'Дополнительные товары' },
        desc: {
            tr: 'Vanity, diş, tıraş ve dikiş setleri; terlik ve tarak gibi tamamlayıcı aksesuarlar.',
            en: 'Vanity, dental, shaving and sewing kits plus accessories such as slippers and combs.',
            ru: 'Косметические, зубные, бритвенные и швейные наборы, тапочки, расчёски и аксессуары.'
        }
    }
];

window.SAMTIDA_SERIES = {
    'pure-blanc': { tr: 'Pure Blanc', en: 'Pure Blanc', ru: 'Pure Blanc' },
    'ambre-noir': { tr: 'Ambre Noir', en: 'Ambre Noir', ru: 'Ambre Noir' },
    'lavanda': { tr: 'Lavanda', en: 'Lavanda', ru: 'Lavanda' }
};

window.SAMTIDA_PRODUCTS = [
    // Dispenserler
    {
        id: 'duvar-tipi-kartuslu-dispenser', category: 'dispenserler', series: 'pure-blanc', size: '300 ml', moq: 100,
        image: '/images/samtida/cat-dispenser.jpg',
        name: { tr: 'Duvar Tipi Kartuşlu Dispenser', en: 'Wall-Mounted Cartridge Dispenser', ru: 'Настенный картриджный диспенсер' },
        desc: {
            tr: 'Kilitli gövdesi ve hijyenik kartuş sistemiyle israfı önleyen, kolay değiştirilebilir dispenser.',
            en: 'A lockable dispenser with a hygienic cartridge system that prevents waste and is easy to replace.',
            ru: 'Запираемый диспенсер с гигиеничной картриджной системой, исключающей потери и лёгкой в замене.'
        }
    },
    {
        id: 'uclu-dispenser-seti', category: 'dispenserler', series: 'ambre-noir', size: '3 × 300 ml', moq: 50,
        image: '/images/samtida/hero-dispenser.jpg',
        name: { tr: 'Üçlü Dispenser Seti', en: 'Triple Dispenser Set', ru: 'Тройной набор диспенсеров' },
        desc: {
            tr: 'Şampuan, saç kremi ve duş jeli için tek askılı paslanmaz çelik braket üzerinde üçlü set.',
            en: 'A three-piece set for shampoo, conditioner and shower gel on a single stainless steel bracket.',
            ru: 'Набор из трёх диспенсеров для шампуня, кондиционера и геля на едином кронштейне из нержавеющей стали.'
        }
    },
    {
        id: 'doldurulabilir-seramik-dispenser', category: 'dispenserler', series: 'lavanda', size: '350 ml', moq: 100,
        image: '/images/samtida/about-bathroom.jpg',
        name: { tr: 'Doldurulabilir Seramik Dispenser', en: 'Refillable Ceramic Dispenser', ru: 'Многоразовый керамический диспенсер' },
        desc: {
            tr: 'Tezgah üstü kullanım için mat seramik gövdeli, pompalı ve tekrar doldurulabilir dispenser.',
            en: 'A countertop dispenser with a matte ceramic body and pump, designed to be refilled.',
            ru: 'Настольный диспенсер с матовым керамическим корпусом и помпой для повторного наполнения.'
        }
    },
    {
        id: 'sensorlu-temassiz-dispenser', category: 'dispenserler', series: 'pure-blanc', size: '500 ml', moq: 50,
        image: '/images/samtida/standards-room.jpg',
        name: { tr: 'Sensörlü Temassız Dispenser', en: 'Touch-Free Sensor Dispenser', ru: 'Сенсорный бесконтактный диспенсер' },
        desc: {
            tr: 'Kızılötesi sensörlü, pil ile çalışan ve ortak alanlar için ideal temassız sabun dispenseri.',
            en: 'A battery-powered infrared sensor soap dispenser, ideal for public areas.',
            ru: 'Бесконтактный дозатор мыла с ИК-датчиком на батарейках, идеален для общих зон.'
        }
    },
    // Sabunlar
    {
        id: 'kare-otel-sabunu', category: 'sabunlar', series: 'pure-blanc', size: '20 g', moq: 5000,
        image: '/images/samtida/cat-soap.jpg',
        name: { tr: 'Kare Otel Sabunu', en: 'Square Hotel Soap', ru: 'Квадратное гостиничное мыло' },
        desc: {
            tr: 'Bitkisel bazlı, nemlendirici formüllü ve logonuza özel baskılı kutuda kare sabun.',
            en: 'A plant-based square soap with a moisturising formula, in a box printed with your logo.',
            ru: 'Квадратное мыло на растительной основе с увлажняющей формулой в коробке с вашим логотипом.'
        }
    },
    {
        id: 'oval-bitkisel-sabun', category: 'sabunlar', series: 'lavanda', size: '30 g', moq: 5000,
        image: '/images/samtida/series-lavender.jpg',
        name: { tr: 'Oval Bitkisel Sabun', en: 'Oval Botanical Soap', ru: 'Овальное растительное мыло' },
        desc: {
            tr: 'Lavanta özlü, cildi kurutmayan oval form bitkisel sabun; plise veya kutu ambalaj.',
            en: 'An oval botanical soap with lavender extract that does not dry the skin; pleated or boxed.',
            ru: 'Овальное растительное мыло с экстрактом лаванды, не сушит кожу; плиссе или коробка.'
        }
    },
    {
        id: 'zeytinyagli-dogal-sabun', category: 'sabunlar', series: 'ambre-noir', size: '40 g', moq: 3000,
        image: '/images/samtida/parallax-production.jpg',
        name: { tr: 'Zeytinyağlı Doğal Sabun', en: 'Natural Olive Oil Soap', ru: 'Натуральное оливковое мыло' },
        desc: {
            tr: 'Soğuk işlem zeytinyağı bazlı, parfümsüz seçeneği de bulunan premium doğal sabun.',
            en: 'A premium cold-process olive oil soap, also available fragrance-free.',
            ru: 'Премиальное мыло холодного отжима на оливковом масле, есть вариант без отдушки.'
        }
    },
    {
        id: 'plise-ambalajli-sabun', category: 'sabunlar', series: 'pure-blanc', size: '15 g', moq: 10000,
        image: '/images/samtida/page-spa.jpg',
        name: { tr: 'Plise Ambalajlı Sabun', en: 'Pleat-Wrapped Soap', ru: 'Мыло в плиссированной упаковке' },
        desc: {
            tr: 'Ekonomik otel konseptleri için plise kağıt ambalajlı, hafif kokulu mini sabun.',
            en: 'A lightly scented mini soap in pleated paper wrap for economy hotel concepts.',
            ru: 'Мини-мыло с лёгким ароматом в плиссированной бумаге для эконом-концепций.'
        }
    },
    // Şişeler
    {
        id: 'sampuan-30ml', category: 'siseler', series: 'pure-blanc', size: '30 ml', moq: 5000,
        image: '/images/samtida/cat-bottle.jpg',
        name: { tr: 'Şampuan', en: 'Shampoo', ru: 'Шампунь' },
        desc: {
            tr: 'Tüm saç tipleri için pH dengeli, parabensiz şampuan; flip-top kapaklı şişede.',
            en: 'A pH-balanced, paraben-free shampoo for all hair types in a flip-top bottle.',
            ru: 'Шампунь без парабенов со сбалансированным pH для всех типов волос во флаконе с откидной крышкой.'
        }
    },
    {
        id: 'dus-jeli-30ml', category: 'siseler', series: 'ambre-noir', size: '30 ml', moq: 5000,
        image: '/images/samtida/about-bathroom.jpg',
        name: { tr: 'Duş Jeli', en: 'Shower Gel', ru: 'Гель для душа' },
        desc: {
            tr: 'Amber ve sandal ağacı notalı, yoğun köpüklü ve cilt dostu duş jeli.',
            en: 'A rich-lather, skin-friendly shower gel with amber and sandalwood notes.',
            ru: 'Мягкий для кожи гель для душа с густой пеной и нотами амбры и сандала.'
        }
    },
    {
        id: 'sac-kremi-30ml', category: 'siseler', series: 'lavanda', size: '30 ml', moq: 5000,
        image: '/images/samtida/series-amber.jpg',
        name: { tr: 'Saç Kremi', en: 'Conditioner', ru: 'Кондиционер' },
        desc: {
            tr: 'Kolay tarama sağlayan, lavanta özlü hafif dokulu saç kremi.',
            en: 'A lightweight lavender conditioner that makes combing easy.',
            ru: 'Лёгкий кондиционер с лавандой для лёгкого расчёсывания.'
        }
    },
    {
        id: 'vucut-losyonu-30ml', category: 'siseler', series: 'pure-blanc', size: '30 ml', moq: 5000,
        image: '/images/samtida/hero-series.jpg',
        name: { tr: 'Vücut Losyonu', en: 'Body Lotion', ru: 'Лосьон для тела' },
        desc: {
            tr: 'Shea yağı ve E vitamini içeren, hızlı emilen nemlendirici vücut losyonu.',
            en: 'A fast-absorbing moisturising body lotion with shea butter and vitamin E.',
            ru: 'Быстро впитывающийся увлажняющий лосьон с маслом ши и витамином E.'
        }
    },
    // Kişisel bakım
    {
        id: 'el-kremi', category: 'kisisel-bakim', series: 'lavanda', size: '50 ml', moq: 2000,
        image: '/images/samtida/cat-personal.jpg',
        name: { tr: 'El Kremi', en: 'Hand Cream', ru: 'Крем для рук' },
        desc: {
            tr: 'Yağlı his bırakmayan, gliserin ve bitkisel yağlarla zenginleştirilmiş el kremi.',
            en: 'A non-greasy hand cream enriched with glycerin and botanical oils.',
            ru: 'Нежирный крем для рук с глицерином и растительными маслами.'
        }
    },
    {
        id: 'banyo-tuzu', category: 'kisisel-bakim', series: 'ambre-noir', size: '100 g', moq: 1000,
        image: '/images/samtida/hero-series.jpg',
        name: { tr: 'Banyo Tuzu', en: 'Bath Salt', ru: 'Соль для ванн' },
        desc: {
            tr: 'Mineral bakımından zengin deniz tuzu ve esansiyel yağlarla rahatlatıcı banyo tuzu.',
            en: 'A relaxing bath salt of mineral-rich sea salt and essential oils.',
            ru: 'Расслабляющая соль для ванн из богатой минералами морской соли и эфирных масел.'
        }
    },
    {
        id: 'vucut-kremi', category: 'kisisel-bakim', series: 'pure-blanc', size: '150 ml', moq: 1000,
        image: '/images/samtida/series-amber.jpg',
        name: { tr: 'Vücut Kremi', en: 'Body Cream', ru: 'Крем для тела' },
        desc: {
            tr: 'Spa ve suit odalar için yoğun nemlendirici, kavanoz ambalajlı premium vücut kremi.',
            en: 'A rich premium body cream in a jar for spas and suites.',
            ru: 'Насыщенный премиальный крем для тела в баночке для спа и люксов.'
        }
    },
    // Tamamlayıcı
    {
        id: 'vanity-seti', category: 'tamamlayici', series: 'pure-blanc', size: '1 set', moq: 5000,
        image: '/images/samtida/cat-complementary.jpg',
        name: { tr: 'Vanity Seti', en: 'Vanity Kit', ru: 'Косметический набор' },
        desc: {
            tr: 'Pamuk ped ve kulak çubuğundan oluşan, geri dönüştürülebilir kutuda vanity seti.',
            en: 'A vanity kit with cotton pads and cotton buds in a recyclable box.',
            ru: 'Набор из ватных дисков и палочек в перерабатываемой коробке.'
        }
    },
    {
        id: 'dis-bakim-seti', category: 'tamamlayici', series: 'ambre-noir', size: '1 set', moq: 5000,
        image: '/images/samtida/standards-room.jpg',
        name: { tr: 'Diş Bakım Seti', en: 'Dental Kit', ru: 'Зубной набор' },
        desc: {
            tr: 'Bambu saplı diş fırçası ve mini diş macunundan oluşan çevre dostu set.',
            en: 'An eco-friendly kit with a bamboo toothbrush and mini toothpaste.',
            ru: 'Экологичный набор: бамбуковая зубная щётка и мини-паста.'
        }
    },
    {
        id: 'tiras-seti', category: 'tamamlayici', series: 'ambre-noir', size: '1 set', moq: 3000,
        image: '/images/samtida/parallax-hotel.jpg',
        name: { tr: 'Tıraş Seti', en: 'Shaving Kit', ru: 'Бритвенный набор' },
        desc: {
            tr: 'Çift bıçaklı tıraş bıçağı ve tıraş köpüğünden oluşan, özel baskılı kutuda set.',
            en: 'A twin-blade razor and shaving foam in a custom-printed box.',
            ru: 'Двухлезвийная бритва и пена для бритья в коробке с вашей печатью.'
        }
    },
    {
        id: 'otel-terligi', category: 'tamamlayici', series: 'pure-blanc', size: '28 cm', moq: 2000,
        image: '/images/samtida/hero-sets.jpg',
        name: { tr: 'Otel Terliği', en: 'Hotel Slippers', ru: 'Гостиничные тапочки' },
        desc: {
            tr: 'Kaymaz tabanlı, havlu kumaş, logolu nakış seçenekli kapalı burun otel terliği.',
            en: 'Closed-toe terry slippers with non-slip soles and optional logo embroidery.',
            ru: 'Махровые тапочки с закрытым носком, нескользящей подошвой и вышивкой логотипа.'
        }
    }
];
