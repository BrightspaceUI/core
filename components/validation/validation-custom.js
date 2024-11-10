
import { LitElement } from 'lit';
import { ValidationCustomMixin } from './validation-custom-mixin.js';

/** @typedef {ValidationCustom} ValidationCustomExported */
class ValidationCustom extends ValidationCustomMixin(LitElement) {

	async validate() {
		const validation = new Promise(resolve => {
			const details = { detail: { forElement: this.forElement, resolve } };
			const event = new CustomEvent('d2l-validation-custom-validate', details);
			return this.dispatchEvent(event);
		});
		return validation;
	}

}

customElements.define('d2l-validation-custom', ValidationCustom);
