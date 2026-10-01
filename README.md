# WoManHood

Showcase and archive site for *WoManHood*, a contemporary circus show. Two pages: a scroll-driven homepage built around the show's photographs and music, and an archive of the creation, chapter by chapter.

## Stack

- **React 19** with **React Router 8** (data mode): a single app, so the music keeps playing from one page to the next
- **Vite 8**, with **vite-imagetools** for the image pipeline
- **GSAP 3** (ScrollTrigger, SplitText, CustomEase) for every animation, through `@gsap/react`
- **Lenis** for smooth scrolling, driven by GSAP's ticker
- **Web Audio API** for the soundtrack
- Deployed on **Vercel**

## Highlights

- **One structure for every screen.** Each page has a single semantic HTML structure; desktop, tablet and mobile differ in CSS only. Layout sits on the design's visible column grid (36, 24 and 12 columns), and every dimension scales continuously with the window: the only jumps are the column changes at 1024px and 768px.
- **Intro.** A counter paced for the eye but held at 90% until the page is truly ready: fonts, music and every photo are downloaded first, with a time limit so a slow connection is never stuck. "Enter with Sound" is the gesture browsers require before a site may play audio.
- **Page transitions.** A black curtain made of bands laid on the same grid closes, the next page swaps in behind it, scroll is restored (including on Back and Forward), and it opens once the new page is decoded and measured.
- **Text reveals.** Letters rise line by line in a wave. The split text keeps the font's kerning (measured pair by pair), so a revealed paragraph sits exactly where the unsplit one would.
- **Images.** Every photo is served as AVIF and WebP at several widths, sized to the layout it fills, with a tiny inlined placeholder and long-term caching.
- **Soundtrack.** A one-minute loop played sample-accurately (no gap at the seam), with fades in decibels and a sound toggle that lasts the visit.
- **Accessibility.** Real text throughout, keyboard-reachable controls, inert content behind the intro, and reduced-motion support for the reveals and the curtain.

## Getting started

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev      # development server on http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serves the production build
npm run lint     # Oxlint
```

In development, optimized images are generated on first request, so photos can take a few seconds to appear; the production build generates them all ahead of time.

## Project structure

```
src/
├── App.jsx, Archive.jsx    the two pages
├── Root.jsx                shell shared by every page (smooth scroll, transitions)
├── pages.js                page loading shared by the router and prefetching
├── animation/              text reveal engine, page readiness, timing signals
├── audio/                  soundtrack playback
├── components/             Curtain, EnterScreen, Picture, RollText, SiteHeader, SiteFooter…
├── hooks/                  scroll-triggered text and image reveals, sound state
├── navigation/             link prefetching
└── assets/                 photos, music and their registry
```
