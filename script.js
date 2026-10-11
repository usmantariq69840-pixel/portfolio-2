// =========================================
// Portfolio interactions
// =========================================
const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-link');
const progressBar = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

// 1. Mobile navigation toggle
function closeMenu() {
  navLinks.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
  document.body.classList.remove('menu-open');
}
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  document.body.classList.toggle('menu-open', isOpen);
});
navItems.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

// 2. Scroll progress, sticky header and back-to-top control
function handleScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
  header.classList.toggle('scrolled', window.scrollY > 20);
  backToTop.classList.toggle('visible', window.scrollY > 500);
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// 3. Reveal sections as they enter the viewport
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
}

// 4. Highlight the navigation item for the current section
const sections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', active);
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

// 5. Contact form client-side validation and feedback
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const validators = {
  name: value => value.trim().length >= 2 ? '' : 'Please enter at least 2 characters.',
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? '' : 'Please enter a valid email address.',
  subject: value => value.trim().length >= 3 ? '' : 'Please enter a subject (at least 3 characters).',
  message: value => value.trim().length >= 10 ? '' : 'Please write at least 10 characters.'
};
function validateField(field) {
  const error = validators[field.name](field.value);
  const errorElement = document.getElementById(`${field.name}Error`);
  errorElement.textContent = error;
  field.classList.toggle('invalid', Boolean(error));
  field.setAttribute('aria-invalid', String(Boolean(error)));
  return !error;
}
Object.keys(validators).forEach(name => {
  const field = contactForm.elements[name];
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('invalid')) validateField(field);
    formFeedback.textContent = '';
    formFeedback.classList.remove('error');
  });
});
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const fields = Object.keys(validators).map(name => contactForm.elements[name]);
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    formFeedback.textContent = 'Please check the highlighted fields and try again.';
    formFeedback.classList.add('error');
    fields.find(field => field.classList.contains('invalid'))?.focus();
    return;
  }
  formFeedback.textContent = 'Your form is valid! This demo is not connected to an inbox yet.';
  formFeedback.classList.remove('error');
  contactForm.reset();
  fields.forEach(field => {
    field.classList.remove('invalid');
    field.removeAttribute('aria-invalid');
  });
  Object.keys(validators).forEach(name => {
    document.getElementById(`${name}Error`).textContent = '';
  });
});

// 6. Automatically keep the copyright year current
document.getElementById('year').textContent = new Date().getFullYear();
