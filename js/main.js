// Main JavaScript File
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createParticles();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupIntersectionObserver();
        this.setupCursor();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('load', this.handleLoad.bind(this));

        // Performance optimization
        this.handleScroll = this.throttle(this.handleScroll.bind(this), 16);
        this.handleResize = this.debounce(this.handleResize.bind(this), 250);
    }

    // Create animated background particles
    createParticles() {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;

        const particleCount = window.innerWidth > 768 ? 50 : 25;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning and animation
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            
            // Add some variety to particle sizes
            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            particlesContainer.appendChild(particle);
        }
    }

    // Handle scroll events
    handleScroll() {
        this.updateProgressBar();
        this.handleNavbarScroll();
        this.updateParallaxElements();
    }

    // Update scroll progress bar
    updateProgressBar() {
        const scrollProgress = window.pageYOffset / 
            (document.documentElement.scrollHeight - window.innerHeight);
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = Math.min(scrollProgress * 100, 100) + '%';
        }
    }

    // Handle navbar scroll effect
    handleNavbarScroll() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // Update parallax elements
    updateParallaxElements() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.parallax');
        
        parallax.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.setProperty('--scroll-y', yPos + 'px');
        });
    }

    // Setup smooth scrolling for navigation
    setupSmoothScrolling() {
        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Setup scroll-triggered effects
    setupScrollEffects() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop && 
                    window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            // Update active navigation link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Setup Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger staggered animations for child elements
                    const staggerItems = entry.target.querySelectorAll('.stagger-item');
                    staggerItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe sections and special elements
        document.querySelectorAll('.fade-in-section, .reveal, .text-reveal').forEach(section => {
            observer.observe(section);
        });
    }

    // Setup custom cursor
    setupCursor() {
        if (window.innerWidth <= 768) return; // Skip on mobile

        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        
        if (!cursor || !cursorFollower) return;

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        // Update mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Animate follower with easing
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .experience-card, .skill-category, .contact-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursorFollower.style.transform = 'scale(1.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    }

    // Initialize special animations
    initializeAnimations() {
        // Typewriter effect
        this.initTypewriter();
        
        // Text reveal animations
        this.initTextReveal();
        
        // Loading animations
        this.initLoadingAnimations();
    }

    // Typewriter animation
    initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-color)';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    // Blinking cursor effect
                    setInterval(() => {
                        element.style.borderRightColor = 
                            element.style.borderRightColor === 'transparent' ? 
                            'var(--primary-color)' : 'transparent';
                    }, 530);
                }
            }, 100);
        });
    }

    // Text reveal animation
    initTextReveal() {
        const textRevealElements = document.querySelectorAll('.text-reveal');
        
        textRevealElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = text.split('').map(char => 
                `<span>${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
            
            const spans = element.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transitionDelay = `${index * 0.05}s`;
            });
        });
    }

    // Loading animations
    initLoadingAnimations() {
        const loadingElements = document.querySelectorAll('.loading');
        
        loadingElements.forEach(element => {
            setTimeout(() => {
                element.classList.add('loaded');
            }, Math.random() * 1000 + 500);
        });
    }

    // Handle window resize
    handleResize() {
        // Recreate particles on resize
        const particlesContainer = document.querySelector('.particles');
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
            this.createParticles();
        }
        
        // Reinitialize cursor on desktop
        if (window.innerWidth > 768) {
            this.setupCursor();
        }
    }

    // Handle page load
    handleLoad() {
        // Add loaded class to body
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        const heroElements = document.querySelectorAll('.hero .fade-in-up');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 200);
        });
    }

    // Utility functions
    throttle(func, limit) {
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
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add some additional utility functions
window.PortfolioUtils = {
    // Smooth scroll to element
    scrollToElement: (selector, offset = 80) => {
        const element = document.querySelector(selector);
        if (element) {
            const offsetTop = element.offsetTop - offset;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Get scroll percentage
    getScrollPercentage: () => {
        return (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    }
};