// Main Application Module
class PagBankApp {
    constructor() {
        this.isInitialized = false;
        this.components = new Map();
        this.utils = {};
        this.config = {
            affiliateLinks: {
                maquininhas: 'http://pagbank.vc/indica-maquininhas-48ac5c3da',
                account: 'http://indicapagbank.page.link/UKzTCMytKr8UYHyz6'
            },
            telegram: 'https://t.me/PagbankParceiros',
            official: 'https://pagbank.com.br/'
        };
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Inicializando PagBank Landing Page...');
            console.log('📍 Estado do documento:', document.readyState);
            
            // Carrega componentes em ordem
            await this.setupDOMReady();
            console.log('✅ DOM Ready');
            
            this.setupUtils();
            console.log('✅ Utils configurados');
            
            this.setupSmoothScroll();
            this.setupNavigationHandler();
            this.setupCTATracking();
            this.setupStatsCounter();
            this.setupPerformanceMonitoring();
            this.setupSEOOptimizations();
            this.setupAccessibility();
            this.setupErrorHandling();
            
            console.log('✅ Todos os módulos inicializados');
            
            // Remove loading screen após inicialização
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('✅ PagBank App inicializado com sucesso!');
            
            // Dispara evento customizado
            this.dispatchEvent('app:initialized');
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            this.handleInitializationError(error);
            // Remove loading mesmo com erro
            this.hideLoadingScreen();
        }
    }

    setupDOMReady() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    setupUtils() {
        this.utils = {
            // Debounce function
            debounce: (func, wait) => {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            },

            // Throttle function
            throttle: (func, limit) => {
                let inThrottle;
                return function() {
                    const args = arguments;
                    const context = this;
                    if (!inThrottle) {
                        func.apply(context, args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                };
            },

            // Device detection
            isMobile: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            
            isTablet: () => /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent),
            
            // Lazy loading para imagens
            lazyLoadImages: () => {
                const images = document.querySelectorAll('img[data-src]');
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            },

            // Format de números
            formatNumber: (num) => {
                return new Intl.NumberFormat('pt-BR').format(num);
            },

            // Validação de email
            isValidEmail: (email) => {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            },

            // Geração de ID único
            generateId: () => {
                return '_' + Math.random().toString(36).substr(2, 9);
            }
        };
    }

    setupSmoothScroll() {
        // Smooth scroll para links de ancoragem
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Atualiza URL sem recarregar
                    history.pushState(null, null, targetId);
                    
                    // Tracking
                    this.trackEvent('navigation', 'smooth_scroll', targetId);
                }
            });
        });

        // Scroll indicator
        this.setupScrollIndicator();
    }

    setupScrollIndicator() {
        const scrollProgress = document.createElement('div');
        scrollProgress.className = 'scroll-progress';
        scrollProgress.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(scrollProgress);

        const updateScrollProgress = this.utils.throttle(() => {
            const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            scrollProgress.style.width = `${scrolled}%`;
        }, 10);

        window.addEventListener('scroll', updateScrollProgress);
    }

    setupNavigationHandler() {
        // Navigation active state
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    
                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current link
                    const currentLink = document.querySelector(`.nav-link[href="#${currentId}"]`);
                    if (currentLink) {
                        currentLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -80% 0px'
        });

        sections.forEach(section => observer.observe(section));

        // Mobile menu handler
        this.setupMobileMenu();
    }

    setupMobileMenu() {
        const navbar = document.querySelector('.navbar');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!navbarToggler || !navbarCollapse) return;

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar?.contains(e.target) && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });

        // Close menu when clicking on nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });

        // Prevent body scroll when menu is open
        navbarToggler.addEventListener('click', () => {
            setTimeout(() => {
                if (navbarCollapse.classList.contains('show')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }, 100);
        });
    }

    setupCTATracking() {
        // Track all CTA clicks
        const ctaButtons = document.querySelectorAll('[href*="pagbank"], [href*="indicapagbank"]');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const href = button.getAttribute('href');
                const buttonText = button.textContent.trim();
                
                // Analytics tracking
                this.trackEvent('cta', 'click', href, buttonText);
                
                // Cookie tracking
                if (window.Security?.getCookieManager) {
                    const cookieManager = window.Security.getCookieManager();
                    cookieManager.set('last_cta_click', JSON.stringify({
                        url: href,
                        text: buttonText,
                        timestamp: Date.now()
                    }), 7);
                }
                
                console.log(`🎯 CTA clicado: ${buttonText} -> ${href}`);
            });
        });

        // Exit intent tracking
        this.setupExitIntent();
    }

    setupExitIntent() {
        // Função de exit intent foi desativada
        console.info('Exit intent popup foi desativado');
    }

    setupPerformanceMonitoring() {
        // Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            this.monitorWebVitals();
        }

        // Resource loading monitoring
        this.monitorResourceLoading();

        // Error monitoring
        this.monitorErrors();
    }

    monitorWebVitals() {
        // Monitor Largest Contentful Paint
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
                this.trackEvent('performance', 'lcp', Math.round(lastEntry.startTime));
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP monitoring não suportado');
        }

        // Monitor First Input Delay
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                    this.trackEvent('performance', 'fid', Math.round(entry.processingStart - entry.startTime));
                });
            });
            observer.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.warn('FID monitoring não suportado');
        }
    }

    monitorResourceLoading() {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`⚡ Página carregada em ${loadTime}ms`);
            this.trackEvent('performance', 'page_load_time', loadTime);
        });
    }

    monitorErrors() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            this.trackEvent('error', 'javascript', e.error?.message || 'Unknown error');
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            this.trackEvent('error', 'promise_rejection', e.reason?.message || 'Unknown rejection');
        });
    }

    setupSEOOptimizations() {
        // Dynamic meta tag updates
        this.updateMetaTags();
        
        // Structured data
        this.addStructuredData();
        
        // Canonical URL
        this.setCanonicalURL();
    }

    updateMetaTags() {
        // Dynamic title based on section in view
        const updateTitle = this.utils.throttle(() => {
            const sections = document.querySelectorAll('section[id]');
            let currentSection = 'Início';
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSection = section.getAttribute('data-title') || 'PagBank Maquininhas';
                }
            });
            
            // Mantém o título fixo como "PagBank - Parceiros"
            document.title = 'PagBank - Parceiros';
        }, 1000);

        window.addEventListener('scroll', updateTitle);
    }

    addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PagBank",
            "description": "Maquininhas de cartão PagBank para seu negócio",
            "url": window.location.origin,
            "logo": `${window.location.origin}/Logos-schematics/Logo-Hotbar.png`,
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "url": this.config.telegram
            },
            "offers": {
                "@type": "Offer",
                "description": "Maquininhas de cartão com as melhores taxas",
                "url": this.config.affiliateLinks.maquininhas
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    setCanonicalURL() {
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = window.location.origin + window.location.pathname;
        document.head.appendChild(canonical);
    }

    setupAccessibility() {
        // Skip to content link
        this.addSkipLink();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Focus management
        this.setupFocusManagement();
        
        // ARIA labels
        this.setupARIALabels();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content ID
        const heroSection = document.querySelector('.hero');
        if (heroSection && !heroSection.id) {
            heroSection.id = 'main-content';
        }
    }

    setupKeyboardNavigation() {
        // Tab key navigation improvements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // CSS for keyboard navigation
        const keyboardCSS = `
            body:not(.keyboard-navigation) *:focus {
                outline: none;
            }
            
            .keyboard-navigation *:focus {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = keyboardCSS;
        document.head.appendChild(style);
    }

    setupFocusManagement() {
        // Focus trap for modals/popups
        this.focusTrap = {
            elements: [],
            current: -1,
            
            activate: (container) => {
                this.focusTrap.elements = container.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (this.focusTrap.elements.length > 0) {
                    this.focusTrap.elements[0].focus();
                }
            },
            
            handleKeydown: (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    
                    if (e.shiftKey) {
                        this.focusTrap.current--;
                        if (this.focusTrap.current < 0) {
                            this.focusTrap.current = this.focusTrap.elements.length - 1;
                        }
                    } else {
                        this.focusTrap.current++;
                        if (this.focusTrap.current >= this.focusTrap.elements.length) {
                            this.focusTrap.current = 0;
                        }
                    }
                    
                    this.focusTrap.elements[this.focusTrap.current].focus();
                }
            }
        };
    }

    setupARIALabels() {
        // Add ARIA labels to elements without them
        const buttons = document.querySelectorAll('button:not([aria-label])');
        const links = document.querySelectorAll('a:not([aria-label])');
        
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                const icon = button.querySelector('i');
                if (icon) {
                    button.setAttribute('aria-label', this.getIconDescription(icon.className));
                }
            }
        });
        
        links.forEach(link => {
            if (link.getAttribute('target') === '_blank') {
                const currentLabel = link.getAttribute('aria-label') || link.textContent.trim();
                link.setAttribute('aria-label', `${currentLabel} (abre em nova aba)`);
            }
        });
    }

    getIconDescription(iconClass) {
        const iconMap = {
            'fa-shopping-cart': 'Carrinho de compras',
            'fa-user-plus': 'Adicionar usuário',
            'fa-chevron-left': 'Anterior',
            'fa-chevron-right': 'Próximo',
            'fa-check': 'Confirmado',
            'fa-times': 'Fechar'
        };
        
        for (const [key, description] of Object.entries(iconMap)) {
            if (iconClass.includes(key)) {
                return description;
            }
        }
        
        return 'Botão';
    }

    setupErrorHandling() {
        // Global error boundary
        this.errorHandler = {
            logError: (error, context = '') => {
                console.error(`[PagBank App Error] ${context}:`, error);
                this.trackEvent('error', 'application', `${context}: ${error.message}`);
            },
            
            showUserError: (message) => {
                this.showToast(message, 'error');
            },
            
            handleAsyncError: async (asyncFn, fallback = null) => {
                try {
                    return await asyncFn();
                } catch (error) {
                    this.errorHandler.logError(error, 'Async operation');
                    return fallback;
                }
            }
        };
    }

    // Toast notification system
    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        // CSS para toast
        const toastCSS = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                padding: 16px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                max-width: 400px;
                animation: toastSlideIn 0.3s ease-out;
                border-left: 4px solid var(--primary-color);
            }
            
            .toast-error { border-left-color: var(--danger-color); }
            .toast-success { border-left-color: var(--success-color); }
            .toast-warning { border-left-color: var(--warning-color); }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .toast-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #666;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
            }
            
            .toast-close:hover {
                background: #f5f5f5;
            }
            
            @keyframes toastSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = toastCSS;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Close functionality
        const closeToast = () => {
            toast.style.animation = 'toastSlideIn 0.3s ease-in reverse';
            setTimeout(() => toast.remove(), 300);
        };
        
        toast.querySelector('.toast-close').addEventListener('click', closeToast);
        
        // Auto close
        if (duration > 0) {
            setTimeout(closeToast, duration);
        }
    }

    getToastIcon(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }

    // Event tracking system
    trackEvent(category, action, label = '', value = 0) {
        // Console tracking
        console.log(`📊 Track: ${category}.${action}`, { label, value });
        
        // Could integrate with Google Analytics, Facebook Pixel, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
        
        // Custom analytics
        const eventData = {
            category,
            action,
            label,
            value,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // Store in localStorage for analytics
        const events = JSON.parse(localStorage.getItem('pagbank_events') || '[]');
        events.push(eventData);
        
        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        localStorage.setItem('pagbank_events', JSON.stringify(events));
    }

    // Custom event system
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    addEventListener(eventName, callback) {
        document.addEventListener(eventName, callback);
    }

    // Initialization error handler
    handleInitializationError(error) {
        console.error('Erro crítico na inicialização:', error);
        
        // Fallback básico
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
            ">
                <div>
                    <h1 style="color: #e74c3c; margin-bottom: 20px;">
                        Ops! Algo deu errado
                    </h1>
                    <p style="margin-bottom: 30px; color: #666;">
                        Estamos com problemas técnicos. Tente novamente em alguns instantes.
                    </p>
                    <button onclick="location.reload()" style="
                        background: #00A859;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                    ">
                        Tentar Novamente
                    </button>
                </div>
            </div>
        `;
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            console.log('🔄 Removendo tela de loading...');
            // Adiciona uma pequena delay para melhor UX
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                // Remove o elemento após a animação
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.remove();
                        console.log('✅ Tela de loading removida');
                    }
                }, 500);
            }, 500); // 500ms delay reduzido
        } else {
            console.warn('⚠️ Loading screen não encontrado');
        }
    }

    // Public API
    getComponent(name) {
        return this.components.get(name);
    }

    getConfig() {
        return { ...this.config };
    }

    getUtils() {
        return this.utils;
    }

    isReady() {
        return this.isInitialized;
    }

    setupStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length === 0) return;
        
        const animateNumber = (element, target, suffix = '') => {
            const start = 0;
            const duration = 2000; // 2 segundos
            const startTime = performance.now();
            
            const updateNumber = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (target - start) * easeOut);
                
                element.textContent = current.toLocaleString('pt-BR');
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    element.textContent = target.toLocaleString('pt-BR');
                    element.classList.add('counting');
                }
            };
            
            requestAnimationFrame(updateNumber);
        };
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    const element = entry.target;
                    const target = parseInt(element.dataset.target);
                    
                    if (!isNaN(target)) {
                        element.dataset.animated = 'true';
                        animateNumber(element, target);
                        
                        // Track stats view
                        this.trackEvent('engagement', 'stats_viewed');
                    }
                }
            });
        }, observerOptions);
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
}

// Export class to global scope
window.PagBankApp = PagBankApp;

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.pagBankApp = new PagBankApp();
    });
} else {
    window.pagBankApp = new PagBankApp();
}
