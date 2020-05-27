import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { findFormElements, isCustomFormElement, isFormElement } from '../form/form-helpers.js';
import { css } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';

export const validationStyles = css`
	:host {
		display: block;
	}

	[aria-invalid='true'] {
		border-color: var(--d2l-color-cinnabar);
	}
`;

export const ValidationGroupMixin = superclass => class extends LocalizeStaticMixin(superclass) {

	static get properties() {
		return {};
	}

	static get resources() {
		return {
			'en': {
				'valueMissingMessage': '{subject} is required',
				'tooLongMessage': '{subject} must be at most {maxlength} characters',
				'tooShortMessage': '{subject} must be at least {minlength} characters',
				'badInputMessage': '{subject} has bad input',
				'patternMismatchMessage': '{subject} has malformed input',
				'rangeOverflowMessage': '{subject} must be less than {max}',
				'rangeUnderflowMessage': '{subject} must be greater than {min}',
				'typeMismatchMessage': '{subject} has an invalid type'
			},
		};
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
		this._errorSummary = this._findErrorSummary();
	}

	commit() {
		if (!this.checkValidity()) {
			return false;
		}
		this._dirty = false;
		return true;
	}
	get errors() {
		const errorLists = this._errors.values();
		return [].concat(...errorLists);
	}
	async validate() {
		const errors = new Map();
		errors.set(undefined, []);

		const formElements = findFormElements(this);
		for (const ele of formElements) {
			const eleErrors = await this._validateFormElement(ele);
			if (eleErrors.length > 0) {
				ele.setAttribute('aria-invalid', 'true');
				this._showTooltip(ele, eleErrors[0]);
			}
			errors.set(ele, eleErrors);
		}
		this._errors = errors;
		this._updateErrorSummary();
		return errors.size === 0;
	}

	_findErrorSummary() {
		let errorSummary = this.querySelector('d2l-validation-error-summary');
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

	_localizeValidity(ele) {
		const subject = ele.getAttribute('data-subject');
		if (ele.validity.valueMissing) {
			return this.localize('valueMissingMessage', { subject });
		}
		if (ele.validity.tooLong) {
			const maxlength = ele.getAttribute('maxlength');
			return this.localize('tooLongMessage', { subject, maxlength });
		}
		if (ele.validity.tooShort) {
			const minlength = ele.getAttribute('minlength');
			return this.localize('tooShortMessage', { subject, minlength });
		}
		if (ele.validity.badInput) {
			return this.localize('badInputMessage', { subject });
		}
		if (ele.validity.patternMismatch) {
			return this.localize('patternMismatchMessage', { subject });
		}
		if (ele.validity.rangeOverflow) {
			const max = ele.getAttribute('max');
			return this.localize('rangeOverflowMessage', { subject, max });
		}
		if (ele.validity.rangeUnderflow) {
			const min = ele.getAttribute('min');
			return this.localize('rangeUnderflowMessage', { subject, min });
		}
		if (ele.validity.typeMismatch) {
			return this.localize('typeMismatchMessage', { subject });
		}
		return ele.validationMessage;
	}

	async _onChangeEvent(e) {
		const ele = e.composedPath()[0];
		const errors = await this._validateFormElement(ele);

		const isValid = errors.length === 0;
		ele.setAttribute('aria-invalid', isValid ? 'false' : 'true');

		if (isValid) {
			if (this._errors.delete(ele)) {
				this._updateErrorSummary();
			}
			this._hideTooltip(ele);
		} else {
			this._errors.set(ele, errors);
			this._showTooltip(ele, errors[0]);
			if (this._errors.has(ele)) {
				this._updateErrorSummary();
			}
		}
		this._dirty = true;
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
		if (!ele.id) {
			ele.id = getUniqueId();
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
		tooltip.innerText = message;
	}

	_updateErrorSummary() {
		if (!this._errorSummary) {
			return;
		}
		this._errorSummary.errors = this.errors;
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
			errors.push(ele.validationMessage);
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
