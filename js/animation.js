// Advanced Animation System
class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupClickAnimations();
        this.initializeSpecialEffects();
    }

    // Setup intersection observer for scroll-triggered animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target, entry.intersectionRatio);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(`
            .fade-in-section, .slide-in-left, .slide-in-right,
            .bounce-in, .zoom-in, .flip-in, .stagger-item
        `);

        animatedElements.forEach(element => {
            observer.observe(element);
        });

        this.observers.set('intersection', observer);
    }

    // Setup scroll-based animations
    setupScrollAnimations() {
        let ticking = false;

        const updateScrollAnimations = () => {
            this.updateParallax();
            this.updateProgressIndicators();
            this.updateScrollReveal();
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        });
    }

    // Update parallax elements
    updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    // Update progress indicators
    updateProgressIndicators() {
        const progressElements = document.querySelectorAll('.progress-indicator');
        const scrollProgress = window.pageYOffset / 
            (document.documentElement.scrollHeight - window.innerHeight);

        progressElements.forEach(element => {
            element.style.transform = `scaleX(${scrollProgress})`;
        });
    }

    // Update scroll reveal animations
    updateScrollReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        const windowHeight = window.innerHeight;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const revealPoint = 150;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    }

    // Setup hover animations
    setupHoverAnimations() {
        // Magnetic effect for buttons
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.createMagneticEffect(element, e);
            });

            element.addEventListener('mouseleave', () => {
                this.resetMagneticEffect(element);
            });
        });

        // Tilt effect for cards
        const tiltElements = document.querySelectorAll('.tilt-effect');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.createTiltEffect(element, e);
            });

            element.addEventListener('mouseleave', () => {
                this.resetTiltEffect(element);
            });
        });
    }

    // Create magnetic effect
    createMagneticEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.3;
        const moveY = y * 0.3;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    // Reset magnetic effect
    resetMagneticEffect(element) {
        element.style.transform = 'translate(0, 0)';
    }

    // Create tilt effect
    createTiltEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    // Reset tilt effect
    resetTiltEffect(element) {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }

    // Setup click animations
    setupClickAnimations() {
        // Ripple effect for buttons
        const rippleElements = document.querySelectorAll('.ripple-effect');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRippleEffect(element, e);
            });
        });

        // Pulse effect for interactive elements
        const pulseElements = document.querySelectorAll('.pulse-on-click');
        
        pulseElements.forEach(element => {
            element.addEventListener('click', () => {
                this.createPulseEffect(element);
            });
        });
    }

    // Create ripple effect
    createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Create pulse effect
    createPulseEffect(element) {
        element.classList.add('pulsing');
        
        setTimeout(() => {
            element.classList.remove('pulsing');
        }, 600);
    }

    // Initialize special effects
    initializeSpecialEffects() {
        this.initializeTextAnimations();
        this.initializeCounters();
        this.initializeProgressBars();
        this.initializeParticleSystem();
    }

    // Initialize text animations
    initializeTextAnimations() {
        // Split text for character-by-character animations
        const splitTextElements = document.querySelectorAll('.split-text');
        
        splitTextElements.forEach(element => {
            const text = element.textContent;
            const characters = text.split('').map((char, index) => 
                `<span style="animation-delay: ${index * 0.1}s">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
            
            element.innerHTML = characters;
        });

        // Initialize typewriter effects
        this.initializeTypewriter();
    }

    // Initialize typewriter effect
    initializeTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter-effect');
        
        typewriterElements.forEach(element => {
            const text = element.getAttribute('data-text') || element.textContent;
            const speed = parseInt(element.getAttribute('data-speed')) || 100;
            
            element.textContent = '';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    element.classList.add('typing-complete');
                }
            }, speed);
        });
    }

    // Initialize counters
    initializeCounters() {
        const counterElements = document.querySelectorAll('.counter');
        
        const observerOptions = {
            threshold: 0.5
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counterElements.forEach(element => {
            counterObserver.observe(element);
        });
    }

    // Animate counter
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const duration = parseInt(element.getAttribute('data-duration')) || 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    // Initialize progress bars
    initializeProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar-animated');
        
        const observerOptions = {
            threshold: 0.5
        };

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBar(entry.target);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }

    // Animate progress bar
    animateProgressBar(element) {
        const progress = element.getAttribute('data-progress') || '0';
        const duration = parseInt(element.getAttribute('data-duration')) || 1500;
        
        element.style.width = '0%';
        
        setTimeout(() => {
            element.style.transition = `width ${duration}ms ease-out`;
            element.style.width = progress + '%';
        }, 100);
    }

    // Initialize particle system
    initializeParticleSystem() {
        const particleContainers = document.querySelectorAll('.particle-container');
        
        particleContainers.forEach(container => {
            this.createParticleSystem(container);
        });
    }

    // Create particle system
    createParticleSystem(container) {
        const particleCount = parseInt(container.getAttribute('data-particles')) || 20;
        const particleColor = container.getAttribute('data-color') || '#00d4ff';
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'animated-particle';
            particle.style.background = particleColor;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 4 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            container.appendChild(particle);
        }
    }

    // Trigger animation based on element and intersection ratio
    triggerAnimation(element, ratio) {
        if (element.classList.contains('fade-in-section')) {
            element.style.opacity = ratio;
            element.style.transform = `translateY(${(1 - ratio) * 50}px)`;
        }
        
        if (ratio > 0.1 && !element.classList.contains('animated')) {
            element.classList.add('animated');
            
            // Trigger staggered animations for children
            const staggerItems = element.querySelectorAll('.stagger-item');
            staggerItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animated');
                }, index * 100);
            });
        }
    }

    // Public API methods
    playAnimation(selector, animationType) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.classList.add(animationType);
        
        // Remove animation class after completion
        element.addEventListener('animationend', () => {
            element.classList.remove(animationType);
        }, { once: true });
    }

    pauseAnimations() {
        document.body.style.animationPlayState = 'paused';
    }

    resumeAnimations() {
        document.body.style.animationPlayState = 'running';
    }

    // Performance monitoring
    monitorPerformance() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    this.optimizeForPerformance();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    // Optimize animations for low-end devices
    optimizeForPerformance() {
        // Reduce particle count
        const particles = document.querySelectorAll('.particle, .animated-particle');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) {
                particle.style.display = 'none';
            }
        });
        
        // Disable complex animations
        document.body.classList.add('reduced-animations');
    }
}

// Animation utilities
const AnimationUtils = {
    // Ease functions
    easing: {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    
    // Animate between two values
    animate: (from, to, duration, easingFunction, callback) => {
        const startTime = performance.now();
        
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easingFunction(progress);
            const value = from + (to - from) * easedProgress;
            
            callback(value);
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    },
    
    // Random animation delay
    randomDelay: (min = 0, max = 1000) => {
        return Math.random() * (max - min) + min;
    },
    
    // Stagger animation timing
    staggerDelay: (index, baseDelay = 100) => {
        return index * baseDelay;
    }
};

// Initialize animation system
document.addEventListener('DOMContentLoaded', () => {
    const animationManager = new AnimationManager();
    
    // Start performance monitoring
    animationManager.monitorPerformance();
    
    // Make available globally
    window.AnimationManager = animationManager;
    window.AnimationUtils = AnimationUtils;
});