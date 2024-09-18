import { css, html, LitElement } from 'lit';
import { findFormElements, flattenMap, getFormElementData, isCustomFormElement, isNativeFormElement } from './form-helper.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { FormMixin } from './form-mixin.js';

/**
 * A component that can be used to build sections containing interactive controls that are validated and submitted as a group.
 * Values of these interactive controls are aggregated but the user is responsible for handling submission via the @d2l-form-submit event.
 * @slot - The native and custom form elements that participate in validation and submission
 * @fires d2l-form-connect - Internal event
 */
class Form extends FormMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Indicates that the form should opt-out of nesting.
			 * This means that it will not be submitted or validated if an ancestor form is submitted or validated.
			 * However, directly submitting or validating a form with `no-nesting` will still trigger submission and validation for its descendant forms unless they also opt-out using `no-nesting`.
			 * @type {boolean}
			 */
			noNesting: { type: Boolean, attribute: 'no-nesting', reflect: true },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this._isSubForm = false;
		this._nestedForms = new Map();

		/** @ignore */
		this.addEventListener('d2l-form-connect', this._onFormConnect);
	}

	connectedCallback() {
		super.connectedCallback();
		/** @ignore */
		this._isSubForm = !this.dispatchEvent(new CustomEvent('d2l-form-connect', { bubbles: true, composed: true, cancelable: true }));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-form-disconnect'));
		this._isSubForm = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		const dialogAncestor = findComposedAncestor(
			this,
			(node) => { return (node?.tagName?.includes('D2L-DIALOG')); }
		);
		if (!dialogAncestor) return;

		dialogAncestor.addEventListener('d2l-dialog-close', () => {
			const flag = window.D2L?.LP?.Web?.UI?.Flags.Flag('GAUD-6979-dialog-close-reset-validation', true) ?? true;
			if (!flag) return;
			this.resetValidation();
		});
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

	resetValidation() {
		const formElements = this._findFormElements();
		for (const ele of formElements) {
			if (this._hasSubForms(ele)) {
				const forms = this._getSubForms(ele);
				for (const form of forms) {
					form.resetValidation();
				}
			} else {
				if (isCustomFormElement(ele)) {
					ele.resetValidation();
				} else if (isNativeFormElement(ele)) {
					this._displayValid(ele);
				}
			}
		}
		this._errors = new Map();
		this._tooltips = new Map();
	}

	async submit() {
		return this.requestSubmit(null);
	}

	async validate() {
		const errorMap = new Map();
		const formElements = this._findFormElements();
		for (const ele of formElements) {
			if (this._hasSubForms(ele)) {
				const forms = this._getSubForms(ele);
				for (const form of forms) {
					if (!form.noNesting) {
						const formErrors = await form.validate();
						for (const [key, val] of formErrors) {
							errorMap.set(key, val);
						}
					}
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
			const errorSummary = this.shadowRoot && this.shadowRoot.querySelector('d2l-form-error-summary');
			if (errorSummary) {
				this.updateComplete.then(() => errorSummary.focus());
			}
			/** Dispatched when the form fails validation. The error map can be obtained from the `detail`'s `errors` property. */
			this.dispatchEvent(new CustomEvent('d2l-form-invalid', { detail: { errors: flattenedErrorMap } }));
		}
		return flattenedErrorMap;
	}

	_findFormElements() {
		const isFormElementPredicate = ele => this._hasSubForms(ele);
		const visitChildrenPredicate = ele => !this._hasSubForms(ele);
		return findFormElements(this, isFormElementPredicate, visitChildrenPredicate);
	}

	_getSubForms(ele) {
		return this._nestedForms.get(ele);
	}

	_hasSubForms(ele) {
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
		const target = e.target;

		if (!this._nestedForms.has(target)) {
			this._nestedForms.set(target, []);
		}
		this._nestedForms.get(target).push(form);

		const onFormDisconnect = () => {
			form.removeEventListener('d2l-form-disconnect', onFormDisconnect);
			if (this._nestedForms.has(target)) {
				const forms = this._nestedForms.get(target);
				const index = forms.indexOf(form);
				if (index > -1) {
					forms.splice(index, 1);
				}
				if (forms.length === 0) {
					this._nestedForms.delete(target);
				}
			}
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
			} else if (this._hasSubForms(ele)) {
				const forms = this._getSubForms(ele);
				forms.forEach(form => {
					if (!form.noNesting) {
						form._submitData(submitter);
					}
				});
			}
		}
		/** Dispatched when the form is submitted. The form data can be obtained from the `detail`'s `formData` property. */
		this.dispatchEvent(new CustomEvent('d2l-form-submit', { detail: { formData } }));
	}

}
customElements.define('d2l-form', Form);
