import '../alert/alert-toast.js';
import './button-icon.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';

/**
 * A button component that copies to the clipboard.
 */
class ButtonCopy extends FocusMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Id of the element to copy
			 * @type {string}
			 */
			for: { type: String },
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
		this._toastOpen = false;
	}

	static get focusElementSelector() {
		return 'd2l-button-icon';
	}

	render() {
		return html`
			<d2l-button-icon icon="tier1:copy" text="Copy" @click="${this.#handleClick}"></d2l-button-icon>
			<d2l-alert-toast ?open="${this._toastOpen}" @d2l-alert-toast-close="${this.#handleToastClose}">Copied!</d2l-alert-toast>
		`;
	}

	#handleClick() {
		const elemToCopy = this.getRootNode().querySelector(`#${this.for}`);
		if (!elemToCopy) return;

		// todo: what to do with empty strings
		const value = elemToCopy.value || elemToCopy.textContent;
		if (!value) return;

		navigator.clipboard.writeText(value);
		this._toastOpen = true;
	}

	#handleToastClose() {
		this._toastOpen = false;
	}

}

customElements.define('d2l-button-copy', ButtonCopy);
