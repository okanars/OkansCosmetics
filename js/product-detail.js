// Product Detail Page Handler
class ProductDetailPage {
    constructor() {
        this.currentProduct = null;
        this.init();
    }

    init() {
        this.loadProductFromURL();
        this.setupEventListeners();
    }

    loadProductFromURL() {
        const path = window.location.pathname;
        const slug = path.split('/').pop().replace('.html', '');
        
        // Find product by slug
        this.currentProduct = products.find(product => product.slug === slug);
        
        if (this.currentProduct) {
            this.populateProductDetails();
            this.loadRelatedProducts();
        } else {
            this.showProductNotFound();
        }
    }

    populateProductDetails() {
        const product = this.currentProduct;
        
        // Update page title and meta
        document.getElementById('page-title').textContent = `${product.name} - KozmetikKimya`;
        document.getElementById('page-description').content = product.description;
        
        // Update breadcrumb
        document.getElementById('breadcrumb-product').textContent = product.name;
        
        // Update main product info
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-main-image').src = product.image;
        document.getElementById('product-main-image').alt = product.name;
        
        // Update badges
        document.getElementById('product-category').textContent = this.getCategoryName(product.category);
        document.getElementById('product-origin').textContent = product.origin;
        
        // Update specifications
        document.getElementById('product-cas').textContent = product.cas;
        document.getElementById('product-form').textContent = product.form;
        document.getElementById('product-origin-spec').textContent = product.origin;
        
        // Update applications
        this.populateApplications(product.applications);
        
        // Update technical specifications
        this.populateSpecifications(product);
        
        // Update safety information
        this.populateSafetyInfo(product);
    }

    populateApplications(applications) {
        const container = document.getElementById('product-applications');
        container.innerHTML = '';
        
        applications.forEach(app => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i><span>${app}</span>`;
            container.appendChild(li);
        });
    }

    populateSpecifications(product) {
        const container = document.getElementById('product-specifications');
        
        const specs = [
            { label: 'Kimyasal Formül', value: this.getChemicalFormula(product.name) },
            { label: 'Moleküler Ağırlık', value: this.getMolecularWeight(product.name) },
            { label: 'Yoğunluk', value: this.getDensity(product.name) },
            { label: 'Erime Noktası', value: this.getMeltingPoint(product.name) },
            { label: 'Kaynama Noktası', value: this.getBoilingPoint(product.name) },
            { label: 'pH Değeri', value: this.getPHValue(product.name) },
            { label: 'Çözünürlük', value: this.getSolubility(product.name) }
        ];
        
        container.innerHTML = '';
        specs.forEach(spec => {
            if (spec.value) {
                const div = document.createElement('div');
                div.className = 'spec-row';
                div.innerHTML = `
                    <span class="spec-label">${spec.label}:</span>
                    <span class="spec-value">${spec.value}</span>
                `;
                container.appendChild(div);
            }
        });
    }

    populateSafetyInfo(product) {
        const container = document.getElementById('product-safety');
        
        const safetyInfo = [
            { icon: 'fas fa-exclamation-triangle', label: 'Güvenlik Sınıfı', value: this.getSafetyClass(product.name) },
            { icon: 'fas fa-shield-alt', label: 'Koruyucu Ekipman', value: this.getProtectiveEquipment(product.name) },
            { icon: 'fas fa-flask', label: 'Depolama Koşulları', value: this.getStorageConditions(product.name) },
            { icon: 'fas fa-leaf', label: 'Çevre Dostu', value: this.getEnvironmentalInfo(product.name) }
        ];
        
        container.innerHTML = '';
        safetyInfo.forEach(info => {
            if (info.value) {
                const div = document.createElement('div');
                div.className = 'safety-item';
                div.innerHTML = `
                    <i class="${info.icon}"></i>
                    <div>
                        <span class="safety-label">${info.label}</span>
                        <span class="safety-value">${info.value}</span>
                    </div>
                `;
                container.appendChild(div);
            }
        });
    }

    loadRelatedProducts() {
        const container = document.getElementById('related-products');
        const currentCategory = this.currentProduct.category;
        
        // Get products from same category (excluding current product)
        const relatedProducts = products
            .filter(product => product.category === currentCategory && product.id !== this.currentProduct.id)
            .slice(0, 4);
        
        container.innerHTML = '';
        relatedProducts.forEach(product => {
            const card = this.createRelatedProductCard(product);
            container.appendChild(card);
        });
    }

    createRelatedProductCard(product) {
        const card = document.createElement('div');
        card.className = 'related-product-card';
        card.innerHTML = `
            <div class="related-product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="related-product-content">
                <h4>${product.name}</h4>
                <p>${product.description.substring(0, 100)}...</p>
                <a href="/urunler/${product.slug}.html" class="related-product-link">
                    <span>Detayları Gör</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        return card;
    }

    showProductNotFound() {
        document.body.innerHTML = `
            <div class="not-found-container">
                <div class="not-found-content">
                    <i class="fas fa-search"></i>
                    <h1>Ürün Bulunamadı</h1>
                    <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
                    <a href="/urunler/index.html" class="btn btn-primary">
                        <i class="fas fa-arrow-left"></i>
                        <span>Tüm Ürünlere Dön</span>
                    </a>
                </div>
            </div>
        `;
    }

    getCategoryName(category) {
        const categoryNames = {
            'surfaktan': 'Sürfaktanlar',
            'nemlendirici': 'Nemlendiriciler',
            'koruyucu': 'Koruyucular',
            'aktif': 'Aktif İçerikler',
            'kivam': 'Kıvamlaştırıcılar'
        };
        return categoryNames[category] || category;
    }

    // Technical specification helper methods
    getChemicalFormula(productName) {
        const formulas = {
            'Sodyum Lauril Sülfat (SLS)': 'C₁₂H₂₅SO₄Na',
            'Sitrik Asit': 'C₆H₈O₇',
            'Gliserin (Bitkisel)': 'C₃H₈O₃',
            'Hyaluronik Asit': '(C₁₄H₂₁NO₁₁)ₙ',
            'Askorbik Asit (Vitamin C)': 'C₆H₈O₆'
        };
        return formulas[productName] || 'Mevcut değil';
    }

    getMolecularWeight(productName) {
        const weights = {
            'Sodyum Lauril Sülfat (SLS)': '288.38 g/mol',
            'Sitrik Asit': '192.12 g/mol',
            'Gliserin (Bitkisel)': '92.09 g/mol',
            'Hyaluronik Asit': '~1,000,000 g/mol',
            'Askorbik Asit (Vitamin C)': '176.12 g/mol'
        };
        return weights[productName] || 'Mevcut değil';
    }

    getDensity(productName) {
        const densities = {
            'Sodyum Lauril Sülfat (SLS)': '1.01 g/cm³',
            'Sitrik Asit': '1.665 g/cm³',
            'Gliserin (Bitkisel)': '1.261 g/cm³',
            'Hyaluronik Asit': '1.0-1.1 g/cm³'
        };
        return densities[productName] || 'Mevcut değil';
    }

    getMeltingPoint(productName) {
        const meltingPoints = {
            'Sodyum Lauril Sülfat (SLS)': '204-207°C',
            'Sitrik Asit': '153°C',
            'Gliserin (Bitkisel)': '17.8°C',
            'Askorbik Asit (Vitamin C)': '190-192°C'
        };
        return meltingPoints[productName] || 'Mevcut değil';
    }

    getBoilingPoint(productName) {
        const boilingPoints = {
            'Sodyum Lauril Sülfat (SLS)': 'Decomposes',
            'Sitrik Asit': '175°C',
            'Gliserin (Bitkisel)': '290°C',
            'Askorbik Asit (Vitamin C)': 'Decomposes'
        };
        return boilingPoints[productName] || 'Mevcut değil';
    }

    getPHValue(productName) {
        const phValues = {
            'Sodyum Lauril Sülfat (SLS)': '6.5-8.5 (1% sol.)',
            'Sitrik Asit': '2.2 (1% sol.)',
            'Gliserin (Bitkisel)': '5.5-7.0',
            'Hyaluronik Asit': '6.0-7.5'
        };
        return phValues[productName] || 'Mevcut değil';
    }

    getSolubility(productName) {
        const solubilities = {
            'Sodyum Lauril Sülfat (SLS)': 'Su, etanol',
            'Sitrik Asit': 'Su, etanol',
            'Gliserin (Bitkisel)': 'Su, etanol',
            'Hyaluronik Asit': 'Su'
        };
        return solubilities[productName] || 'Mevcut değil';
    }

    getSafetyClass(productName) {
        const safetyClasses = {
            'Sodyum Lauril Sülfat (SLS)': 'Güvenli (Kozmetik)',
            'Sitrik Asit': 'Güvenli (GRAS)',
            'Gliserin (Bitkisel)': 'Güvenli (GRAS)',
            'Hyaluronik Asit': 'Güvenli (Doğal)'
        };
        return safetyClasses[productName] || 'Standart';
    }

    getProtectiveEquipment(productName) {
        return 'Eldiven, gözlük (gerekirse)';
    }

    getStorageConditions(productName) {
        return 'Serin, kuru yerde, 15-25°C';
    }

    getEnvironmentalInfo(productName) {
        const envInfo = {
            'Sodyum Lauril Sülfat (SLS)': 'Biyolojik olarak parçalanabilir',
            'Sitrik Asit': 'Doğal, biyolojik olarak parçalanabilir',
            'Gliserin (Bitkisel)': 'Doğal, biyolojik olarak parçalanabilir',
            'Hyaluronik Asit': 'Doğal, biyolojik olarak parçalanabilir'
        };
        return envInfo[productName] || 'Standart';
    }

    setupEventListeners() {
        // Add any additional event listeners here
    }
}

// Initialize product detail page when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProductDetailPage();
    });
} else {
    new ProductDetailPage();
} 