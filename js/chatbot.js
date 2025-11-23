/**
 * Okan'ın Kozmetiği - Chatbot Module
 * 
 * This module handles all chatbot functionality for the website.
 * It provides intelligent Q&A system with keyword matching.
 * 
 * @author Developer Team
 * @version 1.0.0
 */

class OkanChatbot {
    /**
     * Constructor - Initialize chatbot with default settings
     * Burada chatbot'un başlangıç ayarlarını yapıyoruz
     */
    constructor() {
        // State management - chatbot açık mı kapalı mı kontrol ediyoruz
        this.isOpen = false;
        this.messages = []; // Mesaj geçmişini tutuyoruz
        this.currentStep = 'main'; // Şu anki adımı takip ediyoruz
        this.userInfo = {}; // Kullanıcı bilgileri için placeholder
        this.isTyping = false; // Bot yazıyor mu kontrolü
        
        // Initialize Q&A database - soru cevap veritabanını yüklüyoruz
        this.qaDatabase = this.initializeQADatabase();
        
        // Start initialization process
        this.init();
    }
    
    /**
     * Initialize Q&A Database
     * Bu fonksiyon tüm soru-cevap çiftlerini içeren database'i oluşturuyor
     * @returns {Object} Q&A database object
     */
    initializeQADatabase() {
        return {
            // General questions - Genel sorular için
            'merhaba': {
                response: 'Merhaba! Okan\'ın Kozmetiği\'ne hoş geldiniz. Size nasıl yardımcı olabilirim?',
                options: ['Ürünler hakkında bilgi', 'Fiyat teklifi', 'İletişim bilgileri', 'Sipariş süreci']
            },
            'selam': {
                response: 'Selam! Okan\'ın Kozmetiği\'ne hoş geldiniz. Size nasıl yardımcı olabilirim?',
                options: ['Ürünler hakkında bilgi', 'Fiyat teklifi', 'İletişim bilgileri', 'Sipariş süreci']
            },
            'ürünler': {
                response: 'Okan\'ın Kozmetiği olarak kozmetik sektörü için kaliteli ham maddeler tedarik ediyoruz. Hangi kategori hakkında bilgi almak istiyorsunuz?',
                options: ['Sürfaktanlar', 'Nemlendiriciler', 'Koruyucular', 'Aktif İçerikler', 'Kıvamlaştırıcılar', 'Tüm ürünler']
            },
            'fiyat': {
                response: 'Fiyat bilgileri için lütfen hangi ürün hakkında bilgi almak istediğinizi belirtin. Size özel teklif hazırlayabiliriz.',
                options: ['Ürün listesi', 'Toplu alım', 'Özel üretim', 'İletişime geç']
            },
            'sipariş': {
                response: 'Sipariş sürecimiz şu şekildedir:\n1. Ürün seçimi ve teklif\n2. Sipariş onayı\n3. Üretim/hazırlık (1-3 iş günü)\n4. Teslimat\n\nHangi aşamada yardıma ihtiyacınız var?',
                options: ['Minimum sipariş miktarı', 'Teslimat süreleri', 'Ödeme koşulları', 'Kalite garantisi']
            },
            'iletişim': {
                response: 'Bizimle iletişime geçebilirsiniz:\n📞 Telefon: +90 212 552 00 39\n📧 E-posta: info@okaninkozmetigi.com\n📍 Adres: Halide Edip Adıvar Cd. No:21, Esenyurt/İstanbul\n\nHangi konuda yardım istiyorsunuz?',
                options: ['Teknik destek', 'Satış', 'Kalite kontrol', 'İnsan kaynakları']
            },
            'telefon': {
                response: 'Telefon numaramız: +90 212 552 00 39\n\nÇalışma saatleri: Pazartesi - Cuma, 09:00 - 18:00\n\nHızlı destek için WhatsApp: +90 532 123 45 67',
                options: ['E-posta ile iletişim', 'Adres bilgisi', 'Çalışma saatleri']
            },
            'email': {
                response: 'E-posta adresimiz: info@okaninkozmetigi.com\n\n24 saat içinde yanıt veriyoruz.\n\nFarklı departmanlar:\n• Satış: sales@okaninkozmetigi.com\n• Teknik destek: tech@okaninkozmetigi.com\n• Kalite kontrol: quality@okaninkozmetigi.com',
                options: ['Telefon ile iletişim', 'Adres bilgisi', 'WhatsApp']
            },
            'adres': {
                response: 'Adresimiz:\nHalide Edip Adıvar Caddesi No:21\nSelahaddin Eyyübi Mahallesi\nEsenyurt / İstanbul, 34517\n\nGPS koordinatları: 41.0082° N, 28.9784° E\n\nNasıl ulaşabilirsiniz?',
                options: ['Harita', 'Toplu taşıma', 'Araç ile ulaşım', 'Telefon']
            },
            
            // Product categories - Ürün kategorileri için
            'sürfaktanlar': {
                response: 'Sürfaktanlar kategorimizde şu ürünler bulunmaktadır:\n• Sodyum Lauril Sülfat (SLS)\n• Cocamidopropyl Betaine\n• Polisorbat 20\n\nBu ürünler şampuan, duş jeli, diş macunu gibi ürünlerde kullanılır.',
                options: ['SLS hakkında detay', 'Cocamidopropyl Betaine', 'Polisorbat 20', 'Diğer kategoriler']
            },
            'nemlendiriciler': {
                response: 'Nemlendiriciler kategorimizde şu ürünler bulunmaktadır:\n• Gliserin (Bitkisel)\n• Hyaluronik Asit\n• Pantenol\n• Shea Yağı\n• Kaprilik/Kaprik Trigliserit\n\nBu ürünler cilt nemlendirme ve bakım ürünlerinde kullanılır.',
                options: ['Gliserin hakkında', 'Hyaluronik Asit', 'Pantenol', 'Diğer kategoriler']
            },
            'koruyucular': {
                response: 'Koruyucular kategorimizde şu ürünler bulunmaktadır:\n• Fenoksietanol\n\nBu ürünler kozmetik ürünlerin raf ömrünü uzatmak için kullanılır.',
                options: ['Fenoksietanol detayı', 'Diğer kategoriler']
            },
            'aktif': {
                response: 'Aktif İçerikler kategorimizde şu ürünler bulunmaktadır:\n• Vitamin C (Askorbik Asit)\n• Vitamin E (Tokoferil Asetat)\n• Niasinamid (Vitamin B3)\n• Salisilik Asit\n• Çinko Oksit\n• Titanyum Dioksit\n\nBu ürünler cilt bakım ve anti-aging ürünlerinde kullanılır.',
                options: ['Vitamin C hakkında', 'Vitamin E', 'Niasinamid', 'Diğer kategoriler']
            },
            'kıvamlaştırıcılar': {
                response: 'Kıvamlaştırıcılar kategorimizde şu ürünler bulunmaktadır:\n• Ksantan Gam\n• Setil Alkol\n• Carbomer\n\nBu ürünler ürünlere kıvam ve stabilite sağlamak için kullanılır.',
                options: ['Ksantan Gam hakkında', 'Setil Alkol', 'Carbomer', 'Diğer kategoriler']
            },
            
            // Specific products - Spesifik ürünler için
            'sls': {
                response: 'Sodyum Lauril Sülfat (SLS):\n• CAS: 151-21-3\n• Menşei: Almanya\n• Form: Toz/Granül\n• Kullanım: Şampuan, duş jeli, diş macunu\n• Özellik: Yüksek köpürme kapasitesi\n\nDetaylı bilgi için ürün sayfasını ziyaret edebilirsiniz.',
                options: ['Fiyat teklifi', 'Teknik veri sayfası', 'Diğer sürfaktanlar']
            },
            'sodyum lauril': {
                response: 'Sodyum Lauril Sülfat (SLS):\n• CAS: 151-21-3\n• Menşei: Almanya\n• Form: Toz/Granül\n• Kullanım: Şampuan, duş jeli, diş macunu\n• Özellik: Yüksek köpürme kapasitesi\n\nDetaylı bilgi için ürün sayfasını ziyaret edebilirsiniz.',
                options: ['Fiyat teklifi', 'Teknik veri sayfası', 'Diğer sürfaktanlar']
            },
            'vitamin c': {
                response: 'Askorbik Asit (Vitamin C):\n• CAS: 50-81-7\n• Menşei: İngiltere\n• Form: Toz\n• Kullanım: Antioksidan, leke karşıtı, serum\n• Özellik: Cilt tonunu eşitleme, kolajen üretimi\n\nDetaylı bilgi için ürün sayfasını ziyaret edebilirsiniz.',
                options: ['Fiyat teklifi', 'Teknik veri sayfası', 'Diğer vitaminler']
            },
            'askorbik': {
                response: 'Askorbik Asit (Vitamin C):\n• CAS: 50-81-7\n• Menşei: İngiltere\n• Form: Toz\n• Kullanım: Antioksidan, leke karşıtı, serum\n• Özellik: Cilt tonunu eşitleme, kolajen üretimi\n\nDetaylı bilgi için ürün sayfasını ziyaret edebilirsiniz.',
                options: ['Fiyat teklifi', 'Teknik veri sayfası', 'Diğer vitaminler']
            },
            'hyaluronik asit': {
                response: 'Hyaluronik Asit:\n• CAS: 9004-61-9\n• Menşei: Güney Kore\n• Form: Toz\n• Kullanım: Nemlendirici, serum, yaşlanma karşıtı\n• Özellik: Kendi ağırlığının 1000 katı su tutma\n\nDetaylı bilgi için ürün sayfasını ziyaret edebilirsiniz.',
                options: ['Fiyat teklifi', 'Teknik veri sayfası', 'Diğer nemlendiriciler']
            },
            'hyaluronik': {
                response: 'Hyaluronik Asit:\n• CAS: 9004-61-9\n• Menşei: Güney Kore\n• Form: Toz\n• Kullanım: Nemlendirici, serum, yaşlanma karşıtı\n• Özellik: Kendi ağırlığının 1000 katı su tutma\n\nDetaylı bilgi için ürün sayfasını ziyaret edebilirsiniz.',
                options: ['Fiyat teklifi', 'Teknik veri sayfası', 'Diğer nemlendiriciler']
            },
            'gliserin': {
                response: 'Gliserin (Bitkisel):\n• CAS: 56-81-5\n• Menşei: Malezya\n• Form: Sıvı\n• Kullanım: Nemlendirici, losyon, krem\n• Özellik: Cildi nemlendirme ve pürüzsüzleştirme\n\nDetaylı bilgi için ürün sayfasını ziyaret edebilirsiniz.',
                options: ['Fiyat teklifi', 'Teknik veri sayfası', 'Diğer nemlendiriciler']
            },
            'vitamin e': {
                response: 'Tokoferil Asetat (Vitamin E):\n• CAS: 7695-91-2\n• Menşei: Almanya\n• Form: Yağlı Sıvı\n• Kullanım: Antioksidan, nemlendirici\n• Özellik: Güçlü antioksidan, serbest radikal koruması\n\nDetaylı bilgi için ürün sayfasını ziyaret edebilirsiniz.',
                options: ['Fiyat teklifi', 'Teknik veri sayfası', 'Diğer vitaminler']
            },
            
            // Order and delivery - Sipariş ve teslimat bilgileri
            'minimum sipariş': {
                response: 'Minimum sipariş miktarları ürün tipine göre değişmektedir:\n• Standart ürünler: 25 kg\n• Özel üretim: 100 kg\n• Pilot üretim: 5 kg\n\nDetaylı bilgi için satış ekibimizle iletişime geçebilirsiniz.',
                options: ['Fiyat teklifi', 'Özel üretim', 'İletişim']
            },
            'minimum': {
                response: 'Minimum sipariş miktarları ürün tipine göre değişmektedir:\n• Standart ürünler: 25 kg\n• Özel üretim: 100 kg\n• Pilot üretim: 5 kg\n\nDetaylı bilgi için satış ekibimizle iletişime geçebilirsiniz.',
                options: ['Fiyat teklifi', 'Özel üretim', 'İletişim']
            },
            'teslimat': {
                response: 'Teslimat süreleri:\n• Stokta bulunan ürünler: 1-3 iş günü\n• Özel üretim: 2-4 hafta\n• İthalat gerektiren ürünler: 3-6 hafta\n\nTeslimat Türkiye genelinde yapılmaktadır.',
                options: ['Fiyat hesaplama', 'Takip sistemi', 'İletişim']
            },
            'ödeme': {
                response: 'Ödeme koşulları:\n• Yeni müşteriler: Peşin ödeme\n• Mevcut müşteriler: 30 gün vadeli\n• Büyük siparişler: Özel koşullar\n\nKredi kartı, banka havalesi ve çek kabul ediyoruz.',
                options: ['Kredi koşulları', 'Fatura bilgileri', 'İletişim']
            },
            'kredi': {
                response: 'Kredi koşulları:\n• Mevcut müşteriler: 30 gün vadeli\n• Büyük siparişler: 60 gün vadeli\n• Özel projeler: Özel koşullar\n\nKredi limiti müşteri profiline göre belirlenir.',
                options: ['Ödeme yöntemleri', 'Fatura bilgileri', 'İletişim']
            },
            
            // Quality and certificates - Kalite ve sertifikalar
            'kalite': {
                response: 'Kalite garantimiz:\n• ISO 9001:2015 sertifikası\n• GMP (İyi Üretim Uygulamaları)\n• COSMOS sertifikası\n• Her parti için analiz raporu\n• 3 yıl saklama garantisi\n\nTüm ürünlerimiz uluslararası standartlarda üretilmektedir.',
                options: ['Sertifikalar', 'Analiz raporları', 'Kalite kontrol süreci']
            },
            'sertifika': {
                response: 'Sertifikalarımız:\n• ISO 9001:2015 - Kalite Yönetim Sistemi\n• ISO 14001 - Çevre Yönetim Sistemi\n• OHSAS 18001 - İş Sağlığı ve Güvenliği\n• GMP - İyi Üretim Uygulamaları\n• COSMOS - Organik ve Doğal Kozmetik\n\nSertifika kopyalarını talep edebilirsiniz.',
                options: ['Sertifika kopyaları', 'Denetim raporları', 'İletişim']
            },
            'iso': {
                response: 'ISO Sertifikalarımız:\n• ISO 9001:2015 - Kalite Yönetim Sistemi\n• ISO 14001 - Çevre Yönetim Sistemi\n• ISO 45001 - İş Sağlığı ve Güvenliği\n\nSertifikalarımız düzenli olarak denetlenmektedir.',
                options: ['Sertifika kopyaları', 'Denetim raporları', 'İletişim']
            },
            
            // Technical support - Teknik destek bilgileri
            'teknik': {
                response: 'Teknik destek hizmetlerimiz:\n• Formülasyon desteği\n• Uygulama önerileri\n• Uyumluluk testleri\n• Kararlılık çalışmaları\n• Laboratuvar analizleri\n\nTeknik ekibimiz size yardımcı olmaya hazır.',
                options: ['Formülasyon desteği', 'Uyumluluk testi', 'Laboratuvar analizi', 'İletişim']
            },
            'formülasyon': {
                response: 'Formülasyon desteği hizmetlerimiz:\n• Yeni ürün geliştirme\n• Mevcut formülasyon iyileştirme\n• Uyumluluk testleri\n• Kararlılık çalışmaları\n• Performans testleri\n\nDeneyimli formülasyon uzmanlarımız size yardımcı olur.',
                options: ['Teknik destek', 'Laboratuvar analizi', 'İletişim']
            },
            'laboratuvar': {
                response: 'Laboratuvar analiz hizmetlerimiz:\n• Fizikokimyasal analizler\n• Mikrobiyolojik testler\n• Kararlılık testleri\n• Uyumluluk testleri\n• Performans testleri\n\nModern laboratuvarımızda kapsamlı analizler yapıyoruz.',
                options: ['Analiz raporları', 'Test süreleri', 'İletişim']
            },
            
            // Company information - Şirket bilgileri
            'şirket': {
                response: 'Okan\'ın Kozmetiği hakkında:\n• Kuruluş: 2010\n• Deneyim: 20+ yıl\n• İhracat: 70+ ülke\n• Müşteri: 500+ mutlu müşteri\n• Ürün çeşidi: 20+\n\nKozmetik sektöründe güvenilir tedarikçi olarak hizmet veriyoruz.',
                options: ['Şirket profili', 'Referanslar', 'İletişim']
            },
            'hakkında': {
                response: 'Okan\'ın Kozmetiği hakkında:\n• Kuruluş: 2010\n• Deneyim: 20+ yıl\n• İhracat: 70+ ülke\n• Müşteri: 500+ mutlu müşteri\n• Ürün çeşidi: 20+\n\nKozmetik sektöründe güvenilir tedarikçi olarak hizmet veriyoruz.',
                options: ['Şirket profili', 'Referanslar', 'İletişim']
            },
            'kuruluş': {
                response: 'Okan\'ın Kozmetiği 2010 yılında kurulmuştur. 20+ yıllık deneyimimizle kozmetik sektöründe güvenilir tedarikçi olarak hizmet veriyoruz.\n\nBugün 70+ ülkeye ihracat yapıyor ve 500+ mutlu müşteriye hizmet veriyoruz.',
                options: ['Şirket profili', 'Referanslar', 'İletişim']
            },
            
            // Working hours - Çalışma saatleri bilgisi
            'çalışma saatleri': {
                response: 'Çalışma saatlerimiz:\n• Pazartesi - Cuma: 09:00 - 18:00\n• Cumartesi: 09:00 - 13:00\n• Pazar: Kapalı\n\nAcil durumlar için 7/24 teknik destek hattı mevcuttur.',
                options: ['İletişim bilgileri', 'Teknik destek', 'Acil durum']
            },
            'saat': {
                response: 'Çalışma saatlerimiz:\n• Pazartesi - Cuma: 09:00 - 18:00\n• Cumartesi: 09:00 - 13:00\n• Pazar: Kapalı\n\nAcil durumlar için 7/24 teknik destek hattı mevcuttur.',
                options: ['İletişim bilgileri', 'Teknik destek', 'Acil durum']
            },
            
            // Default response - Varsayılan cevap
            'default': {
                response: 'Üzgünüm, sorunuzu tam olarak anlayamadım. Size daha iyi yardımcı olabilmem için aşağıdaki seçeneklerden birini seçebilir veya sorunuzu farklı bir şekilde sorabilir misiniz?',
                options: ['Ürünler hakkında', 'Fiyat teklifi', 'Sipariş süreci', 'İletişim bilgileri', 'Teknik destek']
            }
        };
    }
    
    /**
     * Initialize chatbot - Create HTML and bind events
     * Chatbot'u başlatıyoruz, HTML oluşturup event'leri bağlıyoruz
     */
    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.addWelcomeMessage();
    }
    
    /**
     * Create chatbot HTML structure
     * Chatbot'un HTML yapısını oluşturuyoruz
     */
    createChatbotHTML() {
        const chatbotHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <div id="chatbot-toggle" class="chatbot-toggle">
                    <i class="fas fa-comments"></i>
                    <span class="chatbot-toggle-text">Canlı Destek</span>
                </div>
                
                <div id="chatbot-window" class="chatbot-window">
                    <div class="chatbot-header">
                        <div class="chatbot-header-info">
                            <i class="fas fa-robot"></i>
                            <div>
                                <h4>Okan'ın Kozmetiği Asistanı</h4>
                                <span class="status">Çevrimiçi</span>
                            </div>
                        </div>
                        <button id="chatbot-close" class="chatbot-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div id="chatbot-messages" class="chatbot-messages">
                        <!-- Messages will be added here dynamically -->
                    </div>
                    
                    <div class="chatbot-input-container">
                        <input type="text" id="chatbot-input" placeholder="Mesajınızı yazın..." maxlength="500">
                        <button id="chatbot-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Insert HTML into page - HTML'i sayfaya ekliyoruz
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
    
    /**
     * Bind event listeners to chatbot elements
     * Event listener'ları chatbot elementlerine bağlıyoruz
     */
    bindEvents() {
        // Get DOM elements - DOM elementlerini alıyoruz
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const send = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        
        // Add event listeners - Event listener'ları ekliyoruz
        if (toggle) toggle.addEventListener('click', () => this.toggleChatbot());
        if (close) close.addEventListener('click', () => this.closeChatbot());
        if (send) send.addEventListener('click', () => this.sendMessage());
        
        // Enter key support - Enter tuşu desteği
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
        
        // Close when clicking outside - Dışarı tıklayınca kapat
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#chatbot-container') && this.isOpen) {
                this.closeChatbot();
            }
        });
    }
    
    /**
     * Toggle chatbot open/close state
     * Chatbot'u açıp kapatıyoruz
     */
    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }
    
    /**
     * Open chatbot window
     * Chatbot penceresini açıyoruz
     */
    openChatbot() {
        this.isOpen = true;
        const window = document.getElementById('chatbot-window');
        const input = document.getElementById('chatbot-input');
        
        if (window) window.classList.add('open');
        if (input) input.focus(); // Focus input for better UX
    }
    
    /**
     * Close chatbot window
     * Chatbot penceresini kapatıyoruz
     */
    closeChatbot() {
        this.isOpen = false;
        const window = document.getElementById('chatbot-window');
        if (window) window.classList.remove('open');
    }
    
    /**
     * Add welcome message when chatbot opens
     * Chatbot açıldığında hoş geldin mesajı ekliyoruz
     */
    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            text: 'Merhaba! Okan\'ın Kozmetiği\'ne hoş geldiniz. Size nasıl yardımcı olabilirim?',
            options: ['Ürünler hakkında bilgi', 'Fiyat teklifi', 'İletişim bilgileri', 'Sipariş süreci']
        };
        
        this.addMessage(welcomeMessage);
    }
    
    /**
     * Send user message and process it
     * Kullanıcı mesajını gönderip işliyoruz
     */
    sendMessage() {
        const input = document.getElementById('chatbot-input');
        if (!input) return;
        
        const message = input.value.trim();
        
        // Check if message is valid and bot is not typing
        // Mesaj geçerli mi ve bot yazıyor mu kontrol ediyoruz
        if (message && !this.isTyping) {
            // Add user message to chat - Kullanıcı mesajını ekliyoruz
            this.addMessage({
                type: 'user',
                text: message
            });
            
            // Clear input - Input'u temizliyoruz
            input.value = '';
            
            // Process message and get response - Mesajı işleyip cevap alıyoruz
            this.processMessage(message);
        }
    }
    
    /**
     * Process user message and find matching response
     * Kullanıcı mesajını işleyip eşleşen cevabı buluyoruz
     * @param {string} message - User message
     */
    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = null;
        let bestMatch = 0;
        
        // Advanced keyword matching - En uzun eşleşmeyi buluyoruz
        // Bu sayede daha spesifik cevaplar verebiliyoruz
        for (const [keyword, data] of Object.entries(this.qaDatabase)) {
            if (lowerMessage.includes(keyword)) {
                const matchLength = keyword.length;
                // Take the longest match for better accuracy
                // En uzun eşleşmeyi alıyoruz daha doğru sonuç için
                if (matchLength > bestMatch) {
                    bestMatch = matchLength;
                    response = data;
                }
            }
        }
        
        // Use default response if no match found
        // Eşleşme bulunamazsa varsayılan cevabı kullanıyoruz
        if (!response) {
            response = this.qaDatabase.default;
        }
        
        // Show typing indicator - Yazıyor animasyonunu gösteriyoruz
        this.showTypingIndicator();
        
        // Add bot response with random delay for realism
        // Bot cevabını gerçekçi olması için rastgele gecikmeyle ekliyoruz
        const delay = 1000 + Math.random() * 1000; // 1-2 seconds
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addMessage({
                type: 'bot',
                text: response.response,
                options: response.options
            });
        }, delay);
    }
    
    /**
     * Show typing indicator animation
     * Yazıyor animasyonunu gösteriyoruz
     */
    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;
        
        const typingElement = document.createElement('div');
        typingElement.className = 'chatbot-message bot-message';
        typingElement.id = 'typing-indicator';
        typingElement.innerHTML = `
            <div class="message-content">
                <div class="chatbot-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    /**
     * Hide typing indicator
     * Yazıyor animasyonunu gizliyoruz
     */
    hideTypingIndicator() {
        this.isTyping = false;
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }
    
    /**
     * Add message to chat window
     * Mesajı chat penceresine ekliyoruz
     * @param {Object} message - Message object with type, text, and options
     */
    addMessage(message) {
        // Store message in history - Mesajı geçmişe kaydediyoruz
        this.messages.push(message);
        
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${message.type}-message`;
        
        // Create user message HTML - Kullanıcı mesajı HTML'i
        if (message.type === 'user') {
            messageElement.innerHTML = `
                <div class="message-content">
                    <span>${this.escapeHtml(message.text)}</span>
                </div>
            `;
        } else {
            // Create bot message with options - Bot mesajı ve seçenekler
            let optionsHTML = '';
            if (message.options && message.options.length > 0) {
                optionsHTML = `
                    <div class="message-options">
                        ${message.options.map(option => `
                            <button class="option-btn" onclick="chatbot.selectOption('${this.escapeHtml(option)}')">
                                ${this.escapeHtml(option)}
                            </button>
                        `).join('')}
                    </div>
                `;
            }
            
            messageElement.innerHTML = `
                <div class="message-content">
                    <span>${message.text.replace(/\n/g, '<br>')}</span>
                    ${optionsHTML}
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageElement);
        // Auto scroll to bottom - Otomatik olarak en alta kaydırıyoruz
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    /**
     * Handle option button click
     * Seçenek butonuna tıklanınca işliyoruz
     * @param {string} option - Selected option text
     */
    selectOption(option) {
        this.addMessage({
            type: 'user',
            text: option
        });
        
        this.processMessage(option);
    }
    
    /**
     * Escape HTML to prevent XSS attacks
     * XSS saldırılarını önlemek için HTML'i escape ediyoruz
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chatbot when DOM is ready
// DOM hazır olduğunda chatbot'u başlatıyoruz
let chatbot;
document.addEventListener('DOMContentLoaded', () => {
    chatbot = new OkanChatbot();
});
