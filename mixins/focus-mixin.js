import { dedupeMixin } from '@open-wc/dedupe-mixin';

export const FocusMixin = dedupeMixin(superclass => class extends superclass {

	static focusElementSelector = null;

	constructor() {
		super();
		this._focusOnFirstRender = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this._focusOnFirstRender) {
			console.log(`focus ${this.tagName}: firstUpdated, focusing...`);
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
			console.log(`focus ${this.tagName}: not rendered yet`);
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
