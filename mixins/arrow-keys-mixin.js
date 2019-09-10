import { html } from 'lit-element/lit-element.js';

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
			arrowKeysDirection: { type: String },
			arrowKeysNoWrap: { type: Boolean }
		};
	}

	constructor() {
		super();
		this.arrowKeysDirection = 'leftright';
		this.arrowKeysNoWrap = false;
	}

	arrowKeysContainer(inner) {
		return html`<div class="arrow-keys-container" @keyup="${this._handleArrowKeys}">
			${inner}
		</div>`;
	}

	async arrowKeysFocusablesProvider() {
		return [...this.shadowRoot.querySelectorAll('.d2l-arrowkeys-focusable')];
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
		e.preventDefault();
	}

	_focus(elem) {
		if (elem) {
			if (this.arrowKeysOnBeforeFocus) {
				this.arrowKeysOnBeforeFocus(elem).then(() => {
					elem.focus();
				});
			} else {
				elem.focus();
			}
		}
	}

	_focusFirst() {
		return this.arrowKeysFocusablesProvider().then(
			(elems) => {
				if (elems && elems.length > 0) {
					this._focus(elems[0]);
				}
			}
		);
	}

	_focusLast() {
		return this.arrowKeysFocusablesProvider().then(
			(elems) => {
				if (elems && elems.length > 0) {
					this._focus(elems[elems.length - 1]);
				}
			}
		);
	}

	_focusNext(elem) {
		return this.arrowKeysFocusablesProvider().then(
			(elems) => {
				const next = this._tryGetNextFocusable(elems, elem);
				this._focus(next);
			}
		);
	}

	_focusPrevious(elem) {
		return this.arrowKeysFocusablesProvider().then(
			(elems) => {
				const previous = this._tryGetPreviousFocusable(elems, elem);
				this._focus(previous);
			}
		);
	}

	_tryGetNextFocusable(elems, elem) {
		if (!elems || elems.length === 0) {
			return;
		}
		const index = elems.indexOf(elem);
		if (index === elems.length - 1) {
			if (this.arrowKeysNoWrap) {
				return;
			}
			return elems[0];
		}
		return elems[index + 1];
	}

	_tryGetPreviousFocusable(elems, elem) {
		if (!elems || elems.length === 0) {
			return;
		}
		const index = elems.indexOf(elem);
		if (index === 0) {
			if (this.arrowKeysNoWrap) {
				return;
			}
			return elems[elems.length - 1];
		}
		return elems[index - 1];
	}
};
