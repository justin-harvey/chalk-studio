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
    name: "Meghan",
    role: "Stylist",
    specialty: "Seventeen years behind the chair; cuts and color rooted in Newbury Street training.",
    photo: "images/stylists/meghan.jpg", website: "", booking: "", instagram: ""
  },
  {
    name: "Brooklyn",
    role: "Stylist",
    specialty: "Independent stylist at Chalk. Full bio coming soon.",
    photo: "images/stylists/brooklyn.jpg", website: "", booking: "", instagram: ""
  }
  // Extra headshot also scraped and ready to add once confirmed for Chalk:
  //   images/stylists/veronica.jpg
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
  Meghan:   ['cut','color','classic'],
  Brooklyn: ['cut','color']
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

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Fair match — NOT a ranking. Every artist who does this kind of work is an
// equal match; we simply surface them (shuffled, so order isn't a hierarchy).
function matchStylists() {
  const chosen = [];
  quizAnswers.forEach((oi, qi) => { if (oi !== null) chosen.push(...QUIZ[qi].a[oi].tags); });
  const matches = STYLISTS.filter(s => {
    const tags = STYLIST_TAGS[s.name] || [];
    return chosen.some(t => tags.includes(t));
  });
  // If nothing lines up (e.g. "not sure"), everyone's fair game.
  // Shuffle (order is never a ranking) and show up to 3 — a fair random
  // sample that rotates each visit, so exposure stays even across the team.
  return shuffle(matches.length ? matches : STYLISTS).slice(0, 3);
}

document.addEventListener('click', (e) => {
  const opt = e.target.closest('.quiz-opt');
  if (opt) {
    quizAnswers[+opt.dataset.q] = +opt.dataset.o;
    renderQuiz();
    return;
  }
  if (e.target.id === 'quizGo') {
    const picks = matchStylists();
    const wrap = document.getElementById('quizResults');
    wrap.innerHTML = `<p class="quiz-verdict">Artists who love this kind of work</p>
      <div class="quiz-cards">${picks.map(stylistCardHTML).join('')}</div>
      <p class="quiz-fineprint">Every Chalk artist is an independent pro — this is a friendly starting point, not a ranking. Not sure? Any of them would love to help.</p>`;
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

// Work carousel — arrows, drag-to-scroll, disable at ends
(function () {
  const track = document.getElementById('workTrack');
  if (!track) return;
  const prev = document.getElementById('workPrev');
  const next = document.getElementById('workNext');
  prev.classList.add('is-prev');
  const step = () => {
    const card = track.querySelector('.work__card');
    return card ? card.getBoundingClientRect().width + 18 : 320;
  };
  const updateArrows = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  };
  prev.addEventListener('click', () => track.scrollBy({ left: -step() * 1.5, behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step() * 1.5, behavior: 'smooth' }));
  track.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  updateArrows();

  // pointer drag
  let down = false, startX = 0, startLeft = 0, moved = 0;
  track.addEventListener('pointerdown', (e) => {
    down = true; moved = 0; startX = e.clientX; startLeft = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) track.classList.add('is-dragging');
    moved = Math.max(moved, Math.abs(dx));
    track.scrollLeft = startLeft - dx;
  });
  const end = () => { down = false; track.classList.remove('is-dragging'); };
  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);
  // swallow the click after a real drag so it doesn't feel janky
  track.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  // keyboard
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { track.scrollBy({ left: step(), behavior: 'smooth' }); }
    if (e.key === 'ArrowLeft')  { track.scrollBy({ left: -step(), behavior: 'smooth' }); }
  });
})();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
