import './form-errory-summary.js';
import '../tooltip/tooltip.js';
import '../link/link.js';
import { findFormElements, getFormElementData, isCustomFormElement, isNativeFormElement } from './form-helper.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { getComposedActiveElement } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { localizeFormElement } from './form-element-localize-helper.js';
import { ValidationType } from './form-element-mixin.js';

class FormNative extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			action: { type: String },
			encoding: { type: String },
			enctype: { type: String },
			method: { type: String },
			target: { type: String },
			trackChanges: { type: Boolean, attribute: 'track-changes', reflect: true },
			_errors: { type: Object }
		};
	}

	constructor() {
		super();
		this._onUnload = this._onUnload.bind(this);
		this._onNativeSubmit = this._onNativeSubmit.bind(this);

		this._form = document.createElement('form');

		this.trackChanges = false;
		this._tooltips = new Map();
		this._validationCustoms = new Set();
		this._errors = new Map();

		this.addEventListener('d2l-form-errors-change', this._formErrorsChange);
		this.addEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
	}

	get action() {
		return this._form.action;
	}

	set action(val) {
		this._form.action = val;
	}

	get encoding() {
		return this._form.encoding;
	}

	set encoding(val) {
		this._form.encoding = val;
	}

	get enctype() {
		return this._form.enctype;
	}

	set enctype(val) {
		this._form.enctype = val;
	}

	get method() {
		return this._form.method;
	}

	set method(val) {
		this._form.method = val;
	}

	get target() {
		return this._form.target;
	}

	set target(val) {
		this._form.target = val;
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
		this.addEventListener('change', this._onFormElementChange);
		this.addEventListener('input', this._onFormElementChange);
		this.addEventListener('focusout', this._onFormElementChange);

		this._form.addEventListener('submit', this._onNativeSubmit);
		this._form.id = getUniqueId();
		this._form.noValidate = true;
		this.appendChild(this._form);

		const formElements = findFormElements(this);
		for (const ele of formElements) {
			if (isNativeFormElement(ele)) {
				ele.setAttribute('form', this._form.id);
			}
		}
	}

	render() {
		const errors = [...this._errors.entries()]
			.filter(([, eleErrors]) => eleErrors.length > 0)
			.map(([ele, eleErrors]) => ({ href: `#${ele.id}`, message: eleErrors[0], onClick: () => ele.focus()}));
		return html`
			<d2l-form-error-summary .errors=${errors}></d2l-form-error-summary>
			<slot></slot>
		`;
	}

	async submit() {
		return this._submit(null);
	}

	async validate() {
		let errors = [];
		const errorMap = new Map();
		const formElements = findFormElements(this);
		for (const ele of formElements) {
			const eleErrors = await this._validateFormElement(ele, ValidationType.SHOW_NEW_ERRORS);
			if (eleErrors.length > 0) {
				errors = [...errors, ...eleErrors];
				errorMap.set(ele, eleErrors);
			}
		}
		this._errors = errorMap;
		if (this._errors.size > 0) {
			await this.updateComplete;
			const errorSummary = this.shadowRoot.querySelector('d2l-form-error-summary');
			errorSummary.focus();
		}
		return errors;
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

	_formErrorsChange(e) {
		const errors = e.detail.errors;
		if (this._errors.has(e.target)) {
			e.stopPropagation();
			if (errors.length === 0) {
				this._errors.delete(e.target);
			} else {
				this._errors.set(e.target, errors);
			}
			this.requestUpdate('_errors');
		}
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
			this.requestUpdate('_errors');
		}
	}

	_onNativeSubmit(e) {
		e.preventDefault();
		e.stopPropagation();
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
		if (errors.length > 0) {
			return;
		}
		this._dirty = false;

		let nativeFormData = {};
		let customFormData = {};
		const formElements = findFormElements(this);
		for (const ele of formElements) {
			const eleData = getFormElementData(ele, submitter);
			if (isCustomFormElement(ele) || ele === submitter) {
				customFormData = { ...customFormData, ...eleData };
			} else {
				nativeFormData = { ...nativeFormData, ...eleData };
			}
		}
		if (this.dispatchEvent(new CustomEvent('submit', { bubbles: true, cancelable: true }))) {
			for (const entry of Object.entries(customFormData)) {
				const input = document.createElement('input');
				input.type = 'hidden';
				input.name = entry[0];
				input.value = entry[1];
				this._form.appendChild(input);
			}
			this._form.submit();
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
customElements.define('d2l-form-native', FormNative);
