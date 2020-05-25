import { findFormElements } from '../form/form-helpers.js';

export const ValidationGroupMixin = superclass => class extends superclass {

	constructor() {
		super();
		this._onChangeEvent = this._onChangeEvent.bind(this);
		this._onUnload = this._onUnload.bind(this);
		this._errors = new Map();
	}

	get errors() {
		const errorLists = this._errors.values();
		return [].concat(...errorLists);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('change', this._onChangeEvent);
		this._errorSummary = this._findErrorSummary();
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('beforeunload', this._onUnload);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('beforeunload', this._onUnload);
	}

	async reportValidity() {
		const isValid = await this.checkValidity();
		if (!isValid) {
			this._updateErrorSummary();
		}
		return isValid;
	}

	async checkValidity() {
		const errors = new Map();
		errors.set(undefined, []);

		const formElements = findFormElements(this);
		for (const ele of formElements) {
			errors.set(ele, []);
		}
		const validationCustoms = this.querySelectorAll('d2l-validation-custom');
		const validations = [];
		for (const custom of validationCustoms) {
			validations.push(custom.validate());
		}
		const validationsPromise = Promise.all(validations);
		for (const ele of formElements) {
			if (!ele.checkValidity()) {
				errors.get(ele).push(ele.validationMessage);
			}
		}
		const validationResults = await validationsPromise;
		for (let i = 0; i < validationResults.length; i += 1) {
			const valid = validationResults[i];
			if (!valid) {
				const custom = validationCustoms[i];
				errors.get(custom.source).push(custom.failureText);
			}
		}
		this._errors = errors;
		return errors.size === 0;
	}

	commit() {
		if (!this.checkValidity()) {
			return false;
		}
		const formElements = findFormElements(this);
		for (const ele of formElements) {
			ele.classList.remove('d2l-dirty');
		}
		this._dirty = false;
		return true;
	}

	_findErrorSummary() {
		let errorSummary = this.querySelector('d2l-validation-error-summary');
		if (!errorSummary) {
			errorSummary = document.createElement('d2l-validation-error-summary');
			this.prepend(errorSummary);
		}
		return errorSummary;
	}

	async _onChangeEvent(e) {
		const ele = e.composedPath()[0];
		const formElements = findFormElements(this);
		if (formElements.indexOf(ele) === -1) {
			return;
		}
		const validationCustoms = ele.id ? this.querySelectorAll(`d2l-validation-custom[for="${ele.id}"]`) : [];
		const validations = [];
		for (const custom of validationCustoms) {
			validations.push(custom.validate());
		}
		const validationsPromise = Promise.all(validations);
		const validationResults = [ele.checkValidity(), ...await validationsPromise];
		const isValid = validationResults.reduce((v1, v2) => v1 && v2, true);
		if (isValid && this._errors.delete(ele)) {
			this._updateErrorSummary();
		}
		ele.classList.add('d2l-dirty');
		this._dirty = true;
	}

	_onUnload(e) {
		if (this._dirty) {
			e.returnValue = 'You have unsaved changes!';
		}
	}

	_updateErrorSummary() {
		if (!this._errorSummary) {
			return;
		}
		this._errorSummary.errors = this.errors;
	}
};
