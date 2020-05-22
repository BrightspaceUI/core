import { findFormElements } from '../form/form-helpers.js';

export class ValidationGroupBehavior {

	constructor() {
		this._onChangeEvent = this._onChangeEvent.bind(this);
		this._onUnload = this._onUnload.bind(this);
	}

	get errors() {
		return this._errors.map(e => e.message);
	}

	install(domNode) {
		window.addEventListener('beforeunload', this._onUnload);
		domNode.addEventListener('change', this._onChangeEvent);
		this._errorSummary = null;
		this._domNode = domNode;
	}

	uninstall() {
		window.remove('beforeunload', this._onUnload);
		this._domNode.removeEventListener('change', this._onChangeEvent);
		this._domNode = null;
	}

	async reportValidity() {
		const isValid = await this.checkValidity();
		if (!isValid) {
			this._updateErrorSummary();
		}
		return isValid;
	}

	async checkValidity() {
		const errors = [];
		const formElements = findFormElements(this._domNode);
		for (const ele of formElements) {
			if (!ele.checkValidity()) {
				errors.push({ ele, message: ele.validationMessage });
			}
		}
		const validationCustoms = this._domNode.querySelectorAll('d2l-validation-custom');
		for (const custom of validationCustoms) {
			if (!await custom.validate()) {
				errors.push({ ele: custom.source, message: custom.failureText });
			}
		}
		this._errors = errors;
		return errors.length === 0;
	}

	_onChangeEvent(e) {
		const ele = e.composedPath()[0];
		const formElements = findFormElements(this._domNode);
		if (formElements.indexOf(ele) === -1) {
			return;
		}
		if (ele.validity.valid && this._errors) {
			this._errors = this._errors.filter(error => error.ele !== ele);
			this._updateErrorSummary();
		}
		ele.classList.add('d2l-dirty');
		this._dirty = true;
	}

	commit() {
		if (!this.checkValidity()) {
			return false;
		}
		const formElements = findFormElements(this._domNode);
		for (const ele of formElements) {
			ele.classList.remove('d2l-dirty');
		}
		this._dirty = false;
		return true;
	}

	_updateErrorSummary() {
		const errorSummary = this._domNode.querySelector('d2l-validation-error-summary');
		if (!errorSummary) {
			return;
		}
		errorSummary.errors = this.errors;
	}

	_onUnload(e) {
		if (this._dirty) {
			e.returnValue = 'You have unsaved changes!';
		}
	}
}

