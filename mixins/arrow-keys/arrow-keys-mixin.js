import { html } from 'lit';

const keyCodes = Object.freeze({
	END: 35,
	HOME: 36,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
});

export const ArrowKeysMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			arrowKeysDirection: { type: String, attribute: 'arrow-keys-direction' },
			/**
			 * @ignore
			 */
			arrowKeysNoWrap: { type: Boolean, attribute: 'arrow-keys-no-wrap' }
		};
	}

	constructor() {
		super();
		this.arrowKeysDirection = 'leftright';
		this.arrowKeysNoWrap = false;
	}

	arrowKeysContainer(inner) {
		return html`<div class="arrow-keys-container" @keydown="${this._handleArrowKeys}">
			${inner}
		</div>`;
	}

	async arrowKeysFocusablesProvider() {
		return this.shadowRoot ?
			[...this.shadowRoot.querySelectorAll('.d2l-arrowkeys-focusable')]
			: [];
	}

	async _focus(elem) {
		if (elem) {
			if (this.arrowKeysOnBeforeFocus) await this.arrowKeysOnBeforeFocus(elem);
			elem.focus();
		}
	}

	async _focusFirst() {
		const elems = await this.arrowKeysFocusablesProvider();
		if (elems && elems.length > 0) return this._focus(elems[0]);
	}

	async _focusLast() {
		const elems = await this.arrowKeysFocusablesProvider();
		if (elems && elems.length > 0) return this._focus(elems[elems.length - 1]);
	}

	async _focusNext(elem) {
		const elems = await this.arrowKeysFocusablesProvider();
		const next = this._tryGetNextFocusable(elems, elem);
		return this._focus(next);
	}

	async _focusPrevious(elem) {
		const elems = await this.arrowKeysFocusablesProvider();
		const previous = this._tryGetPreviousFocusable(elems, elem);
		return this._focus(previous);
	}

	_handleArrowKeys(e) {
		const target = e.target;
		if (this.arrowKeysDirection.indexOf('left') >= 0 && e.keyCode === keyCodes.LEFT) {
			if (getComputedStyle(this).direction === 'rtl') {
				this._focusNext(target);
			} else {
				this._focusPrevious(target);
			}
		} else if (this.arrowKeysDirection.indexOf('right') >= 0 && e.keyCode === keyCodes.RIGHT) {
			if (getComputedStyle(this).direction === 'rtl') {
				this._focusPrevious(target);
			} else {
				this._focusNext(target);
			}
		} else if (this.arrowKeysDirection.indexOf('up') >= 0 && e.keyCode === keyCodes.UP) {
			this._focusPrevious(target);
		} else if (this.arrowKeysDirection.indexOf('down') >= 0 && e.keyCode === keyCodes.DOWN) {
			this._focusNext(target);
		} else if (e.keyCode === keyCodes.HOME) {
			this._focusFirst();
		} else if (e.keyCode === keyCodes.END) {
			this._focusLast();
		} else {
			return;
		}
		e.stopPropagation();
		e.preventDefault();
	}

	_tryGetNextFocusable(elems, elem) {
		if (!elems || elems.length === 0) return;

		const index = elems.indexOf(elem);
		if (index === elems.length - 1) {
			if (this.arrowKeysNoWrap) return;
			return elems[0];
		}
		return elems[index + 1];
	}

	_tryGetPreviousFocusable(elems, elem) {
		if (!elems || elems.length === 0) return;

		const index = elems.indexOf(elem);
		if (index === 0) {
			if (this.arrowKeysNoWrap) return;
			return elems[elems.length - 1];
		}
		return elems[index - 1];
	}

};
