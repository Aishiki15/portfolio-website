const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Navigation, progress, and active section state
const navbar = document.querySelector('.navbar');
const progress = document.querySelector('.scroll-progress span');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
let scrollTicking = false;

function updateScrollUI() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    navbar.classList.toggle('scrolled', y > 30);
    progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;

    const marker = y + window.innerHeight * 0.35;
    let activeId = 'home';
    sections.forEach((section) => {
        if (marker >= section.offsetTop) activeId = section.id;
    });
    navLinks.forEach((link) => {
        link.classList.toggle('active', link.hash === `#${activeId}`);
    });
    scrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(updateScrollUI);
        scrollTicking = true;
    }
}, { passive: true });

function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
}

hamburger.addEventListener('click', () => {
    const isOpen = !navMenu.classList.contains('active');
    hamburger.classList.toggle('active', isOpen);
    navMenu.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => {
    if (window.innerWidth > 800) closeMenu();
}, { passive: true });

// Entrance reveals and one-time metrics
const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((item) => {
    item.style.setProperty('--delay', `${item.dataset.delay || 0}ms`);
});

function animateMetric(element) {
    if (element.dataset.animated) return;
    element.dataset.animated = 'true';
    const target = Number(element.dataset.count);
    const decimals = String(target).includes('.') ? 2 : 0;
    const suffix = element.dataset.suffix || '';
    const duration = 1300;
    const start = performance.now();

    function frame(now) {
        const elapsed = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        element.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
        if (elapsed < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            entry.target.querySelectorAll('[data-count]').forEach(animateMetric);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => {
        item.classList.add('visible');
        item.querySelectorAll('[data-count]').forEach((metric) => {
            metric.textContent = `${metric.dataset.count}${metric.dataset.suffix || ''}`;
        });
    });
}

// Rotating terminal-style role label
const roleElement = document.getElementById('dynamic-role');
const roles = ['Software Engineer', 'Graphics Researcher', 'Machine Learning Builder', 'Creative Technologist'];
let roleIndex = 0;
let roleTimer;

function typeRole(text, deleting = false) {
    if (reducedMotion) {
        roleElement.textContent = roles[0];
        return;
    }
    const current = roleElement.textContent;
    if (!deleting && current !== text) {
        roleElement.textContent = text.slice(0, current.length + 1);
        roleTimer = setTimeout(() => typeRole(text), 55);
    } else if (!deleting) {
        roleTimer = setTimeout(() => typeRole(text, true), 1800);
    } else if (current.length) {
        roleElement.textContent = current.slice(0, -1);
        roleTimer = setTimeout(() => typeRole(text, true), 28);
    } else {
        roleIndex = (roleIndex + 1) % roles.length;
        roleTimer = setTimeout(() => typeRole(roles[roleIndex]), 300);
    }
}

if (roleElement) {
    roleElement.textContent = '';
    typeRole(roles[0]);
}

// Cursor-responsive details, limited to fine pointers
const finePointer = window.matchMedia('(pointer: fine)').matches;
if (finePointer && !reducedMotion) {
    const cursorGlow = document.querySelector('.cursor-glow');
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let glowX = pointerX;
    let glowY = pointerY;

    window.addEventListener('pointermove', (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
    }, { passive: true });

    function moveGlow() {
        glowX += (pointerX - glowX) * 0.12;
        glowY += (pointerY - glowY) * 0.12;
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        requestAnimationFrame(moveGlow);
    }
    requestAnimationFrame(moveGlow);

    document.querySelectorAll('.spotlight-card').forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--x', `${event.clientX - rect.left}px`);
            card.style.setProperty('--y', `${event.clientY - rect.top}px`);
        }, { passive: true });
    });

    const identityCard = document.querySelector('.identity-card');
    const heroVisual = document.querySelector('.hero-visual');
    heroVisual.addEventListener('pointermove', (event) => {
        const rect = heroVisual.getBoundingClientRect();
        const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        const rotateX = -((event.clientY - rect.top) / rect.height - 0.5) * 7;
        identityCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }, { passive: true });
    heroVisual.addEventListener('pointerleave', () => {
        identityCard.style.transform = 'rotateY(-4deg) rotateX(2deg)';
    });
}

// Lightweight canvas constellation; no DOM particle churn
const canvas = document.getElementById('network-canvas');
const context = canvas.getContext('2d', { alpha: true });
let points = [];
let canvasWidth = 0;
let canvasHeight = 0;
let animationFrame;
let canvasVisible = !document.hidden;

function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = Math.round(canvasWidth * ratio);
    canvas.height = Math.round(canvasHeight * ratio);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(70, Math.max(26, Math.floor(canvasWidth / 24)));
    points = Array.from({ length: count }, () => ({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.2 + 0.35
    }));
}

function drawNetwork() {
    if (!canvasVisible || reducedMotion) return;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    points.forEach((point, index) => {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > canvasWidth) point.vx *= -1;
        if (point.y < 0 || point.y > canvasHeight) point.vy *= -1;
        context.fillStyle = index % 4 === 0 ? 'rgba(76,230,215,.46)' : 'rgba(152,119,255,.35)';
        context.beginPath();
        context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        context.fill();

        for (let j = index + 1; j < points.length; j += 1) {
            const other = points[j];
            const dx = point.x - other.x;
            const dy = point.y - other.y;
            const distance = Math.hypot(dx, dy);
            if (distance < 120) {
                context.strokeStyle = `rgba(111,132,170,${(1 - distance / 120) * 0.07})`;
                context.lineWidth = 0.5;
                context.beginPath();
                context.moveTo(point.x, point.y);
                context.lineTo(other.x, other.y);
                context.stroke();
            }
        }
    });
    animationFrame = requestAnimationFrame(drawNetwork);
}

if (!reducedMotion) {
    resizeCanvas();
    drawNetwork();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 150);
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
        canvasVisible = !document.hidden;
        cancelAnimationFrame(animationFrame);
        if (canvasVisible) drawNetwork();
        if (document.hidden) clearTimeout(roleTimer);
        else if (roleElement) typeRole(roles[roleIndex]);
    });
}

document.getElementById('year').textContent = new Date().getFullYear();
updateScrollUI();
