export const InputTextMixin = superclass => class extends superclass {

	static get properties() {
		return {
			ariaInvalid: { type: String, attribute: 'aria-invalid' },
			ariaLabel: { type: String, attribute: 'aria-label' },
			autofocus: { type: Boolean },
			disabled: { type: Boolean, reflect: true },
			maxlength: { type: Number },
			minlength: { type: Number },
			name: { type: String },
			placeholder: { type: String },
			readonly: { type: Boolean },
			required: { type: Boolean }
		};
	}

	constructor() {
		super();
		this.autofocus = false;
		this.disabled = false;
		this.readonly = false;
		this.required = false;
	}

	focus() {
		const elem = this.shadowRoot.querySelector('.d2l-input');
		if (elem) elem.focus();
	}

};
