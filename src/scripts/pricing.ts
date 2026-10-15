// Pricing toggle animation is implemented inline in Pricing.astro.
// This module is available for external integrations or testing.

export function togglePricing(yearly: boolean): void {
  const monthlyBtn = document.getElementById('toggle-monthly') as HTMLButtonElement | null;
  const yearlyBtn = document.getElementById('toggle-yearly') as HTMLButtonElement | null;
  const priceEls = document.querySelectorAll<HTMLElement>('[data-price]');

  monthlyBtn?.setAttribute('aria-pressed', String(!yearly));
  yearlyBtn?.setAttribute('aria-pressed', String(yearly));

  priceEls.forEach((el) => {
    const monthly = parseFloat(el.dataset.monthly ?? '0');
    const yearlyVal = parseFloat(el.dataset.yearly ?? '0');
    const target = yearly ? yearlyVal : monthly;
    if (monthly === 0) { el.textContent = '0'; return; }
    el.textContent = Number.isInteger(target) ? String(target) : target.toFixed(2);
  });
}
