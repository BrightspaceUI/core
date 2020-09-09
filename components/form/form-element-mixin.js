import { isCustomFormElement } from './form-helper.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';

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
		this.flags = { ...this.constructor.supportedFlags, ...flags };
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
			/**
			 * Name of the form control. Submitted with the form as part of a name/value pair.
			 */
			name: { type: String },
			noValidate: { type: Boolean, attribute: 'novalidate' },
			validationError: { type: String, attribute: false },
			childErrors: { type: Object, attribute: false },
			_errors: { type: Array, attribute: false }
		};
	}

	constructor() {
		super();
		this._validationCustomConnected = this._validationCustomConnected.bind(this);
		this._onFormElementErrorsChange = this._onFormElementErrorsChange.bind(this);

		this._validationCustoms = new Set();
		this._validity = new FormElementValidityState({});
		this.forceInvalid = false;
		this.formValue = null;
		this.invalid = false;
		this.noValidate = false;
		this.validationError = null;
		this.childErrors = new Map();
		this._errors = [];

		this.shadowRoot.addEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
		this.shadowRoot.addEventListener('d2l-form-element-errors-change', this._onFormElementErrorsChange);
	}

	updated(changedProperties) {
		if (changedProperties.has('_errors') || changedProperties.has('childErrors')) {
			let errors = this._errors;
			for (const childErrors of this.childErrors.values()) {
				errors = [...childErrors, ...errors];
			}
			const options = { bubbles: true, composed: true, detail: { errors } };
			this.dispatchEvent(new CustomEvent('d2l-form-element-errors-change', options));
		}
		changedProperties.forEach((_, propName) => {
			if (propName === 'noValidate' || propName === 'forceInvalid' || propName === 'validationError') {
				const oldValue = this.invalid;
				this.invalid = (this.forceInvalid || this.validationError !== null) && !this.noValidate;
				if (this.invalid !== oldValue) {
					this.dispatchEvent(new CustomEvent('invalid-change'));
				}
			}
		});
	}

	get formAssociated() {
		return true;
	}

	async requestValidate(showNewErrors = true) {
		if (this.noValidate) {
			return [];
		}
		const customs = [...this._validationCustoms].filter(custom => custom.forElement === this || !isCustomFormElement(custom.forElement));
		const results = await Promise.all(customs.map(custom => custom.validate()));
		const errors = customs.map(custom => custom.failureText).filter((_, i) => !results[i]);
		if (!this.validity.valid) {
			errors.unshift(this.validationMessage);
		}
		if (errors.length > 0 && (showNewErrors || this.validationError)) {
			this.validationError = errors[0];
		} else {
			this.validationError = null;
		}
		if (this._errors.length === errors.length) {
			let areEqual = true;
			for (let i = 0; areEqual && i < this._errors.length; i += 1) {
				areEqual = this._errors[i] === errors[i];
			}
			if (areEqual) {
				return;
			}
		}
		this._errors = errors;
	}

	setFormValue(formValue) {
		this.formValue = formValue;
	}

	setValidity(flags) {
		this._validity = new FormElementValidityState(flags);
	}

	async validate() {
		await this.requestValidate(true);
		return this._errors;
	}

	validationCustomConnected(custom) {
		this._validationCustoms.add(custom);
	}

	validationCustomDisconnected(custom) {
		this._validationCustoms.delete(custom);
	}

	get validationMessage() {
		const label = this.label || this.localize('components.form-element.defaultFieldLabel');
		if (this.validity.valueMissing) {
			return this.localize('components.form-element.valueMissing', { label });
		}
		return this.localize('components.form-element.defaultError', { label });
	}

	get validity() {
		return this._validity;
	}

	_onFormElementErrorsChange(e) {
		e.stopPropagation();
		const errors = e.detail.errors;
		if (errors.length === 0) {
			this.childErrors.delete(e.target);
		} else {
			this.childErrors.set(e.target, errors);
		}
		this.requestUpdate('childErrors');
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
