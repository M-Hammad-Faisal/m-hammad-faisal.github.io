document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initMobileNavigation();
    initSmoothScrolling();
    initScrollEffects();
    initContactForm();
    initTypingAnimation();
    initScrollSpy();
    initAnimationsOnScroll();
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
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('.btn-primary');
            const originalText = submitBtn.innerHTML;
            
            // Update button state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Simulate form submission (replace with your actual endpoint)
                await simulateFormSubmission(formData);
                
                // Success state
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'var(--accent-green)';
                
                // Reset form
                contactForm.reset();
                
                // Show success message
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                
            } catch (error) {
                // Error state
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
                submitBtn.style.background = 'var(--accent-orange)';
                
                showNotification('Failed to send message. Please try again.', 'error');
            }
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        });
        
        // Form validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
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
    errorElement.style.color = 'var(--accent-orange)';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.style.borderColor = 'var(--accent-orange)';
    field.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simulate form submission (replace with your actual form handling)
async function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject(new Error('Submission failed'));
            }
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'var(--accent-green)' : 
                   type === 'error' ? 'var(--accent-orange)' : 'var(--primary-teal)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: 'var(--shadow-lg)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        minWidth: '300px',
        maxWidth: '400px'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        default: return 'fa-info-circle';
    }
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Typing Animation for Hero Section
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    
    if (typingElement) {
        const phrases = [
            'Full Stack Developer',
            'Problem Solver',
            'Tech Enthusiast',
            'Creative Thinker'
        ];
        
        let currentPhrase = 0;
        let currentChar = 0;
        let isDeleting = false;
        
        function typeText() {
            const currentText = phrases[currentPhrase];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, currentChar - 1);
                currentChar--;
            } else {
                typingElement.textContent = currentText.substring(0, currentChar + 1);
                currentChar++;
            }
            
            let typeSpeed = isDeleting ? 100 : 150;
            
            if (!isDeleting && currentChar === currentText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                currentPhrase = (currentPhrase + 1) % phrases.length;
                typeSpeed = 500; // Pause before typing new phrase
            }
            
            setTimeout(typeText, typeSpeed);
        }
        
        typeText();
    }
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

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Add loading animation styles dynamically
function addAnimationStyles() {
    const styles = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 0.25rem;
            margin-left: auto;
            border-radius: 0.25rem;
            transition: background-color 0.2s ease;
        }
        
        .notification-close:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .field-error {
            display: block;
            margin-top: 0.25rem;
            font-size: 0.875rem;
        }
        
        body.menu-open {
            overflow: hidden;
        }
        
        .typing-text::after {
            content: '|';
            color: var(--primary-teal);
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Initialize animation styles
addAnimationStyles();

// Performance optimization: Lazy load images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading
initLazyLoading();

// Console welcome message
console.log(
    '%c🚀 Welcome to my portfolio! %c\nBuilt with ❤️ by M-Hammad-Faisal',
    'color: #06b6d4; font-size: 20px; font-weight: bold;',
    'color: #cbd5e1; font-size: 14px;'
);
