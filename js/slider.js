// Products Slider Module
class ProductsSlider {
    constructor() {
        this.slider = null;
        this.track = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.currentIndex = 0;
        this.cardWidth = 320;
        this.gap = 24;
        this.totalCards = 5;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isTransitioning = false;
        
        this.init();
    }

    init() {
        // Detecta se é dispositivo móvel
        this.isMobile = window.innerWidth <= 575;
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        this.setupElements();
        this.setupEventListeners();
        
        // Só configura autoplay e infinite loop se não for mobile
        if (!this.isMobile) {
            this.setupAutoPlay();
            this.setupInfiniteLoop();
        }
        
        this.setupTouchEvents();
        this.setupKeyboardNavigation();
        this.calculateDimensions();
        
        // Escuta mudanças de orientação/resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    setupElements() {
        this.slider = document.querySelector('.products-slider');
        this.track = document.getElementById('productsTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        if (!this.track) {
            console.warn('Products slider track não encontrado');
            return;
        }

        // Duplica os cards para criar loop infinito
        this.duplicateCards();
    }

    duplicateCards() {
        // Não duplica cards em dispositivos móveis (575px ou menos)
        if (this.isMobile || this.isTouchDevice) {
            this.totalCards = this.track.children.length;
            this.currentIndex = 0;
            return;
        }
        
        const originalCards = Array.from(this.track.children);
        
        // Adiciona cards no final
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            this.track.appendChild(clone);
        });

        // Adiciona cards no início
        originalCards.reverse().forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            this.track.insertBefore(clone, this.track.firstChild);
        });

        // Atualiza número total de cards
        this.totalCards = this.track.children.length;
        this.currentIndex = originalCards.length; // Começa no primeiro card original
    }

    calculateDimensions() {
        const card = this.track.querySelector('.product-card');
        if (card) {
            const cardStyles = getComputedStyle(card);
            this.cardWidth = card.offsetWidth + parseInt(cardStyles.marginRight) || 320;
            
            // Calcula gap baseado no CSS
            const trackStyles = getComputedStyle(this.track);
            this.gap = parseInt(trackStyles.gap) || 24;
        }

        // Posiciona no card inicial
        this.updateSliderPosition(false);
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Pausa auto-play quando hover
        if (this.slider) {
            this.slider.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.slider.addEventListener('mouseleave', () => this.resumeAutoPlay());
        }

        // Responsividade
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.calculateDimensions();
            }, 250);
        });

        // Visibility API para pausar quando aba não está ativa
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.resumeAutoPlay();
            }
        });
    }

    setupTouchEvents() {
        // Em dispositivos móveis, não interceptamos nenhum evento de touch
        // para permitir o scroll nativo da página
        if (this.isMobile || window.innerWidth <= 768) {
            return;
        }
        
        if (!this.track) return;

        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.pauseAutoPlay();
        }, { passive: true });

        // Importante: Removemos o preventDefault para permitir o scroll vertical mesmo em desktop
        this.track.addEventListener('touchmove', (e) => {
            // Não previne o comportamento padrão
            // Apenas rastreia a posição
            this.touchEndX = e.touches[0].clientX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
            this.resumeAutoPlay();
        }, { passive: true });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchStartX - this.touchEndX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isSliderInView()) return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ': // Spacebar
                    e.preventDefault();
                    this.toggleAutoPlay();
                    break;
            }
        });
    }

    setupAutoPlay() {
        this.startAutoPlay();
    }

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            if (this.isAutoPlaying && this.isSliderInView()) {
                this.nextSlide();
            }
        }, 4000);
    }

    pauseAutoPlay() {
        this.isAutoPlaying = false;
        if (this.track) {
            this.track.style.animationPlayState = 'paused';
        }
    }

    resumeAutoPlay() {
        this.isAutoPlaying = true;
        if (this.track) {
            this.track.style.animationPlayState = 'running';
        }
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    toggleAutoPlay() {
        if (this.isAutoPlaying) {
            this.pauseAutoPlay();
        } else {
            this.resumeAutoPlay();
        }
    }

    nextSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex++;
        this.updateSliderPosition();
        
        // Verifica se precisa resetar para loop infinito
        this.checkInfiniteLoop();
    }

    prevSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex--;
        this.updateSliderPosition();
        
        // Verifica se precisa resetar para loop infinito
        this.checkInfiniteLoop();
    }

    updateSliderPosition(withTransition = true) {
        if (!this.track) return;

        // Em dispositivos móveis, deixa o scroll nativo fazer o trabalho
        if (this.isMobile || this.isTouchDevice) {
            return;
        }

        const translateX = -(this.currentIndex * (this.cardWidth + this.gap));
        
        if (withTransition) {
            this.track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            this.track.style.transition = 'none';
        }
        
        this.track.style.transform = `translateX(${translateX}px)`;

        // Remove transição após animação
        if (withTransition) {
            setTimeout(() => {
                this.isTransitioning = false;
            }, 500);
        } else {
            this.isTransitioning = false;
        }
    }

    checkInfiniteLoop() {
        const originalCardsCount = 5;
        
        setTimeout(() => {
            // Se chegou no final dos cards duplicados
            if (this.currentIndex >= this.totalCards - originalCardsCount) {
                this.currentIndex = originalCardsCount;
                this.updateSliderPosition(false);
            }
            
            // Se chegou no início dos cards duplicados
            if (this.currentIndex < originalCardsCount) {
                this.currentIndex = this.totalCards - (originalCardsCount * 2);
                this.updateSliderPosition(false);
            }
        }, 500);
    }

    setupInfiniteLoop() {
        // Remove a animação CSS original
        if (this.track) {
            this.track.style.animation = 'none';
        }
    }

    isSliderInView() {
        if (!this.slider) return false;
        
        const rect = this.slider.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        return rect.top < windowHeight && rect.bottom > 0;
    }

    // Método para ir para um slide específico
    goToSlide(index) {
        if (this.isTransitioning) return;
        
        const originalCardsCount = 5;
        this.currentIndex = index + originalCardsCount;
        this.updateSliderPosition();
    }

    // Método para obter o índice atual (relativo aos cards originais)
    getCurrentSlide() {
        const originalCardsCount = 5;
        return this.currentIndex - originalCardsCount;
    }

    // Adiciona indicadores visuais (opcional)
    createIndicators() {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'slider-indicators';
        indicatorsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 20px;
        `;

        for (let i = 0; i < 5; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'slider-indicator';
            indicator.style.cssText = `
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: none;
                background: var(--gray-300);
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            indicator.addEventListener('click', () => this.goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }

        if (this.slider) {
            this.slider.appendChild(indicatorsContainer);
        }

        return indicatorsContainer;
    }

    // Atualiza indicadores (se existirem)
    updateIndicators() {
        const indicators = document.querySelectorAll('.slider-indicator');
        const currentSlide = this.getCurrentSlide();
        
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.style.background = 'var(--primary-color)';
                indicator.style.transform = 'scale(1.2)';
            } else {
                indicator.style.background = 'var(--gray-300)';
                indicator.style.transform = 'scale(1)';
            }
        });
    }

    // Cleanup method
    destroy() {
        this.stopAutoPlay();
        
        // Remove event listeners
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.prevSlide);
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.nextSlide);
        }
        
        window.removeEventListener('resize', this.calculateDimensions);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        document.removeEventListener('keydown', this.handleKeydown);
    }

    // Performance optimization
    optimizePerformance() {
        // Lazy load de imagens fora da viewport
        const cards = this.track.querySelectorAll('.product-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const images = entry.target.querySelectorAll('img[data-src]');
                    images.forEach(img => {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '100px' });

        cards.forEach(card => observer.observe(card));
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 575;
        
        // Se mudou de desktop para mobile ou vice-versa
        if (wasMobile !== this.isMobile) {
            // Limpa clones existentes
            this.track.querySelectorAll('.clone').forEach(clone => clone.remove());
            
            // Remove classes de mobile que não são mais usadas
            this.track.querySelectorAll('.product-card').forEach(card => {
                card.classList.remove('hidden-mobile', 'show-mobile');
                card.style.display = '';
            });
            
            // Reconfigura o slider
            this.setupElements();
            this.calculateDimensions();
            
            if (this.isMobile) {
                // Para mobile: desabilita autoplay
                this.pauseAutoPlay();
                this.currentIndex = 0;
                this.updateSliderPosition(false);
            } else {
                // Para desktop: reabilita funcionalidades
                this.setupAutoPlay();
                this.setupInfiniteLoop();
            }
        } else {
            // Só recalcula dimensões
            this.calculateDimensions();
        }
    }

    setupMobileScrollIndicator() {
        // Método removido - não usado mais
        return;
    }

    // Método removido - sistema de expansão simplificado
}

// Inicializa o slider quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const productsSlider = new ProductsSlider();
    
    // Exporta para uso global
    window.ProductsSlider = productsSlider;
});

// Exporta a classe
window.ProductsSliderClass = ProductsSlider;
