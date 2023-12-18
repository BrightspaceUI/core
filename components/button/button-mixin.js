import { FocusMixin } from '../../mixins/focus/focus-mixin.js';

export const ButtonMixin = superclass => class extends FocusMixin(superclass) {

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
			// eslint-disable-next-line lit/no-native-attributes
			autofocus: { type: Boolean, reflect: true },
			/**
			 * Disables the button
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Tooltip text when disabled
			 * @type {string}
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
		this.disabled = false;

		/** @ignore */
		this.autofocus = false;

		/** @ignore */
		this.type = 'button';
	}

	/**
	 * @attr disabled - Disables the button
	 */
	get disabled() { return this._disabled; }
	set disabled(value) {
		const oldValue = this._disabled;
		this._disabled = value;
		this.requestUpdate('disabled', oldValue);
	}

	/**
	 * @attr disabled-tooltip - Tooltip text when disabled
	 * @type {string}
	 */
	get disabledTooltip() { return this._disabledTooltip; }
	set disabledTooltip(value) {
		const oldValue = this._disabledTooltip;
		this._disabledTooltip = value;
		this.requestUpdate('disabledTooltip', oldValue);
	}

	static get focusElementSelector() {
		return 'button';
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('click', this._handleClick, true);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('click', this._handleClick, true);
	}

	/** @internal */
	_getType() {
		if (this.type === 'submit' || this.type === 'reset') {
			return this.type;
		}
		return 'button';
	}

	/** @internal */
	_handleClick(e) {
		if (this.disabled) {
			e.stopPropagation();
		}
	}

};
