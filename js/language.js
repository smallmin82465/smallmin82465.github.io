// Language Management System
class LanguageManager {
    constructor() {
        this.currentLanguage = 'zh';
        this.languages = ['zh', 'en'];
        this.init();
    }

    init() {
        this.loadSavedLanguage();
        this.setupLanguageToggle();
        this.applyLanguage(this.currentLanguage);
    }

    // Load language from localStorage or browser preference
    loadSavedLanguage() {
        const savedLanguage = localStorage.getItem('portfolio-language');
        if (savedLanguage && this.languages.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        } else {
            // Detect browser language
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('zh') || browserLang.includes('taiwan') || browserLang.includes('tw')) {
                this.currentLanguage = 'zh';
            } else {
                this.currentLanguage = 'en';
            }
        }
    }

    // Setup language toggle button
    setupLanguageToggle() {
        const langToggle = document.getElementById('langToggle');
        if (!langToggle) return;

        langToggle.addEventListener('click', () => {
            this.toggleLanguage();
        });

        // Add keyboard support
        langToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleLanguage();
            }
        });

        this.updateLanguageButton();
    }

    // Toggle between languages
    toggleLanguage() {
        const currentIndex = this.languages.indexOf(this.currentLanguage);
        const nextIndex = (currentIndex + 1) % this.languages.length;
        this.currentLanguage = this.languages[nextIndex];
        
        this.applyLanguage(this.currentLanguage);
        this.saveLanguage();
        this.updateLanguageButton();
        this.announceLanguageChange();
    }

    // Apply language to all elements
    applyLanguage(language) {
        document.documentElement.setAttribute('lang', language === 'zh' ? 'zh-TW' : 'en');
        
        // Update elements with data attributes
        const elements = document.querySelectorAll('[data-en], [data-zh]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${language}`);
            if (text) {
                element.textContent = text;
            }
        });

        // Handle special content sections
        this.updateContentSections(language);
        
        // Update page title
        this.updatePageTitle(language);
        
        // Trigger language change event
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: language }
        }));
    }

    // Update content sections that need special handling
    updateContentSections(language) {
        // About section
        const aboutTextZh = document.querySelectorAll('.about-text-zh');
        const aboutTextEn = document.querySelectorAll('.about-text-en');
        
        if (language === 'zh') {
            aboutTextZh.forEach(el => el.style.display = 'block');
            aboutTextEn.forEach(el => el.style.display = 'none');
        } else {
            aboutTextZh.forEach(el => el.style.display = 'none');
            aboutTextEn.forEach(el => el.style.display = 'block');
        }

        // Job descriptions
        const jobDescZh = document.querySelectorAll('.job-desc-zh');
        const jobDescEn = document.querySelectorAll('.job-desc-en');
        
        if (language === 'zh') {
            jobDescZh.forEach(el => el.style.display = 'block');
            jobDescEn.forEach(el => el.style.display = 'none');
        } else {
            jobDescZh.forEach(el => el.style.display = 'none');
            jobDescEn.forEach(el => el.style.display = 'block');
        }
    }

    // Update page title based on language
    updatePageTitle(language) {
        const titles = {
            zh: 'Hank | 資料科學家 & 軟體工程師',
            en: 'Hank | Data Scientist & Software Engineer'
        };
        document.title = titles[language];
    }

    // Update language button appearance
    updateLanguageButton() {
        const langToggle = document.getElementById('langToggle');
        const langText = langToggle?.querySelector('.lang-text');
        
        if (!langText) return;

        const buttonTexts = {
            zh: 'EN',
            en: '中'
        };

        langText.textContent = buttonTexts[this.currentLanguage];
        
        // Add tooltip
        const tooltips = {
            zh: 'Switch to English',
            en: '切換到中文'
        };
        
        langToggle.setAttribute('title', tooltips[this.currentLanguage]);
    }

    // Save language preference
    saveLanguage() {
        localStorage.setItem('portfolio-language', this.currentLanguage);
    }

    // Announce language change for accessibility
    announceLanguageChange() {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        const announcements = {
            zh: '語言已切換為中文',
            en: 'Language switched to English'
        };
        
        announcement.textContent = announcements[this.currentLanguage];
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Public API methods
    setLanguage(language) {
        if (this.languages.includes(language)) {
            this.currentLanguage = language;
            this.applyLanguage(language);
            this.saveLanguage();
            this.updateLanguageButton();
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Language-specific animations and transitions
class LanguageTransitions {
    constructor(languageManager) {
        this.languageManager = languageManager;
        this.setupTransitions();
    }

    setupTransitions() {
        document.addEventListener('languageChanged', (e) => {
            this.animateLanguageChange(e.detail.language);
        });
    }

    animateLanguageChange(newLanguage) {
        // Animate text changes with fade effect
        this.animateTextChange();
        
        // Update typewriter effect if active
        this.updateTypewriter(newLanguage);
        
        // Animate navigation items
        this.animateNavigation();
    }

    animateTextChange() {
        const elementsToAnimate = document.querySelectorAll('[data-en], [data-zh], .about-text-zh, .about-text-en, .job-desc-zh, .job-desc-en');
        
        elementsToAnimate.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 200);
            }, index * 50);
        });
    }

    updateTypewriter(language) {
        const typewriterElement = document.querySelector('.typewriter');
        if (!typewriterElement) return;

        const texts = {
            zh: '資料科學家 & 軟體工程師',
            en: 'Data Scientist & Software Engineer'
        };

        // Reset and restart typewriter animation
        typewriterElement.style.animation = 'none';
        typewriterElement.textContent = '';
        
        setTimeout(() => {
            typewriterElement.setAttribute('data-text', texts[language]);
            typewriterElement.style.animation = 'typewriter 3s steps(40, end), blinkCursor 1s step-end infinite';
            
            // Manually trigger typewriter effect
            this.triggerTypewriter(typewriterElement, texts[language]);
        }, 300);
    }

    triggerTypewriter(element, text) {
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }

    animateNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    link.style.transform = 'scale(1)';
                }, 150);
            }, index * 100);
        });
    }
}

// Multi-language content data
const LanguageContent = {
    zh: {
        nav: {
            home: '首頁',
            about: '關於我',
            experience: '工作經歷',
            skills: '技能',
            contact: '聯絡我'
        },
        hero: {
            subtitle: '資料科學家 & 軟體工程師',
            description: '熱衷於將數據轉化為洞察並構建創新解決方案。目前在神雲科技擔任系統工程師，曾在趨勢科技從事資料科學工作。',
            cta: '聯絡我'
        },
        sections: {
            about: '關於我',
            experience: '工作經歷',
            skills: '技術能力',
            contact: '聯絡我'
        },
        contact: {
            location: '桃園市，台灣'
        }
    },
    en: {
        nav: {
            home: 'Home',
            about: 'About',
            experience: 'Experience',
            skills: 'Skills',
            contact: 'Contact'
        },
        hero: {
            subtitle: 'Data Scientist & Software Engineer',
            description: 'Passionate about turning data into insights and building innovative solutions. Currently working as a System Engineer at MiTAC, with experience in data science at Trend Micro.',
            cta: 'Get In Touch'
        },
        sections: {
            about: 'About Me',
            experience: 'Work Experience',
            skills: 'Technical Skills',
            contact: 'Get In Touch'
        },
        contact: {
            location: 'Taoyuan, Taiwan'
        }
    }
};

// Dynamic content loader
class DynamicContentLoader {
    constructor(languageManager) {
        this.languageManager = languageManager;
        this.setupContentLoader();
    }

    setupContentLoader() {
        document.addEventListener('languageChanged', (e) => {
            this.loadContent(e.detail.language);
        });
    }

    loadContent(language) {
        const content = LanguageContent[language];
        if (!content) return;

        // Update navigation
        Object.keys(content.nav).forEach(key => {
            const element = document.querySelector(`nav a[href="#${key}"]`);
            if (element && !element.hasAttribute(`data-${language}`)) {
                element.textContent = content.nav[key];
            }
        });

        // Update sections that don't have data attributes
        Object.keys(content.sections).forEach(key => {
            const element = document.querySelector(`#${key} .section-title`);
            if (element && !element.hasAttribute(`data-${language}`)) {
                element.textContent = content.sections[key];
            }
        });
    }
}

// Font loading optimization for different languages
class FontOptimizer {
    constructor() {
        this.setupFontLoading();
    }

    setupFontLoading() {
        document.addEventListener('languageChanged', (e) => {
            this.optimizeFonts(e.detail.language);
        });
    }

    optimizeFonts(language) {
        // Load appropriate fonts for different languages
        if (language === 'zh') {
            this.loadChineseFonts();
        } else {
            this.loadEnglishFonts();
        }
    }

    loadChineseFonts() {
        // Preload Chinese fonts if needed
        const chineseFont = new FontFace('NotoSansCJK', 'url(path/to/chinese-font.woff2)');
        chineseFont.load().then((font) => {
            document.fonts.add(font);
            document.body.style.fontFamily = 'NotoSansCJK, "Segoe UI", sans-serif';
        }).catch(() => {
            // Fallback to system fonts
            document.body.style.fontFamily = '"Microsoft YaHei", "PingFang SC", sans-serif';
        });
    }

    loadEnglishFonts() {
        // Use standard web fonts for English
        document.body.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    }
}

// Initialize language system
document.addEventListener('DOMContentLoaded', () => {
    const languageManager = new LanguageManager();
    new LanguageTransitions(languageManager);
    new DynamicContentLoader(languageManager);
    new FontOptimizer();
    
    // Make language manager globally available
    window.LanguageManager = languageManager;
});