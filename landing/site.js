'use strict';

// ─── SCROLL REVEAL (landing) ──────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => revealObs.observe(el));

// FAQ
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const was = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!was) item.classList.add('open');
}

// ─── SMOOTH SCROLL (ancres #) ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
