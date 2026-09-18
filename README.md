# Chalk Studio — website
Live: https://chalk-studio.netlify.app/

Static one-page marketing site for **Chalk Studio**, an upscale-eclectic hair studio in Portland, Maine and the sister salon to [Slate Studio](https://www.slatestudioportland.com/).

## Stack
Plain HTML/CSS/JS. No build step. Deploy the contents of this folder to any static host (Netlify recommended, `netlify.toml` included, no build plugins).

## Structure
- `index.html` — the page
- `styles.css` — design system (warm & refined eclectic palette)
- `script.js` — sticky header, mobile nav, scroll reveals, gallery lightbox
- `images/` — web-optimized interior photos (processed via `../process_images.py`)
- `llms.txt`, `robots.txt`, `sitemap.xml` — discoverability / AI crawlers

## Design language
Pulled from the interior photos: chalk-white walls with brass line-work, cognac
leather, ochre velvet, walnut cabinetry, ink-black ceilings, brass fauna.
Fonts: Fraunces (display serif) + Jost (sans).

## Themes (light/dark toggle)
The site ships with two full themes, switched by the toggle in the header
(sun/moon icon) and remembered in `localStorage`:
- **`refined`** — the original warm & refined light look (cream/cognac/brass).
- **`botanical`** — dark botanical maximalist: deep plum + forest backgrounds,
  brass botanical fern/flourish ornaments, jewel contrast, heavier grain.

**Default is `refined` (light).** To change the default, edit the two fallbacks
(`|| 'refined'`) in the inline `<script>` in `index.html` head and in
`script.js`. You can also force a theme via URL for sharing/screenshots:
`?theme=refined` or `?theme=botanical`.

Both themes pass WCAG AA text contrast (audited with `tools/`-style Brave
headless script). Accessible color tokens: `--accent-text` (label text) and
`--muted` are tuned per theme; primary CTAs use white text on orange for AA.

## Stylist Matcher quiz
Section `#matcher` (see `STYLIST_TAGS` + `QUIZ` in `script.js`). A 3-question
quiz scores stylists by tag overlap and recommends the top two. Pure static
JS, no dependencies, themed for light + dark. Edit tags/questions in one place.

Both themes share a film-grain/paper texture overlay (`.grain`) and a sticky
"Book" button (`.book-fab`) that appears past the hero — the booking path stays
rigid no matter how wild the visuals get.

## Icons
Local inline SVG sprite in `index.html` (`#i-*` symbols), no icon CDN. Path
data for calendar/arrow/close is from the StyleSeed icon library
(`styleseed/engine/icons`); globe, Instagram, phone, mail, pin, clock and
scissors are drawn in the same 24×24 stroke style. Use anywhere with
`<svg class="ico"><use href="#i-name"/></svg>`.

## Content sources
- Interior photography: owner-supplied (`../interior photos/`)
- Business facts (owner, model, sister studio, contact): scraped from
  slatestudioportland.com via `../scrape_slate.py` → `../slate_markdown/`

## TODO before launch
- [ ] Add Chalk's street address (currently marked "Address TBD")
- [ ] Confirm phone/email (currently reusing Slate's shared line)
- [ ] Confirm the stylist roster (edit the `STYLISTS` array in `script.js`) and add each artist's own website / booking / Instagram links + optional headshot (falls back to a brass monogram)
- [ ] Set canonical domain (currently placeholder `chalkstudioportland.com`)
- [ ] Add favicon / social OG image if desired
