import { html, LitElement } from 'lit';
import { FormElementContainerMixin } from '../form-element-container-mixin.js';
import { inputLabelStyles } from '../../inputs/input-label-styles.js';
import { inputStyles } from '../../inputs/input-styles.js';

class CustomFormElementContainer extends FormElementContainerMixin(LitElement) {

	static styles = [inputStyles, inputLabelStyles];

	render() {
		return html`
			<label for="native-input" class="d2l-input-label d2l-input-label-required" required>First Name</label>
			<input id="native-input"
				type="text"
				name="first-name"
				minlength="4"
				maxlength="15"
				required
				class="d2l-input"
				@blur="${this._handleBlur}"
				@input="${this._handleInput}"
			>
			<d2l-input-text label="Middle Name" name="middle-name" minlength="4" maxlength="8"></d2l-input-text>
			<d2l-input-text label="Last Name" name="last-name" required minlength="4" maxlength="15"></d2l-input-text>
			<d2l-input-text
				label="Telephone Number"
				type="tel"
				name="phone-number"
				pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
				required
			></d2l-input-text>
			<d2l-input-number label="Age" name="age" required min="18" max="23"></d2l-input-number>
		`;
	}

	_handleBlur(e) {
		e.preventDefault();
		const nativeInput = this.shadowRoot.querySelector('#native-input');
		if (!nativeInput.validity.valid) {
			nativeInput.setAttribute('aria-invalid', 'true');
		}
	}

	_handleInput(e) {
		e.preventDefault();
		const nativeInput = this.shadowRoot.querySelector('#native-input');
		if (nativeInput.validity.valid) {
			nativeInput.removeAttribute('aria-invalid');
		}
	}
}

customElements.define('d2l-custom-form-element-container', CustomFormElementContainer);
