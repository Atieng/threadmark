---
name: project-phase2-complete
description: Phase 2 of Threadmark site is fully built — all 16 sections, footer, privacy page, 404 page
metadata:
  type: project
---

Phase 2 build complete as of October 15, 2026. All sections 9–16 built and building cleanly.

**Why:** User's full Phase 2 request from the earlier session.

**How to apply:** The site is complete for static deployment. Run `npm run build` and deploy `dist/` via wrangler.

## What was added in Phase 2

**New section components (src/components/sections/):**
- PrivateChats.astro — 2×2 mockup grid showing privacy features
- Benchmarks.astro — horizontal bar chart with bg-blush, GSAP animation via `data-bench-bar`
- PrivacyTrust.astro — rules list + working channel-toggle card + SOC 2/GDPR badges
- KnownLimitations.astro — 4 items in 2×2 grid with bg-blush
- KnowledgeBase.astro — dark (bg-ink) section, live search + type filter, all 8 entries
- Integrations.astro — integration logos + terminal typewriter animation
- Pricing.astro — roadmap comparison + pricing toggle (GSAP price tween) + 3 tiers
- FAQ.astro — accessible accordion from faq.json, arrow-key navigation
- EarlyAccess.astro — dark section + peach glow, full form using form.ts `initForm()`
- Footer.astro — logo + quote + mini email form + 4 link columns + large wordmark with GSAP highlight sweep

**New mockup components (src/components/mockups/):**
- PrivateChatCard.astro — blurred DM + summary card
- BotDM.astro — Threadmark bot asking to publish
- AutonomyCard.astro — interactive on/off toggles (locked third)

**New content (src/content/):**
- faq.json — 5 FAQ items
- pricing.json — 3 tiers + roadmap lists

**New pages:**
- src/pages/privacy.astro — full privacy model prose page
- src/pages/404.astro — "This thread doesn't exist. Back to home."

**New public assets:**
- public/favicon-32.png (32×32)
- public/apple-touch-icon.png (180×180)
- public/og.png (1200×630, warm gradient with "threadmark" text)

**Updated files:**
- src/pages/index.astro — removed temp CTA/footer, added all 16 sections
- src/layouts/Layout.astro — added apple-touch-icon link
- src/scripts/search.ts — implemented filterEntries() export
- src/scripts/pricing.ts — implemented togglePricing() export

## Important technical notes

- Benchmarks bars use `data-bench-bar` (NOT `data-bar`) to avoid conflict with `revealBars('[data-bar]')` in `initRevealAll()`.
- form.ts `initForm()` expects `[data-form-error]` and `[data-form-success]` in the DOM — EarlyAccess.astro provides these.
- Footer footer logo has `data-logo-stroke` — it animates on page load like nav logo (before user reaches footer).
- Footer mobile columns use `hidden sm:block` on `<ul>` — JS toggles `hidden` class on mobile, `sm:block` overrides on tablet+.
- KnowledgeBase starts all entries visible; `filterEntries()` is called on load with default state.
