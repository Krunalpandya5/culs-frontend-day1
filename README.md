# Modified by

Krunal Pandya

# The Little Herb Garden — Single-Page Website

## Project Overview
A fully static, responsive, single-page herb discovery website built with HTML, CSS and vanilla JavaScript. The herb content remains JSON-driven. No React, jQuery or CSS frameworks.

## Design and implementation log

| Change | Why | How | Files |
|---|---|---|---|
| Sticky 100px header | Consistent navigation | Flexbox header, sticky positioning, responsive menu | index.html, style.css, app.js |
| Single-page anchor navigation | Avoid separate pages | `#home`, `#about`, `#herbs`, `#visit`, `#contact`, smooth scrolling and IntersectionObserver active state | All three |
| Modern logo and font | Consistent nature branding | Existing local botanical SVG, one Nunito font family across the UI; Arial fallback | index.html, style.css |
| Hero redesign | Stronger first impression | Large photographic-style image, 30–43% dark gradient, smaller responsive title, animated CTA | index.html, style.css, image/hero-premium.jpg |
| About section | Explain purpose and values | 40/60 image/text grid, value cards, reveal animation | index.html, style.css, image/garden-shop.jpg |
| Herb card redesign | Improve discoverability | Four-column desktop grid, photo-style herb thumbnails, shadows and lift hover | style.css, app.js, image/ |
| Herb search, type filter, alphabetical sort | Fast discovery | Client-side filtering and sorting of fetched JSON records | index.html, app.js |
| Herb modal and carousel | Keep herb information in-page | Reused JSON-based dialog, gallery arrows, dots, keyboard and swipe support | index.html, app.js, style.css |
| Garden masonry-style gallery | Rich visual storytelling | Local image assets, CSS grid spans, zoom hover, lightbox with arrow-key controls | All three, image/gallery-*.jpg |
| Footer redesign | Better navigation | Four columns, quick links, popular herb modal buttons and honest visitor information | index.html, style.css, app.js |
| Responsive accessibility | Usable on small screens | Breakpoints, mobile nav, focus states, alt text, reduced motion, keyboard dialogs | All three |

## Image asset disclosure
The hero, garden-shop, gallery and eight primary herb images are **AI-generated photorealistic visual crops** from a botanical website concept. They are not verified real photographs of a particular garden or botanical specimens. For scientific-grade species imagery, replace them with properly licensed, botanically verified photographs and retain the same filenames. The remaining two carousel images per herb are existing illustrations from the earlier project.

## Project structure
```
project-root/
├── index.html
├── style.css
├── app.js
├── README.md
├── data/
│   ├── index.json
│   ├── Basil.json
│   ├── Spearmint.json
│   ├── Rosemary.json
│   ├── Thyme.json
│   ├── Lavender.json
│   ├── Sage.json
│   ├── Chamomile.json
│   └── Chives.json
└── image/
    ├── herb-logo.svg
    ├── hero-premium.jpg
    ├── garden-shop.jpg
    ├── gallery-1.jpg … gallery-8.jpg
    └── basil-1.jpg … chives-3.jpg
```

## Architecture and data flow
`index.html` owns semantic sections and dialogs. `style.css` owns all layout, color, typography, animation and responsive behavior. `app.js` fetches `data/index.json`, fetches each herb JSON concurrently, validates fields and image paths, renders cards and drives interactive components. No herb text is hardcoded in the HTML.

Each herb JSON contains `id`, `name`, `scientificName`, `lifeCycle`, `summary`, `description`, `usefulInformation`, `healthBenefits`, `medicinalUses`, `additionalInformation`, and `images` (three local paths). Add a new file, list it in `data/index.json`, and provide the corresponding images.

## Modal and slider
Click any card or a footer herb button to open the existing accessible modal. Close using X, Escape or the backdrop. The image carousel has previous/next arrows, slide dots, keyboard arrows and touch swipe. Body scrolling is disabled while a dialog is open. The gallery has its own lightbox and keyboard controls.

## Responsive design
Four herb columns on desktop, three on medium desktop, two on tablets/mobile. About content stacks on narrow screens. The header collapses to a keyboard-operable menu on mobile. Gallery grid rearranges to two columns. `prefers-reduced-motion` disables movement.

## Installation and usage
1. Extract the archive.
2. In `project-root`, run `python -m http.server 8000` (or `py -m http.server 8000` on Windows).
3. Open `http://localhost:8000/`. Do not open the HTML using `file://`, because browsers block JSON `fetch()` from local files.
4. Use header links to jump between sections, search/filter/sort herbs, click herb cards for details, and click gallery images to enlarge them.

## Visitor information
No actual physical location, opening hours, contact email or social profiles were supplied. The footer intentionally marks these as not provided rather than inventing them. Add verified details before public launch.

## Accessibility and performance
Semantic landmarks, labeled controls, visible keyboard focus, alt text, focus trapping in dialogs, Escape-to-close, reduced motion, lazy-loaded images, local images, and small framework-free JS. Google Fonts Nunito is optional; the site falls back to Arial offline.

## Troubleshooting
- Blank cards: check that a local HTTP server is running and JSON files exist.
- Missing image: confirm path in the relevant JSON file and capitalization.
- Font not loading: check network access; Arial fallback remains functional.
- Browser console errors: inspect the network tab for missing JSON/image files.

## Files modified
`index.html`, `style.css`, `app.js`, `README.md`, and each herb's primary image `*-1.jpg`. All eight JSON files and secondary carousel images are preserved.

## Files added
`image/hero-premium.jpg`, `image/garden-shop.jpg`, `image/gallery-1.jpg` through `image/gallery-8.jpg`.

## Future improvements
Replace AI-generated visual crops with licensed verified herb photographs; add real garden details when supplied; add image optimization, social URLs, and optional multilingual translations.

## Change log
- v3: One-page layout; premium hero; about section; filter and sort; local photo-style assets; garden gallery lightbox; expanded footer; sticky navigation; documentation.
- v2: Header and hero enhancements.
- v1: JSON-driven herb cards, modal, carousel, and search.


## Critical hero and gallery fixes — 22 October 2026

### Hero: text collision removal
- **What:** Removed the previous hero headline/subtitle and inserted one accessible `h1`, one paragraph and one CTA. The hero image was replaced with a clean photographic crop without text baked into the pixels.
- **Why:** The previous hero image itself contained rendered UI text, so HTML text appeared twice and overlapped.
- **How:** The hero uses `image/hero-clean-4k.jpg` as a cover background, a single 30–43% dark CSS overlay (`::before`), isolated stacking context, and a higher `z-index` for the centered content. The image is 3840 × 2160 pixels, **upscaled from a smaller AI-generated image**, not native 4K photographic detail.
- **Files:** `index.html`, `style.css`, `image/hero-clean-4k.jpg`.

### Gallery: overflow and aspect ratio
- **What:** Normalized gallery images, removed baked-in screenshot headings from source crops, and rebuilt the grid with explicit tracks and card sizes.
- **Why:** Previous gallery images included cropped UI labels and the auto-row sizing could cause awkward layouts.
- **How:** `minmax(0,1fr)` columns, `overflow:hidden`, `border-radius:24px`, fixed 220px standard cards, a 464px featured card on desktop, 2-column tablet and 1-column mobile layouts, `object-fit:cover`, and contained 1.03 hover scaling.
- **Files:** `style.css`, `image/gallery-1.jpg` through `image/gallery-8.jpg`.

### Validation and limits
- Checked generated JPEG dimensions, JSON parsing, JavaScript syntax, referenced local files, and ZIP integrity.
- Live rendering across browsers/devices has not been independently tested; the 4K file dimensions do not imply native 4K detail.


## Final duplicate-layer correction (22 October 2026)

### Hero text
- **What changed:** Set the exact requested headline and subtitle, retaining one CTA. Disabled hero text pseudo-elements and unnecessary entrance animation to prevent visually doubled text.
- **Why:** Earlier hero mockup assets contained text burned into the pixels; duplicate text cannot be corrected with z-index alone.
- **How:** Removed obsolete text-bearing `hero-premium.jpg` and `hero-garden.jpg`; the actual hero now references only `hero-clean-4k.jpg`, a text-free garden crop. Explicit stacking puts the 30–43% overlay below the semantic HTML content. All copy is ordinary accessible HTML.
- **Files:** `index.html`, `style.css`, `image/`.

### Gallery title and imagery
- **What changed:** The section has one visible heading, `Visit My Garden`, and the subtitle `Take a look around and enjoy some moments from the garden.` Replaced gallery images 5 and 8 (which featured text on garden signs) with text-free crops of existing botanical photos.
- **Why:** Avoid confusion between image-baked text and real section titles, and eliminate perceived ghost typography.
- **How:** Disabled heading/section generated-text pseudo-elements, isolated the section stacking context, and retained 24px gaps, 220px standard card heights, 464px featured desktop card, `overflow:hidden` and `object-fit:cover`. Responsive grids remain 4/2/1 columns.
- **Files:** `index.html`, `style.css`, `image/gallery-5.jpg`, `image/gallery-8.jpg`.

### Testing note
Static syntax, image, JSON, and archive checks were performed. A full cross-browser visual QA session is still required before production deployment.


## 2026-10-22 — Shared alignment and herb-heading collision fix

- **What:** Header and hero now use the same 1400px maximum-width `.container` and identical responsive side gutters (24px desktop, 16px narrow screens). **Why:** The hero's left edge must align with the logo and brand. **How:** Both wrappers use the same CSS width, max-width, and auto margins; the hero copy has no extra horizontal padding. **File:** `style.css`.
- **What:** Removed generated pseudo-element content and forced a single untransformed heading layer for the What Grows Here section. **Why:** Avoid ghost titles and decorative text collisions. **How:** Scope `content:none` rules to the herb section, remove heading text effects, and keep section content above the background. **File:** `style.css`.
- **What:** Preserved the one-time JSON data rendering pipeline. **Why:** Filtering should replace, not append, cards. **How:** `renderCards()` already calls `replaceChildren()` before inserting the current filtered fragment. **File reviewed:** `app.js` (unchanged).
- **What:** Removed a stale reference to an absent hero background asset. **Why:** Avoid needless missing-image requests. **How:** Reference the existing `hero-clean-4k.jpg`. **File:** `style.css`.

### Verification scope
CSS and JS were inspected and asset references checked. Browser screenshots at different breakpoints should be checked before deployment; no browser rendering test is claimed here.


## 2026-10-22 — Image and alignment remediation

### Shared alignment
**What:** Header, hero, About, Herbs, Gallery and Footer use the same `.container` width (1400px) and gutters (40px desktop, 28px tablet, 16px mobile). **Why:** Hero text previously began outside the logo alignment. **How:** Explicit box-sizing, max-width, margin auto and matching padding on `.header-inner` and `.hero-inner`. **Files:** `style.css`.

### One image per herb card
**What:** Each card contains exactly one `<img class="card-image">`; decorative card image pseudo-elements are disabled. **Why:** Prevent overlapping or duplicated images. **How:** The renderer creates a single `img`, and `cardImage` is read from each herb's JSON; images are clipped to 250px with `object-fit: cover` (190px on narrow screens). **Files:** `app.js`, `style.css`, `data/*.json`.

### Better source selection and modal display
**What:** Each herb's 960×640 local image is used first in its modal and as its card thumbnail instead of the former 620×360 thumbnail. **Why:** Avoid enlarging the lower-resolution card asset. **How:** Each JSON `images` array is reordered and a `cardImage` field is added. Modal images are contained within 700×500px and retain their aspect ratio. **Files:** `data/*.json`, `app.js`, `style.css`.

### Gallery and lightbox
**What:** Gallery cards clip their images and use cover/center; full images in the lightbox use contain/center, limited to 75% width/70vh desktop, 85%/65vh tablet and 90%/60vh mobile. **Why:** Avoid cropping and dominating the screen. **Files:** `style.css`.

### Photo provenance and remaining work
Existing local assets have been retained because an authenticated high-resolution botanical photo library and redistribution permissions were not supplied, and online photo retrieval was unavailable. The 960×640 herb images are not guaranteed to be genuine botanical photographs; the 3840×2160 hero image is an upscale, not native 4K capture. **Do not describe these as verified real photographs.** For fully photographic production assets, replace them with licensed original files and preserve the filenames/JSON references. Browser screenshot and interaction testing still need to be performed in a real browser; static validation alone cannot certify appearance.


## Real botanical photography update (22 October 2026)

The eight herb cards now reference **real photographic files on Wikimedia Commons** instead of the locally generated drawings. Each `data/<Herb>.json` defines one `cardImage` URL; `app.js` renders exactly one `<img>` per card. CSS constrains the image using `object-fit: cover` and prevents pseudo-element image layers. The modal image arrays remain unchanged to avoid silently claiming illustrations are photographs.

**Important deployment limitation:** these eight photographs are loaded from external Wikimedia Commons URLs at runtime; they are **not packaged as JPEG files in the ZIP**. Internet access is required, Wikimedia Commons may block hotlinking or redirect requests, and two image filenames (Spearmint and Rosemary) have not been independently confirmed. For a production/offline release, download verified originals, review individual licenses/attributions, and replace `cardImage` with local paths. Basil is CC0 and Lavender requires CC BY 4.0 attribution according to their Commons file pages. No claim of complete photo verification is made.

Sources: https://commons.wikimedia.org/wiki/Category:Herbs ; https://commons.wikimedia.org/wiki/File:Closeup_of_basil_for_sale.jpg ; https://commons.wikimedia.org/wiki/File:Lavender_flowers.jpg


## Gallery photography update (October 2026)

**What:** Replaced the eight repeated gallery image references with eight distinct photographic source URLs covering a lavender pathway, basil raised beds, medicinal herbs, chamomile, kitchen herb planters, outdoor seating, harvest tools and mixed herb planters. The lightbox opens the same full source URL used in each gallery tile and displays an individual descriptive caption.

**Why:** Previous images were repetitive and some were derived from synthetic composites. Different source scenes provide more visual variety.

**How:** `index.html` assigns one distinct `src`, `alt`, `data-caption`, and local fallback to each gallery image; `app.js` reads captions and uses fallback on load failure; `style.css` enforces contained, undistorted grid and lightbox images. No framework added.

**Important limitations:** These are external photographic sources, not downloaded local originals. Source images and licensing must be independently verified before commercial publication. Some sources may block embedding, disappear, or provide only moderate-resolution versions. If an image fails, the local fallback may be an older illustrative image. The gallery represents photographic examples from different locations, not photos of one confirmed real-world garden. Do not claim all eight are Ultra-HD or production-cleared.

### Gallery source credits / rights review list

1. Lavender-bordered garden path — https://www.treeoflife.co.jp/garden/news/garden/2023072310780.html

2. Basil and herbs in a wooden raised bed — https://streetkitchen.hu/receptek/ganca

3. Rosemary and lavender in a medicinal herb bed — https://verdenook.com/articles/medicinal-herb-garden-therapeutic-plants-for-wellness

4. Chamomile flowers growing in a raised garden bed — https://plantes-avenue.fr/plantes-aromatiques/99997079-camomille-des-monts-3565421117531.html

5. Spearmint and kitchen herbs in outdoor planters — https://www.gardeningworldlimited.co.uk/updates/grow-a-herb-garden

6. Garden seating beside herb beds — https://divisare.com/projects/182112-rgastudio-michele-nastasi-erba-brusca

7. Herb harvesting tools and raised beds — https://www.plantingseason.com.au/grow/northern-rivers/guides/northern-rivers-herb-garden/

8. Wide view of a mixed culinary herb planter — https://thelostherbs.com/the-beginners-guide-to-growing-medicinal-herbs-at-home/
