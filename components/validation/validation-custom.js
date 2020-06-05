
import { LitElement } from 'lit-element/lit-element.js';
import { ValidationCustomMixin } from './validation-custom-mixin.js';

class ValidationCustom extends ValidationCustomMixin(LitElement) {

	async validate() {
		const validation = new Promise(resolve => {
			const details = { detail: { target: this.target, resolve } };
			const event = new CustomEvent('d2l-validation-custom-validate', details);
			return this.dispatchEvent(event);
		});
		return validation;
	}

}

customElements.define('d2l-validation-custom', ValidationCustom);
