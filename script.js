// Mobile navigation toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

// Dark Mode Toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

// Get saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add animation
        themeToggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

function updateThemeIcon(theme) {
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
}

// Scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = entry.target.dataset.delay || '0s';
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(
    '.section-title, .project-card, .skill-category, .about-content, .hero-content'
);

animateElements.forEach((el, index) => {
    el.dataset.delay = `${index * 0.1}s`;
    observer.observe(el);
});

// Add CSS class for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===== REVOLUTIONARY UI SYSTEM =====

// Custom Cursor System
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.cursorRing = document.querySelector('.cursor-ring');
        this.trail = document.querySelector('.magnetic-trail');
        this.mouse = { x: 0, y: 0 };
        this.cursorPos = { x: 0, y: 0 };
        this.isHovering = false;
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => this.updatePosition(e));
        document.addEventListener('mouseenter', () => this.show());
        document.addEventListener('mouseleave', () => this.hide());
        
        // Hover effects for interactive elements
        const hoverElements = document.querySelectorAll('a, button, .skill-node, .project-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.setHover(true));
            el.addEventListener('mouseleave', () => this.setHover(false));
        });
        
        this.animate();
    }
    
    updatePosition(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        
        // Create magnetic trail
        this.createTrail(e.clientX, e.clientY);
    }
    
    animate() {
        this.cursorPos.x += (this.mouse.x - this.cursorPos.x) * 0.1;
        this.cursorPos.y += (this.mouse.y - this.cursorPos.y) * 0.1;
        
        this.cursor.style.transform = `translate(${this.cursorPos.x}px, ${this.cursorPos.y}px)`;
        
        requestAnimationFrame(() => this.animate());
    }
    
    setHover(hovering) {
        this.isHovering = hovering;
        this.cursor.classList.toggle('hover', hovering);
    }
    
    show() {
        this.cursor.style.opacity = '1';
    }
    
    hide() {
        this.cursor.style.opacity = '0';
    }
    
    createTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'magnetic-trail active';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        document.body.appendChild(trail);
        
        setTimeout(() => trail.remove(), 500);
    }
}

// Neural Network Background
class NeuralNetwork {
    constructor() {
        this.canvas = document.getElementById('neural-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createNodes();
        this.createConnections();
        
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => this.updateMouse(e));
        
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createNodes() {
        this.nodes = [];
        const nodeCount = Math.min(50, Math.floor(window.innerWidth / 30));
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 3 + 1,
                color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
            });
        }
    }
    
    createConnections() {
        this.connections = [];
        const maxDistance = 150;
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.getDistance(this.nodes[i], this.nodes[j]);
                if (distance < maxDistance) {
                    this.connections.push({
                        nodeA: this.nodes[i],
                        nodeB: this.nodes[j],
                        opacity: 1 - (distance / maxDistance)
                    });
                }
            }
        }
    }
    
    updateMouse(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
    
    getDistance(nodeA, nodeB) {
        return Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
        );
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update nodes
        this.nodes.forEach(node => {
            // Mouse interaction
            const mouseDistance = Math.sqrt(
                Math.pow(node.x - this.mouse.x, 2) + Math.pow(node.y - this.mouse.y, 2)
            );
            
            if (mouseDistance < 100) {
                const force = (100 - mouseDistance) / 100;
                node.vx += (node.x - this.mouse.x) * force * 0.01;
                node.vy += (node.y - this.mouse.y) * force * 0.01;
            }
            
            node.x += node.vx;
            node.y += node.vy;
            
            // Boundary bounce
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            // Keep in bounds
            node.x = Math.max(0, Math.min(this.canvas.width, node.x));
            node.y = Math.max(0, Math.min(this.canvas.height, node.y));
            
            // Friction
            node.vx *= 0.99;
            node.vy *= 0.99;
        });
        
        // Draw connections
        this.connections.forEach(conn => {
            const distance = this.getDistance(conn.nodeA, conn.nodeB);
            if (distance < 150) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(99, 102, 241, ${conn.opacity * 0.3})`;
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(conn.nodeA.x, conn.nodeA.y);
                this.ctx.lineTo(conn.nodeB.x, conn.nodeB.y);
                this.ctx.stroke();
            }
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = node.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = node.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Typing Animation System
class TypingAnimation {
    constructor() {
        this.element = document.getElementById('typed-text');
        this.texts = [
            'Digital Experiences',
            'Scalable Solutions',
            'Modern Applications',
            'Interactive Interfaces',
            'Innovative Software'
        ];
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        this.init();
    }
    
    init() {
        setTimeout(() => this.type(), 1000);
    }
    
    type() {
        const fullText = this.texts[this.currentIndex];
        
        if (!this.isDeleting) {
            this.currentText = fullText.substring(0, this.currentText.length + 1);
        } else {
            this.currentText = fullText.substring(0, this.currentText.length - 1);
        }
        
        this.element.textContent = this.currentText;
        
        let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.currentText === fullText) {
            speed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            speed = 500;
        }
        
        setTimeout(() => this.type(), speed);
    }
}

// Initialize Revolutionary Systems
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        new CustomCursor();
        new NeuralNetwork();
        new TypingAnimation();
        
        // Revolutionary Liquid Animations
        initLiquidEffects();
        
        // GSAP Master Timeline
        const masterTimeline = gsap.timeline();
        
        masterTimeline
            .from('.hero-content', {
                duration: 2,
                y: 100,
                opacity: 0,
                ease: 'elastic.out(1, 0.5)',
                delay: 0.5
            })
            .from('.project-card', {
                duration: 1.5,
                y: 80,
                opacity: 0,
                rotationX: 25,
                stagger: 0.3,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: '.projects',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scrub: 1
                }
            });
    });
}

// Liquid Morphing Effects System
function initLiquidEffects() {
    // Liquid cursor trail
    document.addEventListener('mousemove', (e) => {
        createLiquidTrail(e.clientX, e.clientY);
    });
    
    // Project card magnetic effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            gsap.to(card, {
                duration: 0.5,
                rotationY: deltaX * 10,
                rotationX: deltaY * -10,
                transformPerspective: 1000,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.8,
                rotationY: 0,
                rotationX: 0,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
    
    // Liquid background morph
    gsap.to('.hero::before', {
        duration: 20,
        backgroundPosition: '100% 100%',
        ease: 'none',
        repeat: -1,
        yoyo: true
    });
    
    // Ethereal particle system
    createEtherealParticles();
}

function createLiquidTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'liquid-trail';
    trail.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--prism-fire);
        background-size: 200% 200%;
        pointer-events: none;
        z-index: 9999;
        animation: liquidTrailFade 0.8s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    
    setTimeout(() => trail.remove(), 800);
}

function createEtherealParticles() {
    const particleContainer = document.querySelector('.particles-container');
    if (!particleContainer) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'ethereal-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: var(--prism-fire);
            background-size: 200% 200%;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: etherealFloat ${Math.random() * 10 + 15}s linear infinite;
            opacity: ${Math.random() * 0.6 + 0.2};
            filter: blur(1px);
        `;
        
        particleContainer.appendChild(particle);
    }
}

// Add liquid trail CSS animation
const liquidTrailStyle = document.createElement('style');
liquidTrailStyle.textContent = `
    @keyframes liquidTrailFade {
        0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
            background-position: 0% 50%;
        }
        100% {
            transform: scale(3) rotate(180deg);
            opacity: 0;
            background-position: 100% 50%;
        }
    }
    
    @keyframes etherealFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            background-position: 0% 50%;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            background-position: 100% 50%;
        }
    }
`;
document.head.appendChild(liquidTrailStyle);

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    burger.classList.toggle('toggle');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const navHeight = document.querySelector('nav').offsetHeight;
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - navHeight,
                behavior: 'smooth'
            });
        }

        if (nav.classList.contains('nav-active')) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            navLinks.forEach(link => link.style.animation = '');
        }
    });
});

// Sticky header on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.padding = '10px 0';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.padding = '15px 0';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// Form submission feedback
const contactForm = document.querySelector('.contact-form');
const successMessage = document.querySelector('.form-success');

contactForm.addEventListener('submit', (e) => {
    // Show feedback before Formsubmit redirect
    setTimeout(() => {
        successMessage.style.display = 'block';
        contactForm.reset();
        setTimeout(() => successMessage.style.display = 'none', 3000);
    }, 500); // Delay to mimic submission
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({behavior: 'smooth'});
    });
});