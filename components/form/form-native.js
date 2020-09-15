import { findFormElements, getFormElementData, isCustomFormElement, isNativeFormElement } from './form-helper.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { FormMixin } from './form-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';

/**
 * A component that can be used to build sections containing interactive controls that are validated and submitted as a group.
 * These interactive controls are submitted using a native HTML form submission.
 * @slot - The native and custom form elements that participate in validation and submission
 * @fires submit - Dispatched when the form is submitted
 * @fires formdata - Dispatched after the entry list representing the form's data is constructed. This happens when the form is submitted.
 */
class FormNative extends FormMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * The URL that processes the form submission.
			 */
			action: { type: String },
			/**
			 * If the value of the method attribute is post, enctype is the MIME type of the form submission.
			 * @type {'application/x-www-form-urlencoded'|'multipart/form-data'|'text/plain'}
			 */
			enctype: { type: String },
			/**
			 * The HTTP method to submit the form with.
			 * @type {'get'|'post'}
			 */
			method: { type: String },
			/**
			 * Indicates where to display the response after submitting the form.
			 * @type {'_self '|'_blank'|'_parent'|'_top'}
			 */
			target: { type: String },
		};
	}

	constructor() {
		super();
		this.action = '';
		this.enctype = 'application/x-www-form-urlencoded';
		this.method = 'get';
		this.target = '_self';
	}

	render() {
		const errors = [...this._errors]
			.filter(([, eleErrors]) => eleErrors.length > 0)
			.map(([ele, eleErrors]) => ({ href: `#${ele.id}`, message: eleErrors[0], onClick: () => ele.focus() }));
		return html`
			<d2l-form-error-summary .errors=${errors}></d2l-form-error-summary>
			<slot></slot>
		`;
	}

	shouldUpdate(changedProperties) {
		if (!super.shouldUpdate(changedProperties)) {
			return false;
		}
		const ignoredProps = new Set(['action', 'enctype', 'method', 'target']);
		return [...changedProperties].filter(([prop]) => !ignoredProps.has(prop)).length > 0;
	}

	async requestSubmit(submitter) {
		const errors = await this.validate();
		if (errors.size > 0) {
			return;
		}
		this._dirty = false;

		const form = document.createElement('form');
		form.addEventListener('formdata', this._onFormData);
		form.id = getUniqueId();
		form.action = this.action;
		form.enctype = this.enctype;
		form.method = this.method;
		form.target = this.target;
		this.appendChild(form);

		let customFormData = {};
		const formElements = findFormElements(this);
		for (const ele of formElements) {
			const eleData = getFormElementData(ele, submitter);
			const isCustom = isCustomFormElement(ele);
			if (isCustom || ele === submitter) {
				customFormData = { ...customFormData, ...eleData };
			}
			if (!isCustom && isNativeFormElement(ele)) {
				ele.setAttribute('form', form.id);
			}
		}
		for (const entry of Object.entries(customFormData)) {
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = entry[0];
			input.value = entry[1];
			form.appendChild(input);
		}
		const submit = this.dispatchEvent(new CustomEvent('submit', { bubbles: true, cancelable: true }));
		this.dispatchEvent(new CustomEvent('formdata', { detail: { formData: new FormData(form) } }));
		if (submit) {
			form.submit();
		}
		form.remove();
	}

	async submit() {
		return this.requestSubmit(null);
	}

	async validate() {
		let errors = [];
		const errorMap = new Map();
		const formElements = findFormElements(this);
		for (const ele of formElements) {
			const eleErrors = await this._validateFormElement(ele, true);
			if (eleErrors.length > 0) {
				errors = [...errors, ...eleErrors];
				errorMap.set(ele, eleErrors);
			}
		}
		this._errors = errorMap;
		if (errorMap.size > 0) {
			const errorSummary = this.shadowRoot.querySelector('d2l-form-error-summary');
			this.updateComplete.then(() => errorSummary.focus());
		}
		return errorMap;
	}

	_onFormData(e) {
		e.stopPropagation();
	}

}
customElements.define('d2l-form-native', FormNative);
