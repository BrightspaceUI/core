import './form-errory-summary.js';
import '../tooltip/tooltip.js';
import '../link/link.js';
import { isCustomFormElement, isNativeFormElement } from './form-helper.js';
import { getComposedActiveElement } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { localizeFormElement } from './form-element-localize-helper.js';
import { ValidationType } from './form-element-mixin.js';

export const FormMixin = superclass => class extends LocalizeCoreElement(superclass) {

	static get properties() {
		return {
			trackChanges: { type: Boolean, attribute: 'track-changes', reflect: true },
			_errors: { type: Object }
		};
	}

	constructor() {
		super();
		this._onUnload = this._onUnload.bind(this);
		this._onNativeSubmit = this._onNativeSubmit.bind(this);

		this.trackChanges = false;
		this._tooltips = new Map();
		this._validationCustoms = new Set();
		this._errors = new Map();

		this.addEventListener('d2l-form-errors-change', this._onFormErrorsChange);
		this.addEventListener('d2l-validation-custom-connected', this._validationCustomConnected);
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
	}

	// eslint-disable-next-line no-unused-vars
	async requestSubmit(submitter) {
		throw new Error('FormMixin.requestSubmit must be overridden');
	}

	async submit() {
		throw new Error('FormMixin.submit must be overridden');
	}

	async validate() {
		throw new Error('FormMixin.validate must be overridden');
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

	async _onFormElementChange(e) {
		const ele = e.target;
		if (!isNativeFormElement(ele)) {
			return;
		}
		e.stopPropagation();
		this._dirty = true;
		const validationType = e.type === 'focusout' ? ValidationType.SHOW_NEW_ERRORS : ValidationType.UPDATE_EXISTING_ERRORS;
		const errors = await this._validateFormElement(ele, validationType);
		this._updateErrors(ele, errors);
	}

	_onFormErrorsChange(e) {
		if (e.target === this) {
			return;
		}
		e.stopPropagation();
		this._updateErrors(e.target, e.detail.errors);
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
		this.dispatchEvent(new CustomEvent('d2l-form-errors-change', detail));
		this.requestUpdate('_errors');
		return true;
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

};
