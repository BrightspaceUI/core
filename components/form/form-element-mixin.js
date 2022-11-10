import { isCustomFormElement } from './form-helper.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

export class FormElementValidityState {

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
			/**
			 * @ignore
			 */
			forceInvalid: { type: Boolean, attribute: false },
			/**
			 * @ignore
			 */
			invalid: { type: Boolean, reflect: true },
			/**
			 * Name of the form control. Submitted with the form as part of a name/value pair.
			 * @type {string}
			 */
			name: { type: String },
			/**
			 * @ignore
			 */
			noValidate: { type: Boolean, attribute: 'novalidate' },
			/**
			 * @ignore
			 * Perform validation immediately instead of waiting for the user to make changes.
			 */
			validateOnInit: { type: Boolean, attribute: 'validate-on-init' },
			/**
			 * @ignore
			 */
			validationError: { type: String, attribute: false },
			/**
			 * @ignore
			 */
			childErrors: { type: Object, attribute: false },
			_errors: { type: Array, attribute: false }
		};
	}

	constructor() {
		super();
		this._validationCustomConnected = this._validationCustomConnected.bind(this);
		this._onFormElementErrorsChange = this._onFormElementErrorsChange.bind(this);

		this._firstUpdateResolve = null;
		this._firstUpdatePromise = new Promise((resolve) => {
			this._firstUpdateResolve = resolve;
		});
		this._validationCustoms = new Set();
		this._validity = new FormElementValidityState({});
		/** @ignore */
		this.forceInvalid = false;
		/** @ignore */
		this.formValue = null;
		/** @ignore */
		this.invalid = false;
		/** @ignore */
		this.noValidate = false;
		/** @ignore */
		this.validateOnInit = false;
		/** @ignore */
		this.validationError = null;
		/** @ignore */
		this.childErrors = new Map();
		this._errors = [];
	}

	/** @ignore */
	get formAssociated() {
		return true;
	}

	/** @ignore */
	get validationMessage() {
		const label = this.label || this.localize('components.form-element.defaultFieldLabel');
		if (this.validity.valueMissing) {
			return this.localize('components.form-element.valueMissing', { label });
		}
		return this.localize('components.form-element.defaultError', { label });
	}

	/** @ignore Note: this may be our custom FormElementValidityState or native ValidityState depending on the source. */
	get validity() {
		return this._validity;
	}

	connectedCallback() {
		super.connectedCallback();
		this.shadowRoot.addEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
		this.shadowRoot.addEventListener('d2l-form-element-errors-change', this._onFormElementErrorsChange);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.shadowRoot.removeEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
		this.shadowRoot.removeEventListener('d2l-form-element-errors-change', this._onFormElementErrorsChange);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._firstUpdateResolve();
	}

	updated(changedProperties) {
		if (changedProperties.has('_errors') || changedProperties.has('childErrors')) {
			let errors = this._errors;
			for (const childErrors of this.childErrors.values()) {
				errors = [...childErrors, ...errors];
			}
			const options = { bubbles: true, composed: true, detail: { errors } };
			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-form-element-errors-change', options));
		}
		if (changedProperties.has('noValidate') || changedProperties.has('forceInvalid') || changedProperties.has('validationError')) {
			const oldValue = this.invalid;
			this.invalid = (this.forceInvalid || this.validationError !== null) && !this.noValidate;
			if (this.invalid !== oldValue) {
				/** @ignore */
				this.dispatchEvent(new CustomEvent('invalid-change'));
			}
		}
		if (this.validateOnInit && (changedProperties.has('noValidate') || changedProperties.has('validateOnInit'))) {
			this.requestValidate(true);
		}
	}

	async requestValidate(showNewErrors = true) {
		if (this.noValidate) {
			return [];
		}

		// validation can be requested before first update, which can cause issues
		// if validation logic depends on rendered DOM
		await this._firstUpdatePromise;

		const customs = [...this._validationCustoms].filter(custom => custom.forElement === this || !isCustomFormElement(custom.forElement));
		const results = await Promise.all(customs.map(custom => custom.validate()));
		const errors = customs.map(custom => custom.failureText).filter((_, i) => !results[i]);
		if (!this.validity.valid) {
			errors.unshift(this.validationMessage);
		}
		const oldValidationError = this.validationError;
		if (errors.length > 0 && (showNewErrors || this.validationError)) {
			this.validationError = errors[0];
		} else {
			this.validationError = null;
		}
		if (oldValidationError !== this.validationError) {
			this._errors = errors;
		}
		await this.updatedComplete;
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
		if (this.validateOnInit) {
			this.requestValidate(true);
		}
	}

	validationCustomDisconnected(custom) {
		this._validationCustoms.delete(custom);
	}

	_onFormElementErrorsChange(e) {
		e.stopPropagation();
		const errors = e.detail.errors;
		if (errors.length === 0) {
			if (this.childErrors.has(e.target)) {
				this.childErrors.delete(e.target);
				this.requestUpdate('childErrors');
			}
		} else {
			this.childErrors.set(e.target, errors);
			this.requestUpdate('childErrors');
		}
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
