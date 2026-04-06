// 1. Dynamic year in footer
document.querySelectorAll('.year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// 2. Scroll reveal with IntersectionObserver
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// 3. Nav active state on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// 4. Mobile nav toggle
const hamburger = document.querySelector('.nav-hamburger');
const navLinksEl = document.querySelector('.nav-links');
if (hamburger && navLinksEl) {
  hamburger.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
  });
  // Close on link click
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinksEl.classList.remove('open'));
  });
}
