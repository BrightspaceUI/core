import { css, html, LitElement } from 'lit';
import { getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { isComposedAncestor } from '../../helpers/dom.js';

const traps = [];

/**
 * A generic container component to trap user focus.
 * @fires d2l-focus-trap-enter - Dispatched when focus enters the trap. May be used to override initial focus placement when focus enters the trap.
 */
class FocusTrap extends FocusMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Whether the component should trap user focus.
			 * @type {boolean}
			 */
			trap: { type: Boolean },
			_legacyPromptIds: { state: true }
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

	static #exemptSelectors = [
		'.equatio-toolbar-wrapper',
		'.equatio-toolbar-shadow-root-container'
	].join(', ');

	static #isExempt(target) {
		return !!target.closest(this.#exemptSelectors);
	}

	constructor() {
		super();
		this.trap = false;
		this._handleBodyFocus = this._handleBodyFocus.bind(this);
		this._handleLegacyPromptOpen = this._handleLegacyPromptOpen.bind(this);
		this._handleLegacyPromptClose = this._handleLegacyPromptClose.bind(this);
		this._legacyPromptIds = new Set();
	}

	static get focusElementSelector() {
		return '.d2l-focus-trap-start';
	}

	connectedCallback() {
		super.connectedCallback();
		document.body.addEventListener('focus', this._handleBodyFocus, true);
		document.body.addEventListener('d2l-legacy-prompt-open', this._handleLegacyPromptOpen);
		document.body.addEventListener('d2l-legacy-prompt-close', this._handleLegacyPromptClose);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		document.body.removeEventListener('focus', this._handleBodyFocus, true);
		document.body.removeEventListener('d2l-legacy-prompt-open', this._handleLegacyPromptOpen);
		document.body.removeEventListener('d2l-legacy-prompt-close', this._handleLegacyPromptClose);
	}

	render() {
		const tabindex = (this.trap && this._legacyPromptIds.size === 0) ? '0' : undefined;
		return html`
			<span class="d2l-focus-trap-start" @focusin="${this._handleStartFocusIn}" tabindex="${ifDefined(tabindex)}"></span>
			<slot></slot>
			<span class="d2l-focus-trap-end" @focusin="${this._handleEndFocusIn}" tabindex="${ifDefined(tabindex)}"></span>
		`;
	}

	willUpdate(changedProperties) {
		if (!changedProperties.has('trap')) return;
		if (this.trap) {
			traps.push(this);
		} else {
			const trapIndex = traps.findIndex(trap => trap === this);
			if (trapIndex === -1) return;
			traps.splice(trapIndex, 1);
		}
	}

	_focusFirst() {
		const focusable = this.shadowRoot &&
			getNextFocusable(this.shadowRoot.querySelector('.d2l-focus-trap-start'));
		if (focusable) focusable.focus();
		this.dispatchEvent(new CustomEvent('d2l-focus-trap-enter', { bubbles: true, composed: true }));
	}

	_getContainer() {
		return this.shadowRoot && this.shadowRoot.querySelector('.d2l-focus-trap-start').parentNode;
	}

	_handleBodyFocus(e) {
		const lastTrap = traps[traps.length - 1];
		if (!this.trap || this._legacyPromptIds.size > 0 || lastTrap !== this) return;
		const container = this._getContainer();
		const target = e.composedPath()[0];
		if (isComposedAncestor(container, target) || FocusTrap.#isExempt(target)) return;
		this._focusFirst();
	}

	_handleEndFocusIn(e) {
		const container = this._getContainer();
		if (this.shadowRoot && (isComposedAncestor(container, e.relatedTarget) || FocusTrap.#isExempt(e.relatedTarget))) {
			// user is exiting trap via forward tabbing...
			const firstFocusable = getNextFocusable(this.shadowRoot.querySelector('.d2l-focus-trap-start'));
			if (firstFocusable) {
				// Delay to re-apply the focus effects as a visual clue when there is only one focusable element
				setTimeout(() => firstFocusable.focus(), 50);
				return;
			}
		}
		this._focusFirst();
	}

	_handleLegacyPromptClose(e) {
		this._legacyPromptIds.delete(e.detail.id);
		this.requestUpdate();
	}

	_handleLegacyPromptOpen(e) {
		this._legacyPromptIds.add(e.detail.id);
		this.requestUpdate();
	}

	_handleStartFocusIn(e) {
		const container = this._getContainer();
		if (this.shadowRoot && (isComposedAncestor(container, e.relatedTarget) || FocusTrap.#isExempt(e.relatedTarget))) {
			// user is exiting trap via back tabbing...
			const lastFocusable = getPreviousFocusable(this.shadowRoot.querySelector('.d2l-focus-trap-end'));
			if (lastFocusable) {
				// Delay to re-apply the focus effects as a visual clue when there is only one focusable element
				setTimeout(() => lastFocusable.focus(), 50);
				return;
			}
		}
		this._focusFirst();
	}

}

customElements.define('d2l-focus-trap', FocusTrap);
