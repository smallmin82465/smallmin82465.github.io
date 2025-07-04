// Theme Management System
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.themes = ['dark', 'light', 'auto'];
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupThemeToggle();
        this.setupSystemThemeListener();
        this.applyTheme(this.currentTheme);
    }

    // Load theme from localStorage or default
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.currentTheme = savedTheme;
        } else {
            // Default to system preference if no saved theme
            this.currentTheme = 'auto';
        }
    }

    // Setup theme toggle button
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            this.cycleTheme();
        });

        // Update button appearance
        this.updateThemeButton();
    }

    // Cycle through themes
    cycleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.currentTheme = this.themes[nextIndex];
        
        this.applyTheme(this.currentTheme);
        this.saveTheme();
        this.updateThemeButton();
    }

    // Apply theme to document
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        
        // Handle auto theme
        if (theme === 'auto') {
            this.applySystemTheme();
        }
        
        // Trigger theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor();
    }

    // Apply system preference theme
    applySystemTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = prefersDark ? 'dark' : 'light';
        
        // Add system theme indicator
        document.body.setAttribute('data-system-theme', systemTheme);
    }

    // Listen for system theme changes
    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            if (this.currentTheme === 'auto') {
                this.applySystemTheme();
                this.updateMetaThemeColor();
            }
        });
    }

    // Update theme toggle button appearance
    updateThemeButton() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle?.querySelector('.theme-icon');
        
        if (!themeIcon) return;

        const icons = {
            dark: '🌙',
            light: '☀️',
            auto: '⚙️'
        };

        themeIcon.textContent = icons[this.currentTheme];
        
        // Add tooltip
        const tooltips = {
            dark: 'Switch to Light Mode',
            light: 'Switch to Auto Mode', 
            auto: 'Switch to Dark Mode'
        };
        
        themeToggle.setAttribute('title', tooltips[this.currentTheme]);
    }

    // Update meta theme-color for mobile browsers
    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.getElementsByTagName('head')[0].appendChild(metaThemeColor);
        }

        const themeColors = {
            dark: '#1a1a2e',
            light: '#f8f9fa'
        };

        let effectiveTheme = this.currentTheme;
        if (this.currentTheme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            effectiveTheme = prefersDark ? 'dark' : 'light';
        }

        metaThemeColor.content = themeColors[effectiveTheme];
    }

    // Save theme to localStorage
    saveTheme() {
        localStorage.setItem('portfolio-theme', this.currentTheme);
    }

    // Get current effective theme (resolves 'auto' to actual theme)
    getEffectiveTheme() {
        if (this.currentTheme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }
        return this.currentTheme;
    }

    // Public API methods
    setTheme(theme) {
        if (this.themes.includes(theme)) {
            this.currentTheme = theme;
            this.applyTheme(theme);
            this.saveTheme();
            this.updateThemeButton();
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    // Theme-specific animations
    triggerThemeTransition() {
        document.body.classList.add('theme-transitioning');
        
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 500);
    }
}

// Enhanced theme transitions
class ThemeTransitions {
    constructor(themeManager) {
        this.themeManager = themeManager;
        this.setupTransitions();
    }

    setupTransitions() {
        document.addEventListener('themeChanged', (e) => {
            this.animateThemeChange(e.detail.theme);
        });
    }

    animateThemeChange(newTheme) {
        // Create ripple effect from theme button
        const themeButton = document.getElementById('themeToggle');
        if (themeButton) {
            this.createRippleEffect(themeButton, newTheme);
        }

        // Animate particles color change
        this.animateParticles(newTheme);
        
        // Animate cards
        this.animateCards();
    }

    createRippleEffect(button, theme) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.style.position = 'fixed';
        ripple.style.borderRadius = '50%';
        ripple.style.background = theme === 'light' ? 
            'radial-gradient(circle, rgba(248,249,250,0.8) 0%, rgba(248,249,250,0) 70%)' :
            'radial-gradient(circle, rgba(26,26,46,0.8) 0%, rgba(26,26,46,0) 70%)';
        ripple.style.left = rect.left + rect.width / 2 + 'px';
        ripple.style.top = rect.top + rect.height / 2 + 'px';
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9999';
        ripple.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(ripple);
        
        // Animate ripple
        ripple.animate([
            { width: '0px', height: '0px', opacity: 1 },
            { width: '3000px', height: '3000px', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).addEventListener('finish', () => {
            ripple.remove();
        });
    }

    animateParticles(theme) {
        const particles = document.querySelectorAll('.particle');
        const newColor = theme === 'light' ? '#0066cc' : '#00d4ff';
        
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.background = newColor;
                particle.style.transform = 'scale(1.5)';
                
                setTimeout(() => {
                    particle.style.transform = 'scale(1)';
                }, 200);
            }, index * 10);
        });
    }

    animateCards() {
        const cards = document.querySelectorAll('.experience-card, .skill-category, .contact-item');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 150);
            }, index * 50);
        });
    }
}

// Accessibility enhancements for themes
class ThemeAccessibility {
    constructor(themeManager) {
        this.themeManager = themeManager;
        this.setupAccessibility();
    }

    setupAccessibility() {
        // Add keyboard support for theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.themeManager.cycleTheme();
                }
            });
        }

        // Announce theme changes to screen readers
        document.addEventListener('themeChanged', (e) => {
            this.announceThemeChange(e.detail.theme);
        });

        // Respect prefers-reduced-motion
        this.setupReducedMotion();
    }

    announceThemeChange(theme) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        const themeNames = {
            dark: 'Dark theme',
            light: 'Light theme',
            auto: 'Auto theme (follows system preference)'
        };
        
        announcement.textContent = `Switched to ${themeNames[theme]}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
        }
        
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduce-motion');
            } else {
                document.body.classList.remove('reduce-motion');
            }
        });
    }
}

// Initialize theme system
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    new ThemeTransitions(themeManager);
    new ThemeAccessibility(themeManager);
    
    // Make theme manager globally available
    window.ThemeManager = themeManager;
});