document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initMobileNavigation();
    initSmoothScrolling();
    initScrollEffects();
    initContactForm();
    initScrollSpy();
    initAnimationsOnScroll();
    initMagicalBackground();
});

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);
    
    setTimeout(() => {
        const event = new Event('scroll');
        window.dispatchEvent(event);
    }, 100);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);
        
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
}

function updateThemeIcon(theme, icon) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            document.body.classList.toggle('menu-open', navMenu.classList.contains('active'));
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    
    [...navLinks, ...heroButtons].forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    function updateNavbarBackground() {
        const currentScrollY = window.scrollY;
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        
        if (currentTheme === 'light') {
            if (currentScrollY > 50) {
                navbar.style.backgroundColor = 'rgba(248, 250, 252, 0.98)';
            } else {
                navbar.style.backgroundColor = 'rgba(248, 250, 252, 0.95)';
            }
        } else {
            if (currentScrollY > 50) {
                navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.98)';
            } else {
                navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
            }
        }
        
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', updateNavbarBackground);
    
    updateNavbarBackground();
    
    const themeObserver = new MutationObserver(() => {
        updateNavbarBackground();
    });
    
    themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveNav, 100));
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    const submitBtn = contactForm.querySelector('.btn-primary');
    const originalBtnHTML = submitBtn.innerHTML;

    contactForm.addEventListener('submit', () => {
        // Clear any lingering field error spans before navigating away
        contactForm.querySelectorAll('.field-error').forEach(el => el.remove());
        contactForm.querySelectorAll('input, textarea').forEach(el => el.style.borderColor = '');

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Safety net: re-enable after 30s in case formsubmit.co fails silently
        setTimeout(() => {
            submitBtn.innerHTML = originalBtnHTML;
            submitBtn.disabled = false;
        }, 30000);
    });

    // Inline field validation on blur/input
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Form validation functions
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Clear previous errors
    clearFieldError(e);
    
    // Validate based on field type
    let isValid = true;
    let errorMessage = '';
    
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.style.borderColor = '';
}

function showFieldError(field, message) {
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.style.borderColor = 'var(--accent-orange)';
    field.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Animations on Scroll
function initAnimationsOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animateElements = document.querySelectorAll(`
        .skill-category,
        .project-card,
        .timeline-item,
        .stat,
        .about-image,
        .hero-visual
    `);
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Utility Functions
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Magical starfield background for hero section
function initMagicalBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'arcane-canvas';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let animFrame;
    let paused = false;

    const STAR_COUNT = 180;
    const stars = [];

    function resize() {
        canvas.width  = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function randomStar() {
        return {
            x:     Math.random() * canvas.width,
            y:     Math.random() * canvas.height,
            r:     Math.random() * 1.4 + 0.3,
            alpha: Math.random(),
            speed: Math.random() * 0.004 + 0.002,
            phase: Math.random() * Math.PI * 2,
            // red or orange
            hue:   Math.random() < 0.65 ? 0 : 24,
        };
    }

    function init() {
        resize();
        stars.length = 0;
        for (let i = 0; i < STAR_COUNT; i++) stars.push(randomStar());
    }

    function draw(ts) {
        if (paused) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(s => {
            s.alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(ts * s.speed + s.phase));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${s.hue}, 70%, 80%, ${s.alpha * 0.55})`;
            ctx.fill();
        });

        animFrame = requestAnimationFrame(draw);
    }

    init();
    animFrame = requestAnimationFrame(draw);

    window.addEventListener('resize', () => {
        resize();
        stars.forEach(s => {
            s.x = Math.random() * canvas.width;
            s.y = Math.random() * canvas.height;
        });
    });

    // Pause animation when hero is not visible (perf)
    const observer = new IntersectionObserver(entries => {
        paused = !entries[0].isIntersecting;
        if (!paused) animFrame = requestAnimationFrame(draw);
    }, { threshold: 0 });
    observer.observe(hero);
}

// Console welcome message
console.log(
    '%c🚀 Welcome to my portfolio! %c\nBuilt with ❤️ by M-Hammad-Faisal',
    'color: #06b6d4; font-size: 20px; font-weight: bold;',
    'color: #cbd5e1; font-size: 14px;'
);
