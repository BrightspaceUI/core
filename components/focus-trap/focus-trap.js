import { css, html, LitElement } from 'lit-element/lit-element.js';
import { forceFocusVisible, getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { isComposedAncestor } from '../../helpers/dom.js';

/**
 * A generic container component to trap user focus.
 * @fires d2l-focus-trap-enter - Dispatched when focus enters the trap. May be used to override initial focus placement when focus enters the trap.
 */
class FocusTrap extends LitElement {

	static get properties() {
		return {
			/**
			 * Whether the component should trap user focus.
			 * @type {boolean}
			 */
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
		const focusable = this.shadowRoot ? this.shadowRoot.querySelector('.d2l-focus-trap-start') : undefined;
		if (focusable) focusable.focus();
	}

	_focusFirst() {
		const focusable = this.shadowRoot ?
			getNextFocusable(this.shadowRoot.querySelector('.d2l-focus-trap-start'))
			: undefined;
		if (focusable) forceFocusVisible(focusable);
		this.dispatchEvent(new CustomEvent('d2l-focus-trap-enter', { bubbles: true, composed: true }));
	}

	_getContainer() {
		return this.shadowRoot ? this.shadowRoot.querySelector('.d2l-focus-trap-start').parentNode : undefined;
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
		if (this.shadowRoot && isComposedAncestor(container, e.relatedTarget)) {
			// user is exiting trap via forward tabbing...
			const firstFocusable = getNextFocusable(this.shadowRoot.querySelector('.d2l-focus-trap-start'));
			if (firstFocusable) {
				// Delay to re-apply the focus effects as a visual clue when there is only one focusable element
				setTimeout(() => {
					forceFocusVisible(firstFocusable);
				}, 50);
				return;
			}
		}
		this._focusFirst();
	}

	_handleStartFocusIn(e) {
		const container = this._getContainer();
		if (this.shadowRoot && isComposedAncestor(container, e.relatedTarget)) {
			// user is exiting trap via back tabbing...
			const lastFocusable = getPreviousFocusable(this.shadowRoot.querySelector('.d2l-focus-trap-end'));
			if (lastFocusable) {
				// Delay to re-apply the focus effects as a visual clue when there is only one focusable element
				setTimeout(() => {
					forceFocusVisible(lastFocusable);
				}, 50);
				return;
			}
		}
		this._focusFirst();
	}

}

customElements.define('d2l-focus-trap', FocusTrap);
