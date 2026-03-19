function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
    document.getElementById('page-' + name).classList.add('active');
    document.getElementById('nav-' + name).classList.add('active');
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
    // Update modal if open
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

  const recettesData = {
    'bowl-skyr': {
      title: "Bowl Skyr Fruits Rouges",
      emoji: "🥣",
      time: "5 min",
      cat: "🌅 Petit-déjeuner",
      macros: { p: [25,"g"], g: [38,"g"], l: [6,"g"], k: [300,""] },
      ingredients: [
        ["Skyr nature", 150, "g"],
        ["Fruits rouges (frais ou surgelés)", 100, "g"],
        ["Flocons d\'avoine", 50, "g"],
        ["Graines de chia", 10, "g"],
        ["Graines de courge", 10, "g"],
        ["Miel (optionnel)", 5, "g"],
      ],
      steps: [
        "Verse le skyr dans un bol. Si tu utilises des fruits surgelés, décongèle-les 5 min au micro-ondes.",
        "Ajoute les flocons d\'avoine directement dans le skyr et mélange légèrement.",
        "Dispose les fruits rouges sur le dessus.",
        "Saupoudre les graines de chia et de courge.",
        "Ajoute le miel si tu veux une touche sucrée. Sers immédiatement.",
      ],
      tip: "💡 Prépare ton bowl la veille (overnight) en mettant les flocons dans le skyr au réfrigérateur — la texture sera encore meilleure le matin !",
    },
    'omelette': {
      title: "Omelette Épinards & Feta",
      emoji: "🍳",
      time: "8 min",
      cat: "🌅 Petit-déjeuner",
      macros: { p: [22,"g"], g: [4,"g"], l: [18,"g"], k: [260,""] },
      ingredients: [
        ["Oeufs entiers", 3, "pièces"],
        ["Épinards frais", 80, "g"],
        ["Feta émiettée", 30, "g"],
        ["Huile d\'olive", 5, "ml"],
        ["Sel, poivre, herbes", 1, "pincée"],
      ],
      steps: [
        "Bats les oeufs avec une pincée de sel et de poivre dans un bol.",
        "Fais chauffer l\'huile d\'olive à feu moyen dans une poêle antiadhésive.",
        "Ajoute les épinards et fais-les tomber 1-2 min jusqu\'à ce qu\'ils réduisent.",
        "Verse les oeufs sur les épinards. Laisse coaguler 1 min sans toucher.",
        "Émiette la feta sur la moitié de l\'omelette, puis rabats l\'autre moitié dessus.",
        "Sers immédiatement avec quelques herbes fraîches si tu en as.",
      ],
      tip: "💡 Pour encore plus de protéines : utilise 2 oeufs entiers + 2 blancs d\'oeufs. Tu passes à ~28g de protéines pour seulement 200 kcal.",
    },
    'saumon': {
      title: "Saumon Papillote Gingembre",
      emoji: "🐟",
      time: "20 min",
      cat: "☀️ Déjeuner / 🌙 Dîner",
      macros: { p: [34,"g"], g: [8,"g"], l: [14,"g"], k: [290,""] },
      ingredients: [
        ["Pavé de saumon frais", 150, "g"],
        ["Courgette", 100, "g"],
        ["Brocoli en fleurettes", 100, "g"],
        ["Gingembre frais râpé", 10, "g"],
        ["Sauce soja sans gluten (tamari)", 10, "ml"],
        ["Jus de citron", 15, "ml"],
        ["Graines de sésame", 5, "g"],
      ],
      steps: [
        "Préchauffe le four à 200°C. Découpe une grande feuille de papier sulfurisé.",
        "Dispose les légumes (courgette tranchée, brocoli) au centre de la feuille.",
        "Pose le pavé de saumon sur les légumes.",
        "Mélange gingembre râpé, sauce soja et jus de citron. Verse sur le saumon.",
        "Referme la papillote hermétiquement. Enfourne 15-18 min.",
        "Ouvre la papillote, saupoudre de sésame et sers immédiatement.",
      ],
      tip: "💡 En phase menstruelle ? Ajoute une pincée de curcuma et une rondelle de citron sur le saumon avant de fermer la papillote — effet anti-douleur naturel puissant.",
    },
    'bowl-quinoa': {
      title: "Bowl Quinoa Thon Avocat",
      emoji: "🥗",
      time: "10 min",
      cat: "☀️ Déjeuner",
      macros: { p: [38,"g"], g: [42,"g"], l: [16,"g"], k: [460,""] },
      ingredients: [
        ["Quinoa cuit", 150, "g"],
        ["Thon au naturel égoutté", 130, "g"],
        ["Avocat", 60, "g"],
        ["Salade verte ou roquette", 40, "g"],
        ["Tomates cerises", 50, "g"],
        ["Jus de citron", 15, "ml"],
        ["Huile d\'olive", 10, "ml"],
        ["Sel, poivre, herbes", 1, "pincée"],
      ],
      steps: [
        "Cuis le quinoa selon les instructions (ou utilise du quinoa précuit en sachet — 2 min micro-ondes).",
        "Dispose la salade dans un bol, puis le quinoa chaud.",
        "Émiette le thon par-dessus, tranche l\'avocat en lamelles.",
        "Ajoute les tomates cerises coupées en deux.",
        "Prépare la vinaigrette : citron + huile d\'olive + sel + herbes. Verse sur le bowl.",
        "Mélange légèrement avant de déguster.",
      ],
      tip: "💡 Prépare le quinoa en grande quantité le dimanche (batch cooking) et conserve-le 4 jours au frigo. Tu as des déjeuners prêts en 3 min toute la semaine.",
    },
    'poulet': {
      title: "Poulet Grillé & Patate Douce Rôtie",
      emoji: "🍗",
      time: "30 min",
      cat: "☀️ Déjeuner",
      macros: { p: [42,"g"], g: [35,"g"], l: [8,"g"], k: [380,""] },
      ingredients: [
        ["Blanc de poulet", 180, "g"],
        ["Patate douce", 160, "g"],
        ["Haricots verts ou brocoli", 120, "g"],
        ["Curcuma en poudre", 3, "g"],
        ["Paprika doux", 2, "g"],
        ["Huile d\'olive", 10, "ml"],
        ["Ail en poudre", 2, "g"],
        ["Jus de citron", 10, "ml"],
      ],
      steps: [
        "Préchauffe le four à 200°C. Épluche et coupe la patate douce en cubes de 2cm.",
        "Mélange les cubes avec l\'huile, le curcuma, le paprika, l\'ail. Étale sur une plaque. Enfourne 20-25 min.",
        "Pendant ce temps, aplatit légèrement le blanc de poulet avec la paume.",
        "Assaisonne avec curcuma, sel, poivre et un filet de citron. Fais griller à la poêle 5-6 min de chaque côté à feu moyen-vif.",
        "Fais cuire les haricots verts à la vapeur 5-7 min.",
        "Dresse : patate douce + poulet tranché + légumes. Arrose du jus de cuisson de la poêle.",
      ],
      tip: "💡 Le secret d\'un poulet moelleux : laisse-le reposer 3 min hors du feu avant de le trancher. Les jus se redistribuent et la chair reste juteuse.",
    },
    'soupe': {
      title: "Soupe Lentilles Corail Curcuma",
      emoji: "🍲",
      time: "25 min",
      cat: "🌙 Dîner",
      macros: { p: [18,"g"], g: [48,"g"], l: [5,"g"], k: [310,""] },
      ingredients: [
        ["Lentilles corail sèches", 100, "g"],
        ["Bouillon de légumes", 500, "ml"],
        ["Oignon", 80, "g"],
        ["Ail", 10, "g"],
        ["Curcuma en poudre", 5, "g"],
        ["Gingembre frais", 10, "g"],
        ["Lait de coco léger", 50, "ml"],
        ["Huile d\'olive", 5, "ml"],
        ["Jus de citron", 15, "ml"],
      ],
      steps: [
        "Rince les lentilles corail sous l\'eau froide.",
        "Fais revenir l\'oignon émincé dans l\'huile d\'olive 3 min. Ajoute l\'ail et le gingembre râpé.",
        "Ajoute le curcuma, mélange 30 secondes pour le faire torréfier légèrement.",
        "Verse les lentilles et le bouillon. Porte à ébullition puis laisse mijoter 15-18 min.",
        "Ajoute le lait de coco léger et le jus de citron. Mixe (ou laisse texturée selon ta préférence).",
        "Rectifie l\'assaisonnement. Sers avec quelques graines de courge sur le dessus.",
      ],
      tip: "💡 Idéale en phase menstruelle : les lentilles sont riches en fer, le curcuma est anti-douleur, le gingembre réchauffe. Prépares-en pour 3-4 jours et réchauffe au besoin.",
    },
    'pois-chiches': {
      title: "Pois Chiches Rôtis & Salade Verte",
      emoji: "🌿",
      time: "35 min",
      cat: "🌙 Dîner / ☀️ Déjeuner",
      macros: { p: [16,"g"], g: [40,"g"], l: [12,"g"], k: [330,""] },
      ingredients: [
        ["Pois chiches en boîte égouttés", 200, "g"],
        ["Salade verte (roquette ou mâche)", 60, "g"],
        ["Tomates cerises", 60, "g"],
        ["Concombre", 80, "g"],
        ["Huile d\'olive", 15, "ml"],
        ["Paprika fumé", 3, "g"],
        ["Cumin", 2, "g"],
        ["Jus de citron", 15, "ml"],
        ["Herbes fraîches", 10, "g"],
      ],
      steps: [
        "Préchauffe le four à 220°C. Égoutte et sèche très bien les pois chiches avec du papier absorbant — c\'est la clé du croustillant !",
        "Mélange les pois chiches avec 10ml d\'huile, paprika, cumin, sel. Étale sur une plaque en une seule couche.",
        "Enfourne 25-30 min en remuant à mi-cuisson. Ils doivent être bien dorés et croustillants.",
        "Pendant ce temps, prépare la salade : lave et essore, coupe les tomates et le concombre.",
        "Vinaigrette : 5ml huile d\'olive + jus de citron + sel + herbes.",
        "Dispose la salade, verse les pois chiches encore chauds dessus, arrose de vinaigrette.",
      ],
      tip: "💡 Les pois chiches rôtis se conservent 3 jours dans un bocal ouvert (pas de boîte hermétique sinon ils ramollissent). Prépares-en plus et utilise-les aussi comme snack.",
    },
    'pancakes': {
      title: "Pancakes Protéinés Sarrasin",
      emoji: "🥞",
      time: "15 min",
      cat: "🌅 Petit-déjeuner / 🍎 Collation",
      macros: { p: [20,"g"], g: [32,"g"], l: [7,"g"], k: [270,""] },
      ingredients: [
        ["Farine de sarrasin", 60, "g"],
        ["Skyr ou fromage blanc", 100, "g"],
        ["Oeuf entier", 1, "pièce"],
        ["Lait végétal non sucré", 60, "ml"],
        ["Levure chimique", 3, "g"],
        ["Vanille (optionnel)", 1, "pincée"],
        ["Fruits rouges (garniture)", 80, "g"],
      ],
      steps: [
        "Mélange la farine de sarrasin, la levure et la vanille dans un bol.",
        "Dans un autre bol, bats l\'oeuf avec le skyr et le lait végétal jusqu\'à obtenir un mélange homogène.",
        "Verse la préparation liquide sur les ingrédients secs. Mélange sans trop travailler la pâte (quelques grumeaux sont ok).",
        "Fais chauffer une poêle antiadhésive à feu moyen-doux. Pas besoin de matière grasse.",
        "Verse des petites louches de pâte (8-9cm de diamètre). Cuis 2 min jusqu\'à la formation de bulles, retourne, 1 min de l\'autre côté.",
        "Sers avec les fruits rouges et un filet de miel ou de skyr nature.",
      ],
      tip: "💡 La farine de sarrasin est naturellement sans gluten et a un index glycémique plus bas que la farine de blé — parfaite pour les femmes sensibles à l\'insuline.",
    },
    'collation-skyr': {
      title: "Collation Skyr & Graines",
      emoji: "🍓",
      time: "3 min",
      cat: "🍎 Collation",
      macros: { p: [17,"g"], g: [14,"g"], l: [5,"g"], k: [170,""] },
      ingredients: [
        ["Skyr nature", 150, "g"],
        ["Graines de courge", 10, "g"],
        ["Graines de lin moulues", 5, "g"],
        ["Fruits rouges", 50, "g"],
        ["Cannelle (optionnel)", 1, "pincée"],
      ],
      steps: [
        "Verse le skyr dans un petit bol ou un pot.",
        "Ajoute les fruits rouges par-dessus.",
        "Saupoudre les graines de courge et de lin.",
        "Une pincée de cannelle pour réguler la glycémie. Sers immédiatement.",
      ],
      tip: "💡 Prends cette collation 1h avant une séance de sport ou 2h avant le dîner. Les protéines du skyr évitent le pic de cortisol de fin d\'après-midi.",
    },
  };
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
    // Supprimer les tokens du localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
    
    console.log('✅ Déconnexion réussie');
    
    // Rediriger vers la page de login
    window.location.href = '/login/';
  }