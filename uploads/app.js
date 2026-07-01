// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
    }, 1200);
});

const header = document.querySelector('header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');
const themeToggle = document.querySelector('.theme-toggle');
const backToTopButton = document.querySelector('.back-to-top');

function closeNav() {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    navOverlay.classList.remove('active');
}

function toggleNav() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    navOverlay.classList.toggle('active');
}

hamburger.addEventListener('click', toggleNav);
navOverlay.addEventListener('click', closeNav);

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', evt => {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (!target) return;
        evt.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        closeNav();
    });
});

// Theme toggle with persistence
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
});

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Contact form mock submit
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you for your message! Godfred will get back to you soon.');
    e.target.reset();
});

// Disable zoom on mobile (double-tap)
document.addEventListener('touchstart', evt => {
    if (evt.touches.length > 1) evt.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', evt => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) evt.preventDefault();
    lastTouchEnd = now;
}, false);

// Reveal on scroll
const revealTargets = document.querySelectorAll('.company-card, .about-image, .about-text, .info-item, .service-card, .testimonial-card, .stats .stat-item');
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
}, { threshold: 0.2 });

revealTargets.forEach(el => observer.observe(el));

// Animated counters when in view
let countersStarted = false;
function animateCounter(el, target, duration) {
    let startTime = null;
    const startValue = 0;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (target - startValue) + startValue);
        el.textContent = value;
        if (progress < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
}

function startCounters() {
    if (countersStarted) return;
    const statsSection = document.querySelector('.stats');
    const pos = statsSection.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight * 0.8;
    if (pos < triggerPoint) {
        countersStarted = true;
        animateCounter(document.getElementById('stat1'), 5, 2000);
        animateCounter(document.getElementById('stat2'), 100, 2000);
        animateCounter(document.getElementById('stat3'), 2, 2000);
        animateCounter(document.getElementById('stat4'), 500, 2000);
    }
}

window.addEventListener('scroll', startCounters);
window.addEventListener('load', startCounters);

// Create floating particles in hero section
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 20 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;

        particlesContainer.appendChild(particle);
    }
}

createParticles();

// AI Assistant functionality
const aiChat = document.getElementById('aiChat');
const aiInput = document.getElementById('aiInput');
const aiSend = document.getElementById('aiSend');

const aiResponses = {
    'hello': 'Hello! How can I assist you with your business inquiries today?',
    'hi': 'Hi there! What would you like to know about Godfred Ampomah or his businesses?',
    'real estate': 'SEMDU Real Estates offers innovative property solutions in Ghana. They specialize in residential and commercial properties with a focus on sustainable development.',
    'travel': 'The travel division provides expert vacation planning services with a focus on unique experiences across Africa and beyond.',
    'car': 'The automotive division offers car sales, rentals, and leasing options with a wide selection of vehicles to meet various needs.',
    'delivery': 'Ampomah Delivery provides reliable logistics services across Ghana with prompt and secure transportation solutions.',
    'investment': 'For investment opportunities, please contact us directly to discuss potential partnerships and ventures.',
    'contact': 'You can reach Godfred Ampomah at +1 616-893-2665 or business@ampomahgroup.com',
    'opportunities': 'There are various business opportunities available across different sectors. Please specify your area of interest for more detailed information.',
    'default': 'Thank you for your inquiry. For more specific information, please contact us directly at +1 616-893-2665 or business@ampomahgroup.com'
};

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('ai-message');
    messageDiv.classList.add(isUser ? 'ai-user' : 'ai-bot');
    messageDiv.textContent = message;
    aiChat.appendChild(messageDiv);
    aiChat.scrollTop = aiChat.scrollHeight;
}

function processInput() {
    const input = aiInput.value.toLowerCase().trim();
    if (input === '') return;

    addMessage(aiInput.value, true);
    aiInput.value = '';

    setTimeout(() => {
        let response = aiResponses.default;
        for (const [keyword, aiResponse] of Object.entries(aiResponses)) {
            if (input.includes(keyword)) {
                response = aiResponse;
                break;
            }
        }
        addMessage(response);
    }, 900);
}

aiSend.addEventListener('click', processInput);
aiInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') processInput();
});

// Appointment booking via Google Calendar
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('bk-name').value.trim();
        const date = document.getElementById('bk-date').value;
        const time = document.getElementById('bk-time').value;
        const type = document.getElementById('bk-type').value;
        const notes = document.getElementById('bk-notes').value.trim();

        if (!name || !date || !time) return;

        const start = new Date(`${date}T${time}`);
        const end = new Date(start.getTime() + 30 * 60000);
        const formatDate = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        const startStr = formatDate(start);
        const endStr = formatDate(end);
        const ownerEmail = 'godfredampomah05@gmail.com';

        const details = `${type} booked via portfolio site${notes ? '\\nNotes: ' + notes : ''}`;
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
            `&text=${encodeURIComponent('Meeting with ' + name)}` +
            `&dates=${startStr}/${endStr}` +
            `&details=${encodeURIComponent(details)}` +
            `&add=${encodeURIComponent(ownerEmail)}` +
            `&location=${encodeURIComponent('Google Meet')}`;

        window.location.href = url;
    });
}

// Pulse animation for AI section
setInterval(() => {
    document.querySelector('.ai-assistant').style.animation = 'pulse 10s infinite';
}, 15000);

// Back to top button & sticky header
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
    header.classList.toggle('scrolled', window.scrollY > 40);
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
