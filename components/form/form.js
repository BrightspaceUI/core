import './form-error-summary.js';
import '../tooltip/tooltip.js';
import '../link/link.js';
import { css, html, LitElement } from 'lit';
import { findFormElements, flattenMap, getFormElementData, isCustomFormElement, isNativeFormElement } from './form-helper.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { getComposedActiveElement } from '../../helpers/focus.js';
import { getFlag } from '../../helpers/flags.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { localizeFormElement } from './form-element-localize-helper.js';

const formElementMixinWithNestedFormsParticipates = getFlag('form-element-mixin-nested-forms', true);

/**
 * A component that can be used to build sections containing interactive controls that are validated and submitted as a group.
 * Values of these interactive controls are aggregated but the user is responsible for handling submission via the @d2l-form-submit event.
 * @slot - The native and custom form elements that participate in validation and submission
 * @fires d2l-form-connect - Internal event
 */
class Form extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			/**
			 * Indicates that the form should opt-out of nesting.
			 * This means that it will not be submitted or validated if an ancestor form is submitted or validated.
			 * However, directly submitting or validating a form with `no-nesting` will still trigger submission and validation for its descendant forms unless they also opt-out using `no-nesting`.
			 * @type {boolean}
			 */
			noNesting: { type: Boolean, attribute: 'no-nesting', reflect: true },
			/**
			 * Indicates that the form should interrupt and warn on navigation if the user has unsaved changes on native elements.
			 * @type {boolean}
			 */
			trackChanges: { type: Boolean, attribute: 'track-changes', reflect: true },
			/**
			 * Indicates that the form should hide the error summary alert.
			 * @type {boolean}
			 */
			hideErrorSummary: { type: Boolean, attribute: 'hide-error-summary' },
			/**
			 * Id for an alternative error summary element
			 * @type {string}
			 */
			summaryId: { type: String, attribute: 'summary-id' },
			_errors: { type: Object },
			_hasErrors: { type: Boolean, attribute: '_has-errors', reflect: true },
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
			:host([_has-errors]) ::slotted(d2l-input-group) {
				margin-block-start: 1rem;
			}
		`;
	}

	constructor() {
		super();
		this.trackChanges = false;
		this.hideErrorSummary = false;
		this.summaryId = null;
		this._errors = new Map();
		this._isSubForm = false;
		this._nestedForms = new Map();
		this._firstUpdateResolve = null;
		this._firstUpdatePromise = new Promise((resolve) => {
			this._firstUpdateResolve = resolve;
		});
		this._hasErrors = false;
		this._tooltips = new Map();
		this._validationCustoms = new Set();

		this._onUnload = this._onUnload.bind(this);
		this._onNativeSubmit = this._onNativeSubmit.bind(this);

		/** @ignore */
		this.addEventListener('d2l-form-connect', this._onFormConnect);
		this.addEventListener('d2l-form-errors-change', this._onErrorsChange);
		this.addEventListener('d2l-form-element-errors-change', this._onErrorsChange);
		this.addEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
	}

	get errorSummary() {
		return [...flattenMap(this._errors)]
			.filter(([, eleErrors]) => eleErrors.length > 0)
			.map(([ele, eleErrors]) => ({ href: `#${ele.id}`, message: eleErrors[0], onClick: () => ele.focus() }));
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('beforeunload', this._onUnload);
		/** @ignore */
		this._isSubForm = !this.dispatchEvent(new CustomEvent('d2l-form-connect', { bubbles: true, composed: true, cancelable: true }));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('beforeunload', this._onUnload);
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-form-disconnect'));
		this._isSubForm = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('change', this._onFormElementChange);
		this.addEventListener('input', this._onFormElementChange);
		this.addEventListener('focusout', this._onFormElementChange);
		this._firstUpdateResolve();
		this._setupDialogValidationReset();
	}

	render() {
		let errorSummary = null;
		if (!(this.hideErrorSummary || this.summaryId) && this._isRootForm()) {
			errorSummary = html`<d2l-form-error-summary .errors=${this.errorSummary}></d2l-form-error-summary>`;
		}
		return html`
			${errorSummary}
			<slot></slot>
		`;
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('_errors')) {
			this._hasErrors = this._errors.size > 0;
		}
		if ((changedProperties.has('summary-id') || changedProperties.has('_errors')) && this.summaryId) {
			this.querySelector(`#${this.summaryId}`).errors = this.errorSummary;
		}
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
			} else if (!formElementMixinWithNestedFormsParticipates) {
				const eleErrors = await this._validateFormElement(ele, true);
				if (eleErrors.length > 0) {
					errorMap.set(ele, eleErrors);
				}
			}
			if (formElementMixinWithNestedFormsParticipates) {
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

	_onErrorsChange(e) {
		if (e.target === this) {
			return;
		}
		e.stopPropagation();
		this._updateErrors(e.target, e.detail.errors);
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

	async _onFormElementChange(e) {
		const ele = e.target;

		if ((isNativeFormElement(ele) || isCustomFormElement(ele)) && e.type !== 'focusout') {
			this._dirty = true;
			/** Dispatched whenever any form element fires an `input` or `change` event. Can be used to track whether the form is dirty or not. */
			this.dispatchEvent(new CustomEvent('d2l-form-dirty'));
		}

		if (!isNativeFormElement(ele)) {
			return;
		}
		e.stopPropagation();
		const errors = await this._validateFormElement(ele, e.type === 'focusout');
		this._updateErrors(ele, errors);
	}

	_onNativeSubmit(e) {
		e.preventDefault();
		e.stopPropagation();
		const submitter = e.submitter || getComposedActiveElement();
		this.requestSubmit(submitter);
	}

	_onUnload(e) {
		if (this.trackChanges && this._dirty) {
			e.preventDefault();
			e.returnValue = false;
		}
	}

	_setupDialogValidationReset() {
		const dialogAncestor = findComposedAncestor(
			this,
			node => node?._isDialogMixin
		);
		if (!dialogAncestor) return;

		dialogAncestor.addEventListener('d2l-dialog-close', () => {
			this.resetValidation();
		});
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

	_updateErrors(ele, errors) {

		if (!this._errors.has(ele)) {
			return false;
		}
		if (Array.from(errors).length === 0) {
			this._errors.delete(ele);
		} else {
			this._errors.set(ele, errors);
		}
		const detail = { bubbles: true, composed: true, detail: { errors: this._errors } };
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-form-errors-change', detail));
		this.requestUpdate('_errors');
		return true;
	}

	async _validateFormElement(ele, showNewErrors) {
		const isCustom = isCustomFormElement(ele);
		const isNative = isNativeFormElement(ele);
		if (!isCustom && !isNative) return [];
		// if validation occurs before we've rendered,
		// localization may not have loaded yet
		await this._firstUpdatePromise;
		ele.id = ele.id || getUniqueId();
		if (isCustom) {
			return ele.validate(showNewErrors);
		} else if (isNative) {
			const customs = [...this._validationCustoms].filter(custom => custom.forElement === ele);
			const results = await Promise.all(customs.map(custom => custom.validate()));
			const errors = customs.map(custom => custom.failureText).filter((_, i) => !results[i]);
			if (!ele.checkValidity()) {
				const validationMessage = localizeFormElement(this.localize.bind(this), ele);
				errors.unshift(validationMessage);
			}
			if (errors.length > 0 && (showNewErrors || ele.getAttribute('aria-invalid') === 'true')) {
				this._displayInvalid(ele, errors[0]);
			} else {
				this._displayValid(ele);
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
