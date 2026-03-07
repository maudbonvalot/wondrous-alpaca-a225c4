// ─── SCROLL REVEAL ───
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ─── HEADER SCROLL ───
window.addEventListener('scroll', () => {
  const h = document.getElementById('header');
  h.style.boxShadow = window.scrollY > 40
    ? '0 4px 32px rgba(30,23,16,0.1)'
    : 'none';
});

// ─── FAQ ───
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ─── WEEKS ───
function toggleWeek(item) {
  const wasActive = item.classList.contains('active');
  document.querySelectorAll('.week-item.active').forEach(i => i.classList.remove('active'));
  if (!wasActive) item.classList.add('active');
}

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ─── MARQUEE PAUSE ON HOVER ───
const track = document.querySelector('.marquee-track');
if (track) {
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}