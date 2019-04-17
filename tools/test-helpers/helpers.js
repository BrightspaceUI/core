window.D2L = window.D2L || {};
window.D2L.TestHelpers = window.D2L.TestHelpers || {};

export async function focus(selector, options) {
	const elemToFocus = queryShadowSelector(selector);
	if (!options || !options.waitFor) {
		elemToFocus.focus();
		return;
	}
	return new Promise((resolve) => {
		const elemToWait = queryShadowSelector(options.waitFor.selector);
		elemToWait.addEventListener(options.waitFor.eventName, resolve, { once: true });
		elemToFocus.focus();
	});
}
window.D2L.TestHelpers.focus = focus;

export function queryShadowSelector(selectors, elem) {

	if (!elem) elem = document;
	if (!selectors) return elem;

	if (!Array.isArray(selectors)) {
		return elem.querySelector(selectors);
	}

	return selectors.reduce((result, selector, index) => {
		if (!result) return null;
		if (index === 0) return result.querySelector(selector);
		if (!result.shadowRoot) return null;
		return result.shadowRoot.querySelector(selector);
	}, elem);

}
window.D2L.TestHelpers.queryShadowSelector = queryShadowSelector;
