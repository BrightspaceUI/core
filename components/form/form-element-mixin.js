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
		return {};
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

	get label() {
		return null;
	}

	setCustomValidity(message) {
		this._validity = new FormElementValidityState({ customError: true });
		this._validationMessage = message;
	}

	setFormValue(formValue) {
		this.formValue = formValue;
	}

	setValidity(flags) {
		this._validity = new FormElementValidityState(flags);
		this._validationMessage = null;
	}

	async validate() {
		const customs = [...this._validationCustoms];
		const results = await Promise.all(customs.map(custom => custom.validate()));
		const errors = customs.map(custom => custom.failureText).filter((_, i) => !results[i]);
		if (!this.checkValidity()) {
			errors.unshift(this.validationMessage);
		}
		if (errors.length > 0) {
			this.validationTooltipShow(errors[0]);
			this.setAttribute('aria-invalid', 'true');
		} else {
			this.validationTooltipHide();
			this.setAttribute('aria-invalid', 'false');
		}
		return errors;
	}

	validationCustomConnected(custom) {
		this._validationCustoms.add(custom);
	}

	validationCustomDisconnected(custom) {
		this._validationCustoms.delete(custom);
	}

	get validationMessage() {
		return this._validationMessage ? this._validationMessage :  this.localizeValidity();
	}

	validationTooltipHide() {}

	// eslint-disable-next-line no-unused-vars
	validationTooltipShow(message) {}

	get validity() {
		return this._validity;
	}

	_validationCustomConnected(e) {
		e.stopPropagation();
		const custom = e.composedPath()[0];
		this.validationCustomConnected(custom);
	}

	_validationCustomDisconnected(e) {
		e.stopPropagation();
		const custom = e.composedPath()[0];
		this.validationCustomDisconnected(custom);
	}

};
