import '../tooltip/tooltip.js';
import { findFormElements, getFormElementData, isCustomFormElement, isNativeFormElement } from './form-helper.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { getComposedActiveElement } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { localizeFormElement } from './form-element-localize-helper.js';

class Form extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			action: { type: String },
			method: { type: String },
			trackChanges: { type: Boolean, attribute: 'track-changes', reflect: true }
		};
	}

	constructor() {
		super();
		this._onUnload = this._onUnload.bind(this);
		this._onNativeSubmit = this._onNativeSubmit.bind(this);

		this.trackChanges = false;
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
		this.addEventListener('change', this._onFormElementChange);
		this.addEventListener('input', this._onFormElementChange);
		this.addEventListener('focusout', this._onFormElementChange);

		this._form = document.createElement('form');
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
		return html`<slot></slot>`;
	}

	async submit() {
		return this._submit(null);
	}

	async validate() {
		let errors = [];
		const formElements = findFormElements(this);
		for (const ele of formElements) {
			const eleErrors = await this._validateFormElement(ele, true);
			if (eleErrors.length > 0) {
				errors = [...errors, ...eleErrors];
			}
		}
		return errors;
	}

	async _onFormElementChange(e) {
		const ele = e.target;
		if (!isNativeFormElement(ele)) {
			return;
		}
		e.stopPropagation();
		this._dirty = true;
		const showErrors = e.type === 'focusout';
		this._validateFormElement(ele, showErrors);
	}

	_onNativeSubmit(e) {
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
		if (errors.length > 0) {
			return;
		}
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
		const formData = { ...nativeFormData, ...customFormData };
		const event = new CustomEvent('d2l-form-submit', { bubbles: true, cancelable: true, detail: { formData } });
		if (this.dispatchEvent(event)) {
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

	async _validateFormElement(ele, showErrors) {
		ele.id = ele.id || getUniqueId();
		if (isCustomFormElement(ele)) {
			return ele.validate(showErrors);
		} else if (isNativeFormElement(ele)) {
			const customs = [...this._validationCustoms].filter(custom => custom.forElement === ele);
			const results = await Promise.all(customs.map(custom => custom.validate()));
			const errors = customs.map(custom => custom.failureText).filter((_, i) => !results[i]);
			if (!ele.checkValidity()) {
				const validationMessage = localizeFormElement(this.localize.bind(this), ele);
				errors.unshift(validationMessage);
			}
			if (errors.length === 0) {
				this._validationTooltipHide(ele);
				ele.setAttribute('aria-invalid', 'false');
			} else if (showErrors || ele.getAttribute('aria-invalid') === 'true') {
				this._validationTooltipShow(ele, errors[0]);
				ele.setAttribute('aria-invalid', 'true');
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

	_validationTooltipHide(ele) {
		const tooltip = this._tooltips.get(ele);
		if (tooltip) {
			this._tooltips.delete(ele);
			tooltip.remove();
		}
	}

	_validationTooltipShow(ele, message) {
		let tooltip = this._tooltips.get(ele);
		if (!tooltip) {
			tooltip = document.createElement('d2l-tooltip');
			tooltip.for = ele.id;
			tooltip.align = 'start';
			tooltip.state = 'error';
			tooltip.innerHTML = message;
			ele.parentNode.append(tooltip);
			this._tooltips.set(ele, tooltip);
		} else if (tooltip.innerHTML !== message) {
			tooltip.innerHTML = message;
			tooltip.updatePosition();
		}
	}

}
customElements.define('d2l-form', Form);
