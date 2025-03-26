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
		if (!this.hasUpdated) {
			this._focusOnFirstRender = true;
			return;
		}

		const focusTarget = this._getFocusTarget();
		if (!focusTarget) {
			throw new Error(`FocusMixin: No focus target found for "${this.tagName}"`);
		}

		focusTarget.focus();
	}

	_getFocusTarget() {
		const selector = this.constructor.focusElementSelector;
		if (!selector) {
			throw new Error(`FocusMixin: no static focusElementSelector provided for "${this.tagName}"`);
		}

		const elem = this.shadowRoot.querySelector(selector);
		return elem;
	}

});
