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
				customError: false
			},
			...flags
		};
	}

	get valid() {
		return Object.values(this.flags).reduce((f1, f2) => !f1 && !f2);
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

	static formAssociated = true;

	constructor() {
		super();
		this._validity = new FormElementValidityState({});
		this._validationMessage = '';
		this.formValue = null;
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

	setFormValue(formValue) {
		this.formValue = formValue;
	}

	get validity() {
		return this._validity;
	}

	get validationMessage() {
		// TODO: Generate message based on validity state or use custom
		return this._validationMessage;
	}
};
