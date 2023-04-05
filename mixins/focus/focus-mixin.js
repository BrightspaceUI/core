import { dedupeMixin } from '@open-wc/dedupe-mixin';

export const FocusMixin = dedupeMixin(superclass => class extends superclass {

	constructor() {
		super();
		this._focusOnFirstRender = false;
	}

	static get focusElementSelector() {
		return null;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this._focusOnFirstRender) {
			this._focusOnFirstRender = false;
			this.focus();
		}
	}

	focus() {

		const selector = this.constructor.focusElementSelector;
		if (!selector) {
			throw new Error(`FocusMixin: no static focusElementSelector provided for "${this.tagName}"`);
		}

		if (!this.hasUpdated) {
			this._focusOnFirstRender = true;
			return;
		}

		const elem = this.shadowRoot.querySelector(selector);
		if (!elem) {
			throw new Error(`FocusMixin: selector "${selector}" yielded no element for "${this.tagName}"`);
		}

		elem.focus();

	}

});
