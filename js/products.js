const products = [
    {
        id: 1,
        name: "Sodyum Lauril Sülfat (SLS)",
        cas: "151-21-3",
        origin: "Almanya",
        form: "Toz / Granül",
        applications: ["Şampuan", "Duş Jeli", "Diş Macunu", "Sıvı Sabun"],
        description: "Yüksek köpürme kapasitesine sahip etkili bir yüzey aktif maddedir.",
        image: "/images/products/sls.jpg",
        category: "surfaktan",
        slug: "sodyum-lauril-sulfat"
    },
    {
        id: 2,
        name: "Sitrik Asit",
        cas: "77-92-9",
        origin: "Çin",
        form: "Kristal Toz",
        applications: ["pH Ayarlayıcı", "Şelasyon Ajanı", "Tonik", "Krem"],
        description: "Kozmetik formülasyonlarda pH dengesini ayarlamak için kullanılır.",
        image: "/images/products/citric-acid.jpg",
        category: "aktif",
        slug: "sitrik-asit"
    },
    {
        id: 3,
        name: "Gliserin (Bitkisel)",
        cas: "56-81-5",
        origin: "Malezya",
        form: "Sıvı",
        applications: ["Nemlendirici", "Losyon", "Krem", "Maske"],
        description: "Cildi nemlendirme ve pürüzsüzleştirme özelliğine sahip bir humektandır.",
        image: "/images/products/glycerin.jpg",
        category: "nemlendirici",
        slug: "gliserin"
    },
    {
        id: 4,
        name: "Ksantan Gam (Xanthan Gum)",
        cas: "11138-66-2",
        origin: "Avusturya",
        form: "Toz",
        applications: ["Kıvamlaştırıcı", "Jel", "Losyon", "Serum"],
        description: "Su bazlı ürünlerde stabilite ve kıvam sağlamak için kullanılır.",
        image: "/images/products/xanthan-gum.jpg",
        category: "kivam",
        slug: "ksantan-gam"
    },
    {
        id: 5,
        name: "Setil Alkol",
        cas: "36653-82-4",
        origin: "Hindistan",
        form: "Pul / Mumsu Katı",
        applications: ["Emülgatör", "Kıvamlaştırıcı", "Krem", "Saç Kremi"],
        description: "Emülsiyonları stabilize eden ve ürünlere kıvam veren yağ alkolü.",
        image: "/images/products/cetyl-alcohol.jpg",
        category: "kivam",
        slug: "setil-alkol"
    },
    {
        id: 6,
        name: "Niasinamid (Vitamin B3)",
        cas: "98-92-0",
        origin: "İsviçre",
        form: "Toz",
        applications: ["Aktif İçerik", "Serum", "Leke Kremi", "Yaşlanma Karşıtı"],
        description: "Cilt bariyerini güçlendiren, leke ve gözenek görünümünü azaltan aktif.",
        image: "/images/products/niacinamide.jpg",
        category: "aktif",
        slug: "niasinamid"
    },
    {
        id: 7,
        name: "Tokoferil Asetat (Vitamin E)",
        cas: "7695-91-2",
        origin: "Almanya",
        form: "Yağlı Sıvı",
        applications: ["Antioksidan", "Nemlendirici", "Güneş Sonrası Ürünler"],
        description: "Güçlü bir antioksidan olup, cildi serbest radikallere karşı korur.",
        image: "/images/products/vitamin-e.jpg",
        category: "aktif",
        slug: "vitamin-e"
    },
    {
        id: 8,
        name: "Fenoksietanol",
        cas: "122-99-6",
        origin: "ABD",
        form: "Sıvı",
        applications: ["Koruyucu", "Tüm Kozmetik Ürünler"],
        description: "Geniş spektrumlu bir koruyucu olarak ürünlerin raf ömrünü uzatır.",
        image: "/images/products/phenoxyethanol.jpg",
        category: "koruyucu",
        slug: "fenoksietanol"
    },
    {
        id: 9,
        name: "Kaprilik/Kaprik Trigliserit",
        cas: "73398-61-5",
        origin: "Almanya",
        form: "Sıvı Yağ",
        applications: ["Yumuşatıcı (Emollient)", "Taşıyıcı Yağ", "Makyaj Temizleyici"],
        description: "Hindistancevizi yağından elde edilen, cilde ipeksi bir his veren yumuşatıcı.",
        image: "/images/products/caprylic-triglyceride.jpg",
        category: "nemlendirici",
        slug: "kaprilik-trigliserit"
    },
    {
        id: 10,
        name: "Hyaluronik Asit",
        cas: "9004-61-9",
        origin: "Güney Kore",
        form: "Toz",
        applications: ["Nemlendirici", "Serum", "Yaşlanma Karşıtı", "Dolgunlaştırıcı"],
        description: "Kendi ağırlığının 1000 katı su tutma kapasitesine sahip süper nemlendirici.",
        image: "/images/products/hyaluronic-acid.jpg",
        category: "nemlendirici",
        slug: "hyaluronik-asit"
    },
    {
        id: 11,
        name: "Cocamidopropyl Betaine",
        cas: "61789-40-0",
        origin: "Türkiye",
        form: "Sıvı",
        applications: ["Yardımcı Sürfaktan", "Köpük Arttırıcı", "Şampuan", "Duş Jeli"],
        description: "Cildi tahriş etmeyen, köpük kalitesini artıran amfoterik bir sürfaktan.",
        image: "/images/products/cocamidopropyl-betaine.jpg",
        category: "surfaktan",
        slug: "cocamidopropyl-betaine"
    },
    {
        id: 12,
        name: "Shea Yağı (Butyrospermum Parkii Butter)",
        cas: "91080-23-8",
        origin: "Gana",
        form: "Yumuşak Katı",
        applications: ["Nemlendirici", "Vücut Yağı", "Dudak Balsamı"],
        description: "Vitaminler ve yağ asitleri açısından zengin, yoğun besleyici bir yağ.",
        image: "/images/products/shea-butter.jpg",
        category: "nemlendirici",
        slug: "shea-yagi"
    },
    {
        id: 13,
        name: "Titanyum Dioksit",
        cas: "13463-67-7",
        origin: "Finlandiya",
        form: "Toz",
        applications: ["UV Filtre", "Güneş Kremi", "Makyaj Ürünleri"],
        description: "Geniş spektrumlu koruma sağlayan etkili bir fiziksel UV filtresi.",
        image: "/images/products/titanium-dioxide.jpg",
        category: "aktif",
        slug: "titanyum-dioksit"
    },
    {
        id: 14,
        name: "Pantenol (Provitamin B5)",
        cas: "81-13-0",
        origin: "İsviçre",
        form: "Sıvı / Toz",
        applications: ["Nemlendirici", "Onarıcı", "Saç Bakım", "Cilt Bakım"],
        description: "Cildi ve saçı nemlendiren, onaran ve yatıştıran bir vitamindir.",
        image: "/images/products/panthenol.jpg",
        category: "nemlendirici",
        slug: "pantenol"
    },
    {
        id: 15,
        name: "Salisilik Asit",
        cas: "69-72-7",
        origin: "Çin",
        form: "Kristal Toz",
        applications: ["Akne Karşıtı", "Peeling", "Tonik", "Temizleyici"],
        description: "Gözenekleri temizleyen ve sivilce oluşumunu önleyen bir beta-hidroksi asit (BHA).",
        image: "/images/products/salicylic-acid.jpg",
        category: "aktif",
        slug: "salisilik-asit"
    },
    {
        id: 16,
        name: "Çinko Oksit",
        cas: "1314-13-2",
        origin: "Peru",
        form: "Toz",
        applications: ["UV Filtre", "Pişik Kremi", "Güneş Kremi"],
        description: "UVA ve UVB ışınlarına karşı koruma sağlayan mineral bir güneş filtresi.",
        image: "/images/products/zinc-oxide.jpg",
        category: "aktif",
        slug: "cinko-oksit"
    },
    {
        id: 17,
        name: "Askorbik Asit (Vitamin C)",
        cas: "50-81-7",
        origin: "İngiltere",
        form: "Toz",
        applications: ["Antioksidan", "Leke Karşıtı", "Serum", "Yaşlanma Karşıtı"],
        description: "Cilt tonunu eşitleyen ve kolajen üretimini destekleyen güçlü antioksidan.",
        image: "/images/products/vitamin-c.jpg",
        category: "aktif",
        slug: "vitamin-c"
    },
    {
        id: 18,
        name: "Carbomer",
        cas: "9003-01-4",
        origin: "Belçika",
        form: "Toz",
        applications: ["Kıvamlaştırıcı", "Jel Yapıcı", "Serum", "El Dezenfektanı"],
        description: "Düşük kullanım oranlarında bile yüksek viskoziteli jeller oluşturan polimer.",
        image: "/images/products/carbomer.jpg",
        category: "kivam",
        slug: "carbomer"
    },
    {
        id: 19,
        name: "Propilen Glikol",
        cas: "57-55-6",
        origin: "Almanya",
        form: "Sıvı",
        applications: ["Nemlendirici", "Çözücü", "Krem", "Losyon"],
        description: "Diğer maddelerin cilde nüfuz etmesine yardımcı olan bir humektan ve çözücü.",
        image: "/images/products/propylene-glycol.jpg",
        category: "nemlendirici",
        slug: "propilen-glikol"
    },
    {
        id: 20,
        name: "Polisorbat 20",
        cas: "9005-64-5",
        origin: "Fransa",
        form: "Sıvı",
        applications: ["Çözücü (Solubilizer)", "Emülgatör", "Tonik", "Vücut Spreyi"],
        description: "Esansiyel yağlar gibi yağ bazlı bileşenlerin su içinde çözünmesini sağlar.",
        image: "/images/products/polysorbate.jpg",
        category: "surfaktan",
        slug: "polisorbat-20"
    }
];

// Category mapping for display
const categoryNames = {
    'surfaktan': 'Sürfaktanlar',
    'nemlendirici': 'Nemlendiriciler',
    'koruyucu': 'Koruyucular',
    'aktif': 'Aktif İçerikler',
    'kivam': 'Kıvamlaştırıcılar'
};

// Function to load products on the products page
function loadProducts() {
    const productGrid = document.getElementById('product-list-grid');
    if (!productGrid) return;

    products.forEach((product, index) => {
        const cardLink = document.createElement('a');
        cardLink.href = `/urunler/${product.slug}.html`;
        cardLink.className = 'product-card reveal';
        cardLink.setAttribute('data-category', product.category.toLowerCase());
        cardLink.setAttribute('data-origin', product.origin);
        cardLink.style.animationDelay = `${index * 0.1}s`;

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'product-card-image-wrapper';

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.className = 'product-card-image';
        img.loading = 'lazy';
        imageWrapper.appendChild(img);

        const content = document.createElement('div');
        content.className = 'product-card-content';

        const title = document.createElement('h3');
        title.textContent = product.name;
        
        const description = document.createElement('p');
        description.textContent = product.description;

        const meta = document.createElement('div');
        meta.className = 'product-meta';

        const categorySpan = document.createElement('span');
        categorySpan.textContent = categoryNames[product.category] || product.category;
        meta.appendChild(categorySpan);

        const originSpan = document.createElement('span');
        originSpan.textContent = product.origin;
        meta.appendChild(originSpan);

        const casSpan = document.createElement('span');
        casSpan.textContent = `CAS: ${product.cas}`;
        meta.appendChild(casSpan);

        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(meta);

        cardLink.appendChild(imageWrapper);
        cardLink.appendChild(content);

        productGrid.appendChild(cardLink);
    });
}

// Load products when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProducts);
} else {
    loadProducts();
} 