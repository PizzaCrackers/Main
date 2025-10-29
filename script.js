
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

// Highlight active nav link based on URL
window.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('#header ul li a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    // Normalize for case and ignore query/hash
    const linkHref = link.getAttribute('href').split('?')[0].split('#')[0].toLowerCase();
    const currentPage = current.toLowerCase();
    if (linkHref === currentPage) {
      link.classList.add('current');
    } else {
      link.classList.remove('current');
    }
  });
});

// Simple responsive carousel for highlights
const track = document.querySelector('.carousel-track');
if (track) {
  const cards = Array.from(track.children);
  const nextButton = document.querySelector('.next');
  const prevButton = document.querySelector('.prev');
  const dotsContainer = document.querySelector('.carousel-dots');
  let currentIndex = 0;
  let slidesToShow = 3;
  let autoPlayId = null;

  function calcSlidesToShow() {
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 768) return 2;
    return 1;
  }

  function updateLayout() {
    slidesToShow = calcSlidesToShow();
    // regenerate dots
    const pages = Math.max(1, cards.length - slidesToShow + 1);
    dotsContainer && (dotsContainer.innerHTML = '');
    for (let i = 0; i < pages; i++) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Go to slide ${i+1}`);
      b.addEventListener('click', () => { currentIndex = i; goTo(currentIndex); });
      if (i === 0) b.classList.add('active');
      dotsContainer && dotsContainer.appendChild(b);
    }
    goTo(currentIndex);
  }

  function goTo(index) {
    const maxIndex = Math.max(0, cards.length - slidesToShow);
    if (index < 0) index = 0;
    if (index > maxIndex) index = 0; // wrap to start for simpler UX
    currentIndex = index;
    const cardWidth = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(cards[0]).marginRight || 0);
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    // update dots
    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  nextButton && nextButton.addEventListener('click', () => { goTo(currentIndex + 1); restartAuto(); });
  prevButton && prevButton.addEventListener('click', () => { goTo(currentIndex - 1); restartAuto(); });

  // Touch support
  let startX = 0, deltaX = 0;
  track.addEventListener('pointerdown', (e) => { startX = e.clientX; track.setPointerCapture(e.pointerId); });
  track.addEventListener('pointermove', (e) => { if (startX) { deltaX = e.clientX - startX; } });
  track.addEventListener('pointerup', (e) => {
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) goTo(currentIndex + 1); else goTo(currentIndex - 1);
      restartAuto();
    }
    startX = 0; deltaX = 0;
  });

  function startAuto() {
    stopAuto();
    autoPlayId = setInterval(() => { goTo(currentIndex + 1); }, 5000);
  }
  function stopAuto() { if (autoPlayId) clearInterval(autoPlayId); }
  function restartAuto() { stopAuto(); startAuto(); }

  window.addEventListener('resize', () => { updateLayout(); });
  updateLayout();
  startAuto();
}

