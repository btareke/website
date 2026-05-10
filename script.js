// ===== Theme toggle =====
(function() {
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    if (stored) root.setAttribute('data-theme', stored);

    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    });
})();

// ===== Mobile nav =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// ===== Smooth scroll for hash links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Navbar scrolled state =====
const navbar = document.querySelector('.navbar');
if (navbar) {
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ===== Active nav link by section =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href') || '';
            if (href === `#${current}`) link.classList.add('active');
        });
    }, { passive: true });
}

// ===== Reveal-on-scroll =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.about-text, .contact-info, .stat-item, .folder, .project-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = 'opacity 600ms ease, transform 600ms ease';
        revealObserver.observe(el);
    });
}

// ===== EmailJS contact form =====
if (typeof emailjs !== 'undefined') {
    emailjs.init('nx5eFQ9JGdUH-3Hmb');
}

const contactForm = document.querySelector('.contact-form');
if (contactForm && typeof emailjs !== 'undefined') {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        emailjs.send('service_a18t1ii', 'template_wcbj3um', {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message
        }).then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert("Thank you for your message! I'll get back to you soon.");
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, function(error) {
            console.log('FAILED...', error);
            alert('Sorry, there was an error sending your message. Please try again or email me directly at beamlaktareke@gmail.com');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// ===== Folder expand/collapse =====
document.querySelectorAll('.folder').forEach(folder => {
    folder.addEventListener('click', (e) => {
        if (e.target.closest('.project-item a')) return;
        document.querySelectorAll('.folder').forEach(other => {
            if (other !== folder) other.classList.remove('active');
        });
        folder.classList.toggle('active');
    });
});

// ===== Journey Map =====
document.addEventListener('DOMContentLoaded', function() {
    const journeyPath = document.querySelector('.journey-path');
    const journeyMap = document.querySelector('.journey-map');
    const countryMarkers = document.querySelectorAll('.country-marker');

    if (!journeyPath || !journeyMap) return;

    const startAnimations = () => {
        journeyPath.style.animation = 'none';
        countryMarkers.forEach(m => { m.style.animation = 'none'; });
        void journeyPath.offsetWidth;
        setTimeout(() => {
            journeyPath.style.animation = 'drawPath 5s ease-out forwards';
            countryMarkers.forEach((m, i) => {
                m.style.animation = `fadeInMarker 800ms ease ${i * 600}ms forwards`;
            });
        }, 10);
    };

    const rect = journeyMap.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;

    if (visible) {
        startAnimations();
    } else {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAnimations();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        obs.observe(journeyMap);
    }
});

// ===== Console message =====
console.log('%cThanks for stopping by.', 'color: #B5482F; font-family: serif; font-size: 14px;');
