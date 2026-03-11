import { html } from 'lit';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

export const CopyMixin = (superclass) => class extends LocalizeCoreElement(superclass) {

	static get properties() {
		return {
			/**
			 * Disables the button
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			_iconCheckTimeoutId: { state: true },
			_toastState: { state: true }
		};
	}

	constructor() {
		super();
		this.disabled = false;
	}

	async _handleClick(e) {
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
						this._toastState = 'copied';
						this._iconCheckTimeoutId = setTimeout(() => this._iconCheckTimeoutId = null, 2000);
						return true;
					} catch {
						this._toastState = 'error';
						return false;
					}
				}
			},
			bubbles: false
		}));

	}

	_handleToastClose() {
		this._toastState = null;
	}

	_renderToast() {
		return html`
			<d2l-alert-toast
				@d2l-alert-toast-close="${this._handleToastClose}"
				?open="${this._toastState}"
				type="${this._toastState === 'error' ? 'critical' : 'default'}">
					${this._toastState === 'error' ? this.localize('components.button-copy.error') : this.localize('components.button-copy.copied')}
			</d2l-alert-toast>
		`;
	}
};

