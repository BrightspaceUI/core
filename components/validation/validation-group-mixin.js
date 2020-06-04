import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { findFormElements, isCustomFormElement, isFormElement, isNativeFormElement } from '../form/form-helpers.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ValidationLocalizeMixin } from './validation-localize-mixin.js';

export const ValidationGroupMixin = superclass => class extends ValidationLocalizeMixin(superclass) {

	static get properties() {
		return {};
	}

	constructor() {
		super();
		this._onChangeEvent = this._onChangeEvent.bind(this);
		this._onUnload = this._onUnload.bind(this);
		this._errors = new Map();
		this._tooltips = new Map();
		this._validationCustoms = new Set();
		this._validationGroups = new Map();

		this.addEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
		this.addEventListener('d2l-validation-custom-disconnected', this._validationCustomDisconnected);
		this.addEventListener('d2l-validation-group-connected', this._validationGroupConnected);
		this.addEventListener('d2l-validation-group-disconnected', this._validationGroupDisconnected);
		this.addEventListener('d2l-validation-group-changed', this._validationGroupChanged);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('beforeunload', this._onUnload);
		const connected = new CustomEvent('d2l-validation-group-connected', { bubbles: true, composed: true });
		this.dispatchEvent(connected);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('beforeunload', this._onUnload);
		const disconnected = new CustomEvent('d2l-validation-group-disconnected', { bubbles: true, composed: true });
		this.dispatchEvent(disconnected);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('change', this._onChangeEvent);
		this.addEventListener('input', this._onChangeEvent);
		this._errorSummary = this._findErrorSummary();
	}

	commit() {
		if (this._errors.length > 0) {
			return false;
		}
		this._dirty = false;
		return true;
	}

	async validate() {
		const errors = new Map();
		const formElements = findFormElements(this, ele => this._validationGroups.has(ele));
		for (const ele of formElements) {
			if (this._validationGroups.has(ele)) {
				const group = this._validationGroups.get(ele);
				const groupErrors = await group.validate();
				errors.set(ele, groupErrors);
			} else {
				const eleErrors = await this._validateFormElement(ele);
				if (eleErrors.length > 0) {
					errors.set(ele, eleErrors);
				}
				this._reportValidity(ele, eleErrors);
			}
		}
		this._errors = errors;
		this._updateErrorSummary();
		return errors;
	}

	_findErrorSummary() {
		return this.querySelector('d2l-validation-error-summary');
	}

	_hideTooltip(ele) {
		if (isCustomFormElement(ele)) {
			return;
		}
		const tooltip = this._tooltips.get(ele);
		if (tooltip) {
			this._tooltips.delete(ele);
			tooltip.remove();
		}
	}

	async _onChangeEvent(e) {

		const ele = e.target;
		if (!isFormElement(ele)) {
			return;
		}
		e.stopPropagation();
		this._dirty = true;
		const errors = await this._validateFormElement(ele);

		const isValid = errors.length === 0;
		const isNative = isNativeFormElement(ele);
		if (isNative) {
			ele.id = ele.id || getUniqueId();
			this._reportValidity(ele, errors);
		}
		if (isValid) {
			if (this._errors.delete(ele)) {
				this._updateErrorSummary();
			}
		} else {
			if (this._errors.has(ele)) {
				this._errors.set(ele, errors);
				this._updateErrorSummary();
			}
		}
	}

	_onUnload(e) {
		if (this._dirty) {
			e.preventDefault();
			e.returnValue = false;
		}
	}

	_reportValidity(ele, errors) {
		if (isCustomFormElement(ele)) {
			return;
		}
		const isValid = errors.length === 0;
		if (isValid) {
			this._hideTooltip(ele);
			ele.setAttribute('aria-invalid', 'false');
		} else {
			this._showTooltip(ele, errors[0]);
			ele.setAttribute('aria-invalid', 'true');
		}
	}

	_showTooltip(ele, message) {
		if (isCustomFormElement(ele)) {
			return;
		}
		let tooltip = this._tooltips.get(ele);
		if (!tooltip) {
			tooltip = document.createElement('d2l-tooltip');
			tooltip.for = ele.id;
			tooltip.setAttribute('align', 'start');
			tooltip.state = 'error';
			ele.parentNode.append(tooltip);
			this._tooltips.set(ele, tooltip);
		}
		if (tooltip.innerText !== message) {
			tooltip.innerText = message;
			tooltip.updatePosition();
		}
	}

	_updateErrorSummary() {
		let errorList = [];
		for (const [key, val] of this._errors.entries()) {
			if (val instanceof Map) {
				errorList = [...errorList, ...val];
			} else {
				errorList.push([key, val]);
			}
		}
		const errors = new Map(errorList);
		if (this._errorSummary) {
			this._errorSummary.errors = errors;
		}
		const detail = { bubbles: true, composed: true, detail: { errors} };
		this.dispatchEvent(new CustomEvent('d2l-validation-group-changed', detail));
	}

	async _validateFormElement(ele) {
		if (isCustomFormElement(ele)) {
			return ele.validate();
		} else if (isNativeFormElement(ele)) {
			const customs = [...this._validationCustoms].filter(custom => custom.source === ele);
			const results = await Promise.all(customs.map(custom => custom.validate()));
			const errors = customs.map(custom => custom.failureText).filter((_, i) => !results[i]);
			if (!ele.checkValidity()) {
				const validationMessage = this.localizeValidity(ele);
				errors.unshift(validationMessage);
			}
			return errors;
		}
		return [];
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

	_validationGroupChanged(e) {
		const errors = e.detail.errors;
		if (this._errors.has(e.target)) {
			this._errors.set(e.target, errors);
			this._updateErrorSummary();
		}
	}

	_validationGroupConnected(e) {
		const group = e.composedPath()[0];
		if (group === this) {
			return;
		}
		this._validationGroups.set(e.target, group);
	}

	_validationGroupDisconnected(e) {
		const group = e.composedPath()[0];
		if (group === this) {
			return;
		}
		this._validationGroups.delete(e.target);
	}

};
