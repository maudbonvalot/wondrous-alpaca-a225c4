async function showPage(name) {
  if (!PageLoader.loadedPages.has(name)) {
    await PageLoader.loadPage(name);
  }
  
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
  
  const targetPage = document.getElementById(`page-${name}`);
  const targetNav = document.getElementById(`nav-${name}`);
  
  if (targetPage) targetPage.classList.add('active');
  if (targetNav) targetNav.classList.add('active');
  
  if (name === 'recettes') renderRecettesGrid();

  window.scrollTo(0, 0);
}

  function showContent(id) {
    document.querySelectorAll('.content-block').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
    document.getElementById('content-' + id).classList.add('active');
    event.currentTarget.classList.add('active');
  }

  function showDay(btn, id) {
    const parent = btn.closest('.content-block') || btn.closest('.page');
    parent.querySelectorAll('.week-tab').forEach(t => t.classList.remove('active'));
    parent.querySelectorAll('.week-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(id).classList.add('active');
  }

  function showPhase(btn, id) {
    document.querySelectorAll('.phase-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.phase-detail').forEach(d => d.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('phase-' + id).classList.add('active');
  }

  function toggleDot(dot, type) {
    dot.classList.toggle('checked');
    updateCount(type);
    updateProgress();
  }

  function updateCount(type) {
    const dots = document.querySelectorAll(`#${type}-dots .dot`);
    const checked = document.querySelectorAll(`#${type}-dots .dot.checked`).length;
    const total = dots.length;
    const el = document.getElementById(`${type}-count`);
    if (el) {
      if (type === 'eau') el.textContent = `${checked} / ${total} verres`;
      else if (type === 'repas') el.textContent = `${checked} / ${total} repas`;
      else if (type === 'sport') el.textContent = `${checked} / ${total} jours`;
    }
  }

  function updateProgress() {
    const eauChecked = document.querySelectorAll('#eau-dots .dot.checked').length;
    const repasChecked = document.querySelectorAll('#repas-dots .dot.checked').length;
    const pct = Math.round(((eauChecked / 8) * 50 + (repasChecked / 4) * 50));
    document.getElementById('prog-bar').style.width = pct + '%';
    document.getElementById('prog-pct').textContent = pct + '%';
  }

  const ratings = {};
  const sommeilLabels = ['', 'Très mauvais 😰', 'Difficile 😔', 'Moyen 😐', 'Bon 🙂', 'Excellent 🌟'];

  function setRating(type, val) {
    ratings[type] = val;
    const stars = document.querySelectorAll(`#${type}-stars .star`);
    stars.forEach((s, i) => s.classList.toggle('active', i < val));
    if (type === 'sommeil') {
      document.getElementById('sommeil-label').textContent = sommeilLabels[val];
    }
  }

  function toggleSymptom(btn) { btn.classList.toggle('selected'); }

  function toggleCheck(li) {
    li.classList.toggle('done');
  }

  function toggleCourse(item) {
    item.classList.toggle('checked');
  }

  function resetCourses() {
    document.querySelectorAll('.course-item').forEach(i => i.classList.remove('checked'));
  }

  function saveTracker() {
    const msg = document.getElementById('saved-msg');
    msg.style.opacity = '1';
    setTimeout(() => msg.style.opacity = '0', 2500);
  }

  // ---- RECETTES ----
  let currentPortions = 1;

  const CAT_LABELS = {
    petitdej: { label: '🌅 Petit-déjeuner', cls: 'petitdej' },
    dejeuner:  { label: '☀️ Déjeuner',       cls: 'dejeuner'  },
    diner:     { label: '🌙 Dîner',           cls: 'diner'     },
    collation: { label: '🍎 Collation',       cls: 'collation' },
  };

  const recettesData = {
    'bowl-proteine-fraise-ricotta': {
      cats: ['petitdej'],
      gradient: 'linear-gradient(135deg, #FDE8D8, #FBBF8A)',
      desc: "Ricotta onctueuse, fraises fraîches et croustillant du granola. Le petit-déjeuner anti-inflammatoire qui lance ton métabolisme.",
      title: "Bowl protéiné fraise-ricotta",
      emoji: "🥣",
      time: "10 min",
      cat: "🌅 Petit-déjeuner",
      macros: { p: [34, "g"], g: [38, "g"], l: [12, "g"], k: [420, ""] },
      ingredients: [
        ["Ricotta allégée", 200, "g"],
        ["Fromage blanc 0%", 100, "g"],
        ["Fraises fraîches", 150, "g"],
        ["Granola avoine", 40, "g"],
        ["Graines de chia", 10, "g"],
        ["Miel", 1, "c.à.c"],
      ],
      steps: [
        "Mélanger la ricotta et le fromage blanc jusqu'à texture lisse.",
        "Laver et couper les fraises en morceaux.",
        "Verser la base ricotta dans un bol, déposer les fraises.",
        "Parsemer de granola, de graines de chia et arroser de miel.",
      ],
      tip: "💡 Pour une version encore plus légère, remplace le granola par des amandes effilées grillées.",
    },
    'omelette-printaniere-asperges-feta': {
      cats: ['petitdej'],
      gradient: 'linear-gradient(135deg, #E8F5E8, #B5C9B0)',
      desc: "Asperges vertes sautées, feta et herbes fraîches dans une omelette dorée. Zinc, magnésium et protéines complètes.",
      title: "Omelette printanière asperges & feta",
      emoji: "🥚",
      time: "15 min",
      cat: "🌅 Petit-déjeuner",
      macros: { p: [33, "g"], g: [6, "g"], l: [25, "g"], k: [380, ""] },
      ingredients: [
        ["Œufs entiers", 3, "pièces"],
        ["Blancs d'œuf", 2, "pièces"],
        ["Asperges vertes", 6, "tiges"],
        ["Feta", 40, "g"],
        ["Ciboulette fraîche", 1, "c.à.s"],
        ["Huile d'olive", 1, "c.à.c"],
      ],
      steps: [
        "Couper les asperges en tronçons et les faire revenir 5 min à la poêle.",
        "Battre les œufs entiers et les blancs, saler, poivrer.",
        "Verser dans la poêle huilée sur feu moyen, ajouter les asperges.",
        "Émietter la feta et la ciboulette, plier l'omelette et servir.",
      ],
      tip: "💡 Ajoute des pointes d'asperges crues pour un croquant supplémentaire.",
    },
    'salade-poulet-grille-quinoa': {
      cats: ['dejeuner'],
      gradient: 'linear-gradient(135deg, #EDE8F5, #C8B8E8)',
      desc: "Poulet grillé, quinoa et légumes frais. Le déjeuner équilibré par excellence pour tenir toute l'après-midi.",
      title: "Salade de poulet grillé & quinoa",
      emoji: "🥗",
      time: "25 min",
      cat: "☀️ Déjeuner",
      macros: { p: [42, "g"], g: [40, "g"], l: [14, "g"], k: [490, ""] },
      ingredients: [
        ["Blanc de poulet", 150, "g"],
        ["Quinoa cuit", 80, "g"],
        ["Concombre", 0.5, "pièce"],
        ["Tomates cerises", 80, "g"],
        ["Roquette", 40, "g"],
        ["Citron", 0.5, "pièce"],
        ["Huile d'olive", 1, "c.à.s"],
      ],
      steps: [
        "Cuire le quinoa selon les instructions, refroidir.",
        "Griller le blanc de poulet 6 min de chaque côté, trancher.",
        "Couper concombre et tomates cerises.",
        "Assembler tous les ingrédients, assaisonner citron + huile d'olive.",
      ],
      tip: "💡 Pour gagner du temps, prépare le quinoa la veille et garde-le au frigo.",
    },
    'bowl-saumon-avocat-riz-complet': {
      cats: ['dejeuner', 'diner'],
      gradient: 'linear-gradient(135deg, #FFE8D8, #FFB38A)',
      desc: "Saumon doré, avocat crémeux et riz complet. Le bowl oméga-3 qui rassasie sans alourdir — idéal en semaine.",
      title: "Bowl saumon avocat & riz complet",
      emoji: "🐟",
      time: "20 min",
      cat: "☀️ Déjeuner / 🌙 Dîner",
      macros: { p: [38, "g"], g: [42, "g"], l: [18, "g"], k: [520, ""] },
      ingredients: [
        ["Pavé de saumon", 130, "g"],
        ["Riz complet cuit", 120, "g"],
        ["Avocat", 0.5, "pièce"],
        ["Edamamés", 50, "g"],
        ["Radis", 3, "pièces"],
        ["Sauce tamari light", 1, "c.à.s"],
        ["Sésame", 1, "c.à.c"],
      ],
      steps: [
        "Cuire le saumon à la poêle antiadhésive 4 min par face.",
        "Préparer le bol : riz, saumon émietté, avocat tranché.",
        "Ajouter edamamés et radis tranchés.",
        "Arroser de tamari, parsemer de sésame.",
      ],
      tip: "💡 Utilise du riz cuit la veille pour une texture plus ferme.",
    },
    'banana-bread-healthy-proteine': {
      cats: ['collation'],
      gradient: 'linear-gradient(135deg, #FFF0D8, #FDDBA0)',
      desc: "Moelleux, sans sucre ajouté et riche en protéines. La collation parfaite de l'après-midi, préparable en 5 min.",
      title: "Banana bread healthy protéiné",
      emoji: "🍌",
      time: "30 min",
      cat: "🍎 Collation",
      macros: { p: [12, "g"], g: [28, "g"], l: [6, "g"], k: [210, ""] },
      ingredients: [
        ["Banane mûre", 100, "g"],
        ["Flocons d'avoine", 40, "g"],
        ["Protéine vanille", 25, "g"],
        ["Œuf entier", 1, "pièce"],
        ["Compote sans sucre", 50, "g"],
        ["Levure chimique", 0.5, "c.à.c"],
      ],
      steps: [
        "Préchauffer le four à 180°C.",
        "Mixer banane + œuf + compote jusqu'à obtenir une purée lisse.",
        "Ajouter flocons d'avoine, protéine en poudre et levure, mélanger.",
        "Cuire 25 min. Laisser refroidir avant de couper.",
      ],
      tip: "💡 Pour une version sans gluten, utilise des flocons de sarrasin à la place de l'avoine.",
    },
    'carrot-cake-healthy-light': {
      cats: ['collation'],
      gradient: 'linear-gradient(135deg, #F5E8D8, #E8C8A0)',
      desc: "Un classique revisité sain et gourmand. Yaourt grec, carottes fraîches et cannelle — version légère et protéinée.",
      title: "Carrot cake healthy light",
      emoji: "🥕",
      time: "30 min",
      cat: "🍎 Collation",
      macros: { p: [11, "g"], g: [22, "g"], l: [5, "g"], k: [190, ""] },
      ingredients: [
        ["Carottes râpées", 80, "g"],
        ["Farine d'avoine", 50, "g"],
        ["Protéine vanille", 20, "g"],
        ["Œuf entier", 1, "pièce"],
        ["Yaourt grec 0%", 80, "g"],
        ["Cannelle, épices", 1, "c.à.c"],
        ["Sirop d'agave", 1, "c.à.s"],
      ],
      steps: [
        "Préchauffer le four à 175°C.",
        "Mélanger œuf, yaourt grec et sirop d'agave.",
        "Incorporer farine, protéine, cannelle et carottes râpées.",
        "Cuire 22-25 min en moule. Refroidir avant de déguster.",
      ],
      tip: "💡 Ajoute des noix concassées pour un apport en bonnes graisses.",
    },
    'balls-proteinees-coco-datte': {
      cats: ['collation'],
      gradient: 'linear-gradient(135deg, #E8F0E8, #A8C8A0)',
      desc: "3 ingrédients, 15 minutes. Des energy balls coco-dattes pour booster ta collation d'avant ou d'après sport.",
      title: "Balls protéinées coco-datte",
      emoji: "⚡",
      time: "15 min",
      cat: "🍎 Collation",
      macros: { p: [8, "g"], g: [14, "g"], l: [4, "g"], k: [130, ""] },
      ingredients: [
        ["Dattes Medjool", 3, "pièces"],
        ["Protéine chocolat", 20, "g"],
        ["Flocons d'avoine", 30, "g"],
        ["Noix de coco râpée", 10, "g"],
        ["Beurre d'amande", 1, "c.à.s"],
      ],
      steps: [
        "Mixer dattes dénoyautées + beurre d'amande jusqu'à pâte homogène.",
        "Ajouter protéine et flocons, former une masse.",
        "Façonner en 3 boules (ou 12 pour 4 portions).",
        "Rouler dans la noix de coco, réfrigérer 10 min avant de servir.",
      ],
      tip: "💡 Conserve-les au congélateur pour une texture plus ferme et une conservation plus longue.",
    },
    'poulet-citron-herbes-legumes-vapeur': {
      cats: ['diner'],
      gradient: 'linear-gradient(135deg, #FFF0D8, #FDDBA0)',
      desc: "Poulet mariné au citron et aux herbes, légumes vapeur croquants. Le dîner digeste et rassasiant du programme.",
      title: "Poulet citron-herbes & légumes vapeur",
      emoji: "🍗",
      time: "28 min",
      cat: "🌙 Dîner",
      macros: { p: [46, "g"], g: [22, "g"], l: [13, "g"], k: [420, ""] },
      ingredients: [
        ["Blanc de poulet", 180, "g"],
        ["Courgettes", 1, "pièce"],
        ["Haricots verts", 100, "g"],
        ["Citron", 1, "pièce"],
        ["Ail", 1, "gousse"],
        ["Herbes fraîches", 1, "c.à.s"],
        ["Huile d'olive", 1, "c.à.s"],
      ],
      steps: [
        "Mariner le poulet dans citron, ail et herbes 10 min.",
        "Cuire les légumes à la vapeur 12-15 min.",
        "Griller le poulet 7 min par face à feu moyen.",
        "Servir avec les légumes vapeur et un filet d'huile d'olive.",
      ],
      tip: "💡 Utilise un panier vapeur en bambou pour une cuisson optimale des légumes.",
    },
    'crevettes-sautees-nouilles-courgettes': {
      cats: ['diner'],
      gradient: 'linear-gradient(135deg, #FFE8F0, #FFB8D8)',
      desc: "Nouilles de courgettes spiralisées, crevettes à l'ail et basilic frais. Ultra rapide, léger et plein de saveurs.",
      title: "Crevettes sautées & nouilles de courgettes",
      emoji: "🦐",
      time: "20 min",
      cat: "🌙 Dîner",
      macros: { p: [38, "g"], g: [18, "g"], l: [14, "g"], k: [360, ""] },
      ingredients: [
        ["Crevettes décortiquées", 200, "g"],
        ["Courgettes spiralisées", 2, "pièces"],
        ["Tomates cerises", 100, "g"],
        ["Ail", 2, "gousses"],
        ["Basilic frais", 8, "feuilles"],
        ["Huile d'olive", 1, "c.à.s"],
      ],
      steps: [
        "Spiraliser les courgettes pour faire des nouilles.",
        "Faire revenir l'ail dans l'huile, ajouter les crevettes 3 min.",
        "Ajouter tomates cerises et courgettes spirales, cuire 4 min.",
        "Finir avec le basilic frais, assaisonner et servir.",
      ],
      tip: "💡 Pour une version plus gourmande, ajoute des pignons de pin grillés.",
    },
    'cabillaud-papillote-petits-pois': {
      cats: ['diner'],
      gradient: 'linear-gradient(135deg, #E8F5F0, #A8C8C0)',
      desc: "Cuisson douce en papillote, zéro gras ajouté. Cabillaud fondant, petits pois et citron — le dîner détox du programme.",
      title: "Cabillaud en papillote & petits pois",
      emoji: "🐟",
      time: "25 min",
      cat: "🌙 Dîner",
      macros: { p: [41, "g"], g: [24, "g"], l: [11, "g"], k: [390, ""] },
      ingredients: [
        ["Filet de cabillaud", 160, "g"],
        ["Petits pois frais", 80, "g"],
        ["Tomates cerises", 60, "g"],
        ["Citron", 0.5, "pièce"],
        ["Thym, laurier", 1, "brin"],
        ["Huile d'olive", 1, "c.à.c"],
      ],
      steps: [
        "Préchauffer le four à 200°C.",
        "Placer le cabillaud sur papier cuisson, entourer de légumes et herbes.",
        "Arroser de citron et d'huile, fermer hermétiquement la papillote.",
        "Cuire 18-20 min. Ouvrir délicatement et servir directement.",
      ],
      tip: "💡 Ajoute des rondelles de citron dans la papillote pour plus de saveur.",
    }
  };

  function renderRecettesGrid() {
    const grid = document.getElementById('recettes-grid');
    if (!grid || grid.children.length > 0) return;

    grid.innerHTML = Object.entries(recettesData).map(([id, r]) => {
      const catDataAttr = r.cats.join(' ');
      const catDisplay = r.cats.map(c => CAT_LABELS[c].label).join(' / ');
      const catCls = CAT_LABELS[r.cats[0]].cls;
      const mp = r.macros;

      return `
      <div class="recette-card" data-cat="${catDataAttr}">
        <div class="recette-img" style="background: ${r.gradient};">
          <span style="font-size:52px;">${r.emoji}</span>
          <div class="recette-time-badge">⏱ ${r.time}</div>
        </div>
        <div class="recette-body">
          <div class="recette-cat-tag ${catCls}">${catDisplay}</div>
          <h3 class="recette-title">${r.title}</h3>
          <p class="recette-desc">${r.desc}</p>
          <div class="macros-bar">
            <div class="macro-pill protein"><span class="macro-val" data-base="${mp.p[0]}" data-unit="${mp.p[1]}">${mp.p[0]}${mp.p[1]}</span><span class="macro-name">Protéines</span></div>
            <div class="macro-pill carb"><span class="macro-val" data-base="${mp.g[0]}" data-unit="${mp.g[1]}">${mp.g[0]}${mp.g[1]}</span><span class="macro-name">Glucides</span></div>
            <div class="macro-pill fat"><span class="macro-val" data-base="${mp.l[0]}" data-unit="${mp.l[1]}">${mp.l[0]}${mp.l[1]}</span><span class="macro-name">Lipides</span></div>
            <div class="macro-pill kcal"><span class="macro-val" data-base="${mp.k[0]}" data-unit="${mp.k[1]}">${mp.k[0]}</span><span class="macro-name">Kcal</span></div>
          </div>
          <button class="voir-recette-btn" onclick="openRecette('${id}')">Voir la recette →</button>
        </div>
      </div>`;
    }).join('');
  }

  function setPortions(n) {
    currentPortions = n;
    document.getElementById('portion-1').classList.toggle('active', n === 1);
    document.getElementById('portion-4').classList.toggle('active', n === 4);
    document.querySelectorAll('.macro-val').forEach(el => {
      const base = parseFloat(el.dataset.base);
      const unit = el.dataset.unit || '';
      const val = base * n;
      el.textContent = (Number.isInteger(val) ? val : val.toFixed(0)) + unit;
    });
    if (document.getElementById('recette-modal').style.display === 'flex') {
      document.querySelectorAll('.modal-ing-qty').forEach(el => {
        const base = parseFloat(el.dataset.base);
        const unit = el.dataset.unit || '';
        const val = base * n;
        el.textContent = (Number.isInteger(val) ? val : val.toFixed(1)) + (unit ? ' ' + unit : '');
      });
      document.querySelectorAll('.modal-macro-val').forEach(el => {
        const base = parseFloat(el.dataset.base);
        const unit = el.dataset.unit || '';
        const val = base * n;
        el.textContent = (Number.isInteger(val) ? val : val.toFixed(0)) + unit;
      });
      const portionLabel = document.getElementById('modal-portion-label');
      if (portionLabel) portionLabel.textContent = n === 1 ? '1 portion' : '4 portions';
    }
  }

  function filterRecettes(btn, cat) {
    document.querySelectorAll('.recette-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.recette-card').forEach(card => {
      if (cat === 'all') { card.style.display = ''; return; }
      const cardCat = card.dataset.cat || '';
      card.style.display = cardCat.includes(cat) ? '' : 'none';
    });
  }

  function openRecette(id) {
    const r = recettesData[id];
    if (!r) return;
    const n = currentPortions;
    const portionLabel = n === 1 ? '1 portion' : '4 portions';

    const ingrHtml = r.ingredients.map(([name, qty, unit]) => {
      const val = qty * n;
      const displayed = Number.isInteger(val) ? val : val.toFixed(1);
      return `<li><span>${name}</span><span class="ing-qty modal-ing-qty" data-base="${qty}" data-unit="${unit}">${displayed} ${unit}</span></li>`;
    }).join('');

    const stepsHtml = r.steps.map(s => `<li>${s}</li>`).join('');

    const mp = r.macros;
    const macroHtml = `
      <div class="modal-macro-row">
        <div class="modal-macro-box" style="background:#FDE8E0"><span class="val modal-macro-val" data-base="${mp.p[0]}" data-unit="${mp.p[1]}">${mp.p[0]*n}${mp.p[1]}</span><span class="lbl">Protéines</span></div>
        <div class="modal-macro-box" style="background:#FFF3E0"><span class="val modal-macro-val" data-base="${mp.g[0]}" data-unit="${mp.g[1]}">${mp.g[0]*n}${mp.g[1]}</span><span class="lbl">Glucides</span></div>
        <div class="modal-macro-box" style="background:#E8F0E6"><span class="val modal-macro-val" data-base="${mp.l[0]}" data-unit="${mp.l[1]}">${mp.l[0]*n}${mp.l[1]}</span><span class="lbl">Lipides</span></div>
        <div class="modal-macro-box" style="background:#EDE8F5"><span class="val modal-macro-val" data-base="${mp.k[0]}" data-unit="${mp.k[1]}">${mp.k[0]*n}${mp.k[1]}</span><span class="lbl">Kcal</span></div>
      </div>`;

    document.getElementById('modal-content').innerHTML = `
      <div style="font-size:52px; text-align:center; margin-bottom:12px;">${r.emoji}</div>
      <div style="text-align:center; font-size:11px; color:var(--warm-gray); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:8px;">${r.cat} · ⏱ ${r.time}</div>
      <h2 style="font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:400; text-align:center; color:var(--charcoal); margin-bottom:4px;">${r.title}</h2>
      <div style="text-align:center; font-size:12px; color:var(--terracotta); font-weight:500;" id="modal-portion-label">Macros pour ${portionLabel}</div>
      ${macroHtml}
      <div style="height:1px; background:var(--gold-light); margin:4px 0 20px;"></div>
      <h4 style="font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.12em; color:var(--warm-gray); margin-bottom:10px;">Ingrédients · ${portionLabel}</h4>
      <ul class="ingredients-list">${ingrHtml}</ul>
      <div style="height:1px; background:var(--gold-light); margin:20px 0;"></div>
      <h4 style="font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.12em; color:var(--warm-gray); margin-bottom:10px;">Préparation</h4>
      <ol class="steps-list">${stepsHtml}</ol>
      <div class="modal-tip">${r.tip}</div>
    `;

    const modal = document.getElementById('recette-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeRecette() {
    document.getElementById('recette-modal').style.display = 'none';
    document.body.style.overflow = '';
  }

  document.getElementById('recette-modal').addEventListener('click', function(e) {
    if (e.target === this) closeRecette();
  });

  // Fonction de déconnexion
  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
    
    console.log('✅ Déconnexion réussie');
    window.location.href = '/login/';
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.querySelector('.nav-toggle');
    
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  }

  // Close mobile menu when clicking on a nav item
  document.querySelectorAll('.nav-links button').forEach(button => {
    button.addEventListener('click', () => {
      if (window.innerWidth <= 968) {
        const navLinks = document.getElementById('navLinks');
        const navToggle = document.querySelector('.nav-toggle');
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  });
