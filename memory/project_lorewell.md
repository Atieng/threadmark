---
name: Lorewell project context
description: Core context for the Lorewell marketing site build — tech stack, phase status, file layout
type: project
---

Lorewell is a front-end-only marketing site for an AI Slack/Teams knowledge-capture product. No real backend, no AI — HTML/CSS mockups with small front-end interactions.

**Why:** Sell the product concept to engineering leads, support/ops managers, and enterprise/compliance buyers; get them to join early access.

**How to apply:** Phase 1 (sections 1–8 + setup) is complete and building. Phase 2 (sections 9–16, /privacy, 404) is next.

## Stack
- Astro 7 static output (`output: 'static'`, no adapter)
- Tailwind CSS v4 via `@tailwindcss/vite`
- GSAP (ScrollTrigger + SplitText) + Lenis smooth scroll
- Fontsource: Schibsted Grotesk 800 (headings), Newsreader 500/italic (entry titles)
- Astro `<ClientRouter />` for view transitions
- Deployed as static assets on Cloudflare Workers via wrangler

## Phase 1 files created
- `astro.config.mjs` — static output, Tailwind v4 vite plugin
- `wrangler.jsonc` — simplified static assets only
- `src/styles/global.css` — design tokens, @theme, base styles
- `src/layouts/Layout.astro`
- `src/content/messages.json`, `entries.json`
- `src/components/ui/` — Button, Tag, ChatMessage, EntryCard, Toggle
- `src/components/mockups/AppMockup.astro`
- `src/components/sections/` — Nav, Hero, LiveCaptureDemo, TheProblem, SocialProof, ChooseYourPath, HowItWorks, WhatItCatches
- `src/scripts/` — motion.ts, demo.ts, role.ts, form.ts, search.ts (stub), pricing.ts (stub)
- `src/pages/index.astro`
- `public/favicon.svg`

## Phase 2 remaining (sections 9–16)
9. Private Chats — 2x2 mockup grid
10. Benchmarks — horizontal bars
11. Privacy & Trust — channel toggles, badges
12. Known Limitations
13. Knowledge Base — live search/filter
14. Integrations + Quickstart — terminal animation
15. Roadmap + Pricing — monthly/yearly toggle
16. FAQ accordion + Early Access form + Footer
Plus: /privacy page, 404 page
