import './form-errory-summary.js';
import '../tooltip/tooltip.js';
import '../link/link.js';
import { findFormElements, flattenMap, getFormElementData, isCustomFormElement, isNativeFormElement } from './form-helper.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { getComposedActiveElement } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { localizeFormElement } from './form-element-localize-helper.js';
import { ValidationType } from './form-element-mixin.js';

/**
 * A component that can be used to build forms that validate and submit native and custom form elements.
 * @slot - The native and custom form elements that participate in validation and submission
 * @fires d2l-form-submit - Dispatched when the form is submitted
 * @fires d2l-form-invalid - Dispatched when the form is submitted but one or more form elements failed validation
 */
class Form extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			/**
			 * The URL that processes the form submission
			 */
			action: { type: String },
			/**
			 * Causes the form to be submitted as an asynchronous XHR request rather than a native form submission.
			 * If the form has nested forms then
			 */
			asyncSubmit: { type: Boolean, attribute: 'async-submit', reflect: true },
			/**
			 * The MIME type used to encode the submitted data using synchronous submit
			 * @type {'application/x-www-form-urlencoded'|'multipart/form-data'|'text/plain'}
			 */
			enctype: { type: String },
			/**
			 * The HTTP request method to use to submit the form
			 * @type {'POST'|'PUT'}
			 */
			method: { type: String },
			/**
			 * Prevents the form from being validated and submitted when an ancestor form is validated or submitted
			 */
			noNesting: { type: Boolean, attribute: 'no-nesting', reflect: true },
			/**
			 * Enable to warn the user about unsaved changes when navigating away
			 */
			trackChanges: { type: Boolean, attribute: 'track-changes', reflect: true },
			_errors: { type: Object, attribute: false },
			_isSubForm: { type: Boolean, attribute: false },
		};
	}

	constructor() {
		super();
		this._onUnload = this._onUnload.bind(this);
		this._onNativeSubmit = this._onNativeSubmit.bind(this);

		this.action = '';
		this.asyncSubmit = false;
		this.enctype = 'application/x-www-form-urlencoded';
		this.method = 'POST';
		this.noNesting = false;
		this.trackChanges = false;

		this._errors = new Map();
		this._isSubForm = false;
		this._nestedForms = new Map();
		this._tooltips = new Map();
		this._validationCustoms = new Set();

		this.addEventListener('d2l-form-connected', this._formConnected);
		this.addEventListener('d2l-form-errors-changed', this._formErrorsChanged);
		this.addEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('beforeunload', this._onUnload);
		this._isSubForm = !this.dispatchEvent(new CustomEvent('d2l-form-connected', { bubbles: true, composed: true, cancelable: true }));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.dispatchEvent(new CustomEvent('d2l-form-disconnected'));
		this._isSubForm = false;
		window.removeEventListener('beforeunload', this._onUnload);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('change', this._onFormElementChange);
		this.addEventListener('input', this._onFormElementChange);
		this.addEventListener('focusout', this._onFormElementChange);

		this._form = document.createElement('form');
		this._form.addEventListener('submit', this._onNativeSubmit);
		this._form.id = getUniqueId();
		this._form.noValidate = true;
		this.appendChild(this._form);

		const formElements = this._findFormElements(this);
		for (const ele of formElements) {
			if (isNativeFormElement(ele)) {
				ele.setAttribute('form', this._form.id);
			}
		}
	}

	render() {
		let errorSummary = null;
		if (this._isRootForm()) {
			const errors = [...flattenMap(this._errors)]
				.filter(([, eleErrors]) => eleErrors.length > 0)
				.map(([ele, eleErrors]) => ({ href: `#${ele.id}`, message: eleErrors[0], onClick: () => ele.focus() }));
			errorSummary = html`<d2l-form-error-summary .errors=${errors}></d2l-form-error-summary>`;
		}
		return html`
			${errorSummary}
			<slot></slot>
		`;
	}

	shouldUpdate(changedProperties) {
		const ignoredProps = new Set(['action', 'asyncSubmit', 'enctype', 'method', 'trackChanges']);
		return [...changedProperties].filter(([prop]) => !ignoredProps.has(prop)).length > 0;
	}

	async submit() {
		return this._submit(null);
	}

	async validate() {
		const errorMap = new Map();
		const formElements = this._findFormElements(this);
		for (const ele of formElements) {
			if (this._hasSubForm(ele)) {
				const form = this._getSubForm(ele);
				if (!form.noNesting) {
					const formErrors = await form.validate();
					errorMap.set(ele, formErrors);
				}
			} else {
				const eleErrors = await this._validateFormElement(ele, ValidationType.SHOW_NEW_ERRORS);
				if (eleErrors.length > 0) {
					errorMap.set(ele, eleErrors);
				}
			}
		}
		this._errors = errorMap;

		const flattenedErrorMap = flattenMap(this._errors);
		if (this._errors.size > 0) {
			if (this._isRootForm()) {
				await this.updateComplete;
				const errorSummary = this.shadowRoot.querySelector('d2l-form-error-summary');
				errorSummary.focus();
			}
			this.dispatchEvent(new CustomEvent('d2l-form-invalid', { detail: { errors: flattenedErrorMap }}));
		}
		return flattenedErrorMap;
	}

	_displayInvalid(ele, message) {
		let tooltip = this._tooltips.get(ele);
		if (!tooltip) {
			tooltip = document.createElement('d2l-tooltip');
			tooltip.for = ele.id;
			tooltip.align = 'start';
			tooltip.state = 'error';
			ele.parentNode.append(tooltip);
			this._tooltips.set(ele, tooltip);

			tooltip.appendChild(document.createTextNode(message));
		} else if (tooltip.innerText.trim() !== message.trim()) {
			tooltip.textContent = '';
			tooltip.appendChild(document.createTextNode(message));
			tooltip.updatePosition();
		}
		ele.setAttribute('aria-invalid', 'true');
	}

	_displayValid(ele) {
		const tooltip = this._tooltips.get(ele);
		if (tooltip) {
			this._tooltips.delete(ele);
			tooltip.remove();
		}
		ele.setAttribute('aria-invalid', 'false');
	}

	_findFormElements(root) {
		const isFormElementPredicate = ele => this._hasSubForm(ele);
		const visitChildrenPredicate = ele => !this._hasSubForm(ele);
		return findFormElements(root, isFormElementPredicate, visitChildrenPredicate);
	}

	_formConnected(e) {
		const form = e.composedPath()[0];
		if (form === this) {
			return;
		}
		e.stopPropagation();
		e.preventDefault();
		this._nestedForms.set(e.target, form);

		const onDisconnect = () => {
			form.removeEventListener('d2l-form-disconnected', onDisconnect);
			this._nestedForms.delete(e.target);
		};
		form.addEventListener('d2l-form-disconnected', onDisconnect);
	}

	_formErrorsChanged(e) {
		const errors = e.detail.errors;
		if (this._errors.has(e.target)) {
			e.stopPropagation();
			if (errors.size === 0) {
				this._errors.delete(e.target);
			} else {
				this._errors.set(e.target, errors);
			}
			this.requestUpdate('_errors');
		}
	}

	_getSubForm(ele) {
		return this._nestedForms.get(ele);
	}

	_hasSubForm(ele) {
		return this._nestedForms.has(ele);
	}

	_isRootForm() {
		return !this._isSubForm || this.noNesting;
	}

	async _onFormElementChange(e) {
		const ele = e.target;
		if (!isNativeFormElement(ele)) {
			return;
		}
		e.stopPropagation();
		this._dirty = true;
		const validationType = e.type === 'focusout' ? ValidationType.SHOW_NEW_ERRORS : ValidationType.UPDATE_EXISTING_ERRORS;
		const eleErrors = await this._validateFormElement(ele, validationType);
		if (this._errors.has(ele)) {
			if (eleErrors.length > 0) {
				this._errors.set(ele, eleErrors);
			} else {
				this._errors.delete(ele);
			}
			const detail = { bubbles: true, composed: true, detail: { errors: this._errors } };
			this.dispatchEvent(new CustomEvent('d2l-form-errors-changed', detail));
			this.requestUpdate('_errors');
		}
	}

	_onNativeSubmit(e) {
		e.stopPropagation();
		e.preventDefault();
		const submitter = e.submitter || getComposedActiveElement();
		this._submit(submitter);
	}

	_onUnload(e) {
		if (this.trackChanges && this._dirty) {
			e.preventDefault();
			e.returnValue = false;
		}
	}

	async _submit(submitter) {
		const errors = await this.validate();
		if (errors.size > 0) {
			return;
		}
		await this._submitWithoutValidation(submitter);
	}

	async _submitWithoutValidation(submitter) {
		this._dirty = false;

		let nativeFormData = {};
		let customFormData = {};
		let hasSubForms = false;
		const formElements = this._findFormElements(this);
		for (const ele of formElements) {
			const eleData = getFormElementData(ele, submitter);
			if (isCustomFormElement(ele) || ele === submitter) {
				customFormData = { ...customFormData, ...eleData };
			} else if (isNativeFormElement(ele)) {
				nativeFormData = { ...nativeFormData, ...eleData };
			} else if (this._hasSubForm(ele)) {
				const form = this._getSubForm(ele);
				if (!form.noNesting) {
					form._submitWithoutValidation(submitter);
					hasSubForms = true;
				}
			}
		}
		const formData = { ...nativeFormData, ...customFormData };
		const event = new CustomEvent('d2l-form-submit', { cancelable: true, detail: { formData } });
		if (this.dispatchEvent(event)) {
			const tempInputs = [];
			for (const entry of Object.entries(customFormData)) {
				const input = document.createElement('input');
				input.type = 'hidden';
				input.name = entry[0];
				input.value = entry[1];
				this._form.appendChild(input);
				tempInputs.push(input);
			}
			if (this.asyncSubmit || hasSubForms || !this._isRootForm()) {
				const form = new FormData(this._form);
				tempInputs.forEach(tempInput => tempInput.remove());
				const request = new XMLHttpRequest();
				request.open(this.method, this.action);
				request.send(form);
			} else {
				this._form.action = this.action;
				this._form.enctype = this.enctype;
				this._form.method = this.method;
				this._form.submit();
			}
		}
	}

	async _validateFormElement(ele, validationType) {
		ele.id = ele.id || getUniqueId();
		if (isCustomFormElement(ele)) {
			return ele.validate(validationType);
		} else if (isNativeFormElement(ele)) {
			const customs = [...this._validationCustoms].filter(custom => custom.forElement === ele);
			const results = await Promise.all(customs.map(custom => custom.validate()));
			const errors = customs.map(custom => custom.failureText).filter((_, i) => !results[i]);
			if (!ele.checkValidity()) {
				const validationMessage = localizeFormElement(this.localize.bind(this), ele);
				errors.unshift(validationMessage);
			}
			switch (validationType) {
				case ValidationType.UPDATE_EXISTING_ERRORS:
					if (ele.getAttribute('aria-invalid') === 'true' && errors.length > 0) {
						this._displayInvalid(ele, errors[0]);
					} else {
						this._displayValid(ele);
					}
					break;
				case ValidationType.SHOW_NEW_ERRORS:
					if (errors.length > 0) {
						this._displayInvalid(ele, errors[0]);
					} else {
						this._displayValid(ele);
					}
					break;
			}
			return errors;
		}
		return [];
	}

	_validationCustomConnected(e) {
		e.stopPropagation();
		const custom = e.composedPath()[0];
		this._validationCustoms.add(custom);

		const onDisconnect = () => {
			custom.removeEventListener('d2l-validation-custom-disconnected', onDisconnect);
			this._validationCustoms.delete(custom);
		};
		custom.addEventListener('d2l-validation-custom-disconnected', onDisconnect);
	}

}
customElements.define('d2l-form', Form);
