// ── Portrait image fallback ──────────────────────────
const portraitImg = document.getElementById('portraitImg');
const portraitFallback = document.getElementById('portraitFallback');
if (portraitImg) {
  portraitImg.addEventListener('error', () => {
    portraitImg.style.display = 'none';
    if (portraitFallback) portraitFallback.style.display = '';
  });
  if (portraitImg.complete && !portraitImg.naturalWidth) {
    portraitImg.dispatchEvent(new Event('error'));
  }
}

// ── Navbar scroll ────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Scroll to top button ─────────────────────────────
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Scroll reveal ─────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Hamburger menu ────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileDrawer = document.getElementById('mobileDrawer');

function openMenu() {
  hamburger.classList.add('open');
  mobileOverlay.classList.add('open');
  mobileDrawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  hamburger.classList.remove('open');
  mobileOverlay.classList.remove('open');
  mobileDrawer.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});
mobileOverlay.addEventListener('click', closeMenu);

mobileDrawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    closeMenu();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
    }
  });
});

// ── Cursor glow ───────────────────────────────────────
const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ── Smooth nav links ──────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Pétales de fleurs — Canvas animation ─────────────
(function() {
  const canvas = document.getElementById('petals-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = [
    'rgba(123, 79, 173, 0.55)',
    'rgba(201, 174, 237, 0.65)',
    'rgba(92, 45, 138, 0.45)',
    'rgba(237, 225, 250, 0.7)',
    'rgba(180, 130, 220, 0.6)',
    'rgba(61, 26, 92, 0.35)',
    'rgba(215, 190, 245, 0.7)',
  ];

  function drawPetal(ctx, x, y, rx, ry, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -ry);
    ctx.bezierCurveTo(rx * 0.8, -ry * 0.5,  rx * 0.8,  ry * 0.5, 0,  ry);
    ctx.bezierCurveTo(-rx * 0.8,  ry * 0.5, -rx * 0.8, -ry * 0.5, 0, -ry);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -ry);
    ctx.lineTo(0, ry);
    ctx.strokeStyle = color.replace(/[\d.]+\)$/, '0.3)');
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
  }

  class Petal {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * canvas.width;
      this.y = init ? Math.random() * canvas.height : -30;
      this.rx = 6 + Math.random() * 9;
      this.ry = 10 + Math.random() * 14;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.04;
      this.vy = 0.6 + Math.random() * 1.2;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = 0;
      this.fadeIn = true;
      this.oscillate = (Math.random() - 0.5) * 0.3;
      this.t = Math.random() * 100;
    }
    update() {
      this.t += 0.02;
      this.x += this.vx + Math.sin(this.t) * this.oscillate;
      this.y += this.vy;
      this.angle += this.spin;
      if (this.fadeIn && this.alpha < 0.9) this.alpha = Math.min(0.9, this.alpha + 0.02);
      if (this.y > canvas.height + 40) this.reset(false);
    }
    draw() {
      ctx.globalAlpha = this.alpha;
      drawPetal(ctx, this.x, this.y, this.rx, this.ry, this.angle, this.color);
      ctx.globalAlpha = 1;
    }
  }

  const petals = Array.from({ length: 28 }, () => new Petal());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── Filtre boutique ───────────────────────────────────
function filterProduits(btn, cat) {
  document.querySelectorAll('.bfilter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.produit-card').forEach(card => {
    const match = cat === 'tous' || card.dataset.cat === cat;
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    if (match) {
      card.style.opacity = '1';
      card.style.transform = '';
      card.style.display = 'flex';
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.96)';
      setTimeout(() => {
        if (card.dataset.cat !== cat && cat !== 'tous') card.style.display = 'none';
      }, 300);
    }
  });
}

// ── Modale produit ────────────────────────────────────
const modalOverlay = document.getElementById('modalOverlay');

const produitsData = {
  'creme-eclat-naturel': {
    cat: 'Soin visage', name: 'Crème Éclat Naturel',
    desc: "Hydratation intense enrichie en beurre de karité et huile d'argan. Peau lumineuse dès la première application.",
    img: 'assets/images/cosmetiques/creme-visage.jpg',
    prix: '4 500 FCFA', prixOld: '5 500 FCFA', stars: 5, avis: 24,
    details: [['Contenance','50 ml'],['Type de peau','Tous types'],['Usage','Matin & soir']]
  },
  'serum-eclat-unifiant': {
    cat: 'Soin visage', name: 'Sérum Éclat Unifiant',
    desc: "Formule concentrée à la vitamine C pour unifier le teint et réduire les taches. Texture légère, absorption rapide.",
    img: 'assets/images/cosmetiques/serum-eclat.jpg',
    prix: '6 200 FCFA', stars: 4, avis: 18,
    details: [['Contenance','30 ml'],['Type de peau','Mixte / Grasse'],['Usage','Matin']]
  },
  'masque-nuit-reparateur': {
    cat: 'Soin visage', name: 'Masque Nuit Réparateur',
    desc: "Soin intensif nocturne à l'aloe vera et à l'huile de rose musquée. Peau régénérée au réveil.",
    img: 'assets/images/cosmetiques/masque-nuit.jpg',
    prix: '5 800 FCFA', stars: 5, avis: 31,
    details: [['Contenance','75 ml'],['Type de peau','Sèche / Sensible'],['Usage','Nuit']]
  },
  'huile-soyeuse-corps': {
    cat: 'Soin corps', name: 'Huile Soyeuse Corps',
    desc: "Mélange précieux d'huiles végétales — coco, jojoba et amande douce — pour une peau veloutée et nourrie.",
    img: 'assets/images/cosmetiques/huile-corps.jpg',
    prix: '3 800 FCFA', stars: 5, avis: 42,
    details: [['Contenance','100 ml'],['Texture','Huile sèche'],['Usage','Après douche']]
  },
  'lotion-karite-fondante': {
    cat: 'Soin corps', name: 'Lotion Karité Fondante',
    desc: "Texture crémeuse ultra-nourrissante au karité pur d'Afrique de l'Ouest. Hydratation longue durée pour tous types de peau.",
    img: 'assets/images/cosmetiques/lotion-corps.jpg',
    prix: '3 200 FCFA', prixOld: '4 000 FCFA', stars: 4, avis: 19,
    details: [['Contenance','200 ml'],['Type de peau','Sèche / Très sèche'],['Usage','Matin & soir']]
  },
  'gommage-sucre-coco': {
    cat: 'Soin corps', name: 'Gommage Sucre & Coco',
    desc: "Exfoliant doux naturel à la noix de coco et au sucre de canne. Élimine les cellules mortes et révèle l'éclat de la peau.",
    img: 'assets/images/cosmetiques/gommage-corps.jpg',
    prix: '4 100 FCFA', stars: 5, avis: 11,
    details: [['Contenance','150 g'],['Fréquence','1 à 2× / semaine'],['Usage','Sous la douche']]
  },
  'rose-oud-mystique': {
    cat: 'Parfum · Eau de parfum', name: 'Rose & Oud Mystique',
    desc: 'Un sillage envoûtant qui dure toute la journée. Composition orientale de caractère avec une féminité affirmée.',
    img: 'assets/images/cosmetiques/parfum-rose-oud.jpg',
    prix: '12 500 FCFA', prixOld: '15 000 FCFA', stars: 5, avis: 38,
    details: [['Notes de tête','Rose de Damas'],['Notes de cœur','Oud précieux'],['Notes de fond','Musc blanc'],['Contenance','50 ml']]
  },
  'vanille-ambre-dore': {
    cat: 'Parfum · Eau de parfum', name: 'Vanille & Ambre Doré',
    desc: "Douceur et sensualité à l'état pur. Un parfum chaud et enveloppant qui laisse une trace mémorable.",
    img: 'assets/images/cosmetiques/parfum-vanille-ambre.jpg',
    prix: '11 000 FCFA', stars: 5, avis: 21,
    details: [["Notes de tête","Fleur d'oranger"],['Notes de cœur','Vanille bourbon'],['Notes de fond','Ambre chaud'],['Contenance','50 ml']]
  },
  'jasmin-bois-precieux': {
    cat: 'Parfum · Eau de toilette', name: 'Jasmin & Bois Précieux',
    desc: 'Fraîcheur florale et profondeur boisée pour un parfum polyvalent, du jour au soir.',
    img: 'assets/images/cosmetiques/parfum-jasmin-bois.jpg',
    prix: '8 500 FCFA', prixOld: '10 000 FCFA', stars: 4, avis: 14,
    details: [['Notes de tête','Jasmin frais'],['Notes de cœur','Bois de santal'],['Notes de fond','Cèdre & Patchouli'],['Contenance','50 ml']]
  },
  'chouchou-satin-rose': {
    cat: 'Chouchou · Accessoire cheveux', name: 'Chouchou Satin Rose',
    desc: 'Élastique en satin doux pour cheveux. Réduit les frisottis et les casses. Idéal pour tous types de cheveux, surtout crépus et bouclés.',
    img: 'assets/images/cosmetiques/chouchou-satin-rose.jpg',
    prix: '500 FCFA', stars: 5, avis: 52,
    details: [['Matière','Satin doux'],['Couleur','Rose poudré'],['Idéal pour','Cheveux crépus & bouclés']]
  },
  'chouchou-velours-mauve': {
    cat: 'Chouchou · Accessoire cheveux', name: 'Chouchou Velours Mauve',
    desc: 'Chouchou en velours épais ultra tendance. Tenue parfaite toute la journée, sans marque ni douleur. Style et confort réunis.',
    img: 'assets/images/cosmetiques/chouchou-velours-mauve.jpg',
    prix: '750 FCFA', stars: 5, avis: 67,
    details: [['Matière','Velours épais'],['Couleur','Mauve'],['Style','Casual & élégant']]
  },
  'chouchou-perles-dorees': {
    cat: 'Chouchou · Accessoire cheveux', name: 'Chouchou Perles Dorées',
    desc: 'Chouchou tissé orné de petites perles dorées pour un look élégant et raffiné. Parfait pour une tenue de soirée ou du quotidien chic.',
    img: 'assets/images/cosmetiques/chouchou-perles-dorees.jpg',
    prix: '1 000 FCFA', stars: 5, avis: 29,
    details: [['Matière','Tissu & perles'],['Couleur','Doré / Crème'],['Occasion','Soirée & quotidien']]
  },
};

function slugify(str) {
  return str.toLowerCase()
    .replace(/[àâä]/g,'a').replace(/[éèêë]/g,'e')
    .replace(/[îï]/g,'i').replace(/[ôö]/g,'o')
    .replace(/[ùûü]/g,'u').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

function openModal(slug) {
  const p = produitsData[slug];
  if (!p) return;

  const imgEl = document.getElementById('modalImgEl');
  const placeholder = document.getElementById('modalPlaceholder');
  imgEl.src = p.img;
  imgEl.alt = p.name;
  imgEl.style.display = '';
  placeholder.style.display = 'none';

  const modalImgDiv = document.getElementById('modalImg');
  if      (p.cat.includes('visage'))  modalImgDiv.style.background = 'linear-gradient(145deg,#F0E8FA,#DEC9F5)';
  else if (p.cat.includes('corps'))   modalImgDiv.style.background = 'linear-gradient(145deg,#FFF0E8,#F5D9C4)';
  else if (p.cat.includes('Eau de parfum')) modalImgDiv.style.background = 'linear-gradient(145deg,#1A0A2E,#3D1A5C)';
  else if (p.cat.includes('Eau de toilette')) modalImgDiv.style.background = 'linear-gradient(145deg,#0A1A2E,#1A3A5C)';
  else if (p.cat.includes('Chouchou') && p.name.includes('Rose')) modalImgDiv.style.background = 'linear-gradient(145deg,#FAE8F5,#F0C8E8)';
  else if (p.cat.includes('Chouchou') && p.name.includes('Mauve')) modalImgDiv.style.background = 'linear-gradient(145deg,#F5E8FA,#E0C0F0)';
  else if (p.cat.includes('Chouchou')) modalImgDiv.style.background = 'linear-gradient(145deg,#FAF0E8,#F5D8C0)';
  else modalImgDiv.style.background = 'var(--violet-blush)';

  document.getElementById('modalCat').textContent = p.cat;
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalPrix').textContent = p.prix;
  document.getElementById('modalPrixOld').textContent = p.prixOld || '';

  const starsEl = document.getElementById('modalStars');
  starsEl.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    s.textContent = '★';
    s.style.color = i <= p.stars ? 'var(--gold)' : 'var(--muted)';
    starsEl.appendChild(s);
  }
  const avisSpan = document.createElement('span');
  avisSpan.className = 'star-count';
  avisSpan.textContent = `(${p.avis} avis)`;
  starsEl.appendChild(avisSpan);

  const detailsEl = document.getElementById('modalDetails');
  detailsEl.innerHTML = p.details.map(([k,v]) =>
    `<div class="modal-detail-row"><span>${k}</span><span>${v}</span></div>`
  ).join('');

  const waBtn = document.getElementById('modalWaBtn');
  const msg = encodeURIComponent(`Bonjour Tatiana 🌸, je souhaite commander : *${p.name}*\nPrix : ${p.prix}\nMerci !`);
  waBtn.href = `https://wa.me/2250151151432?text=${msg}`;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e, force) {
  if (force || (e && e.target === modalOverlay)) {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal(null, true);
});

document.querySelectorAll('.produit-card').forEach(card => {
  const btn = card.querySelector('.overlay-btn');
  const nameEl = card.querySelector('.produit-name');
  if (btn && nameEl) {
    const slug = slugify(nameEl.textContent.trim());
    btn.addEventListener('click', () => openModal(slug));
  }
});