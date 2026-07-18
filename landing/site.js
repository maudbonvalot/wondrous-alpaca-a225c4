'use strict';

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
}, { threshold: 0.01, rootMargin: '0px 0px -40px 0px' });
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

// ─── LANDING : animations & interactions ─────────────────────────────────
(() => {
  const landing = document.getElementById('landing');
  if (!landing || !landing.classList.contains('active')) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Titre héro — révélation mot par mot
  const h1 = document.getElementById('heroTitle');
  if (h1 && !reduceMotion) {
    let i = 0;
    const wrapWords = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          if (!child.textContent.trim()) return;
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
            const s = document.createElement('span');
            s.className = 'w';
            s.style.setProperty('--d', (0.15 + i * 0.07).toFixed(2) + 's');
            s.textContent = part;
            i++;
            frag.appendChild(s);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          const tag = child.tagName.toLowerCase();
          if (tag !== 'br' && tag !== 'svg') wrapWords(child);
        }
      });
    };
    wrapWords(h1);
  }

  // 2. Header intelligent + barre de progression
  const header = document.getElementById('siteHeader');
  const bar = document.getElementById('scrollBar');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (header) header.classList.toggle('hide', y > lastY && y > 320);
    lastY = y;
    if (bar) {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
  }, { passive: true });

  // 3. Parallaxe douce sur les photos
  const pxEls = [...document.querySelectorAll('[data-parallax]')];
  if (pxEls.length && !reduceMotion) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const mid = innerHeight / 2;
      pxEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > innerHeight + 100) return;
        const speed = parseFloat(el.dataset.parallax) || 0.06;
        const off = (r.top + r.height / 2 - mid) * speed;
        el.style.transform = 'translateY(' + off.toFixed(1) + 'px) scale(1.14)';
      });
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // 4. Carte héro — inclinaison 3D au survol
  const tiltCard = document.getElementById('tiltCard');
  const tiltZone = document.querySelector('.hero-right');
  if (tiltCard && tiltZone && !reduceMotion) {
    tiltZone.addEventListener('mousemove', e => {
      const r = tiltZone.getBoundingClientRect();
      const rx = ((e.clientX - r.left) / r.width - 0.5) * 8;
      const ry = ((e.clientY - r.top) / r.height - 0.5) * -8;
      tiltCard.style.transform = 'perspective(900px) rotateY(' + rx.toFixed(2) + 'deg) rotateX(' + ry.toFixed(2) + 'deg) translateY(-4px)';
    });
    tiltZone.addEventListener('mouseleave', () => { tiltCard.style.transform = ''; });
  }

  // 5. Compteurs animés
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      countObs.unobserve(entry.target);
      const el = entry.target;
      const end = parseFloat(el.dataset.count);
      const pre = el.dataset.prefix || '';
      const suf = el.dataset.suffix || '';
      if (reduceMotion || isNaN(end)) return;
      const t0 = performance.now(), dur = 1400;
      const tick = t => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(end * eased) + suf;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

  // 6. Témoignages — glisser pour faire défiler
  const scroller = document.getElementById('testiScroll');
  if (scroller) {
    let down = false, startX = 0, startScroll = 0;
    scroller.addEventListener('pointerdown', e => {
      down = true; startX = e.clientX; startScroll = scroller.scrollLeft;
      scroller.classList.add('dragging');
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      scroller.scrollLeft = startScroll - (e.clientX - startX);
    });
    addEventListener('pointerup', () => { down = false; scroller.classList.remove('dragging'); });
    scroller.addEventListener('dragstart', e => e.preventDefault());
  }

  // 7. Bouton final magnétique
  document.querySelectorAll('.btn-final').forEach(btn => {
    if (reduceMotion) return;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.18;
      const dy = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();
