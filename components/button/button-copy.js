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
			_iconCheckTimeoutId: { state: true },
			_toastMessage: { state: true }
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
	}

	static get focusElementSelector() {
		return 'd2l-button-icon';
	}

	render() {
		return html`
			<d2l-button-icon ?disabled="${this.disabled}" icon="${this._iconCheckTimeoutId ? 'tier1:check' : 'tier1:copy'}" text="${this.localize('intl-common:actions:copy')}" @click="${this.#handleClick}"></d2l-button-icon>
			<d2l-alert-toast ?open="${this._toastMessage}" @d2l-alert-toast-close="${this.#handleToastClose}">${this._toastMessage}</d2l-alert-toast>
		`;
	}

	async #handleClick(e) {
		e.stopPropagation();
		if (this.disabled) return;

		clearTimeout(this._iconCheckTimeoutId);

		/** Dispatched when button is clicked. Use the event detail's `writeTextToClipboard` to write to the clipboard. */
		this.dispatchEvent(new CustomEvent('click', {
			detail: {
				writeTextToClipboard: async(text) => {
					text = text?.trim?.();
					if (!text) return false;
					try {
						// writeText can throw NotAllowedError (ex. iframe without allow="clipboard-write" in Chrome)
						await navigator.clipboard.writeText(text);
						this._toastMessage = this.localize('components.button-copy.copied');
						this._iconCheckTimeoutId = setTimeout(() => this._iconCheckTimeoutId = null, 2000);
						return true;
					} catch {
						return false;
					}
				}
			},
			bubbles: false
		}));

	}

	#handleToastClose() {
		this._toastMessage = null;
	}

}

customElements.define('d2l-button-copy', ButtonCopy);
