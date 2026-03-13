/* =========================================================
   ANDREA AJELLO – EXECUTIVE COACH
   scripts.js
   ========================================================= */

'use strict';

/* ---------- STICKY HEADER ---------- */
const header = document.getElementById('site-header');

function handleScroll() {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // run once on load

/* ---------- MOBILE MENU ---------- */
const burger    = document.getElementById('nav-burger');
const navLinks  = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  });
});

/* ---------- INTERSECTION OBSERVER – FADE-IN ---------- */
const fadeEls = document.querySelectorAll(
  '.about__grid, .card, .audience__grid, .offer__inner, .faq__item, .contact__inner, .trust-item, .pullquote'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger sibling elements slightly
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Add stagger delays to card groups
document.querySelectorAll('.card').forEach((card, i) => {
  card.dataset.delay = i * 100;
});
document.querySelectorAll('.trust-item').forEach((item, i) => {
  item.dataset.delay = i * 80;
});
document.querySelectorAll('.faq__item').forEach((item, i) => {
  item.dataset.delay = i * 60;
});

fadeEls.forEach(el => observer.observe(el));

/* ---------- CONTACT FORM ---------- */
const form        = document.getElementById('contact-form');
const successMsg  = document.getElementById('form-success');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(input, message) {
  input.classList.add('error');
  input.setAttribute('aria-invalid', 'true');
  let errorEl = input.nextElementSibling;
  if (!errorEl || !errorEl.classList.contains('field-error')) {
    errorEl = document.createElement('span');
    errorEl.classList.add('field-error');
    errorEl.style.cssText = 'font-size:.78rem;color:#c0392b;margin-top:.2rem;display:block;';
    input.parentNode.insertBefore(errorEl, input.nextSibling);
  }
  errorEl.textContent = message;
}

function clearError(input) {
  input.classList.remove('error');
  input.removeAttribute('aria-invalid');
  const errorEl = input.nextElementSibling;
  if (errorEl && errorEl.classList.contains('field-error')) {
    errorEl.remove();
  }
}

// Live validation
form.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('blur', () => {
    if (field.required && !field.value.trim()) {
      setError(field, 'This field is required.');
    } else if (field.type === 'email' && field.value && !validateEmail(field.value)) {
      setError(field, 'Please enter a valid email address.');
    } else {
      clearError(field);
    }
  });
  field.addEventListener('input', () => {
    if (field.classList.contains('error')) clearError(field);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  successMsg.textContent = '';

  const name  = form.querySelector('#name');
  const email = form.querySelector('#email');
  const goal  = form.querySelector('#goal');
  let valid = true;

  if (!name.value.trim()) {
    setError(name, 'Please enter your name.'); valid = false;
  } else clearError(name);

  if (!email.value.trim()) {
    setError(email, 'Please enter your email.'); valid = false;
  } else if (!validateEmail(email.value)) {
    setError(email, 'Please enter a valid email address.'); valid = false;
  } else clearError(email);

  if (!goal.value.trim()) {
    setError(goal, 'Please tell me a little about yourself.'); valid = false;
  } else clearError(goal);

  if (!valid) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  const firstName = name.value.split(' ')[0];

  fetch('https://formspree.io/f/mojkvpog', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new FormData(form)
  })
  .then(res => {
    if (res.ok) {
      form.reset();
      successMsg.textContent = '✓ Thank you, ' + firstName + '! I will be in touch within 48 hours.';
    } else {
      successMsg.textContent = 'Something went wrong. Please try again or email me directly.';
    }
  })
  .catch(() => {
    successMsg.textContent = 'Something went wrong. Please try again or email me directly.';
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  });
});

/* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));
