import { ValidationLocalizeMixin } from '../validation/validation-localize-mixin.js';

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

	get badInput() {
		return this.flags.badInput;
	}
	get customError() {
		return this.flags.customError;
	}
	get patternMismatch() {
		return this.flags.patternMismatch;
	}
	get stepMismatch() {
		return this.flags.stepMismatch;
	}
	get tooLong() {
		return this.flags.tooLong;
	}
	get tooShort() {
		return this.flags.tooShort;
	}
	get valid() {
		return Object.values(this.flags).reduce((f1, f2) => !f1 && !f2);
	}

	get valueMissing() {
		return this.flags.valueMissing;
	}

}

export const FormElementMixin = superclass => class extends ValidationLocalizeMixin(superclass) {

	static get properties() {
		return {
			_validationMessage: { type: String },
			_validity: { type: Object }
		};
	}

	constructor() {
		super();
		this._validity = new FormElementValidityState({});
		this._validationMessage = '';
		this.formValue = null;
		this._validationCustoms = new Set();

		this.addEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
		this.addEventListener('d2l-validation-custom-disconnected', this._validationCustomDisconnected);
	}

	checkValidity() {
		return this._validity && this._validity.valid;
	}

	get formAssociated() {
		return true;
	}

	hideValidationTooltip() {

	}

	setFormValue(formValue) {
		this.formValue = formValue;
	}

	setValidity(flags, message) {
		this._validity = new FormElementValidityState(flags);
		if (!this._validity.valid) {
			this._validationMessage = message;
		} else {
			this._validationMessage = null;
		}
	}

	showValidationTooltip() {
		return false;
	}

	async validateInternalCustoms() {
		const customs = [...this._validationCustoms];
		const results = await Promise.all(customs.map(custom => custom.validate()));
		return customs.map(custom => custom.failureText).filter((_, i) => !results[i]);
	}

	get validationMessage() {
		return this._validationMessage ? this._validationMessage :  this.localizeValidity();
	}

	get validity() {
		return this._validity;
	}

	_validationCustomConnected(e) {
		e.stopPropagation();
		const custom = e.composedPath()[0];
		this._validationCustoms.add(custom);
	}

	_validationCustomDisconnected(e) {
		e.stopPropagation();
		const custom = e.composedPath()[0];
		this._validationCustoms.delete(custom);
	}

};
