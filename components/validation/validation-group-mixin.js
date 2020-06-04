import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { findFormElements, isCustomFormElement, isFormElement } from '../form/form-helpers.js';
import { css } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ValidationLocalizeMixin } from './validation-localize-mixin.js';

export const validationStyles = css`
	:host {
		display: block;
	}

	[aria-invalid='true'] {
		border-color: var(--d2l-color-cinnabar);
	}
`;

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

		this.addEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
		this.addEventListener('d2l-validation-custom-disconnected', this._validationCustomDisconnected);

	}
	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('beforeunload', this._onUnload);
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('beforeunload', this._onUnload);
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

	getRootNode() {
		return this.shadowRoot;
	}

	async validate() {
		const errors = new Map();
		const root = this.getRootNode();
		const formElements = findFormElements(root);
		for (const ele of formElements) {
			const eleErrors = await this._validateFormElement(ele);
			if (eleErrors.length > 0) {
				ele.setAttribute('aria-invalid', 'true');
				this._showTooltip(ele, eleErrors[0]);
				errors.set(ele, eleErrors);
			}
		}
		this._errors = errors;
		this._updateErrorSummary();
		return errors;
	}

	_findErrorSummary() {
		const root = this.getRootNode();
		let errorSummary = root.querySelector('d2l-validation-error-summary');
		if (!errorSummary) {
			errorSummary = document.createElement('d2l-validation-error-summary');
			this.prepend(errorSummary);
		}
		return errorSummary;
	}

	_hideTooltip(ele) {
		const tooltip = this._tooltips.get(ele);
		if (isCustomFormElement(ele)) {
			ele.hideValidationTooltip();
		}
		if (tooltip) {
			this._tooltips.delete(ele);
			tooltip.remove();
		}
	}

	async _onChangeEvent(e) {

		e.preventDefault();
		this._dirty = true;

		const ele = e.target;
		const errors = await this._validateFormElement(ele);

		const isValid = errors.length === 0;
		if (!ele.id) {
			ele.id = getUniqueId();
		}
		ele.setAttribute('aria-invalid', isValid ? 'false' : 'true');

		if (isValid) {
			if (this._errors.delete(ele)) {
				this._updateErrorSummary();
			}
			this._hideTooltip(ele);
		} else {
			if (this._errors.has(ele)) {
				this._errors.set(ele, errors);
				this._updateErrorSummary();
			}
			this._showTooltip(ele, errors[0]);
		}
	}

	_onUnload(e) {
		if (this._dirty) {
			e.preventDefault();
			e.returnValue = false;
		}
	}

	_showTooltip(ele, message) {
		if (isCustomFormElement(ele) && ele.showValidationTooltip(message)) {
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
		if (!this._errorSummary) {
			return;
		}
		this._errorSummary.errors = new Map(this._errors);
	}

	async _validateFormElement(ele) {
		if (!isFormElement(ele)) {
			return [];
		}
		const externalCustoms = [...this._validationCustoms].filter(custom => custom.source === ele);
		const externalCustomValidations = Promise.all(externalCustoms.map(custom => custom.validate()));
		const internalCustomValidations = isCustomFormElement(ele) ? ele.validateInternalCustoms() : Promise.resolve([]);
		const customValidations = Promise.all([externalCustomValidations, internalCustomValidations]);

		const errors = [];
		if (!ele.checkValidity()) {
			if (isCustomFormElement(ele)) {
				errors.push(ele.validationMessage);
			} else {
				const validationMessage = this.localizeValidity(ele);
				errors.push(validationMessage);
			}
		}
		const validationResults = await customValidations;
		const externalResults = validationResults[0];
		const externalMessages = externalCustoms.map(custom => custom.failureText).filter((_, i) => !externalResults[i]);
		const internalResults = validationResults[1];
		return [...errors, ...internalResults, ...externalMessages];
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
