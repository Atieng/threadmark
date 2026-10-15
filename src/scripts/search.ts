// Knowledge base search and filter logic is implemented inline in KnowledgeBase.astro.
// This module is available for external integrations or testing.

export function filterEntries(
  entries: NodeListOf<HTMLElement>,
  activeFilter: string,
  searchQuery: string,
  emptyEl: HTMLElement | null
): void {
  let visible = 0;
  entries.forEach((el) => {
    const type = el.dataset.type ?? '';
    const titleEl = el.querySelector<HTMLElement>('[data-entry-title]');
    const text = (titleEl?.textContent ?? '').toLowerCase();
    const typeOk = activeFilter === 'All' || type === activeFilter;
    const searchOk = !searchQuery || text.includes(searchQuery.toLowerCase());
    el.hidden = !(typeOk && searchOk);
    if (typeOk && searchOk) visible++;
  });
  if (emptyEl) emptyEl.hidden = visible > 0;
}
