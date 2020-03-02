import { getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { html } from 'lit-element/lit-element.js';
import { isComposedAncestor } from '../../helpers/dom.js';

export const FocusTrapMixin = superclass => class extends superclass {

	static get properties() {
		return {
			trap: { type: Boolean, reflect: true }
		};
	}

	constructor() {
		super();
		this.trap = false;
		this._handleFocusTrapBodyFocus = this._handleFocusTrapBodyFocus.bind(this);
	}

	async attributeChangedCallback(name, oldval, newval) {
		super.attributeChangedCallback(name, oldval, newval);
		if (name !== 'trap') return;
		if (this.trap) {
			document.body.addEventListener('focus', this._handleFocusTrapBodyFocus, true);
		} else {
			document.body.removeEventListener('focus', this._handleFocusTrapBodyFocus, true);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this.trap) {
			document.body.removeEventListener('focus', this._handleFocusTrapBodyFocus, true);
		}
	}

	_focusTrapFocusFirst() {
		if (this._focusFirst) {
			this._focusFirst();
			return;
		}
		const focusable = getNextFocusable(this.shadowRoot.querySelector('.d2l-focus-trap-start'));
		if (focusable) focusable.focus();
	}

	_getFocusTrapContainer() {
		return this.shadowRoot.querySelector('.d2l-focus-trap-start').parentNode;
	}

	_handleFocusTrapBodyFocus(e) {
		const trapContainer = this._getFocusTrapContainer();
		const target = e.composedPath()[0];
		if (isComposedAncestor(trapContainer, target)) return;
		this._focusTrapFocusFirst();
	}

	_handleFocusTrapEndFocusIn(e) {
		const trapContainer = this._getFocusTrapContainer();
		if (isComposedAncestor(trapContainer, e.relatedTarget)) {
			// user is exiting trap via forward tabbing...
			const firstFocusable = getNextFocusable(this.shadowRoot.querySelector('.d2l-focus-trap-start'));
			if (firstFocusable) {
				firstFocusable.focus();
				return;
			}
		}
		this._focusTrapFocusFirst();
	}

	_handleFocusTrapStartFocusIn(e) {
		const trapContainer = this._getFocusTrapContainer();
		if (isComposedAncestor(trapContainer, e.relatedTarget)) {
			// user is exiting trap via back tabbing...
			const lastFocusable = getPreviousFocusable(this.shadowRoot.querySelector('.d2l-focus-trap-end'));
			if (lastFocusable) {
				lastFocusable.focus();
				return;
			}
		}
		this._focusTrapFocusFirst();
	}

	_renderFocusTrap(inner) {
		if (this.trap) {
			return html`
				<span class="d2l-focus-trap-start" @focusin="${this._handleFocusTrapStartFocusIn}" tabindex="0"></span>
				${inner}
				<span class="d2l-focus-trap-end" @focusin="${this._handleFocusTrapEndFocusIn}" tabindex="0"></span>
			`;
		} else {
			return html`
				<span class="d2l-focus-trap-start" @focusin="${this._handleFocusTrapStartFocusIn}"></span>
				${inner}
				<span class="d2l-focus-trap-end" @focusin="${this._handleFocusTrapEndFocusIn}"></span>
			`;
		}

	}

};
