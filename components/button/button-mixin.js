import { FocusVisiblePolyfillMixin } from '../../mixins/focus-visible-polyfill-mixin.js';

export const ButtonMixin = superclass => class extends FocusVisiblePolyfillMixin(superclass) {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			ariaExpanded: { type: String, reflect: true, attribute: 'aria-expanded' },
			/**
			 * @ignore
			 */
			ariaHaspopup: { type: String, reflect: true, attribute: 'aria-haspopup' },
			/**
			 * @ignore
			 */
			ariaLabel: { type: String, reflect: true, attribute: 'aria-label' },
			/**
			 * @ignore
			 */
			autofocus: { type: Boolean, reflect: true },
			/**
			 * Disables the button
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Tooltip text when disabled
			 */
			disabledTooltip: { type: String, attribute: 'disabled-tooltip' },
			/**
			 * @ignore
			 */
			form: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			formaction: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			formenctype: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			formmethod: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			formnovalidate: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			formtarget: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			name: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			type: { type: String, reflect: true }
		};
	}

	constructor() {
		super();
		this.autofocus = false;
		this.disabled = false;
		this.primary = false;
		this.type = 'button';
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('click', this._handleClick, true);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('click', this._handleClick, true);
	}

	focus() {
		const button = this.shadowRoot.querySelector('button');
		if (button) button.focus();
	}

	_getType() {
		if (this.type === 'submit' || this.type === 'reset') {
			return this.type;
		}
		return 'button';
	}

	_handleClick(e) {
		if (this.disabled) {
			e.stopPropagation();
		}
	}

};
