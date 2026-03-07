'use strict';

// ─── STORAGE (localStorage comme fallback si window.storage absent) ───────
const STORAGE = {
  async get(key) {
    if (window.storage) {
      try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch { return null; }
    }
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
  },
  async set(key, val) {
    if (window.storage) {
      try { await window.storage.set(key, JSON.stringify(val)); return true; } catch { return false; }
    }
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; }
  }
};

// ─── NAVIGATION ───────────────────────────────────────────────────────────
function goTo(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screen).classList.add('active');
  window.scrollTo(0, 0);
}

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

// ─── AUTH ─────────────────────────────────────────────────────────────────
let authMode = 'login';
let contactMode = 'email';

function switchTab(mode) {
  authMode = mode;
  document.getElementById('tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-register').classList.toggle('active', mode === 'register');
  document.getElementById('fg-prenom').style.display = mode === 'register' ? 'block' : 'none';
  document.getElementById('btn-auth').textContent = mode === 'login' ? 'Accéder à mon programme' : 'Créer mon compte';
  document.getElementById('auth-note').textContent = mode === 'register'
    ? 'Tu recevras des rappels de motivation basés sur tes scores quotidiens.'
    : 'Tes données sont sauvegardées et accessibles depuis n\'importe quel appareil.';
  clearAuthMessages();
}

function switchContact(mode) {
  contactMode = mode;
  document.getElementById('cb-email').classList.toggle('active', mode === 'email');
  document.getElementById('cb-phone').classList.toggle('active', mode === 'phone');
  document.getElementById('inp-email').style.display = mode === 'email' ? 'block' : 'none';
  document.getElementById('inp-phone').style.display = mode === 'phone' ? 'block' : 'none';
}

function clearAuthMessages() {
  document.getElementById('auth-error').style.display = 'none';
  document.getElementById('auth-success').style.display = 'none';
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = '⚠️ ' + msg; el.style.display = 'block';
}

function genId() { return Math.random().toString(36).slice(2, 10); }

async function handleAuth() {
  clearAuthMessages();
  const btn = document.getElementById('btn-auth');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Chargement...';

  const contact = contactMode === 'email'
    ? document.getElementById('inp-email').value.trim()
    : document.getElementById('inp-phone').value.trim();

  if (!contact) {
    showAuthError('Renseigne ton ' + (contactMode === 'email' ? 'email' : 'numéro'));
    resetBtn(); return;
  }

  if (authMode === 'register') {
    const prenom = document.getElementById('inp-prenom').value.trim();
    if (!prenom) { showAuthError('Renseigne ton prénom'); resetBtn(); return; }

    const existing = await STORAGE.get('user:' + contact);
    if (existing) { showAuthError('Ce compte existe déjà. Connecte-toi.'); switchTab('login'); resetBtn(); return; }

    const uid = genId();
    const userData = { uid, prenom, contact, notifMode: contactMode, createdAt: new Date().toISOString() };
    await STORAGE.set('user:' + contact, userData);
    await STORAGE.set('session', userData);
    resetBtn();
    loginUser(userData);

  } else {
    const userData = await STORAGE.get('user:' + contact);
    if (!userData) {
      showAuthError('Compte introuvable. Inscris-toi d\'abord.');
      setTimeout(() => switchTab('register'), 800);
      resetBtn(); return;
    }
    await STORAGE.set('session', userData);
    resetBtn();
    loginUser(userData);
  }
}

function resetBtn() {
  const btn = document.getElementById('btn-auth');
  btn.disabled = false;
  btn.textContent = authMode === 'login' ? 'Accéder à mon programme' : 'Créer mon compte';
}

async function loginDemo() {
  const demo = { uid: 'demo-' + genId(), prenom: 'Demo', contact: 'demo@reset.fr', notifMode: 'email', isDemo: true };
  loginUser(demo);
}

// ─── APP INIT ─────────────────────────────────────────────────────────────
let currentUser = null;
let dayData = { eau: 0, meals: [], energie: 0, humeur: 0, digestion: 0, sommeil: 0, activities: [], symptomes: [], notes: '' };
let notifOn = true;
let toastTimer = null;

function loginUser(user) {
  currentUser = user;
  document.getElementById('app-prenom').textContent = user.prenom || 'toi';
  document.getElementById('profile-name-display').textContent = user.prenom || 'toi';
  document.getElementById('profile-contact-display').textContent = user.contact;
  document.getElementById('preview-contact').textContent = user.contact;
  document.getElementById('profile-notif-icon').textContent = user.notifMode === 'phone' ? '📱' : '📧';
  goTo('app');
  initTracker();
}

async function logout() {
  await STORAGE.set('session', null);
  currentUser = null;
  goTo('landing');
}

// Auto-login
(async () => {
  const session = await STORAGE.get('session');
  if (session && session.uid) { loginUser(session); }
})();

// ─── TRACKER ──────────────────────────────────────────────────────────────
const SYMPTOMS = ['💤 Fatigue', '🌊 Ballonnements', '🍫 Fringales sucre', '🥵 Bouffées chaleur', '😤 Irritabilité', '🤕 Maux de tête', '💧 Rétention eau', '😴 Insomnie', '✨ Aucun symptôme'];
const RATINGS = ['energie', 'humeur', 'digestion', 'sommeil'];
const RATING_EMOJIS = { energie: '⭐', humeur: '⭐', digestion: '⭐', sommeil: '🌙' };

function todayKey() { return new Date().toISOString().split('T')[0]; }

function computeScore(d) {
  let pts = 0;
  pts += Math.round((Math.min(d.eau, 8) / 8) * 25);
  pts += Math.round((Math.min(d.meals.length, 4) / 4) * 25);
  if (d.activities && d.activities.length > 0) pts += 20;
  const ratings = RATINGS.map(r => d[r] || 0).filter(v => v > 0);
  if (ratings.length) pts += Math.round((ratings.reduce((a, b) => a + b, 0) / (ratings.length * 5)) * 20);
  if ((d.notes || '').trim().length > 10) pts += 10;
  return Math.min(100, pts);
}

function getMotivMsg(score, prenom) {
  const n = prenom ? ' ' + prenom : '';
  if (score === 0) return `Bonjour${n} 👋 Démarre ton tracker — même 5 min suffisent !`;
  if (score < 30) return `${n ? n.trim() + ',' : ''} tu es à ${score}% aujourd'hui. Un verre d'eau de plus ?`;
  if (score < 55) return `Belle progression${n} ! ${score}% de tes objectifs — continue 💪`;
  if (score < 75) return `Super${n} ! ${score}% atteints — tu es sur la bonne voie 🌿`;
  if (score < 90) return `Excellent${n} ! ${score}% — journée au top ✨`;
  return `Journée parfaite${n} ! ${score}% — ton métabolisme te remercie 🌸`;
}

async function initTracker() {
  // Charger données du jour
  if (!currentUser) return;
  const saved = await STORAGE.get('day:' + currentUser.uid + ':' + todayKey());
  if (saved) dayData = { ...dayData, ...saved };

  // Charger prefs notifs
  const notifPrefs = await STORAGE.get('notif:' + currentUser.uid);
  if (notifPrefs) {
    notifOn = notifPrefs.notifOn !== false;
    if (notifPrefs.notifTime) document.getElementById('notif-time').value = notifPrefs.notifTime;
    if (notifPrefs.threshold) {
      document.getElementById('notif-threshold').value = notifPrefs.threshold;
      document.getElementById('threshold-val').textContent = notifPrefs.threshold + '%';
    }
    const sw = document.getElementById('toggle-notif');
    sw.style.background = notifOn ? 'var(--sage)' : 'var(--gold-lt)';
    sw.querySelector('.toggle-knob').style.left = notifOn ? '23px' : '3px';
  }

  renderAll();
  renderMiniHist();
  renderHistorique();
  renderNotifPreview();
}

function renderAll() {
  if (!currentUser) return;
  const score = computeScore(dayData);

  // Date & message
  document.getElementById('mot-date').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  document.getElementById('mot-msg').textContent = getMotivMsg(score, currentUser.prenom);

  // Score ring
  const circ = 2 * Math.PI * 28;
  const arc = document.getElementById('score-arc');
  arc.setAttribute('stroke-dasharray', `${(score / 100) * circ} ${circ}`);
  arc.style.stroke = score < 30 ? '#E8C4B0' : score < 60 ? '#C9A96E' : score < 85 ? '#8A9E85' : '#4A6741';
  document.getElementById('score-pct-text').textContent = score + '%';

  // Notif banner
  document.getElementById('notif-banner').textContent =
    notifOn ? `📲 Un rappel te sera envoyé à 20h sur ${currentUser.contact} si ton score est inférieur à 70%.`
    : '🔕 Rappels désactivés. Active-les dans ton profil.';

  // Eau
  const eauCont = document.getElementById('eau-dots');
  eauCont.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const b = document.createElement('button');
    b.className = 'dot-btn' + (i < dayData.eau ? ' on' : '');
    b.textContent = i + 1;
    b.onclick = () => { dayData.eau = dayData.eau === i + 1 ? i : i + 1; renderAll(); };
    eauCont.appendChild(b);
  }
  document.getElementById('eau-label').textContent = dayData.eau + '/8 verres';

  // Repas
  document.querySelectorAll('.meal-btn').forEach((btn, i) => {
    btn.classList.toggle('on', dayData.meals.includes(i));
  });
  document.getElementById('repas-label').textContent = dayData.meals.length + '/4';

  // Ratings
  RATINGS.forEach(r => {
    const cont = document.getElementById('stars-' + r);
    if (!cont) return;
    cont.innerHTML = '';
    for (let n = 1; n <= 5; n++) {
      const b = document.createElement('button');
      b.className = 'star-btn';
      b.textContent = RATING_EMOJIS[r];
      b.style.opacity = n <= (dayData[r] || 0) ? '1' : '0.2';
      b.onclick = () => { dayData[r] = dayData[r] === n ? 0 : n; renderAll(); };
      cont.appendChild(b);
    }
  });

  // Activités
  document.querySelectorAll('.act-btn').forEach(btn => {
    const act = btn.dataset.act;
    btn.classList.toggle('on', (dayData.activities || []).includes(act));
  });

  // Symptômes
  const sg = document.getElementById('symptom-grid');
  sg.innerHTML = '';
  SYMPTOMS.forEach(s => {
    const b = document.createElement('button');
    b.className = 'sym-btn' + ((dayData.symptomes || []).includes(s) ? ' on' : '');
    b.textContent = s;
    b.onclick = () => {
      const arr = dayData.symptomes || [];
      dayData.symptomes = arr.includes(s) ? arr.filter(x => x !== s) : [...arr, s];
      renderAll();
    };
    sg.appendChild(b);
  });

  // Notes
  document.getElementById('notes-ta').value = dayData.notes || '';

  // Profile week score
  document.getElementById('profile-week-score').textContent = score + '%';
  document.getElementById('profile-week-score').parentElement.previousElementSibling;
}

function toggleMeal(i) {
  if (dayData.meals.includes(i)) {
    dayData.meals = dayData.meals.filter(m => m !== i);
  } else {
    dayData.meals = [...dayData.meals, i];
  }
  renderAll();
}

function toggleAct(act) {
  if (!dayData.activities) dayData.activities = [];
  if (dayData.activities.includes(act)) {
    dayData.activities = dayData.activities.filter(a => a !== act);
  } else {
    dayData.activities = [...dayData.activities, act];
  }
  renderAll();
}

// Notes en temps réel
document.getElementById('notes-ta').addEventListener('input', function() {
  dayData.notes = this.value;
});

async function saveDay() {
  if (!currentUser) return;
  const btn = document.getElementById('btn-save');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Sauvegarde...';

  dayData.notes = document.getElementById('notes-ta').value;
  const score = computeScore(dayData);
  const toSave = { ...dayData, score, savedAt: new Date().toISOString() };

  await STORAGE.set('day:' + currentUser.uid + ':' + todayKey(), toSave);

  // Mettre à jour historique
  const hist = await STORAGE.get('hist:' + currentUser.uid) || {};
  hist[todayKey()] = { score, eau: dayData.eau, meals: dayData.meals.length, activities: dayData.activities, symptomes: dayData.symptomes };
  await STORAGE.set('hist:' + currentUser.uid, hist);

  btn.disabled = false;
  btn.textContent = '💾 Sauvegarder ma journée';
  showToast(`✅ Journée sauvegardée ! Score : ${score}%`);
  renderMiniHist();
  renderHistorique();
}

// ─── MINI HISTORIQUE ──────────────────────────────────────────────────────
async function renderMiniHist() {
  if (!currentUser) return;
  const hist = await STORAGE.get('hist:' + currentUser.uid) || {};
  const cont = document.getElementById('mini-hist');
  cont.innerHTML = '';
  const days = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = d.toISOString().split('T')[0];
    const sc = hist[k]?.score || 0;
    const isToday = i === 0;
    const div = document.createElement('div');
    div.style.flex = '1';
    div.style.textAlign = 'center';
    div.innerHTML = `
      <div class="mini-bar" style="margin-bottom:6px">
        <div class="mini-bar-fill" style="height:${sc}%;background:${isToday ? 'var(--terra)' : 'var(--sage)'}"></div>
      </div>
      <div style="font-size:9px;color:${isToday ? 'var(--terra)' : 'var(--mist)'};font-weight:${isToday ? 700 : 400};text-transform:uppercase">${days[d.getDay()]}</div>
      <div style="font-size:10px;color:var(--mist)">${sc > 0 ? sc + '%' : '–'}</div>
    `;
    cont.appendChild(div);
  }
}

// ─── HISTORIQUE COMPLET ───────────────────────────────────────────────────
async function renderHistorique() {
  if (!currentUser) return;
  const hist = await STORAGE.get('hist:' + currentUser.uid) || {};
  const last7 = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = d.toISOString().split('T')[0];
    last7.push({ date: k, data: hist[k], isToday: i === 0, d });
  }

  // Score moyen
  const scores = last7.filter(x => x.data?.score > 0).map(x => x.data.score);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  document.getElementById('avg-score-val').textContent = avg > 0 ? avg + '%' : '–';
  const avgCirc = 2 * Math.PI * 34;
  document.getElementById('avg-arc').setAttribute('stroke-dasharray', `${(avg / 100) * avgCirc} ${avgCirc}`);
  document.getElementById('avg-pct-text').textContent = avg > 0 ? avg + '%' : '–';

  // Liste jours
  const list = document.getElementById('hist-days-list');
  list.innerHTML = '';
  last7.forEach(({ date, data, isToday, d }) => {
    const div = document.createElement('div');
    div.className = 'hist-day';
    div.style.opacity = data ? '1' : '0.5';
    const label = isToday ? 'Aujourd\'hui' : d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
    const tagsHtml = data ? `
      <div class="hist-tags">
        ${data.eau > 0 ? `<span class="hist-tag">💧 ${data.eau} verres</span>` : ''}
        ${data.meals > 0 ? `<span class="hist-tag">🥩 ${data.meals} repas</span>` : ''}
        ${data.activities?.length > 0 ? `<span class="hist-tag">💪 Sport</span>` : ''}
        ${data.symptomes?.length > 0 ? `<span class="hist-tag">${data.symptomes.length} symptôme${data.symptomes.length > 1 ? 's' : ''}</span>` : ''}
      </div>` : '<div style="font-size:12px;color:var(--mist)">Non renseigné</div>';
    div.innerHTML = `
      <div class="hist-day-header">
        <div class="hist-day-name" style="color:${isToday ? 'var(--terra)' : 'var(--ink)'}">${label}</div>
        <div class="hist-day-score">${data?.score > 0 ? data.score + '%' : '–'}</div>
      </div>
      ${tagsHtml}
    `;
    list.appendChild(div);
  });
}

// ─── PROFIL / NOTIFS ──────────────────────────────────────────────────────
function toggleNotif() {
  notifOn = !notifOn;
  const sw = document.getElementById('toggle-notif');
  sw.style.background = notifOn ? 'var(--sage)' : 'var(--gold-lt)';
  sw.querySelector('.toggle-knob').style.left = notifOn ? '23px' : '3px';
}

async function saveNotifSettings() {
  if (!currentUser) return;
  const prefs = {
    notifOn,
    notifTime: document.getElementById('notif-time').value,
    threshold: parseInt(document.getElementById('notif-threshold').value)
  };
  await STORAGE.set('notif:' + currentUser.uid, prefs);
  showToast('✅ Préférences sauvegardées !');
  // Rafraîchir banner
  document.getElementById('notif-banner').textContent = notifOn
    ? `📲 Un rappel te sera envoyé à ${prefs.notifTime} sur ${currentUser.contact} si ton score est inférieur à ${prefs.threshold}%.`
    : '🔕 Rappels désactivés.';
  renderNotifPreview();
}

function renderNotifPreview() {
  const threshold = parseInt(document.getElementById('notif-threshold').value) || 70;
  const prenom = currentUser?.prenom || '';
  const examples = [
    { score: 42, day: 'Hier' },
    { score: 78, day: 'Il y a 2 jours' },
    { score: 28, day: 'Il y a 3 jours' },
  ];
  const cont = document.getElementById('notif-preview');
  if (!cont) return;
  cont.innerHTML = examples.map(e => {
    const triggered = e.score < threshold;
    const bg = triggered ? '#FDE8E0' : '#E8F5E8';
    const icon = triggered ? '💪' : '🌿';
    return `<div class="notif-preview-item" style="background:${bg}">
      <span style="font-size:20px">${icon}</span>
      <div>
        <div class="preview-score">${e.day} · Score ${e.score}%${triggered ? ' — rappel envoyé' : ' — aucun rappel (objectif atteint)'}</div>
        <div class="preview-msg">${getMotivMsg(e.score, prenom)}</div>
      </div>
    </div>`;
  }).join('');
}

// ─── NAVIGATION APP ───────────────────────────────────────────────────────
function switchAppTab(name) {
  document.querySelectorAll('.app-tab').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).style.display = 'block';
  event.currentTarget.classList.add('active');
  if (name === 'historique') renderHistorique();
  if (name === 'profil') renderNotifPreview();
}

// ─── TOAST ────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.style.display = 'flex';
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 4000);
}
function hideToast() {
  document.getElementById('toast').style.display = 'none';
}

// ─── SMOOTH SCROLL (landing) ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});