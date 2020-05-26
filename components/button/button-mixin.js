export const ButtonMixin = superclass => class extends superclass {

	static get properties() {
		return {
			ariaExpanded: { type: String, reflect: true, attribute: 'aria-expanded' },
			ariaHaspopup: { type: String, reflect: true, attribute: 'aria-haspopup' },
			ariaLabel: { type: String, reflect: true, attribute: 'aria-label' },
			disabled: { type: Boolean, reflect: true },
			autofocus: { type: Boolean, reflect: true },
			form: { type: String, reflect: true },
			formaction: { type: String, reflect: true },
			formenctype: { type: String, reflect: true },
			formmethod: { type: String, reflect: true },
			formnovalidate: { type: String, reflect: true },
			formtarget: { type: String, reflect: true },
			name: { type: String, reflect: true },
			primary: { type: Boolean, reflect: true },
			type: { type: String, reflect: true }
		};
	}

	constructor() {
		super();
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
