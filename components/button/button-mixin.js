import { FocusVisiblePolyfillMixin } from '../../mixins/focus-visible-polyfill-mixin.js';

export const ButtonMixin = superclass => class extends FocusVisiblePolyfillMixin(superclass) {

	static get properties() {
		return {
			/**
			 * Indicate expansion state of a collapsible element
			 */
			ariaExpanded: { type: String, reflect: true, attribute: 'aria-expanded' },
			/**
			 * Indicate clicking the button opens a menu
			 */
			ariaHaspopup: { type: String, reflect: true, attribute: 'aria-haspopup' },
			/**
			 * Acts as a primary label
			 */
			ariaLabel: { type: String, reflect: true, attribute: 'aria-label' },
			autofocus: { type: Boolean, reflect: true },
			/**
			 * Disables the button
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Tooltip text when disabled (optional)
			 */
			disabledTooltip: { type: String, attribute: 'disabled-tooltip' },
			form: { type: String, reflect: true },
			formaction: { type: String, reflect: true },
			formenctype: { type: String, reflect: true },
			formmethod: { type: String, reflect: true },
			formnovalidate: { type: String, reflect: true },
			formtarget: { type: String, reflect: true },
			name: { type: String, reflect: true },
			/**
			 * Styles the button as a primary button
			 */
			primary: { type: Boolean, reflect: true },
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
