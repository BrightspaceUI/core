import { getLabelText } from './form-helper.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';

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

	constructor() {
		super();
		this._validationCustoms = new Set();
		this._validationMessage = '';
		this._validity = new FormElementValidityState({});
		this.formValue = null;

		this.addEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
		this.addEventListener('d2l-validation-custom-disconnected', this._validationCustomDisconnected);
	}

	checkValidity() {
		return this.validity.valid;
	}

	get formAssociated() {
		return true;
	}

	get label() {
		return null;
	}

	get labelText() {
		const label = this.label || getLabelText(this);
		if (label) {
			return label;
		}
		console.warn(this, ' is missing a label');
		return this.localize('components.form-element-mixin.defaultFieldLabel');
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
		await this.updateComplete;
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
		const validity = this.validity;
		if (validity.valid) {
			return null;
		}
		if (validity.customError) {
			return this._validationMessage;
		}
		if (validity.badInput) {
			return this.validationMessageBadInput;
		}
		if (validity.patternMismatch) {
			return this.validationMessagePatternMismatch;
		}
		if (validity.rangeOverflow) {
			return this.validationMessageRangeOverflow;
		}
		if (validity.rangeUnderflow) {
			return this.validationMessageRangeUnderflow;
		}
		if (validity.stepMismatch) {
			return this.validationMessageStepMismatch;
		}
		if (validity.tooLong) {
			return this.validationMessageTooLong;
		}
		if (validity.tooShort) {
			return this.validationMessageTooShort;
		}
		if (validity.typeMismatch) {
			return this.validationMessageTypeMismatch;
		}
		if (validity.valueMissing) {
			return this.validationMessageValueMissing;
		}
		console.warn(this, ' is using the default validation message for an unknown validity flag');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageBadInput() {
		console.warn(this, ' is using the default \'badInput\' validation message, override \'validationMessageBadInput\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessagePatternMismatch() {
		console.warn(this, ' is using the default \'patternMismatch\' validation message, override \'validationMessagePatternMismatch\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageRangeOverflow() {
		console.warn(this, ' is using the default \'stepMismatch\' validation message, override \'validationMessageRangeOverflow\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageStepMismatch() {
		console.warn(this, ' is using the default \'stepMismatch\' validation message, override \'validationMessageStepMismatch\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageTooLong() {
		console.warn(this, ' is using the default \'tooLong\' validation message, override \'validationMessageTooLong\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageTooShort() {
		console.warn(this, ' is using the default \'tooShort\' validation message, override \'validationMessageTooShort\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageTypeMismatch() {
		console.warn(this, ' is using the default \'tooShort\' validation message, override \'validationMessageTypeMismatch\'');
		return this.localize('components.form-element-mixin.defaultValidationMessage', { label: this.labelText });
	}

	get validationMessageValueMissing() {
		return this.localize('components.form-element-mixin.valueMissingMessage', { label: this.labelText });
	}

	validationTooltipHide() { }

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
