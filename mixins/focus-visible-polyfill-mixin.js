let polyfillLoading = false;

export const FocusVisiblePolyfillMixin = superclass => class extends superclass {

	connectedCallback() {

		super.connectedCallback();

		if (!this.shadowRoot) return;

		if (window.applyFocusVisiblePolyfill) {
			window.applyFocusVisiblePolyfill(this.shadowRoot);
			return;
		}

		window.addEventListener('focus-visible-polyfill-ready', () => {
			window.applyFocusVisiblePolyfill(this.shadowRoot);
		}, { once: true });

		if (!polyfillLoading) {
			polyfillLoading = true;
			import('focus-visible');
		}

	}
};
