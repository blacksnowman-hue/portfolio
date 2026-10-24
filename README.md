# Harsh Thakur — Rock Zine Portfolio

A single-page Astro portfolio with a monochrome editorial layout, GSAP scroll motion, and one lightweight Three.js object.

## Setup

```bash
npm install
npm run dev
```

The dev server starts at [http://localhost:4321](http://localhost:4321).

Layouts are checked at **320px**, **375px**, **768px**, **1024px**, and **1440px** widths. Use responsive mode in devtools if you change section CSS.

## Production build

```bash
npm run build
npm run preview
```

## Edit the copy

All names, dates, project text, and links live in [`src/data/content.ts`](src/data/content.ts).

- `site.location` — the location label in the hero and mobile menu. It currently reads `Edit location`.
- `site.resumeHref` — leave `null` until you add your PDF at `public/resume.pdf`, then set this to `"/resume.pdf"`. The footer link appears only after that.
- `education.institution` — replace `EDIT_INSTITUTION` with the school name.
- `contact.email` — set an address to turn the email row into a `mailto:` link. While it is `null`, the row stays a labeled placeholder.
- `contact.github` and `contact.linkedin` — set full `https://` URLs. Empty values stay placeholders.
- Each project `links[].href` — set a real URL or leave `null`. Do not invent repository or deployment links. External URLs open in a new tab.

## Replace images

Keep the same filenames or update the paths in `images` inside `src/data/content.ts`. Photos are cropped with `object-fit` and shown in grayscale.

| File | Where it is used |
| --- | --- |
| `public/assets/hero-mountain-placeholder.jpg` | Hero |
| `public/assets/about-workspace-placeholder.jpg` | About |
| `public/assets/education-desk-placeholder.jpg` | Education |
| `public/assets/contact-mountain-placeholder.jpg` | Contact |
| `public/assets/portfolio-moodboard-reference.jpg` | Reference only. It is not a page background. |

Current photos are from Unsplash, under the Unsplash License:

- https://images.unsplash.com/photo-1464822759023-fed622ff2c3b
- https://images.unsplash.com/photo-1498050108023-c5249f4df085
- https://images.unsplash.com/photo-1517694712202-14dd9538aa97
- https://images.unsplash.com/photo-1519681393784-d120267933ba
- https://images.unsplash.com/photo-1518770660439-4636190af475

Display type is Bebas Neue, body is Newsreader, notes are Caveat, and labels are IBM Plex Mono. The files in `public/fonts/` are the OFL builds from Fontsource.

## Motion

- `src/scripts/preloader.ts` — full-screen intro: centered **HT** mark only (no name on the loader), progress bar and percentage tied to load steps (fonts → eager images → `window` load → short dwell), then a GSAP flight into the navbar **HT** box (`#site-wordmark-mark`). Scroll stays locked until the flight finishes. Hero motion and the Three.js scene start after this sequence. To use a signature image later, replace the inner content of `.wordmark-mark` in both `Preloader.astro` and `Navbar.astro` with the same `<img>` so the fly-in still lines up.
- `src/scripts/navigation.ts` — mobile menu, smooth in-page scrolling, and the active section.
- `src/scripts/animations.ts` — hero entrance, scroll reveals, project wipes, timeline draw, and small parallax. ScrollTrigger instances are cleared before they are created again.
- `src/scripts/scene.ts` — a metallic wireframe knot in `#three-canvas-mount`. The canvas does not receive clicks. If WebGL is unavailable, the circle behind the mount stays and the rest of the page still works.

`prefers-reduced-motion: reduce` skips the preloader flight and page tweens, pauses the skills ticker into a wrapped list, and stops the 3D loop after one frame.
