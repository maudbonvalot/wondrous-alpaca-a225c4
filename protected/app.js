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
    },
    'bowl-saumon-miel-harissa': {
      cats: ['dejeuner', 'diner'],
      gradient: 'linear-gradient(135deg, #FDE8D8, #F5A88A)',
      desc: "Cubes de saumon laqués miel-harissa, pois chiches croustillants et sauce tahini. Le bowl méditerranéen complet du programme.",
      title: "Bowl méditerranéen saumon miel-harissa",
      emoji: "🥙",
      time: "30 min",
      cat: "☀️ Déjeuner / 🌙 Dîner",
      macros: { p: [46, "g"], g: [64, "g"], l: [28, "g"], k: [720, ""] },
      ingredients: [
        ["Pavé de saumon (en cubes)", 170, "g"],
        ["Pois chiches égouttés", 120, "g"],
        ["Riz jasmin cuit", 80, "g"],
        ["Harissa", 1, "c.à.s"],
        ["Miel", 0.5, "c.à.s"],
        ["Tahini", 1.5, "c.à.s"],
        ["Citron", 0.5, "pièce"],
        ["Feta émiettée", 20, "g"],
        ["Tomates cerises", 75, "g"],
        ["Concombre", 0.25, "pièce"],
      ],
      steps: [
        "Faire dorer les pois chiches à la poêle avec paprika et cumin 10-12 min jusqu'à croustillant.",
        "Fouetter le tahini avec citron, ail, eau tiède et sel jusqu'à sauce lisse.",
        "Enrober les cubes de saumon du mélange harissa-miel-citron.",
        "Saisir les cubes 2 min par face jusqu'à caramélisation, cœur juste cuit.",
        "Dresser le riz, disposer saumon, pois chiches, crudités et feta en sections, napper de tahini.",
      ],
      tip: "💡 Sers avec des herbes fraîches (aneth, persil) et un quartier de citron — c'est ce qui fait tout le bowl.",
    },
    'poulet-citron-ail-legumes-rotis': {
      cats: ['diner'],
      gradient: 'linear-gradient(135deg, #FFF8D8, #F0D890)',
      desc: "Poulet doré au citron et à l'ail, brocoli et carottes rôtis au four. Simple, digeste et plein de saveurs naturelles.",
      title: "Poulet citron-ail & légumes rôtis",
      emoji: "🍋",
      time: "35 min",
      cat: "🌙 Dîner",
      macros: { p: [44, "g"], g: [24, "g"], l: [25, "g"], k: [520, ""] },
      ingredients: [
        ["Haut de cuisse de poulet", 150, "g"],
        ["Brocoli en fleurettes", 150, "g"],
        ["Carottes", 2, "pièces"],
        ["Citron", 2, "tranches"],
        ["Ail", 3, "gousses"],
        ["Huile d'olive", 1, "c.à.s"],
        ["Persil frais", 1, "c.à.s"],
      ],
      steps: [
        "Masser le poulet avec ail, citron, huile, sel et poivre.",
        "Rôtir brocoli et carottes au four jusqu'à caramélisation — le rôtissage révèle leur douceur.",
        "Cuire le poulet au four ou au gril jusqu'à ce qu'il soit juteux et doré.",
        "Presser du citron frais sur l'ensemble encore chaud.",
        "Parsemer de persil et de poivre concassé avant de servir.",
      ],
      tip: "💡 Le citron pressé à chaud remplace toute sauce lourde — saveur maximale, zéro superflu.",
    },
    'poisson-blanc-citron-capres': {
      cats: ['diner'],
      gradient: 'linear-gradient(135deg, #E8F0F5, #A8C4D8)',
      desc: "Poisson blanc confit à l'huile d'olive, citron et câpres. Le dîner « restaurant » de semaine : 36g de protéines pour 340 kcal.",
      title: "Poisson blanc citron-câpres à l'huile d'olive",
      emoji: "🐠",
      time: "25 min",
      cat: "🌙 Dîner",
      macros: { p: [36, "g"], g: [4, "g"], l: [20, "g"], k: [340, ""] },
      ingredients: [
        ["Filet de poisson blanc (cabillaud, lieu)", 180, "g"],
        ["Huile d'olive de qualité", 1.5, "c.à.s"],
        ["Citron (moitié jus, moitié rondelles)", 0.5, "pièce"],
        ["Câpres égouttées", 1, "c.à.s"],
        ["Persil plat ciselé", 1, "c.à.s"],
        ["Fleur de sel, poivre noir", 1, "pincée"],
      ],
      steps: [
        "Éponger soigneusement le poisson — c'est le secret d'une texture délicate, pas aqueuse.",
        "Saler, poivrer et déposer le filet dans un petit plat allant au four.",
        "Verser huile et jus de citron, parsemer de câpres, poser les rondelles de citron.",
        "Cuire à 200°C pendant 12-15 min, jusqu'à ce que la chair se détache à la fourchette.",
        "Arroser le filet de l'huile citronnée tiède du plat, finir persil et fleur de sel.",
      ],
      tip: "💡 Prépare l'huile citron-câpres 1h à l'avance : le dîner sera prêt en 15 min. Sers avec haricots blancs ou salade verte.",
    },
    'toast-avocat-sardines': {
      cats: ['dejeuner'],
      gradient: 'linear-gradient(135deg, #E8F5E0, #B8D8A0)',
      desc: "Pain au levain grillé, avocat écrasé et sardines entières. Plus de nutriments que la plupart des déjeuners — en 8 minutes.",
      title: "Toast avocat-sardines",
      emoji: "🥑",
      time: "8 min",
      cat: "☀️ Déjeuner",
      macros: { p: [22, "g"], g: [28, "g"], l: [26, "g"], k: [420, ""] },
      ingredients: [
        ["Pain au levain (tranche épaisse)", 1, "pièce"],
        ["Avocat", 0.5, "pièce"],
        ["Sardines à l'huile d'olive", 120, "g"],
        ["Citron", 0.5, "pièce"],
        ["Ail", 1, "gousse"],
        ["Piment en flocons, persil", 1, "pincée"],
      ],
      steps: [
        "Griller le pain bien croustillant.",
        "Frotter la gousse d'ail coupée sur le toast chaud.",
        "Écraser l'avocat avec citron, sel et poivre — le laisser bien texturé.",
        "Tartiner généreusement, poser les sardines presque entières dessus.",
        "Arroser d'une cuillère d'huile de la boîte, finir piment, persil et fleur de sel.",
      ],
      tip: "💡 Les sardines sont la source d'oméga-3 la moins chère et la plus concentrée, avec calcium et vitamine D en bonus.",
    },
    'bowl-soba-miso-champignons': {
      cats: ['diner'],
      gradient: 'linear-gradient(135deg, #EDE8E0, #C0B0A0)',
      desc: "Bouillon miso-gingembre, champignons saisis et œufs mollets. L'anti-inflammatoire qui agit à trois niveaux à la fois.",
      title: "Bowl soba miso-champignons",
      emoji: "🍜",
      time: "25 min",
      cat: "🌙 Dîner",
      macros: { p: [28, "g"], g: [62, "g"], l: [22, "g"], k: [540, ""] },
      ingredients: [
        ["Nouilles soba", 75, "g"],
        ["Champignons variés", 125, "g"],
        ["Bouillon", 500, "ml"],
        ["Miso blanc", 1, "c.à.s"],
        ["Gingembre râpé", 0.5, "c.à.s"],
        ["Ail émincé", 1, "gousse"],
        ["Œufs", 2, "pièces"],
        ["Edamamés", 60, "g"],
        ["Huile de sésame", 0.5, "c.à.c"],
      ],
      steps: [
        "Cuire les œufs 6 min 30 puis les plonger dans l'eau glacée.",
        "Cuire les soba, égoutter et rincer à l'eau froide.",
        "Saisir les champignons à feu vif sans les toucher 3 min — c'est l'étape qui compte.",
        "Chauffer le bouillon, délayer le miso avec une louche de bouillon tiède avant de reverser.",
        "Ajouter gingembre, ail et soja, frémir 5 min sans bouillir fort pour préserver les ferments vivants.",
        "Assembler : nouilles, edamamés, bouillon, champignons, œufs coupés, oignons nouveaux et sésame.",
      ],
      tip: "💡 Le miso apporte des probiotiques vivants, gingembre et ail sont anti-inflammatoires directs, les champignons fournissent des bêta-glucanes. Le bouillon se garde 4 jours.",
    },
    'bowl-poulet-coco-curcuma': {
      cats: ['diner'],
      gradient: 'linear-gradient(135deg, #FFF3D8, #F0C070)',
      desc: "Poulet mijoté au lait de coco et curcuma. Le goût d'un plat réconfort, l'effet d'un soin anti-inflammatoire.",
      title: "Bowl poulet coco-curcuma",
      emoji: "🍛",
      time: "35 min",
      cat: "🌙 Dîner",
      macros: { p: [42, "g"], g: [35, "g"], l: [34, "g"], k: [620, ""] },
      ingredients: [
        ["Blanc de poulet en morceaux", 250, "g"],
        ["Lait de coco entier", 200, "ml"],
        ["Riz complet cuit", 120, "g"],
        ["Oignon", 0.5, "pièce"],
        ["Ail", 2, "gousses"],
        ["Gingembre râpé", 0.5, "c.à.s"],
        ["Curcuma", 1, "c.à.c"],
        ["Curry en poudre", 0.5, "c.à.c"],
        ["Poivre noir", 0.25, "c.à.c"],
        ["Carotte, poivron, brocoli", 200, "g"],
      ],
      steps: [
        "Éponger le poulet et saler — c'est ce qui le fait dorer.",
        "Le faire dorer 4 min, réserver. Cuire l'oignon dans la même poêle 4 min.",
        "Ajouter ail, gingembre, curcuma, curry et poivre, 1 min pour révéler les épices.",
        "Verser le lait de coco, remettre le poulet avec ses jus.",
        "Ajouter carottes et poivron, mijoter 15 min ; brocoli les 5 dernières minutes.",
        "Servir sur le riz avec oignons nouveaux et coriandre.",
      ],
      tip: "💡 Le curcuma est l'un des anti-inflammatoires les plus étudiés — et le poivre noir multiplie son absorption par 20. Encore meilleur le lendemain.",
    },
    'chili-dinde-proteine': {
      cats: ['dejeuner', 'diner'],
      gradient: 'linear-gradient(135deg, #FDE0D8, #E89880)',
      desc: "Dinde maigre, haricots noirs et jalapeño, finis au yaourt grec. Protéines + fibres : le duo satiété et glycémie stable.",
      title: "Chili de dinde protéiné",
      emoji: "🌶️",
      time: "30 min",
      cat: "☀️ Déjeuner / 🌙 Dîner",
      macros: { p: [42, "g"], g: [29, "g"], l: [18, "g"], k: [470, ""] },
      ingredients: [
        ["Dinde hachée maigre", 150, "g"],
        ["Haricots noirs égouttés", 80, "g"],
        ["Tomates concassées", 150, "g"],
        ["Oignon", 0.5, "pièce"],
        ["Jalapeño émincé", 1, "pièce"],
        ["Fromage râpé", 25, "g"],
        ["Yaourt grec", 2, "c.à.s"],
        ["Épices chili", 1, "c.à.c"],
        ["Coriandre fraîche", 1, "c.à.s"],
      ],
      steps: [
        "Faire bien dorer la dinde — la caramélisation construit la base de saveur du chili.",
        "Ajouter oignon et jalapeño, cuire jusqu'à ce qu'ils soient fondants et parfumés.",
        "Incorporer tomates, haricots et épices.",
        "Laisser mijoter doucement jusqu'à consistance épaisse — le chili gagne toujours avec le temps.",
        "Servir avec fromage, yaourt grec et coriandre fraîche.",
      ],
      tip: "💡 Double les quantités : le chili est encore meilleur réchauffé et se congèle parfaitement.",
    },
    'bowl-riz-poulet-legumes-arc-en-ciel': {
      cats: ['dejeuner'],
      gradient: 'linear-gradient(135deg, #E8F0FD, #A8C0E8)',
      desc: "Poulet grillé, riz complet et légumes multicolores sautés. De l'énergie stable et ta dose de légumes de la journée.",
      title: "Bowl riz poulet & légumes arc-en-ciel",
      emoji: "🍚",
      time: "25 min",
      cat: "☀️ Déjeuner",
      macros: { p: [42, "g"], g: [41, "g"], l: [15, "g"], k: [495, ""] },
      ingredients: [
        ["Aiguillettes de poulet", 150, "g"],
        ["Riz complet cuit", 120, "g"],
        ["Poivron rouge", 0.5, "pièce"],
        ["Poivron jaune", 0.5, "pièce"],
        ["Brocoli en fleurettes", 80, "g"],
        ["Haricots verts", 60, "g"],
        ["Huile d'olive", 1, "c.à.c"],
      ],
      steps: [
        "Préparer le riz à l'avance — une base tiède accueille mieux les légumes.",
        "Assaisonner généreusement le poulet et le griller jusqu'à belle coloration.",
        "Sauter poivrons, brocoli et haricots verts al dente : la texture fait la satiété.",
        "Laisser reposer le poulet avant de le trancher pour garder le jus.",
        "Dresser le riz, disposer les légumes autour, poser le poulet et poivrer.",
      ],
      tip: "💡 Varie les couleurs de légumes chaque semaine : chaque pigment apporte ses propres antioxydants.",
    },
    'salade-jardiniere-saumon-avocat': {
      cats: ['dejeuner'],
      gradient: 'linear-gradient(135deg, #E8F5E8, #90C8A0)',
      desc: "Saumon croustillant, avocat et tomates rôties sur lit de jeunes pousses. Rassasiant sans glucides lourds.",
      title: "Salade jardinière saumon-avocat",
      emoji: "🥬",
      time: "20 min",
      cat: "☀️ Déjeuner",
      macros: { p: [38, "g"], g: [14, "g"], l: [34, "g"], k: [530, ""] },
      ingredients: [
        ["Pavé de saumon", 150, "g"],
        ["Avocat", 0.5, "pièce"],
        ["Jeunes pousses", 40, "g"],
        ["Concombre", 0.5, "pièce"],
        ["Tomates cerises rôties", 75, "g"],
        ["Oignon rouge", 0.25, "pièce"],
        ["Basilic frais", 6, "feuilles"],
        ["Huile d'olive", 1, "c.à.c"],
      ],
      steps: [
        "Éponger le saumon et bien l'assaisonner — c'est le secret de la croûte dorée.",
        "Le saisir jusqu'à ce qu'il soit croustillant dehors, tendre et nacré dedans.",
        "Rôtir les tomates cerises jusqu'à ce qu'elles confisent : elles remplacent la sauce.",
        "Disposer les pousses, ranger concombre, avocat et oignon autour.",
        "Placer le saumon au centre, parsemer de basilic et arroser d'un filet d'huile.",
      ],
      tip: "💡 Oméga-3 du saumon + bonnes graisses de l'avocat : le combo cœur-cerveau-hormones par excellence.",
    },
    'bowl-poulet-ail-herbes-patate-douce': {
      cats: ['diner'],
      gradient: 'linear-gradient(135deg, #FDE8D0, #E8A870)',
      desc: "Poulet aux herbes, patate douce rôtie et broccolini grillé. Des glucides lents qui préviennent les coups de fatigue.",
      title: "Bowl poulet ail-herbes & patate douce",
      emoji: "🍠",
      time: "35 min",
      cat: "🌙 Dîner",
      macros: { p: [46, "g"], g: [34, "g"], l: [18, "g"], k: [510, ""] },
      ingredients: [
        ["Blanc de poulet", 150, "g"],
        ["Patate douce", 1, "pièce"],
        ["Broccolini (ou brocoli)", 100, "g"],
        ["Oignon rouge", 0.5, "pièce"],
        ["Ail", 3, "gousses"],
        ["Huile d'olive", 1, "c.à.s"],
        ["Herbes séchées", 1, "c.à.c"],
      ],
      steps: [
        "Enrober patate douce en quartiers, oignon et ail d'huile et d'assaisonnement.",
        "Rôtir au four jusqu'à caramélisation fondante — bien plus de goût qu'à la vapeur.",
        "Assaisonner le poulet aux herbes et le cuire jusqu'à belle dorure.",
        "Griller le broccolini jusqu'à ce que les bords croustillent.",
        "Dresser les légumes puis le poulet tranché, finir fleur de sel et poivre du moulin.",
      ],
      tip: "💡 La patate douce libère son énergie lentement : idéale le soir pour un sommeil stable et sans fringale nocturne.",
    },
    'bowl-quinoa-poulet-coriandre': {
      cats: ['dejeuner'],
      gradient: 'linear-gradient(135deg, #F0F5E0, #C0D890)',
      desc: "Poulet grillé, quinoa, avocat et sauce crémeuse coriandre-citron vert au yaourt grec. 48g de protéines par bol.",
      title: "Bowl quinoa poulet & sauce coriandre",
      emoji: "🌿",
      time: "30 min",
      cat: "☀️ Déjeuner",
      macros: { p: [48, "g"], g: [36, "g"], l: [22, "g"], k: [540, ""] },
      ingredients: [
        ["Blanc de poulet", 150, "g"],
        ["Quinoa cuit", 120, "g"],
        ["Tomates cerises rôties", 75, "g"],
        ["Maïs", 40, "g"],
        ["Avocat", 0.5, "pièce"],
        ["Yaourt grec", 2, "c.à.s"],
        ["Coriandre fraîche", 1, "c.à.s"],
        ["Citron vert", 1, "c.à.c"],
        ["Oignon vert", 1, "pièce"],
      ],
      steps: [
        "Assaisonner simplement le poulet : sel et poivre suffisent, le bol fait le reste.",
        "Le griller 5-6 min par face jusqu'à dorure profonde.",
        "Rôtir les tomates cerises pour concentrer leur sucre naturel.",
        "Fouetter yaourt grec, coriandre, citron vert et sel en sauce onctueuse.",
        "Dresser quinoa, avocat, maïs et tomates, poser le poulet tranché.",
        "Napper généreusement de sauce et parsemer d'oignon vert.",
      ],
      tip: "💡 La sauce yaourt-coriandre remplace n'importe quelle sauce du commerce : protéines en plus, additifs en moins.",
    },
    'bowl-riz-crevettes-avocat': {
      cats: ['dejeuner', 'diner'],
      gradient: 'linear-gradient(135deg, #FDE8F0, #E8A0C0)',
      desc: "Tout le plaisir d'un poke bowl, sans la file d'attente ni le prix. Prêt dans le temps de cuisson des crevettes.",
      title: "Bowl riz crevettes-avocat",
      emoji: "🍤",
      time: "10 min",
      cat: "☀️ Déjeuner / 🌙 Dîner",
      macros: { p: [32, "g"], g: [48, "g"], l: [20, "g"], k: [520, ""] },
      ingredients: [
        ["Crevettes décortiquées", 150, "g"],
        ["Riz blanc cuit", 100, "g"],
        ["Avocat tranché", 0.5, "pièce"],
        ["Edamamés", 60, "g"],
        ["Chou rouge émincé", 30, "g"],
        ["Gingembre mariné", 1, "c.à.c"],
        ["Sauce soja", 1, "c.à.s"],
        ["Graines de sésame", 1, "c.à.c"],
      ],
      steps: [
        "Éponger les crevettes et les saisir 90 secondes par face, juste rosées et en « C » souple — dès qu'elles se referment en cercle, c'est trop cuit.",
        "Étaler le riz dans le bol comme base.",
        "Disposer crevettes, avocat, edamamés et chou rouge en sections séparées, façon poke.",
        "Glisser le gingembre mariné, arroser de soja et parsemer de sésame.",
      ],
      tip: "💡 Utilise du riz froid de la veille : le bol devient un vrai déjeuner de 10 minutes chrono. Tranche l'avocat au dernier moment.",
    },
    'power-bowl-saumon-mediterraneen': {
      cats: ['dejeuner', 'diner'],
      gradient: 'linear-gradient(135deg, #E8F0E8, #A0B890)',
      desc: "Saumon, œufs mollets, pommes de terre rôties et olives. Protéines, oméga-3 et fibres réunis dans un seul bol.",
      title: "Power bowl saumon méditerranéen",
      emoji: "🫒",
      time: "30 min",
      cat: "☀️ Déjeuner / 🌙 Dîner",
      macros: { p: [42, "g"], g: [34, "g"], l: [29, "g"], k: [590, ""] },
      ingredients: [
        ["Pavé de saumon", 150, "g"],
        ["Pommes de terre grenaille", 125, "g"],
        ["Haricots verts", 100, "g"],
        ["Œufs", 2, "pièces"],
        ["Jeunes pousses d'épinards", 30, "g"],
        ["Tomates cerises", 75, "g"],
        ["Olives mélangées", 40, "g"],
        ["Huile d'olive vierge extra", 1.5, "c.à.s"],
        ["Citron + moutarde de Dijon", 1, "c.à.c"],
      ],
      steps: [
        "Rôtir les pommes de terre coupées à 220°C, 25 min en une seule couche pour des bords croustillants.",
        "Cuire les œufs 6 min 30 pour un jaune coulant, puis eau glacée.",
        "Blanchir les haricots verts 3 min dans la même eau, rincer froid.",
        "Éponger le saumon, assaisonner et cuire au four à 200°C, 10-12 min.",
        "Émulsionner huile, citron, dijon et ail en vinaigrette.",
        "Dresser sur les épinards : pommes de terre, haricots, tomates et olives en sections, saumon effeuillé, œufs coupés au centre, vinaigrette généreuse.",
      ],
      tip: "💡 L'huile d'olive contient de l'oléocanthal, qui agit sur l'inflammation comme un anti-inflammatoire naturel. Pommes de terre, œufs et vinaigrette se préparent 4 jours à l'avance.",
    },
    'porridge-proteine-choco-cacahuete': {
      cats: ['petitdej'],
      gradient: 'linear-gradient(135deg, #F0E0D8, #C09880)',
      desc: "Porridge crémeux chocolat-beurre de cacahuète, 38g de protéines. Le petit-déjeuner gourmand qui tient jusqu'au déjeuner.",
      title: "Porridge protéiné choco-cacahuète",
      emoji: "🍫",
      time: "10 min",
      cat: "🌅 Petit-déjeuner",
      macros: { p: [38, "g"], g: [60, "g"], l: [18, "g"], k: [520, ""] },
      ingredients: [
        ["Flocons d'avoine", 60, "g"],
        ["Lait (au choix)", 250, "ml"],
        ["Protéine vanille", 30, "g"],
        ["Cannelle", 1, "pincée"],
        ["Banane", 0.5, "pièce"],
        ["Myrtilles", 50, "g"],
        ["Graines de grenade", 40, "g"],
        ["Beurre de cacahuète", 15, "g"],
        ["Chocolat noir concassé", 10, "g"],
      ],
      steps: [
        "Chauffer avoine et lait à feu moyen 4-5 min en remuant, jusqu'à épaississement.",
        "Couper le feu et attendre 1 minute — l'étape clé à ne pas sauter.",
        "Incorporer la protéine en poudre ; trop épais ? Un trait de lait.",
        "Verser dans un bol et disposer les toppings en sections.",
        "Passer le beurre de cacahuète 10 secondes au micro-ondes et le verser en filet, terminer par le chocolat.",
      ],
      tip: "💡 Meal prep : cuis 4 portions le dimanche, toppings en mini-bocaux séparés. Réchauffe avec un trait de lait — 4 matins tranquilles.",
    },
    'energy-bites-pistache-rose-datte': {
      cats: ['collation'],
      gradient: 'linear-gradient(135deg, #FDE8EC, #E8B0C0)',
      desc: "Dattes, pistaches et une touche d'eau de rose. La collation élégante qui lisse les envies de sucre entre les repas.",
      title: "Energy bites pistache-rose-datte",
      emoji: "🌹",
      time: "15 min",
      cat: "🍎 Collation",
      macros: { p: [6, "g"], g: [30, "g"], l: [12, "g"], k: [240, ""] },
      ingredients: [
        ["Dattes Medjool dénoyautées", 3, "pièces"],
        ["Pistaches décortiquées", 30, "g"],
        ["Tahini", 1, "c.à.s"],
        ["Vanille", 0.25, "c.à.c"],
        ["Eau de rose", 0.25, "c.à.c"],
        ["Cardamome", 1, "pincée"],
        ["Pétales de rose séchés (option)", 1, "pincée"],
      ],
      steps: [
        "Mixer dattes, deux tiers des pistaches, tahini, vanille, eau de rose, cardamome et sel 1-2 min jusqu'à pâte épaisse et collante.",
        "Trop sec ? Ajouter un peu d'huile de coco et mixer à nouveau.",
        "Façonner en 3 boules (12 pour 4 portions).",
        "Hacher finement le reste des pistaches et y rouler chaque boule.",
        "Presser un pétale de rose sur le dessus, réfrigérer 30 min. Se garde 1 semaine en boîte hermétique.",
      ],
      tip: "💡 Dattes + pistaches + une touche florale : la vraie alternative aux barres industrielles, sans additifs.",
    },
    'bowl-yaourt-chia-framboises': {
      cats: ['petitdej'],
      gradient: 'linear-gradient(135deg, #FDE0E8, #E890A8)',
      desc: "Yaourt grec, pudding de chia et framboises fraîches. Protéines, oméga-3 et fibres pour une matinée sans fringale.",
      title: "Bowl yaourt chia-framboises",
      emoji: "🍓",
      time: "10 min",
      cat: "🌅 Petit-déjeuner",
      macros: { p: [24, "g"], g: [29, "g"], l: [11, "g"], k: [340, ""] },
      ingredients: [
        ["Yaourt grec", 180, "g"],
        ["Graines de chia", 2, "c.à.s"],
        ["Lait", 125, "ml"],
        ["Framboises", 50, "g"],
        ["Flocons d'avoine", 25, "g"],
      ],
      steps: [
        "Mélanger les graines de chia au lait et réfrigérer jusqu'à texture de pudding (idéalement la veille).",
        "Étaler le yaourt grec dans un bol — la base crémeuse et protéinée.",
        "Déposer le pudding de chia à côté du yaourt, sans tout mélanger.",
        "Garnir généreusement de framboises : de la douceur sans excès de sucre.",
        "Parsemer de flocons d'avoine pour le croquant et la tenue.",
      ],
      tip: "💡 Prépare le pudding de chia la veille : le matin, le bol s'assemble en 2 minutes.",
    },
    'mousse-chocolat-proteinee': {
      cats: ['collation'],
      gradient: 'linear-gradient(135deg, #E8E0DC, #A89088)',
      desc: "Mousse chocolat au yaourt grec, 22g de protéines. L'envie de dessert, sans le crash glycémique derrière.",
      title: "Mousse chocolat protéinée",
      emoji: "🍮",
      time: "10 min + 30 min au frais",
      cat: "🍎 Collation",
      macros: { p: [22, "g"], g: [18, "g"], l: [18, "g"], k: [320, ""] },
      ingredients: [
        ["Yaourt grec entier", 85, "g"],
        ["Protéine chocolat", 15, "g"],
        ["Cacao en poudre", 0.5, "c.à.s"],
        ["Sirop d'érable", 0.5, "c.à.s"],
        ["Pépites de chocolat noir", 0.5, "c.à.s"],
        ["Éclats de fèves de cacao", 0.5, "c.à.c"],
        ["Fleur de sel", 1, "pincée"],
      ],
      steps: [
        "Verser le yaourt dans un bol.",
        "Tamiser cacao et protéine par-dessus pour éviter les grumeaux — la seule étape qui compte pour la texture.",
        "Fouetter énergiquement jusqu'à consistance lisse et brillante.",
        "Incorporer le sirop d'érable, goûter et ajuster.",
        "Répartir en verrine, garnir pépites, éclats de cacao et fleur de sel.",
        "Réfrigérer 30 min pour obtenir une vraie texture de mousse.",
      ],
      tip: "💡 Le chocolat noir est l'un des aliments les plus riches en polyphénols — et la fleur de sel le fait passer de « healthy » à « dessert ». Se garde 3 jours : prépares-en 4 le dimanche.",
    },
    'gratin-oeufs-poulet-batch': {
      cats: ['petitdej'],
      gradient: 'linear-gradient(135deg, #FFF0E0, #F0B888)',
      desc: "Une fournée le dimanche = 6 petits-déjeuners de la semaine. 45g de protéines par part, prêt en 90 secondes au micro-ondes.",
      title: "Gratin œufs-poulet « 1 fournée, 6 matins »",
      emoji: "🍳",
      time: "45 min",
      cat: "🌅 Petit-déjeuner",
      macros: { p: [45, "g"], g: [12, "g"], l: [20, "g"], k: [420, ""] },
      ingredients: [
        ["Poulet cuit en dés", 75, "g"],
        ["Œufs", 1.5, "pièces"],
        ["Blancs d'œuf", 50, "ml"],
        ["Épinards hachés", 30, "g"],
        ["Poivron (rouge/jaune) en dés", 0.3, "pièce"],
        ["Oignon", 0.2, "pièce"],
        ["Cheddar râpé", 20, "g"],
        ["Ail en poudre, paprika fumé", 0.25, "c.à.c"],
      ],
      steps: [
        "Préchauffer le four à 180°C et huiler (ou chemiser) un plat rectangulaire.",
        "Fouetter œufs, blancs, ail en poudre, paprika, sel et poivre dans un grand saladier.",
        "Ajouter poulet, épinards, poivrons et oignon, bien mélanger.",
        "Verser dans le plat, répartir le cheddar sur le dessus sans compter.",
        "Cuire 30-35 min — un couteau planté au centre doit ressortir propre.",
        "Laisser tiédir 10 min et découper en parts individuelles.",
      ],
      tip: "💡 En boîtes individuelles : 5 jours au frigo, 90 secondes au micro-ondes, un trait de sauce piquante. Se congèle aussi très bien.",
    },
    'pancakes-proteines-moelleux': {
      cats: ['petitdej'],
      gradient: 'linear-gradient(135deg, #FDF0D8, #E8C888)',
      desc: "Pancakes avoine-yaourt grec ultra moelleux, 35g de protéines. Le brunch du dimanche compatible avec ton programme.",
      title: "Pancakes protéinés moelleux",
      emoji: "🥞",
      time: "20 min",
      cat: "🌅 Petit-déjeuner",
      macros: { p: [35, "g"], g: [45, "g"], l: [14, "g"], k: [450, ""] },
      ingredients: [
        ["Flocons d'avoine", 60, "g"],
        ["Œufs", 2, "pièces"],
        ["Yaourt grec", 30, "g"],
        ["Levure chimique", 1, "c.à.c"],
        ["Vanille", 0.5, "c.à.c"],
        ["Yaourt grec (topping)", 120, "g"],
        ["Myrtilles fraîches", 80, "g"],
        ["Miel", 1, "c.à.c"],
      ],
      steps: [
        "Mixer les flocons d'avoine en farine.",
        "Ajouter œufs, yaourt, levure, vanille et sel, mixer jusqu'à pâte lisse.",
        "Laisser reposer la pâte 2-3 min — c'est la science des pancakes plus moelleux.",
        "Verser un quart de tasse de pâte par pancake dans une poêle chaude légèrement huilée.",
        "Attendre les bulles en surface (2-3 min de patience), retourner, cuire 1-2 min.",
        "Ne jamais presser avec la spatule ! Empiler haut, garnir yaourt, myrtilles et miel.",
      ],
      tip: "💡 Meal prep : fais-en 15, papier cuisson entre chaque, congèle. Petit-déj en 60 secondes au grille-pain — supériorité assumée face aux céréales.",
    }
  };

  // Photos des recettes (remplace une URL par ta propre photo si tu préfères)
  const RECETTE_IMAGES = {
    'bowl-proteine-fraise-ricotta': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=70',
    'omelette-printaniere-asperges-feta': 'https://www.themealdb.com/images/media/meals/yvpuuy1511797244.jpg',
    'salade-poulet-grille-quinoa': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=70',
    'bowl-saumon-avocat-riz-complet': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=70',
    'banana-bread-healthy-proteine': 'https://images.unsplash.com/photo-1632931057819-4eefffa8e007?w=600&q=70',
    'carrot-cake-healthy-light': 'https://www.themealdb.com/images/media/meals/vrspxv1511722107.jpg',
    'balls-proteinees-coco-datte': 'https://www.themealdb.com/images/media/meals/si2rty1763282314.jpg',
    'poulet-citron-herbes-legumes-vapeur': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=70',
    'crevettes-sautees-nouilles-courgettes': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=70',
    'cabillaud-papillote-petits-pois': 'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?w=600&q=70',
    'bowl-saumon-miel-harissa': 'https://images.unsplash.com/photo-1604259597308-5321e8e4789c?w=600&q=70',
    'poulet-citron-ail-legumes-rotis': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=70',
    'poisson-blanc-citron-capres': 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600&q=70',
    'toast-avocat-sardines': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=70',
    'bowl-soba-miso-champignons': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=70',
    'bowl-poulet-coco-curcuma': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=70',
    'chili-dinde-proteine': 'https://www.themealdb.com/images/media/meals/uuqvwu1504629254.jpg',
    'bowl-riz-poulet-legumes-arc-en-ciel': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=70',
    'salade-jardiniere-saumon-avocat': 'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=600&q=70',
    'bowl-poulet-ail-herbes-patate-douce': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&q=70',
    'bowl-quinoa-poulet-coriandre': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=70',
    'bowl-riz-crevettes-avocat': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=70',
    'power-bowl-saumon-mediterraneen': 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=600&q=70',
    'porridge-proteine-choco-cacahuete': 'https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=600&q=70',
    'energy-bites-pistache-rose-datte': 'https://www.themealdb.com/images/media/meals/dg7tad1782588053.jpg',
    'bowl-yaourt-chia-framboises': 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&q=70',
    'mousse-chocolat-proteinee': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=70',
    'gratin-oeufs-poulet-batch': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&q=70',
    'pancakes-proteines-moelleux': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=70',
  };
  Object.entries(RECETTE_IMAGES).forEach(([id, url]) => {
    if (recettesData[id]) recettesData[id].img = url;
  });

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
          ${r.img ? `<img class="recette-photo" src="${r.img}" alt="${r.title}" loading="lazy">` : `<span style="font-size:52px;">${r.emoji}</span>`}
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
      document.querySelectorAll('.modal-ing-portion').forEach(el => {
        el.textContent = n === 1 ? '1 portion' : '4 portions';
      });
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
      ${r.img ? `<div class="modal-photo"><img src="${r.img}" alt="${r.title}"></div>` : `<div style="font-size:52px; text-align:center; margin-bottom:12px;">${r.emoji}</div>`}
      <div style="text-align:center; font-size:11px; color:var(--warm-gray); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:8px;">${r.cat} · ⏱ ${r.time}</div>
      <h2 style="font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:400; text-align:center; color:var(--charcoal); margin-bottom:4px;">${r.title}</h2>
      <div style="text-align:center; font-size:12px; color:var(--terracotta); font-weight:500;" id="modal-portion-label">Macros pour ${portionLabel}</div>
      ${macroHtml}
      <div style="height:1px; background:var(--gold-light); margin:4px 0 20px;"></div>
      <h4 style="font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.12em; color:var(--warm-gray); margin-bottom:10px;">Ingrédients · <span class="modal-ing-portion">${portionLabel}</span></h4>
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
