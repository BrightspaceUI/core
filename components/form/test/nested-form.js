import '../../validation/validation-custom.js';
import '../form.js';
import './form-element.js';
import { html, LitElement } from 'lit';

class NestedForm extends LitElement {

	static get properties() {
		return {
			noNesting: { type: Boolean, attribute: 'no-nesting', reflect: true },
		};
	}

	constructor() {
		super();
		this.noNesting = false;
	}

	render() {
		return html`
			<d2l-form ?no-nesting=${this.noNesting}>
				<label>
					First Name
					<input type="text" id="composed-nested-first-name" name="first-name" required minlength="4" maxlength="15" style="position: relative;">
				</label>
				<d2l-validation-custom for="composed-nested-pets" @d2l-validation-custom-validate=${this._validateSelect} failure-text="Expected Hamster">
				</d2l-validation-custom>
				<select aria-label="Pets" name="pets" id="composed-nested-pets" style="position: relative;">
					<option value="">--Please choose an option--</option>
					<option value="dog">Dog</option>
					<option value="cat">Cat</option>
					<option value="hamster">Hamster</option>
					<option value="parrot">Parrot</option>
					<option value="spider">Spider</option>
					<option value="goldfish">Goldfish</option>
				</select>
				<input type="radio" id="composed-nested-my-radio" name="composed-nested-optional-radio" style="position: relative;">
				<d2l-test-form-element id="composed-nested-custom-ele"></d2l-test-form-element>
			</d2l-form>
		`;
	}

	fill() {
		if (!this.shadowRoot) return;
		const firstName = this.shadowRoot.querySelector('#composed-nested-first-name');
		firstName.value = 'John Doe';

		const hamster = this.shadowRoot.querySelector('#composed-nested-pets > option:nth-child(4)');
		hamster.selected = true;

		const formElement = this.shadowRoot.querySelector('#composed-nested-custom-ele');
		formElement.value = 'Non-empty';
		formElement.formValue = {
			'composed-nested-key-1': 'val-1',
			'composed-nested-key-2': 'val-2'
		};
	}

	_validateSelect(e) {
		e.detail.resolve(e.detail.forElement.value === 'hamster');
	}
}

customElements.define('d2l-test-nested-form', NestedForm);
