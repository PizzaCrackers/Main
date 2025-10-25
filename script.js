// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Add animation classes as elements come into view
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements that should animate in
document.querySelectorAll('.mission-content, .welcome-letter, .highlight-card').forEach((element) => {
    element.classList.add('animate-on-scroll');
    observer.observe(element);
});

// Add hover effect to highlight cards
document.querySelectorAll('.highlight-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Update copyright year
document.querySelector('.copyright').textContent = 
    `© ${new Date().getFullYear()} PWD Advocacy. All rights reserved.`;

// Add loading animation for hero section
window.addEventListener('load', () => {
    document.querySelector('.hero').classList.add('loaded');
});
