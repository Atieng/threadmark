import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Smooth scroll ──────────────────────────────────────────
export function initLenis(): Lenis | null {
  if (reduced) return null;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time: number) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = (anchor as HTMLAnchorElement).getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    });
  });

  return lenis;
}

// ── Nav: blur on scroll ────────────────────────────────────
export function initNavScroll(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;

  ScrollTrigger.create({
    start: 'top -40px',
    onEnter: () => nav.setAttribute('data-scrolled', 'true'),
    onLeaveBack: () => nav.removeAttribute('data-scrolled'),
  });
}

// ── Logo stroke draw ───────────────────────────────────────
export function drawLogoStroke(delay = 0.2): void {
  const strokes = document.querySelectorAll<SVGPathElement>('[data-logo-stroke]');
  if (!strokes.length || reduced) return;

  strokes.forEach((stroke) => {
    const length = stroke.getTotalLength?.() ?? 200;
    gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(stroke, {
      strokeDashoffset: 0,
      duration: 0.6,
      ease: 'power3.out',
      delay,
    });
  });
}

// ── Hero sequence (~1.8s) ──────────────────────────────────
export function playHero(): void {
  const tl = gsap.timeline();

  if (reduced) {
    gsap.set('[data-hero]', { opacity: 1, y: 0 });
    return;
  }

  // Nav
  tl.from('[data-hero="nav"]', { y: -24, opacity: 0, duration: 0.4, ease: 'power3.out' }, 0);

  // Logo stroke
  drawLogoStroke(0.15);

  // Headline: SplitText line-by-line
  const headline = document.querySelector<HTMLElement>('[data-hero="headline"]');
  if (headline) {
    const split = new SplitText(headline, { type: 'lines', linesClass: 'line-mask' });
    split.lines.forEach((line: Element) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'overflow:hidden;display:block;';
      line.parentNode?.insertBefore(wrap, line);
      wrap.appendChild(line);
    });
    tl.from(
      split.lines,
      { yPercent: 110, duration: 0.75, ease: 'power3.out', stagger: 0.09 },
      0.25
    );
  }

  // Sub + buttons
  tl.from('[data-hero="sub"]', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.7);
  tl.from('[data-hero="btns"]', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.8);
  tl.from('[data-hero="trust"]', { opacity: 0, duration: 0.5, ease: 'none' }, 0.95);

  // Mockup: rise + scale
  tl.from('[data-hero="mockup"]', { y: 40, scale: 0.96, opacity: 0, duration: 1.0, ease: 'power3.out' }, 0.8);

  // Peach glow
  const glow = document.querySelector('[data-hero="glow"]');
  if (glow) {
    tl.to(glow, { opacity: 0.35, duration: 1.0, ease: 'power2.out' }, 0.8);
  }

  // Entries stagger in
  tl.from('[data-hero="entry"]', { y: 16, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1 }, 1.0);
}

// ── Scroll reveal: text (SplitText) ───────────────────────
export function revealText(selector: string): void {
  if (reduced) return;

  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    const split = new SplitText(el, { type: 'lines', linesClass: 'line-mask' });
    split.lines.forEach((line: Element) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'overflow:hidden;display:block;';
      line.parentNode?.insertBefore(wrap, line);
      wrap.appendChild(line);
    });
    gsap.from(split.lines, {
      yPercent: 105,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
}

// ── Scroll reveal: cards (fade-up stagger) ────────────────
export function revealCards(selector: string, stagger = 0.08): void {
  if (reduced) return;

  const groups = new Map<Element, Element[]>();

  document.querySelectorAll<Element>(selector).forEach((el) => {
    const parent = el.parentElement ?? document.body;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent)!.push(el);
  });

  groups.forEach((els) => {
    gsap.from(els, {
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger,
      scrollTrigger: {
        trigger: els[0],
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
}

// ── Scroll reveal: images (clip-path wipe) ────────────────
export function revealImage(selector: string): void {
  if (reduced) return;

  document.querySelectorAll<Element>(selector).forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

// ── Count-up stats ─────────────────────────────────────────
export function countUp(selector: string): void {
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    const target = parseFloat(el.dataset.target ?? '0');
    const suffix = el.dataset.suffix ?? '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const obj = { value: 0 };

    if (reduced) {
      el.textContent =
        (decimals ? target.toFixed(decimals) : Math.round(target).toLocaleString()) + suffix;
      return;
    }

    gsap.to(obj, {
      value: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      onUpdate() {
        const val = decimals
          ? obj.value.toFixed(decimals)
          : Math.round(obj.value).toLocaleString();
        el.textContent = val + suffix;
      },
    });
  });
}

// ── Highlighter sweep ──────────────────────────────────────
export function highlightSweep(selector: string): void {
  if (reduced) {
    document.querySelectorAll(selector).forEach((el) =>
      el.classList.add('is-visible')
    );
    return;
  }

  document.querySelectorAll<Element>(selector).forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => el.classList.add('is-visible'),
    });
  });
}

// ── Pinned "How it works" ──────────────────────────────────
export function initHowItWorksPins(): void {
  if (reduced) return;

  const section = document.querySelector<HTMLElement>('[data-hiw-section]');
  if (!section) return;

  const steps = section.querySelectorAll<HTMLElement>('[data-hiw-step]');
  const line = section.querySelector<HTMLElement>('[data-hiw-line-fill]');
  if (!steps.length) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${section.offsetHeight * 1.5}`,
      scrub: 0.5,
      pin: true,
      anticipatePin: 1,
    },
  });

  // Draw the connecting line
  if (line) {
    tl.from(line, { scaleY: 0, transformOrigin: 'top center', ease: 'none' }, 0);
  }

  // Light up each step
  steps.forEach((step, i) => {
    tl.to(
      step,
      { '--step-opacity': 1, '--step-y': '0px', duration: 0.2, ease: 'power2.out' },
      i * 0.18
    );
  });
}

// ── Stats bars (Benchmarks) ────────────────────────────────
export function revealBars(selector: string): void {
  if (reduced) {
    document.querySelectorAll<HTMLElement>(selector).forEach((bar) => {
      bar.style.width = bar.dataset.width ?? '0%';
    });
    return;
  }

  document.querySelectorAll<HTMLElement>(selector).forEach((bar) => {
    const targetWidth = bar.dataset.width ?? '0%';
    gsap.from(bar, {
      width: 0,
      duration: 1.0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bar,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
    bar.style.width = targetWidth;
  });
}

// ── Tab highlight slider ───────────────────────────────────
export function initTabs(tabsSelector: string, panelsSelector: string): void {
  const tabs = document.querySelectorAll<HTMLElement>(tabsSelector);
  const panels = document.querySelectorAll<HTMLElement>(panelsSelector);
  if (!tabs.length) return;

  const highlight = document.querySelector<HTMLElement>('[data-tab-highlight]');

  function activate(index: number): void {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.setAttribute('tabindex', i === index ? '0' : '-1');
    });
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });
    if (highlight && tabs[index]) {
      const { offsetLeft, offsetWidth } = tabs[index];
      gsap.to(highlight, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.25,
        ease: 'power3.out',
      });
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') activate((i + 1) % tabs.length);
      if (e.key === 'ArrowLeft') activate((i - 1 + tabs.length) % tabs.length);
    });
  });

  activate(0);
}

// ── Directional section reveals (left / right / up / list) ────
export function initSectionReveal(): void {
  const sections = document.querySelectorAll<HTMLElement>('[data-animated-section]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const items = Array.from(section.querySelectorAll<HTMLElement>('[data-slide]'));
    if (!items.length) return;

    if (reduced) {
      items.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        items.forEach((el, i) => {
          const dir = el.dataset.slide ?? 'up';
          const isList = dir === 'list';
          gsap.from(el, {
            x: dir === 'left' ? -60 : dir === 'right' ? 60 : 0,
            y: isList ? 20 : dir === 'up' ? 40 : 0,
            opacity: 0,
            duration: isList ? 0.6 : 0.8,
            ease: 'power3.out',
            delay: i * (isList ? 0.06 : 0.1),
          });
        });
      },
    });
  });
}

// ── Init all scroll reveals ────────────────────────────────
export function initRevealAll(): void {
  revealText('[data-reveal="text"]');
  revealCards('[data-reveal="card"]');
  revealImage('[data-reveal="image"]');
  countUp('[data-count]');
  highlightSweep('[data-highlight]');
  revealBars('[data-bar]');
  initSectionReveal();
}
