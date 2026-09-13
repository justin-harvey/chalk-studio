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
    photo: "", website: "", booking: "", instagram: ""
  },
  {
    name: "Jessie",
    role: "Stylist",
    specialty: "Blondes, rich browns, Brazilian blowouts, cuts for all and fun vivid color.",
    photo: "", website: "", booking: "", instagram: ""
  },
  {
    name: "Marissa",
    role: "Colorist",
    specialty: "Dimensional and live-in color.",
    photo: "", website: "", booking: "", instagram: ""
  },
  {
    name: "Adele",
    role: "Stylist",
    specialty: "Fantastical color melts, extensions and transformational cuts.",
    photo: "", website: "", booking: "", instagram: ""
  },
  {
    name: "Elliot",
    role: "Barber · Stylist",
    specialty: "Classic and modern cuts, non-gender cuts, beard trims and straight-razor shaves.",
    photo: "", website: "", booking: "", instagram: ""
  },
  {
    name: "Jordan",
    role: "Stylist",
    specialty: "Custom color and cuts on every texture; inclusive, collaborative chair.",
    photo: "", website: "", booking: "", instagram: ""
  }
];

function renderStylists() {
  const grid = document.getElementById('stylistGrid');
  if (!grid) return;
  const iconWeb = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>';
  const iconBook = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M8 3v4M16 3v4"/></svg>';
  const iconIg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.4"/><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none"/></svg>';

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

// Sticky header state
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
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
