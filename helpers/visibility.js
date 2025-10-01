const prefersReducedMotion = typeof window !== 'undefined'
	&& window.matchMedia
	&& window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ensureElementVisible(totalStickyOffset, scrollContainer, element) {
	if (!element || !scrollContainer) return;

	const rect = element.getBoundingClientRect();
	const totalBuffer = 14; // focus rings + breathing room
	const isHiddenBySticky = (rect.top - totalBuffer) < totalStickyOffset; 	// Determine visibility relative to sticky offset.

	if (!isHiddenBySticky) return;
	const currentScrollTop = scrollContainer.scrollTop || window.pageYOffset || 0;

	// Place element just below sticky region while honoring buffer.
	const desiredElementTop = totalStickyOffset + totalBuffer;
	const scrollAdjustment = rect.top - desiredElementTop;
	const targetScrollTop = currentScrollTop + scrollAdjustment;

	const behavior = prefersReducedMotion ? 'auto' : 'smooth';
	const top = Math.max(0, targetScrollTop);

	if (scrollContainer === document.documentElement) {
		window.scrollTo({ top, behavior });
	} else if (typeof scrollContainer.scrollTo === 'function') {
		scrollContainer.scrollTo({ top, behavior });
	}
}
