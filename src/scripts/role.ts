type Role = 'engineering' | 'support' | 'enterprise';

const ROLE_KEY = 'threadmark_role';

const roleContent: Record<Role, {
  heroSub: string;
  hiwDefaultTab: number;
  highlightedPricingTier: string;
}> = {
  engineering: {
    heroSub: "Threadmark catches every architecture decision, incident fix and technical answer the moment it's written in Slack or Teams — so your next hire doesn't ask the same questions twice.",
    hiwDefaultTab: 0,
    highlightedPricingTier: 'team',
  },
  support: {
    heroSub: "Threadmark turns your team's repeated answers into a searchable knowledge base that anyone can query in Slack — so your support queue shrinks and your team stops starting from scratch.",
    hiwDefaultTab: 1,
    highlightedPricingTier: 'business',
  },
  enterprise: {
    heroSub: "Threadmark gives compliance and legal teams an auditable trail of every decision made in Slack and Teams — private by default, searchable on demand, never leaves your cloud.",
    hiwDefaultTab: 2,
    highlightedPricingTier: 'enterprise',
  },
};

export function getRole(): Role {
  try {
    const saved = localStorage.getItem(ROLE_KEY) as Role | null;
    if (saved && saved in roleContent) return saved;
  } catch {
    // localStorage not available
  }
  return 'engineering';
}

export function setRole(role: Role): void {
  try {
    localStorage.setItem(ROLE_KEY, role);
  } catch {
    // localStorage not available
  }
  applyRole(role);
}

function applyRole(role: Role): void {
  const content = roleContent[role];

  // Update hero subheadline
  const heroSub = document.querySelector<HTMLElement>('[data-role="hero-sub"]');
  if (heroSub && content.heroSub) {
    heroSub.textContent = content.heroSub;
  }

  // Update How It Works default tab
  const hiwTabs = document.querySelectorAll<HTMLElement>('[data-hiw-tab]');
  if (hiwTabs.length > content.hiwDefaultTab) {
    hiwTabs[content.hiwDefaultTab].click();
  }

  // Highlight the right pricing tier
  const tiers = document.querySelectorAll<HTMLElement>('[data-pricing-tier]');
  tiers.forEach((tier) => {
    const tierName = tier.dataset.pricingTier;
    tier.classList.toggle('pricing-highlighted', tierName === content.highlightedPricingTier);
  });

  // Mark active path card
  const pathCards = document.querySelectorAll<HTMLElement>('[data-path-role]');
  pathCards.forEach((card) => {
    card.classList.toggle('path-active', card.dataset.pathRole === role);
  });
}

export function initRole(): void {
  // Check URL param first
  const params = new URLSearchParams(window.location.search);
  const param = params.get('for') as Role | null;
  if (param && param in roleContent) {
    setRole(param);
    return;
  }
  applyRole(getRole());
}

// Expose globally for onclick handlers
(window as unknown as Record<string, unknown>).setRole = setRole;
