const prefersReducedMotion = typeof window !== 'undefined'
	&& window.matchMedia
	&& window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ensureElementVisible(totalStickyOffset, scrollContainer, element) {
	if (!element) return;
	const rect = element.getBoundingClientRect();
	const viewportHeight = window.innerHeight;

	// Buffer for focus rings + breathing room.
	const totalBuffer = 14;

	// Determine visibility relative to sticky offset & viewport.
	const isHiddenBySticky = (rect.top - totalBuffer) < totalStickyOffset;
	const isOutsideViewport = (rect.bottom + totalBuffer) > viewportHeight || (rect.top - totalBuffer) < 0;

	if (!isHiddenBySticky && !isOutsideViewport) return;
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

export function getScrollContainer(container) {
	while (container && container !== document.documentElement) {
		const style = window.getComputedStyle(container);
		const overflow = style.overflowY || style.overflow;
		if (overflow === 'auto' || overflow === 'scroll') return container;
		container = container.parentElement;
	}
	return document.documentElement;
}
