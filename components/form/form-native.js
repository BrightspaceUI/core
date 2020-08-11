import { findFormElements, getFormElementData, isCustomFormElement } from './form-helper.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { FormMixin } from './form-mixin.js';
import { ValidationType } from './form-element-mixin.js';

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
			 * @type {'POST'|'GET'}
			 */
			method: { type: String },
			/**
			 * Indicates where to display the response after submitting the form.
			 * @type {'_self '|'_blank'|'_parent'|'_top'}
			 */
			target: { type: String },
		};
	}

	get action() {
		return this._form.action;
	}

	set action(val) {
		this._form.action = val;
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

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._form.addEventListener('formdata', this._onFormData);
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

	async requestSubmit(submitter) {
		const errors = await this.validate();
		if (errors.size > 0) {
			return;
		}
		this._dirty = false;

		let customFormData = {};
		const formElements = findFormElements(this);
		for (const ele of formElements) {
			const eleData = getFormElementData(ele, submitter);
			if (isCustomFormElement(ele) || ele === submitter) {
				customFormData = { ...customFormData, ...eleData };
			}
		}
		const tempInputs = [];
		for (const entry of Object.entries(customFormData)) {
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = entry[0];
			input.value = entry[1];
			this._form.appendChild(input);
			tempInputs.push(input);
		}
		const submit = this.dispatchEvent(new CustomEvent('submit', { bubbles: true, cancelable: true }));
		this.dispatchEvent(new CustomEvent('formdata', { detail: { formData: new FormData(this._form) } }));
		if (submit) {
			this._form.submit();
		}
		for (const input of tempInputs) {
			input.remove();
		}
	}

	async submit() {
		return this.requestSubmit(null);
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
