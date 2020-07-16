import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { tryGetLabelText } from './form-helper.js';

export class FormElementValidityState {

	static get supportedFlags() {
		return {
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
		};
	}
	constructor(flags) {
		const flagNames = Object.keys(flags);
		const invalidFlags = flagNames.filter(name => !(name in FormElementValidityState.supportedFlags));
		if (invalidFlags.length > 0) {
			flags = flagNames
				.filter(name => name in FormElementValidityState.supportedFlags)
				.reduce((res, name) => {
					res[name] = flags[name];
					return res;
				}, {});
			console.warn(`validity state was constructed with invalid flags: ${invalidFlags}`);
		}
		this.flags = { ...this.constructor.supportedFlags, ...flags};
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

	get rangeOverflow() {
		return this.flags.rangeOverflow;
	}

	get rangeUnderflow() {
		return this.flags.rangeUnderflow;
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
		return Object.values(this.flags).reduce((f1, f2) => f1 && !f2, true);
	}

	get valueMissing() {
		return this.flags.valueMissing;
	}

}

export const FormElementMixin = superclass => class extends LocalizeCoreElement(superclass) {

	static get properties() {
		return {
			forceInvalid: { type: Boolean, attribute: false },
			invalid: { type: Boolean, reflect: true },
			validationError: { type: String, attribute: false },
		};
	}

	constructor() {
		super();
		this._validationCustoms = new Set();
		this._validationMessage = '';
		this._validity = new FormElementValidityState({});
		this.forceInvalid = false;
		this.formValue = null;
		this.invalid = false;
		this.validationError = null;

		this.addEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
		this.addEventListener('d2l-validation-custom-disconnected', this._validationCustomDisconnected);
	}

	updated(changedProperties) {
		changedProperties.forEach((_, propName) => {
			if (propName === 'forceInvalid' || propName === 'validationError') {
				this.invalid = this.forceInvalid || this.validationError !== null;
			}
		});
	}

	checkValidity() {
		return this.validity.valid;
	}

	get formAssociated() {
		return true;
	}

	get labelText() {
		const label = this.label || tryGetLabelText(this);
		if (label) {
			return label;
		}
		console.warn(this, ' is missing a label');
		return this.localize('components.form-element-mixin.defaultFieldLabel');
	}

	async requestValidate(showErrors = true) {
		if (this.dispatchEvent(new CustomEvent('d2l-form-element-should-validate', { cancelable: true }))) {
			await this.validate(showErrors);
		}
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

	async validate(showErrors) {
		await this.updateComplete;
		const customs = [...this._validationCustoms];
		const results = await Promise.all(customs.map(custom => custom.validate()));
		const errors = customs.map(custom => custom.failureText).filter((_, i) => !results[i]);
		if (!this.checkValidity()) {
			errors.unshift(this.validationMessage);
		}
		if (errors.length === 0) {
			this.validationError = null;
		} else if (showErrors || this.validationError) {
			this.validationError = errors[0];
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
		const validity = this.validity;
		switch (true) {
			case validity.valid:
				return null;
			case validity.customError:
				return this._validationMessage;
			case validity.badInput:
				return this.validationMessageBadInput;
			case validity.patternMismatch:
				return this.validationMessagePatternMismatch;
			case validity.rangeOverflow:
				return this.validationMessageRangeOverflow;
			case validity.rangeUnderflow:
				return this.validationMessageRangeUnderflow;
			case validity.stepMismatch:
				return this.validationMessageStepMismatch;
			case validity.tooLong:
				return this.validationMessageTooLong;
			case validity.tooShort:
				return this.validationMessageTooShort;
			case validity.typeMismatch:
				return this.validationMessageTypeMismatch;
			case validity.valueMissing:
				return this.validationMessageValueMissing;
		}
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageBadInput() {
		console.warn(this, ' is using the default validation message, override \'validationMessageBadInput\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessagePatternMismatch() {
		console.warn(this, ' is using the default validation message, override \'validationMessagePatternMismatch\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageRangeOverflow() {
		console.warn(this, ' is using the default validation message, override \'validationMessageRangeOverflow\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageRangeUnderflow() {
		console.warn(this, ' is using the default validation message, override \'validationMessageRangeUnderflow\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageStepMismatch() {
		console.warn(this, ' is using the default validation message, override \'validationMessageStepMismatch\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageTooLong() {
		console.warn(this, ' is using the default validation message, override \'validationMessageTooLong\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageTooShort() {
		console.warn(this, ' is using the default validation message, override \'validationMessageTooShort\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageTypeMismatch() {
		console.warn(this, ' is using the default validation message, override \'validationMessageTypeMismatch\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageValueMissing() {
		return this.localize('components.form-element-mixin.valueMissingMessage', { label: this.labelText });
	}

	get validity() {
		return this._validity;
	}

	_validationCustomConnected(e) {
		e.stopPropagation();
		const custom = e.detail.validationCustom;
		this.validationCustomConnected(custom);
	}

	_validationCustomDisconnected(e) {
		e.stopPropagation();
		const custom = e.detail.validationCustom;
		this.validationCustomDisconnected(custom);
	}

};
