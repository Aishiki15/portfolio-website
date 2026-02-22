// === GLOBAL VARIABLES ===
let currentSection = 'home';
let isScrolling = false;

// === THEME MANAGEMENT ===
const themeToggle = document.getElementById('theme-icon');
const body = document.body;

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    themeToggle.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// === NAVIGATION ===
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

function updateActiveNavLink() {
    const sections = ['home', 'about', 'experience', 'projects', 'contact'];
    let current = 'home';
    
    for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                current = section;
                break;
            }
        }
    }
    
    if (current !== currentSection) {
        currentSection = current;
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// === TYPING ANIMATION ===
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// === SKILL BARS ANIMATION ===
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const level = item.getAttribute('data-level');
        const progressBar = item.querySelector('.skill-progress');
        
        if (progressBar && level) {
            setTimeout(() => {
                progressBar.style.width = level + '%';
            }, 200);
        }
    });
}

// === SCROLL ANIMATIONS ===
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger specific animations based on element
                if (entry.target.classList.contains('skills-section')) {
                    animateSkillBars();
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all sections and cards
    const elementsToAnimate = document.querySelectorAll(`
        .about-card,
        .skills-section,
        .experience-item,
        .achievement-card,
        .project-card,
        .contact-card,
        .form
    `);
    
    elementsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

// === SMOOTH SCROLLING ===
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - 70; // Account for navbar height
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// === FORM HANDLING ===
function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitButton.style.background = '#48bb78';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.style.background = '';
        }, 3000);
    }, 2000);
}

// === FLOATING SHAPES ANIMATION ===
function initFloatingShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        // Random starting position
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        
        shape.style.left = randomX + '%';
        shape.style.top = randomY + '%';
        
        // Apply random animation duration
        const duration = 6 + Math.random() * 4;
        shape.style.animationDuration = duration + 's';
    });
}

// === PARALLAX EFFECT ===
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shapes');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// === PROJECT CARDS INTERACTION ===
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// === LOADING ANIMATION ===
function showPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    // Add loader styles
    const loaderStyles = `
        <style>
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        }
        
        .loader-content {
            text-align: center;
        }
        
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid var(--border-color);
            border-top: 3px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', loaderStyles);
    document.body.appendChild(loader);
    
    // Hide loader after content loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
}

// === SCROLL TO TOP ===
function createScrollToTop() {
    const scrollBtn = document.createElement('div');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    
    const scrollBtnStyles = `
        <style>
        .scroll-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: var(--gradient-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            opacity: 0;
            transform: translateY(20px);
            transition: all var(--transition-fast);
            z-index: 1000;
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .scroll-to-top:hover {
            transform: translateY(-5px) scale(1.1);
            box-shadow: var(--shadow-medium);
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', scrollBtnStyles);
    document.body.appendChild(scrollBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// === ACHIEVEMENT COUNTERS ===
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += step;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// === EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Show page loader
    showPageLoader();
    
    // Initialize floating shapes
    initFloatingShapes();
    
    // Create scroll to top button
    createScrollToTop();
    
    // Initialize project cards interaction
    initProjectCards();
    
    // Start typing animation
    const typingElement = document.getElementById('typing-name');
    if (typingElement) {
        setTimeout(() => {
            typeWriter(typingElement, 'Aishiki Bhattacharya', 150);
        }, 1500);
    }
    
    // Initialize scroll observer
    observeElements();
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScrollTo(target);
            closeMobileMenu();
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Scroll events
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveNavLink();
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        closeMobileMenu();
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
});

// === ADVANCED ANIMATIONS ===

// Magnetic effect for buttons
function addMagneticEffect() {
    const magneticElements = document.querySelectorAll('.btn, .social-links a, .project-link');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

// Initialize magnetic effect after DOM load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addMagneticEffect, 1000);
});

// === PERFORMANCE OPTIMIZATIONS ===

// Debounce function for scroll events
function debounce(func, wait) {
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

// Optimize scroll handling
const optimizedScrollHandler = debounce(() => {
    updateActiveNavLink();
    handleParallax();
}, 10);

// Replace scroll event listener with optimized version
window.addEventListener('scroll', optimizedScrollHandler);

// === EASTER EGG ===
let clickCount = 0;
document.querySelector('.logo-text').addEventListener('click', function() {
    clickCount++;
    if (clickCount >= 5) {
        this.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            this.style.animation = '';
            clickCount = 0;
        }, 4000);
    }
});

// Add rainbow animation
const rainbowStyles = `
    <style>
    @keyframes rainbow {
        0% { background: linear-gradient(45deg, #ff0000, #ff7f00); }
        16% { background: linear-gradient(45deg, #ff7f00, #ffff00); }
        32% { background: linear-gradient(45deg, #ffff00, #00ff00); }
        48% { background: linear-gradient(45deg, #00ff00, #0000ff); }
        64% { background: linear-gradient(45deg, #0000ff, #4b0082); }
        80% { background: linear-gradient(45deg, #4b0082, #9400d3); }
        100% { background: linear-gradient(45deg, #9400d3, #ff0000); }
    }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', rainbowStyles);