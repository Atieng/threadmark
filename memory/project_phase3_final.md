---
name: project-phase3-final
description: Phase 3 complete + final pass: astro-icon, Lucide/logo icons, scroll animations, footer restructure, responsive fixes, JS-visibility fallbacks, clean build
metadata:
  type: project
---

Phase 3 and final-pass work are complete. Build produces 3 pages (/, /privacy, 404) with zero errors; one harmless astro-icon warning about missing `src/icons/` dir.

**Why:** All design phases done; site is deploy-ready.
**How to apply:** Next work = deploy (`npx wrangler deploy`) or post-launch changes only.

## Phase 3 summary (already in previous memory — key additions only)

- Packages: `astro-icon @iconify-json/logos @iconify-json/lucide`
- All letter-placeholder logos replaced with real `logos:*` and `lucide:*` icons
- All uppercase labels removed
- Scroll animations via `initSectionReveal()` with `[data-animated-section]` + `[data-slide]` on all 16 sections
- Footer restructured: no huge wordmark, brand row (28px logo + 20px wordmark + tagline), 4 link columns sentence-case

## Final pass changes (2026-10-15)

1. **CF analytics beacon removed** — `Layout.astro` had `data-cf-beacon='{"token": "PLACEHOLDER"}'`; removed the script entirely. Add back with a real token if/when analytics are needed.

2. **Demo messages visible without JS** — `LiveCaptureDemo.astro` previously had `class="opacity-0 translate-y-3"` and inline `style="transform: translateY(12px);"` on `[data-msg]`, and `class="opacity-0"` + inline transform on `[data-entry-card]`. Removed these — `demo.ts`'s `reset()` now handles the initial hidden state via `gsap.set()`. If JS never loads, content is visible.

3. **Noscript CSS fallback** — Added `<noscript><style>` block in `Layout.astro <head>` that shows `[data-hiw-step]`, `[data-hero="mockup"]`, `[data-msg]`, `[data-entry-card]` at full opacity if JS is disabled.

4. **HowItWorks pin disabled on mobile** — `initHowItWorksPins()` in `motion.ts` now checks `window.innerWidth < 640`. On small screens it skips the ScrollTrigger pin and instead reveals steps individually via `gsap.fromTo()` with `scrollTrigger` per step. This prevents 1200px+ of pinned scroll on a 360px screen.

5. **Responsive review** — All grids use proper responsive breakpoints (md:grid-cols-2/3, sm:grid-cols-2/3). Nav has hamburger. AppMockup sidebar/right-panel hidden on small screens. Footer stacks to single column. No horizontal overflow found.

## Deploy command
```
npx wrangler deploy
```

wrangler.jsonc: `name: "threadmark"`, `assets.directory: "./dist"`, `compatibility_date: "2026-10-12"`.

Note: before deploying, swap in a real CF analytics token in `Layout.astro` and add a real `og.png` to `public/`.
