// Chalk Studio — interactions

/* ============================================================
   STYLIST ROSTER  —  EDIT THIS LIST
   Each Chalk artist is an independent business. Fill in each
   person's own links; any left as "" simply won't render.
     name       : display name
     role       : short title (e.g. "Owner · Colorist")
     specialty  : one line on what they do
     photo      : "images/xyz.jpg" (optional; falls back to a
                  brass monogram of their initial)
     website    : the stylist's own website (optional)
     booking    : direct booking link (optional)
     instagram  : full instagram URL (optional)
   Seeded from the Slate/Chalk family; confirm who's at Chalk
   and drop in each stylist's real links.
   ============================================================ */
const STYLISTS = [
  {
    name: "Ashley",
    role: "Color Specialist",
    specialty: "Fine-hair aficionado, micro-foiler, curly cutter and vivid color.",
    photo: "images/stylists/ashley.jpg", website: "", booking: "", instagram: ""
  },
  {
    name: "Janaye",
    role: "Stylist",
    specialty: "Cuts and color that start with how you want to feel.",
    photo: "images/stylists/janaye.jpg", website: "", booking: "", instagram: ""
  },
  {
    name: "Jessie",
    role: "Stylist",
    specialty: "Blondes, rich browns, Brazilian blowouts, cuts for all and fun vivid color.",
    photo: "images/stylists/jessie.jpg", website: "", booking: "", instagram: ""
  },
  {
    name: "Marissa",
    role: "Colorist",
    specialty: "Dimensional and live-in color.",
    photo: "images/stylists/marissa.jpg", website: "", booking: "", instagram: ""
  },
  {
    name: "Adele",
    role: "Stylist",
    specialty: "Fantastical color melts, extensions and transformational cuts.",
    photo: "images/stylists/adele.jpg", website: "", booking: "", instagram: ""
  },
  {
    name: "Elliot",
    role: "Barber · Stylist",
    specialty: "Classic and modern cuts, non-gender cuts, beard trims and straight-razor shaves.",
    photo: "images/stylists/elliot.jpg", website: "", booking: "", instagram: ""
  },
  {
    name: "Meghan",
    role: "Stylist",
    specialty: "Seventeen years behind the chair; cuts and color rooted in Newbury Street training.",
    photo: "images/stylists/meghan.jpg", website: "", booking: "", instagram: ""
  },
  {
    name: "Jordan",
    role: "Stylist",
    specialty: "Custom color and cuts on every texture; inclusive, collaborative chair.",
    photo: "images/stylists/jordan.jpg", website: "", booking: "", instagram: ""
  }
  // Extra headshots also scraped and ready to add once confirmed for Chalk:
  //   images/stylists/brooklyn.jpg, images/stylists/veronica.jpg
];

const ico = id => `<svg class="ico"><use href="#${id}"/></svg>`;

function stylistCardHTML(s) {
  const initial = s.name.trim().charAt(0).toUpperCase();
  const avatar = s.photo
    ? `<div class="stylist-card__media"><img src="${s.photo}" alt="${s.name}" loading="lazy"></div>`
    : `<div class="stylist-card__media stylist-card__mono">${initial}</div>`;
  const links = [];
  if (s.booking)   links.push(`<a class="slink" href="${s.booking}">${ico('i-calendar')}<span>Book</span></a>`);
  if (s.website)   links.push(`<a class="slink" href="${s.website}" target="_blank" rel="noopener">${ico('i-globe')}<span>Website</span></a>`);
  if (s.instagram) links.push(`<a class="slink" href="${s.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ico('i-instagram')}<span>Instagram</span></a>`);
  const linkRow = links.length
    ? `<div class="stylist-card__links">${links.join('')}</div>`
    : `<div class="stylist-card__soon">Booking &amp; site links coming soon</div>`;
  return `<article class="stylist-card reveal in">
    ${avatar}
    <div class="stylist-card__body">
      <span class="stylist-card__role">${s.role}</span>
      <h4>${s.name}</h4>
      <p>${s.specialty}</p>
      ${linkRow}
    </div>
  </article>`;
}

function renderStylists() {
  const grid = document.getElementById('stylistGrid');
  if (!grid) return;
  grid.innerHTML = STYLISTS.map(stylistCardHTML).join('');
}
renderStylists();

/* ============================================================
   STYLIST MATCHER QUIZ
   Scores stylists by tag overlap with the visitor's answers,
   then recommends the top two. Tags map to STYLISTS by name.
   ============================================================ */
const STYLIST_TAGS = {
  Ashley:  ['color','blonde','vivid','fine','curly'],
  Janaye:  ['cut','color','natural'],
  Jessie:  ['blonde','vivid','cut','extensions','lowmaintenance'],
  Marissa: ['color','natural','lowmaintenance'],
  Adele:   ['color','vivid','extensions','cut'],
  Elliot:  ['barbering','cut','classic'],
  Meghan:  ['cut','color','classic'],
  Jordan:  ['color','cut','textured','natural']
};

const QUIZ = [
  { q: "What are you booking?", a: [
    { label: "Color", tags: ['color'] },
    { label: "Cut & style", tags: ['cut'] },
    { label: "Blonde / lightening", tags: ['blonde','color'] },
    { label: "Extensions", tags: ['extensions'] },
    { label: "Barbering & beard", tags: ['barbering','cut'] },
  ]},
  { q: "Your goal vibe?", a: [
    { label: "Natural & lived-in", tags: ['natural','lowmaintenance'] },
    { label: "Bold & vivid", tags: ['vivid'] },
    { label: "Classic & polished", tags: ['classic'] },
    { label: "Low-maintenance", tags: ['lowmaintenance'] },
  ]},
  { q: "Your hair?", a: [
    { label: "Fine", tags: ['fine'] },
    { label: "Thick or curly", tags: ['curly'] },
    { label: "Textured or coily", tags: ['textured'] },
    { label: "Not sure yet", tags: [] },
  ]},
];

const quizAnswers = new Array(QUIZ.length).fill(null);

function renderQuiz() {
  const stage = document.getElementById('quizStage');
  if (!stage) return;
  const steps = QUIZ.map((step, qi) => {
    const opts = step.a.map((o, oi) => {
      const on = quizAnswers[qi] === oi ? ' is-on' : '';
      return `<button type="button" class="quiz-opt${on}" data-q="${qi}" data-o="${oi}">${o.label}</button>`;
    }).join('');
    return `<div class="quiz-step">
      <p class="quiz-q"><span class="quiz-n">${qi + 1}</span>${step.q}</p>
      <div class="quiz-opts">${opts}</div>
    </div>`;
  }).join('');
  const answered = quizAnswers.filter(v => v !== null).length;
  stage.innerHTML = `
    <div class="quiz-steps">${steps}</div>
    <div class="quiz-actions">
      <button type="button" class="btn btn--cognac" id="quizGo" ${answered ? '' : 'disabled'}>Show my matches</button>
      <button type="button" class="quiz-reset" id="quizReset" hidden>Start over</button>
    </div>
    <div id="quizResults" class="quiz-results" aria-live="polite"></div>`;
}

function scoreMatches() {
  const chosen = [];
  quizAnswers.forEach((oi, qi) => { if (oi !== null) chosen.push(...QUIZ[qi].a[oi].tags); });
  const ranked = STYLISTS.map((s, idx) => {
    const tags = STYLIST_TAGS[s.name] || [];
    const score = chosen.reduce((n, t) => n + (tags.includes(t) ? 1 : 0), 0);
    return { s, score, idx };
  }).sort((a, b) => b.score - a.score || a.idx - b.idx);
  const top = ranked.filter(r => r.score > 0).slice(0, 2);
  return (top.length ? top : ranked.slice(0, 2)).map(r => r.s);
}

document.addEventListener('click', (e) => {
  const opt = e.target.closest('.quiz-opt');
  if (opt) {
    quizAnswers[+opt.dataset.q] = +opt.dataset.o;
    renderQuiz();
    return;
  }
  if (e.target.id === 'quizGo') {
    const picks = scoreMatches();
    const wrap = document.getElementById('quizResults');
    wrap.innerHTML = `<p class="quiz-verdict">Your best matches at Chalk:</p>
      <div class="quiz-cards">${picks.map(stylistCardHTML).join('')}</div>`;
    document.getElementById('quizReset').hidden = false;
    wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }
  if (e.target.id === 'quizReset') {
    quizAnswers.fill(null);
    renderQuiz();
  }
});
renderQuiz();

// Theme toggle — refined (light) <-> dark botanical maximalist
const THEME_KEY = 'chalk-theme';
const root = document.documentElement;
const currentTheme = () => root.getAttribute('data-theme') || 'refined';
function setTheme(t) {
  root.setAttribute('data-theme', t);
  try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
}
['themeToggle', 'themeToggleMobile'].forEach(id => {
  const b = document.getElementById(id);
  if (b) b.addEventListener('click', () =>
    setTheme(currentTheme() === 'botanical' ? 'refined' : 'botanical'));
});

// Sticky header state + reveal the floating Book button past the hero
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  document.body.classList.toggle('past-hero', window.scrollY > window.innerHeight * 0.7);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
toggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Lightbox gallery
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
const lbClose = document.getElementById('lightboxClose');
document.querySelectorAll('.gallery figure').forEach(fig => {
  fig.addEventListener('click', () => {
    const src = fig.getAttribute('data-full');
    const img = fig.querySelector('img');
    lbImg.src = src;
    lbImg.alt = img ? img.alt : '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
const closeLb = () => {
  lb.classList.remove('open');
  document.body.style.overflow = '';
  lbImg.src = '';
};
lbClose.addEventListener('click', closeLb);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
