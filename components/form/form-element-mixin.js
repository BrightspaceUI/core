export class FormElementValidityState {

	constructor(flags) {
		this.flags = {
			...{
				valueMissing: false,
				typeMismatch: false,
				patternMismatch: false,
				tooLong: false,
				tooShort: false,
				rangeUnderflow: false,
				rangeOverflow: false,
				stepMismatch: false,
				badInput: false,
				customError: false,
				valid: false
			},
			...flags
		};
	}

	get valid() {
		return this.flags.valid;
	}

	get valueMissing() {
		return this.flags.valueMissing;
	}

	get patternMismatch() {
		return this.flags.patternMismatch;
	}

	get tooLong() {
		return this.flags.tooLong;
	}

	get tooShort() {
		return this.flags.tooShort;
	}

	get stepMismatch() {
		return this.flags.stepMismatch;
	}

	get badInput() {
		return this.flags.badInput;
	}

	get customError() {
		return this.flags.customError;
	}
}

export const FormElementMixin = superclass => class extends superclass {

	static get properties() {
		return {
			invalid: { type: Boolean, reflect: true },
			_validationMessage: { type: String },
			_validity: { type: Object }
		};
	}

	constructor() {
		super();
		this.__hiddenInput = document.createElement('input');
		this.__hiddenInput.type = 'hidden';
		this._validity = new FormElementValidityState({ valid: true });
		this._validationMessage = '';
	}

	connectedCallback() {
		super.connectedCallback();
		this.dispatchEvent(new CustomEvent(
			'd2l-form-element-connected', { bubbles: true, composed: true }
		));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.dispatchEvent(new CustomEvent(
			'd2l-form-element-disconnected', { bubbles: true, composed: true }
		));
	}

	checkValidity() {
		return this._validity && this._validity.valid;
	}

	setValidity(flags, message) {
		if (message !== undefined) {
			this._validationMessage = message;
		}
		this._validity = new FormElementValidityState(flags);
		this.invalid = !this._validity.valid;
	}

	get validity() {
		return this._validity;
	}

	get validationMessage() {
		// TODO: Generate message based on validity state or use custom
		return this._validationMessage;
	}
};
