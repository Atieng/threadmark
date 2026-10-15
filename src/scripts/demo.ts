import { gsap } from 'gsap';

export function playThread(containerSelector = '[data-demo]'): void {
  const container = document.querySelector<HTMLElement>(containerSelector);
  if (!container) return;

  const messages = container.querySelectorAll<HTMLElement>('[data-msg]');
  const typingDot = container.querySelector<HTMLElement>('[data-typing]');
  const entryCard = container.querySelector<HTMLElement>('[data-entry-card]');
  const replayBtn = container.querySelector<HTMLButtonElement>('[data-replay]');
  const confirmBtn = container.querySelector<HTMLButtonElement>('.demo-confirm');
  const confirmedMsg = container.querySelector<HTMLElement>('[data-confirmed]');

  if (!messages.length) return;

  // Reset
  function reset(): void {
    gsap.set(messages, { opacity: 0, y: 12 });
    gsap.set(entryCard, { opacity: 0, y: 20, rotate: -1 });
    if (typingDot) gsap.set(typingDot, { opacity: 0 });
    if (replayBtn) replayBtn.hidden = true;
    if (confirmedMsg) confirmedMsg.hidden = true;
    if (confirmBtn) {
      confirmBtn.textContent = 'Confirm entry';
      confirmBtn.disabled = false;
    }
    // Remove highlight class so it can re-animate
    const highlightedMsg = container.querySelector<HTMLElement>('[data-msg][data-highlight-msg]');
    if (highlightedMsg) highlightedMsg.classList.remove('highlight-active');
  }

  function play(): void {
    reset();
    const tl = gsap.timeline({
      onComplete: () => {
        if (replayBtn) replayBtn.hidden = false;
      },
    });

    const delays = [0, 0.9, 1.8, 2.9];

    messages.forEach((msg, i) => {
      const isLast = i === messages.length - 1;

      // Show typing indicator before this message (except first)
      if (i > 0 && typingDot) {
        tl.to(typingDot, { opacity: 1, duration: 0.2 }, delays[i] - 0.5);
        tl.to(typingDot, { opacity: 0, duration: 0.15 }, delays[i] - 0.1);
      }

      // Reveal message
      tl.to(msg, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, delays[i]);

      // Highlight sweep on last message
      if (isLast) {
        const highlightBg = msg.querySelector<HTMLElement>('[data-highlight-bg]');
        if (highlightBg) {
          tl.fromTo(
            highlightBg,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 0.55, ease: 'power3.out' },
            delays[i] + 0.35
          );
        }
      }
    });

    // Entry card slides in
    tl.to(entryCard, { opacity: 1, y: 0, rotate: -1, duration: 0.6, ease: 'power3.out' }, delays[delays.length - 1] + 0.7);
  }

  // Confirm button
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      confirmBtn.textContent = 'Confirmed — now searchable';
      confirmBtn.disabled = true;
      confirmBtn.style.background = 'var(--color-moss)';
      if (confirmedMsg) {
        confirmedMsg.hidden = false;
        gsap.from(confirmedMsg, { opacity: 0, y: 8, duration: 0.4, ease: 'power2.out' });
      }
    });
  }

  // Replay
  if (replayBtn) {
    replayBtn.addEventListener('click', play);
  }

  // Auto-play when section enters viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(container);
}
