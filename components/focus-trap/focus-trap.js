import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { isComposedAncestor } from '../../helpers/dom.js';

class FocusTrap extends LitElement {

	static get properties() {
		return {
			trap: { type: Boolean }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: hidden;
			}
		`;
	}

	constructor() {
		super();
		this.trap = false;
		this._handleBodyFocus = this._handleBodyFocus.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		document.body.addEventListener('focus', this._handleBodyFocus, true);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		document.body.removeEventListener('focus', this._handleBodyFocus, true);
	}

	render() {
		const tabindex = this.trap ? '0' : undefined;
		return html`
			<span class="d2l-focus-trap-start" @focusin="${this._handleStartFocusIn}" tabindex="${ifDefined(tabindex)}"></span>
			<slot></slot>
			<span class="d2l-focus-trap-end" @focusin="${this._handleEndFocusIn}" tabindex="${ifDefined(tabindex)}"></span>
		`;
	}

	focus() {
		this.shadowRoot.querySelector('.d2l-focus-trap-start').focus();
	}

	_focusFirst() {
		const focusable = getNextFocusable(this.shadowRoot.querySelector('.d2l-focus-trap-start'));
		if (focusable) focusable.focus();
		this.dispatchEvent(new CustomEvent('d2l-focus-trap-enter', { bubbles: true, composed: true }));
	}

	_getContainer() {
		return this.shadowRoot.querySelector('.d2l-focus-trap-start').parentNode;
	}

	_handleBodyFocus(e) {
		if (!this.trap) return;
		const container = this._getContainer();
		const target = e.composedPath()[0];
		if (isComposedAncestor(container, target)) return;
		this._focusFirst();
	}

	_handleEndFocusIn(e) {
		const container = this._getContainer();
		if (isComposedAncestor(container, e.relatedTarget)) {
			// user is exiting trap via forward tabbing...
			const firstFocusable = getNextFocusable(this.shadowRoot.querySelector('.d2l-focus-trap-start'));
			if (firstFocusable) {
				firstFocusable.focus();
				return;
			}
		}
		this._focusFirst();
	}

	_handleStartFocusIn(e) {
		const container = this._getContainer();
		if (isComposedAncestor(container, e.relatedTarget)) {
			// user is exiting trap via back tabbing...
			const lastFocusable = getPreviousFocusable(this.shadowRoot.querySelector('.d2l-focus-trap-end'));
			if (lastFocusable) {
				lastFocusable.focus();
				return;
			}
		}
		this._focusFirst();
	}

}

customElements.define('d2l-focus-trap', FocusTrap);
