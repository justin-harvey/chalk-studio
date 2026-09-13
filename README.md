# Chalk Studio — website

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
