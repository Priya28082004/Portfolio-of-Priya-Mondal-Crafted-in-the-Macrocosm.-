// ===== STAR FIELD =====
function createStars() {
    const field = document.getElementById('starField');
    if (!field) return;
    const count = Math.floor((window.innerWidth * window.innerHeight) / 5000);
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 2.5;
        star.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;opacity:${Math.random() * .7 + .2};--dur:${Math.random() * 4 + 3}s;--delay:${Math.random() * 5}s;`;
        field.appendChild(star);
    }
}
createStars();

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const s = hamburger.querySelectorAll('span');
    const o = navLinks.classList.contains('open');
    s[0].style.transform = o ? 'rotate(45deg) translate(5px,5px)' : '';
    s[1].style.opacity = o ? '0' : '1';
    s[2].style.transform = o ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
}));

// ===== STICKY NAV =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

// ===== ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) cur = s.id; });
    allNavLinks.forEach(l => { l.classList.remove('active'); if (l.getAttribute('href') === '#' + cur) l.classList.add('active'); });
});

// ===== TYPING EFFECT =====
const phrases = ['Full Stack Developer', 'Competitive Programmer', 'AI/ML Enthusiast', 'Problem Solver'];
let pi = 0, ci = 0, del = false;
const typedEl = document.getElementById('typedText');
function type() {
    if (!typedEl) return;
    const cur = phrases[pi];
    typedEl.textContent = del ? cur.substring(0, ci--) : cur.substring(0, ci++);
    let sp = del ? 40 : 80;
    if (!del && ci === cur.length + 1) { sp = 1800; del = true; }
    else if (del && ci === -1) { del = false; ci = 0; pi = (pi + 1) % phrases.length; sp = 400; }
    setTimeout(type, sp);
}
type();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.section-label,.section-title,.section-subtitle,.about-grid,.stat-card,.fact,.stack-category,.project-card,.contact-heading,.contact-subtext,.btn-cta,.social-card,.hero-badge,.hero-title,.hero-role,.hero-description,.hero-buttons,.hero-socials,.hero-visual,.timeline-item,.achievement-card,.arsenal-category');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); e.target.style.transition = 'opacity .7s ease,transform .7s ease'; } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = `${(i % 4) * .08}s`; observer.observe(el); });

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Message Sent! ✓';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    setTimeout(() => { btn.innerHTML = 'Send Message <i class="bx bx-send"></i>'; btn.style.background = ''; form.reset(); }, 3000);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}));