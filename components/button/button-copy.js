import '../alert/alert-toast.js';
import './button-icon.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * A button component that copies to the clipboard.
 */
class ButtonCopy extends FocusMixin(LocalizeCoreElement(LitElement)) {

	static get properties() {
		return {
			/**
			 * Disables the button
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			_toastOpen: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.disabled = false;
		this._toastOpen = false;
	}

	static get focusElementSelector() {
		return 'd2l-button-icon';
	}

	render() {
		return html`
			<d2l-button-icon ?disabled="${this.disabled}" icon="tier1:copy" text="Copy" @click="${this.#handleClick}"></d2l-button-icon>
			<d2l-alert-toast ?open="${this._toastOpen}" @d2l-alert-toast-close="${this.#handleToastClose}">Copied!</d2l-alert-toast>
		`;
	}

	#handleClick(e) {
		e.stopPropagation();
		if (this.disabled) return;
		this.dispatchEvent(new CustomEvent('click', {
			detail: { writeText: async(text) => {
				text = text?.trim();
				if (!text) return;
				await navigator.clipboard.writeText(text);
				this._toastOpen = true;
			} },
			bubbles: false
		}));
	}

	#handleToastClose() {
		this._toastOpen = false;
	}

}

customElements.define('d2l-button-copy', ButtonCopy);
