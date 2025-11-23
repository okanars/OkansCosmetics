// Modern JavaScript with advanced animations and interactions
class ModernWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupScrollEffects();
        this.setupNavigation();
        this.setupLoadingStates();
        this.setupMicroInteractions();
        this.initializeProductFilters();
    }

    setupEventListeners() {
        // Smooth scrolling for all internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target, 1000);
                }
            });
        });

        // Form submissions with loading states
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        });

        // Button interactions
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleButtonClick(e));
            btn.addEventListener('mouseenter', (e) => this.handleButtonHover(e, 'enter'));
            btn.addEventListener('mouseleave', (e) => this.handleButtonHover(e, 'leave'));
        });

        // Navigation link interactions
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', (e) => this.handleNavHover(e, 'enter'));
            link.addEventListener('mouseleave', (e) => this.handleNavHover(e, 'leave'));
        });

        // Highlight card interactions
        document.querySelectorAll('.highlight-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => this.handleHighlightHover(e, 'enter'));
            card.addEventListener('mouseleave', (e) => this.handleHighlightHover(e, 'leave'));
        });

        // Social link interactions
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('mouseenter', (e) => this.handleSocialHover(e, 'enter'));
            link.addEventListener('mouseleave', (e) => this.handleSocialHover(e, 'leave'));
        });

        // FAQ interactions
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', (e) => this.handleFAQClick(e));
        });

        // Contact method interactions
        document.querySelectorAll('.contact-method').forEach(method => {
            method.addEventListener('mouseenter', (e) => this.handleContactMethodHover(e, 'enter'));
            method.addEventListener('mouseleave', (e) => this.handleContactMethodHover(e, 'leave'));
        });

        // Social button interactions
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => this.handleSocialButtonHover(e, 'enter'));
            btn.addEventListener('mouseleave', (e) => this.handleSocialButtonHover(e, 'leave'));
        });
    }

    initializeAnimations() {
        // Initialize AOS-like scroll animations
        this.setupScrollReveal();
        
        // Hero section animations
        this.animateHeroSection();
        
        // Floating shapes animation
        this.animateFloatingShapes();
        
        // Stats counter animation
        this.animateStats();
        
        // Parallax effects
        this.setupParallax();
    }

    setupScrollEffects() {
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Smooth scroll behavior
        window.addEventListener('scroll', () => {
            this.handleScrollAnimations();
        });
    }

    setupNavigation() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                menuToggle.classList.toggle('active');
                
                // Animate menu toggle
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    span.style.transform = navLinks.classList.contains('active') 
                        ? `rotate(${45 * (index === 1 ? 0 : 1)}) translateY(${index === 1 ? -8 : 8}px)`
                        : 'none';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        }
    }

    setupLoadingStates() {
        // Page loading animation
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            this.animatePageLoad();
        });

        // Image loading states
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            img.addEventListener('error', () => {
                // Create a placeholder using CSS instead of loading a file
                img.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.innerHTML = `
                    <i class="fas fa-flask"></i>
                    <span>${img.alt || 'Ürün Görseli'}</span>
                `;
                img.parentNode.insertBefore(placeholder, img);
            });
        });
    }

    setupMicroInteractions() {
        // Cursor effects
        this.setupCursorEffects();
        
        // Text typing effect
        this.setupTypingEffect();
        
        // Particle effects
        this.setupParticleEffects();
        
        // Magnetic effects
        this.setupMagneticEffects();
    }

    // Animation Methods
    animateHeroSection() {
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.2}s`;
            element.classList.add('animate-fade-in-up');
        });
    }

    animateFloatingShapes() {
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            shape.style.animationDelay = `${index * 1.5}s`;
            shape.style.animationDuration = `${6 + index}s`;
        });
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        });

        stats.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, 16);
    }

    setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Add staggered animation for child elements
                    const children = entry.target.querySelectorAll('.animate-stagger');
                    children.forEach((child, index) => {
                        child.style.animationDelay = `${index * 0.1}s`;
                        child.classList.add('animate-fade-in-up');
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Interaction Methods
    handleButtonHover(event, type) {
        const button = event.currentTarget;
        const bg = button.querySelector('.btn-bg');
        
        if (type === 'enter') {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
        } else {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
        }
    }

    handleNavHover(event, type) {
        const link = event.currentTarget;
        const icon = link.querySelector('i');
        
        if (type === 'enter') {
            link.style.transform = 'translateY(-2px)';
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
        } else {
            link.style.transform = 'translateY(0)';
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        }
    }

    handleHighlightHover(event, type) {
        const card = event.currentTarget;
        const icon = card.querySelector('.highlight-icon');
        const link = card.querySelector('.highlight-link a');
        
        if (type === 'enter') {
            card.style.transform = 'translateY(-15px)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
            
            if (link) {
                link.style.transform = 'translateX(8px)';
            }
        } else {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            
            if (link) {
                link.style.transform = 'translateX(0)';
            }
        }
    }

    handleSocialHover(event, type) {
        const link = event.currentTarget;
        const icon = link.querySelector('i');
        
        if (type === 'enter') {
            link.style.transform = 'translateY(-3px) scale(1.1)';
            link.style.background = 'var(--accent-color)';
            link.style.color = 'var(--primary-color)';
            
            if (icon) {
                icon.style.transform = 'rotate(360deg)';
            }
        } else {
            link.style.transform = 'translateY(0) scale(1)';
            link.style.background = 'rgba(255, 255, 255, 0.1)';
            link.style.color = 'var(--white-color)';
            
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        }
    }

    handleButtonClick(event) {
        const button = event.currentTarget;
        
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    handleFAQClick(event) {
        const question = event.currentTarget;
        const faqItem = question.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        // Close other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });
        
        // Toggle current FAQ item
        faqItem.classList.toggle('active');
        
        // Animate icon rotation
        if (faqItem.classList.contains('active')) {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    }

    handleContactMethodHover(event, type) {
        const method = event.currentTarget;
        const icon = method.querySelector('.method-icon');
        const content = method.querySelector('.method-content');
        
        if (type === 'enter') {
            method.style.transform = 'translateY(-5px)';
            method.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
            
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
            
            if (content) {
                content.style.transform = 'translateY(-2px)';
            }
        } else {
            method.style.transform = 'translateY(0)';
            method.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            
            if (content) {
                content.style.transform = 'translateY(0)';
            }
        }
    }

    handleSocialButtonHover(event, type) {
        const button = event.currentTarget;
        const icon = button.querySelector('i');
        
        if (type === 'enter') {
            button.style.transform = 'translateY(-3px) scale(1.05)';
            button.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
            
            if (icon) {
                icon.style.transform = 'scale(1.2)';
            }
        } else {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = 'none';
            
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        }
    }

    // Utility Methods
    smoothScrollTo(target, duration) {
        const targetPosition = target.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        this.ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Gönderiliyor...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Gönderildi!';
            submitBtn.style.background = 'var(--accent-color)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 2000);
        }, 2000);
    }

    handleScrollAnimations() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    animatePageLoad() {
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.body.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
        }, 100);
    }

    // Advanced Effects
    setupCursorEffects() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + window.scrollY + 'px';
        });

        // Cursor effects for interactive elements
        document.querySelectorAll('a, button, .product-card, .highlight-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    setupTypingEffect() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--accent-color)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    element.style.borderRight = 'none';
                }
            };
            
            // Start typing when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typeWriter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    setupParticleEffects() {
        // Create particle container
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        document.body.appendChild(particleContainer);

        // Generate particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particleContainer.appendChild(particle);
        }
    }

    setupMagneticEffects() {
        document.querySelectorAll('.magnetic').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Product filtering and search functionality
    initializeProductFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const originFilter = document.getElementById('origin-filter');
        const searchInput = document.getElementById('search-input');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', this.filterProducts.bind(this));
        }
        
        if (originFilter) {
            originFilter.addEventListener('change', this.filterProducts.bind(this));
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', this.filterProducts.bind(this));
        }
    }

    filterProducts() {
        const categoryFilter = document.getElementById('category-filter');
        const originFilter = document.getElementById('origin-filter');
        const searchInput = document.getElementById('search-input');
        const productCards = document.querySelectorAll('.product-card');
        
        const selectedCategory = categoryFilter ? categoryFilter.value : '';
        const selectedOrigin = originFilter ? originFilter.value : '';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productDesc = card.querySelector('p').textContent.toLowerCase();
            const productCategory = card.dataset.category || '';
            const productOrigin = card.dataset.origin || '';
            
            let showCard = true;
            
            // Category filter
            if (selectedCategory && productCategory !== selectedCategory) {
                showCard = false;
            }
            
            // Origin filter - case insensitive comparison
            if (selectedOrigin && productOrigin.toLowerCase() !== selectedOrigin.toLowerCase()) {
                showCard = false;
            }
            
            // Search filter
            if (searchTerm && !productName.includes(searchTerm) && !productDesc.includes(searchTerm)) {
                showCard = false;
            }
            
            // Show/hide card with animation
            if (showCard) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Show "no results" message if no products match
        const visibleCards = document.querySelectorAll('.product-card[style*="display: block"], .product-card:not([style*="display: none"])');
        let noResultsMsg = document.getElementById('no-results-message');
        
        if (visibleCards.length === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'no-results-message';
                noResultsMsg.className = 'no-results';
                noResultsMsg.innerHTML = `
                    <div class="no-results-content">
                        <i class="fas fa-search"></i>
                        <h3>Aradığınız kriterlere uygun ürün bulunamadı</h3>
                        <p>Farklı filtreler deneyebilir veya arama teriminizi değiştirebilirsiniz.</p>
                        <button onclick="window.clearFilters()" class="btn btn-secondary">
                            <i class="fas fa-times"></i>
                            <span>Filtreleri Temizle</span>
                        </button>
                    </div>
                `;
                document.getElementById('product-list-grid').appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = 'block';
        } else {
            if (noResultsMsg) {
                noResultsMsg.style.display = 'none';
            }
        }
    }

    // Enhanced product card creation with data attributes
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card reveal';
        card.dataset.category = product.category || '';
        card.dataset.origin = product.origin || '';
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-card-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-meta">
                    <span>${product.category}</span>
                    <span>${product.origin}</span>
                </div>
                <a href="/urunler/${product.slug}.html" class="product-link">
                    <span>Detayları Gör</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        return card;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModernWebsite();

    // Initialize Swiper
    if (document.querySelector('.hero-slider')) {
        const swiper = new Swiper('.swiper', {
            // Optional parameters
            loop: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },

            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }
});

// Add CSS for custom cursor and particles
const style = document.createElement('style');
style.textContent = `
    .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--accent-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        mix-blend-mode: difference;
    }
    
    .custom-cursor.hover {
        transform: scale(2);
        background: var(--primary-color);
    }
    
    .particle-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    }
    
    .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--accent-color);
        border-radius: 50%;
        opacity: 0.3;
        animation: float-particle linear infinite;
    }
    
    @keyframes float-particle {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-stagger {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .animate-stagger.animate-fade-in-up {
        opacity: 1;
        transform: translateY(0);
    }
    
    body:not(.loaded) {
        opacity: 0;
    }
    
    img:not(.loaded) {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img.loaded {
        opacity: 1;
    }
    
    .magnetic {
        transition: transform 0.3s ease;
    }
`;

document.head.appendChild(style);

// Global function to clear filters
window.clearFilters = function() {
    const categoryFilter = document.getElementById('category-filter');
    const originFilter = document.getElementById('origin-filter');
    const searchInput = document.getElementById('search-input');
    
    if (categoryFilter) categoryFilter.value = '';
    if (originFilter) originFilter.value = '';
    if (searchInput) searchInput.value = '';
    
    // Trigger filter function to show all products
    const website = new ModernWebsite();
    website.filterProducts();
}; 