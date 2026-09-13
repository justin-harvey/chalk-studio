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

function renderStylists() {
  const grid = document.getElementById('stylistGrid');
  if (!grid) return;
  const ico = id => `<svg class="ico"><use href="#${id}"/></svg>`;
  const iconWeb = ico('i-globe');
  const iconBook = ico('i-calendar');
  const iconIg = ico('i-instagram');

  grid.innerHTML = STYLISTS.map(s => {
    const initial = s.name.trim().charAt(0).toUpperCase();
    const avatar = s.photo
      ? `<div class="stylist-card__media"><img src="${s.photo}" alt="${s.name}" loading="lazy"></div>`
      : `<div class="stylist-card__media stylist-card__mono">${initial}</div>`;
    const links = [];
    if (s.booking)   links.push(`<a class="slink" href="${s.booking}">${iconBook}<span>Book</span></a>`);
    if (s.website)   links.push(`<a class="slink" href="${s.website}" target="_blank" rel="noopener">${iconWeb}<span>Website</span></a>`);
    if (s.instagram) links.push(`<a class="slink" href="${s.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${iconIg}<span>Instagram</span></a>`);
    const linkRow = links.length
      ? `<div class="stylist-card__links">${links.join('')}</div>`
      : `<div class="stylist-card__soon">Booking &amp; site links coming soon</div>`;
    return `<article class="stylist-card reveal">
      ${avatar}
      <div class="stylist-card__body">
        <span class="stylist-card__role">${s.role}</span>
        <h4>${s.name}</h4>
        <p>${s.specialty}</p>
        ${linkRow}
      </div>
    </article>`;
  }).join('');
}
renderStylists();

// Theme toggle — refined (light) <-> dark botanical maximalist
const THEME_KEY = 'chalk-theme';
const root = document.documentElement;
const currentTheme = () => root.getAttribute('data-theme') || 'botanical';
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
