
import { css, LitElement } from 'lit';
import { ValidationCustomMixin } from './validation-custom-mixin.js';

/**
 * A component that can be used to provide custom validation for a form element. The component is hidden and does not render any visible content.
 * @fires d2l-validation-custom-validate - Dispatched when the component is validated.
 * @fires d2l-validation-custom-connected - Dispatched when the component is connected to the DOM.
 * @fires d2l-validation-custom-disconnected - Dispatched when the component is disconnected from the DOM.
 */
class ValidationCustom extends ValidationCustomMixin(LitElement) {

	static styles = css`
		:host {
			display: none;
		}
	`;

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
