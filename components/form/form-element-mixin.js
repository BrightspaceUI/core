import { isCustomFormElement, tryGetLabelText } from './form-helper.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';

export const ValidationType = {
	SUPPRESS_ERRORS: 0,
	UPDATE_EXISTING_ERRORS: 1,
	SHOW_NEW_ERRORS: 2,
};

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
			noValidate: { type: Boolean, attribute: 'novalidate' },
			validationError: { type: String, attribute: false },
		};
	}

	constructor() {
		super();
		this._validationCustomConnected = this._validationCustomConnected.bind(this);

		this._validationCustoms = new Set();
		this._validationMessage = '';
		this._validity = new FormElementValidityState({});
		this.forceInvalid = false;
		this.formValue = null;
		this.invalid = false;
		this.noValidate = false;
		this.validationError = null;

		this.shadowRoot.addEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
	}

	updated(changedProperties) {
		changedProperties.forEach((_, propName) => {
			if (propName === 'noValidate' || propName === 'forceInvalid' || propName === 'validationError') {
				const oldValue = this.invalid;
				this.invalid = (this.forceInvalid || this.validationError !== null) && !this.noValidate;
				if (this.invalid !== oldValue) {
					this.dispatchEvent(new CustomEvent('invalid-change'));
				}
			}
			if (propName === 'noValidate' && this.noValidate) {
				this.validationError = null;
				this._notifyFormErrorsChanged([]);
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
		return this.localize('components.form-element.defaultFieldLabel');
	}

	async requestValidate(validationType = ValidationType.SHOW_NEW_ERRORS) {
		if (this.dispatchEvent(new CustomEvent('d2l-form-element-should-validate', { cancelable: true }))) {
			await this.validate(validationType);
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

	async validate(validationType) {
		if (this.noValidate) {
			return [];
		}
		const customs = [...this._validationCustoms].filter(custom => custom.forElement === this || !isCustomFormElement(custom.forElement));
		const results = await Promise.all(customs.map(custom => custom.validate()));
		const errors = customs.map(custom => custom.failureText).filter((_, i) => !results[i]);
		if (!this.checkValidity()) {
			errors.unshift(this.validationMessage);
		}
		switch (validationType) {
			case ValidationType.SUPPRESS_ERRORS:
				this.validationError = null;
				break;
			case ValidationType.UPDATE_EXISTING_ERRORS:
				if (this.validationError && errors.length > 0) {
					this.validationError = errors[0];
				} else {
					this.validationError = null;
				}
				break;
			case ValidationType.SHOW_NEW_ERRORS:
				if (errors.length > 0) {
					this.validationError = errors[0];
				} else {
					this.validationError = null;
				}
				break;
		}
		this._notifyFormErrorsChanged(errors);
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
		return this.localize('components.form-element.defaultError', { label: this.labelText });
	}

	get validationMessageBadInput() {
		console.warn(this, ' is using the default validation message, override \'validationMessageBadInput\'');
		return this.localize('components.form-element.defaultError', { label: this.labelText });
	}

	get validationMessagePatternMismatch() {
		console.warn(this, ' is using the default validation message, override \'validationMessagePatternMismatch\'');
		return this.localize('components.form-element.defaultError', { label: this.labelText });
	}

	get validationMessageRangeOverflow() {
		console.warn(this, ' is using the default validation message, override \'validationMessageRangeOverflow\'');
		return this.localize('components.form-element.defaultError', { label: this.labelText });
	}

	get validationMessageRangeUnderflow() {
		console.warn(this, ' is using the default validation message, override \'validationMessageRangeUnderflow\'');
		return this.localize('components.form-element.defaultError', { label: this.labelText });
	}

	get validationMessageStepMismatch() {
		console.warn(this, ' is using the default validation message, override \'validationMessageStepMismatch\'');
		return this.localize('components.form-element.defaultError', { label: this.labelText });
	}

	get validationMessageTooLong() {
		console.warn(this, ' is using the default validation message, override \'validationMessageTooLong\'');
		return this.localize('components.form-element.defaultError', { label: this.labelText });
	}

	get validationMessageTooShort() {
		console.warn(this, ' is using the default validation message, override \'validationMessageTooShort\'');
		return this.localize('components.form-element.defaultError', { label: this.labelText });
	}

	get validationMessageTypeMismatch() {
		console.warn(this, ' is using the default validation message, override \'validationMessageTypeMismatch\'');
		return this.localize('components.form-element.defaultError', { label: this.labelText });
	}

	get validationMessageValueMissing() {
		return this.localize('components.form-element.valueMissing', { label: this.labelText });
	}

	get validity() {
		return this._validity;
	}

	_notifyFormErrorsChanged(errors) {
		const detail = { bubbles: true, composed: true, detail: { errors } };
		this.dispatchEvent(new CustomEvent('d2l-form-errors-change', detail));
	}

	_validationCustomConnected(e) {
		e.stopPropagation();
		const custom = e.composedPath()[0];
		this.validationCustomConnected(custom);

		const onDisconnect = () => {
			custom.removeEventListener('d2l-validation-custom-disconnected', onDisconnect);
			this.validationCustomDisconnected(custom);
		};
		custom.addEventListener('d2l-validation-custom-disconnected', onDisconnect);
	}

};
