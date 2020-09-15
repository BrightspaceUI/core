import { findFormElements, flattenMap, getFormElementData, isCustomFormElement, isNativeFormElement } from './form-helper.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { FormMixin } from './form-mixin.js';

/**
 * A component that can be used to build sections containing interactive controls that are validated and submitted as a group.
 * Values of these interactive controls are aggregated but the user is responsible for handling submission via the @d2l-form-submit event.
 * @slot - The native and custom form elements that participate in validation and submission
 * @fires d2l-form-submit - Dispatched when the form is submitted
 */
class Form extends FormMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Prevents the form from being validated and submitted when an ancestor form is validated or submitted
			 */
			noNesting: { type: Boolean, attribute: 'no-nesting', reflect: true },
		};
	}

	constructor() {
		super();
		this._isSubForm = false;
		this._nestedForms = new Map();

		this.addEventListener('d2l-form-connect', this._onFormConnect);
	}

	connectedCallback() {
		super.connectedCallback();
		this._isSubForm = !this.dispatchEvent(new CustomEvent('d2l-form-connect', { bubbles: true, composed: true, cancelable: true }));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.dispatchEvent(new CustomEvent('d2l-form-disconnected'));
		this._isSubForm = false;
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

	async requestSubmit(submitter) {
		const errors = await this.validate();
		if (errors.size > 0) {
			return;
		}
		this._submitData(submitter);
	}

	async submit() {
		return this.requestSubmit(null);
	}

	async validate() {
		const errorMap = new Map();
		const formElements = this._findFormElements();
		for (const ele of formElements) {
			if (this._hasSubForm(ele)) {
				const form = this._getSubForm(ele);
				if (!form.noNesting) {
					const formErrors = await form.validate();
					errorMap.set(ele, formErrors);
				}
			} else {
				const eleErrors = await this._validateFormElement(ele, true);
				if (eleErrors.length > 0) {
					errorMap.set(ele, eleErrors);
				}
			}
		}
		const flattenedErrorMap = flattenMap(errorMap);
		this._errors = errorMap;
		if (errorMap.size > 0) {
			const errorSummary = this.shadowRoot.querySelector('d2l-form-error-summary');
			if (errorSummary) {
				this.updateComplete.then(() => errorSummary.focus());
			}
			this.dispatchEvent(new CustomEvent('d2l-form-invalid', { detail: { errors: flattenedErrorMap } }));
		}
		return flattenedErrorMap;
	}

	_findFormElements() {
		const isFormElementPredicate = ele => this._hasSubForm(ele);
		const visitChildrenPredicate = ele => !this._hasSubForm(ele);
		return findFormElements(this, isFormElementPredicate, visitChildrenPredicate);
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

	_onFormConnect(e) {
		if (e.target === this) {
			return;
		}
		e.stopPropagation();
		e.preventDefault();
		const form = e.composedPath()[0];
		this._nestedForms.set(e.target, form);

		const onFormDisconnect = () => {
			form.removeEventListener('d2l-form-disconnect', onFormDisconnect);
			this._nestedForms.delete(e.target);
		};
		form.addEventListener('d2l-form-disconnect', onFormDisconnect);
	}

	async _submitData(submitter) {
		this._dirty = false;

		let formData = {};
		const formElements = this._findFormElements(this);
		for (const ele of formElements) {
			const eleData = getFormElementData(ele, submitter);
			if (isCustomFormElement(ele) || isNativeFormElement(ele)) {
				formData = { ...formData, ...eleData };
			} else if (this._hasSubForm(ele)) {
				const form = this._getSubForm(ele);
				if (!form.noNesting) {
					form._submitData(submitter);
				}
			}
		}
		this.dispatchEvent(new CustomEvent('d2l-form-submit', { detail: { formData } }));
	}

}
customElements.define('d2l-form', Form);
