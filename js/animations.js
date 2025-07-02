// Animations Module - GSAP powered animations
class AnimationManager {
    constructor() {
        this.isGSAPLoaded = false;
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.checkGSAP();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadingAnimation();
        this.setupMorphingBackgrounds();
        this.setupPerformanceOptimizations();
    }

    checkGSAP() {
        if (typeof gsap !== 'undefined') {
            this.isGSAPLoaded = true;
            gsap.registerPlugin(ScrollTrigger);
            console.log('GSAP carregado com sucesso');
        } else {
            console.warn('GSAP não encontrado, usando animações CSS fallback');
            this.setupCSSFallbacks();
        }
    }

    setupScrollAnimations() {
        if (!this.isGSAPLoaded) return;

        // Animação do header
        this.animateHeader();
        
        // Animação da seção hero
        this.animateHero();
        
        // Animação da seção de produtos
        this.animateProducts();
        
        // Animações de scroll genéricas
        this.setupGenericScrollAnimations();
    }

    animateHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        // Animação de entrada
        gsap.fromTo(header, 
            { y: -100, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: "power3.out",
                delay: 0.2
            }
        );

        // Efeito de scroll no header
        let lastScrollY = 0;
        
        ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                const currentScrollY = self.scroll();
                
                if (currentScrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Hide/show header baseado na direção do scroll
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    gsap.to(header, { y: -100, duration: 0.3, ease: "power2.out" });
                } else if (currentScrollY < lastScrollY) {
                    gsap.to(header, { y: 0, duration: 0.3, ease: "power2.out" });
                }
                
                lastScrollY = currentScrollY;
            }
        });
    }

    animateHero() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroFeatures = document.querySelector('.hero-features');
        const heroButtons = document.querySelector('.hero-buttons');
        const heroImage = document.querySelector('.hero-image');
        const floatingCards = document.querySelectorAll('.card-payment');

        // Timeline principal do hero
        const heroTl = gsap.timeline();

        heroTl
            .fromTo(heroTitle, 
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
            )
            .fromTo(heroSubtitle,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                "-=0.5"
            )
            .fromTo(heroFeatures,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                "-=0.4"
            )
            .fromTo(heroButtons,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                "-=0.3"
            )
            .fromTo(heroImage,
                { x: 100, opacity: 0, scale: 0.8 },
                { x: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
                "-=0.8"
            );

        // Animação dos cards flutuantes
        floatingCards.forEach((card, index) => {
            gsap.fromTo(card,
                { 
                    scale: 0,
                    opacity: 0,
                    rotation: 10
                },
                {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    delay: 1 + (index * 0.2)
                }
            );
            
            // Animação contínua de flutuação
            gsap.to(card, {
                y: "-=15",
                duration: 2 + (index * 0.3),
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1
            });
        });

        // Parallax na imagem do hero
        ScrollTrigger.create({
            trigger: ".hero",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
                if (heroImage) {
                    gsap.to(heroImage, {
                        y: self.progress * 50,
                        duration: 0.3,
                        ease: "none"
                    });
                }
            }
        });
    }

    animateProducts() {
        const productsSection = document.querySelector('.products');
        const sectionTitle = productsSection?.querySelector('.section-title');
        const sectionSubtitle = productsSection?.querySelector('.section-subtitle');
        const productCards = document.querySelectorAll('.product-card');

        if (!productsSection) return;

        // Animação do cabeçalho da seção
        ScrollTrigger.create({
            trigger: productsSection,
            start: "top 80%",
            onEnter: () => {
                const tl = gsap.timeline();
                
                tl.fromTo(sectionTitle,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
                )
                .fromTo(sectionSubtitle,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                    "-=0.4"
                );
            }
        });

        // Animação dos cards de produto
        productCards.forEach((card, index) => {
            ScrollTrigger.create({
                trigger: card,
                start: "top 90%",
                onEnter: () => {
                    gsap.fromTo(card,
                        { 
                            y: 60,
                            opacity: 0,
                            scale: 0.9,
                            rotationY: 10
                        },
                        {
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            rotationY: 0,
                            duration: 0.8,
                            ease: "power3.out",
                            delay: index * 0.1
                        }
                    );
                }
            });
        });
    }

    setupGenericScrollAnimations() {
        // Animações para elementos com classes específicas
        const animatedElements = [
            { selector: '.fade-in', animation: { y: 30, opacity: 0 } },
            { selector: '.fade-in-left', animation: { x: -50, opacity: 0 } },
            { selector: '.fade-in-right', animation: { x: 50, opacity: 0 } },
            { selector: '.fade-in-up', animation: { y: 50, opacity: 0 } },
            { selector: '.fade-in-down', animation: { y: -50, opacity: 0 } },
            { selector: '.scale-in', animation: { scale: 0.8, opacity: 0 } }
        ];

        animatedElements.forEach(({ selector, animation }) => {
            const elements = document.querySelectorAll(selector);
            
            elements.forEach((element, index) => {
                ScrollTrigger.create({
                    trigger: element,
                    start: "top 85%",
                    onEnter: () => {
                        gsap.fromTo(element, animation, {
                            ...Object.keys(animation).reduce((acc, key) => {
                                acc[key] = key === 'opacity' ? 1 : 0;
                                return acc;
                            }, {}),
                            duration: 0.8,
                            ease: "power3.out",
                            delay: index * 0.1
                        });
                    }
                });
            });
        });
    }

    setupHoverAnimations() {
        // Animações de hover para botões
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (this.isGSAPLoaded) {
                    gsap.to(button, {
                        scale: 1.05,
                        y: -3,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                } else {
                    button.style.transform = 'scale(1.05) translateY(-3px)';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (this.isGSAPLoaded) {
                    gsap.to(button, {
                        scale: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                } else {
                    button.style.transform = 'scale(1) translateY(0)';
                }
            });
        });

        // Animações para cards
        const cards = document.querySelectorAll('.product-card');
        
        cards.forEach(card => {
            const image = card.querySelector('.product-img');
            
            card.addEventListener('mouseenter', () => {
                if (this.isGSAPLoaded) {
                    gsap.to(card, {
                        y: -10,
                        scale: 1.02,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                    
                    if (image) {
                        gsap.to(image, {
                            scale: 1.1,
                            rotationY: 5,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }
                }
            });

            card.addEventListener('mouseleave', () => {
                if (this.isGSAPLoaded) {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                    
                    if (image) {
                        gsap.to(image, {
                            scale: 1,
                            rotationY: 0,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }
                }
            });
        });
    }

    setupLoadingAnimation() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingLogo = document.querySelector('.loading-logo');
        const loadingSpinner = document.querySelector('.loading-spinner');

        if (!loadingScreen) return;

        window.addEventListener('load', () => {
            if (this.isGSAPLoaded) {
                const tl = gsap.timeline({
                    onComplete: () => {
                        loadingScreen.style.display = 'none';
                    }
                });

                tl.to(loadingSpinner, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in"
                })
                .to(loadingLogo, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: "power2.out"
                }, "-=0.1")
                .to(loadingLogo, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.in"
                })
                .to(loadingScreen, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut"
                }, "-=0.2");
            } else {
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 1000);
            }
        });
    }

    setupMorphingBackgrounds() {
        // Animação de background morfing
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground && this.isGSAPLoaded) {
            gsap.to(heroBackground, {
                backgroundPosition: "200% 200%",
                duration: 20,
                ease: "none",
                repeat: -1,
                yoyo: true
            });
        }
    }

    setupPerformanceOptimizations() {
        // Reduz animações em dispositivos com bateria baixa
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2) {
                    this.reduceAnimations();
                }
            });
        }

        // Reduz animações em conexões lentas
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.reduceAnimations();
            }
        }
    }

    reduceAnimations() {
        console.log('Reduzindo animações para melhor performance');
        
        if (this.isGSAPLoaded) {
            gsap.globalTimeline.timeScale(2); // Acelera todas as animações
        }

        // Adiciona classe para reduzir animações CSS
        document.body.classList.add('reduce-animations');
    }

    setupCSSFallbacks() {
        // CSS fallbacks quando GSAP não está disponível
        const style = document.createElement('style');
        style.textContent = `
            .css-fallback-fade-in {
                animation: cssaFadeIn 0.8s ease-out forwards;
            }
            
            @keyframes cssaFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .reduce-animations * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(style);

        // Aplica fallbacks
        this.applyCSSFallbacks();
    }

    applyCSSFallbacks() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('css-fallback-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observa elementos que precisam de animação
        const elementsToAnimate = document.querySelectorAll(
            '.hero-title, .hero-subtitle, .section-title, .product-card, .btn'
        );
        
        elementsToAnimate.forEach(el => observer.observe(el));
    }

    // Método para criar animação customizada
    createCustomAnimation(element, fromVars, toVars, options = {}) {
        if (!this.isGSAPLoaded) {
            console.warn('GSAP não disponível para animação customizada');
            return;
        }

        const animation = gsap.fromTo(element, fromVars, {
            ...toVars,
            ...options
        });

        return animation;
    }

    // Método para pausar todas as animações
    pauseAllAnimations() {
        if (this.isGSAPLoaded) {
            gsap.globalTimeline.pause();
        }
        
        document.body.style.animationPlayState = 'paused';
    }

    // Método para retomar todas as animações
    resumeAllAnimations() {
        if (this.isGSAPLoaded) {
            gsap.globalTimeline.resume();
        }
        
        document.body.style.animationPlayState = 'running';
    }

    // Cleanup
    destroy() {
        if (this.isGSAPLoaded) {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            gsap.killTweensOf("*");
        }
        
        this.observers.forEach(observer => observer.disconnect());
        this.animations.clear();
    }
}

// Inicializa as animações
document.addEventListener('DOMContentLoaded', () => {
    const animationManager = new AnimationManager();
    window.AnimationManager = animationManager;
});

// Exporta a classe
window.AnimationManagerClass = AnimationManager;
