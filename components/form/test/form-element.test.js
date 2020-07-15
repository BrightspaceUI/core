import '../../validation/validation-custom.js';
import './form-element.js';
import { defineCE, expect, fixture } from '@open-wc/testing';
import { html, LitElement } from 'lit-element/lit-element.js';

const formTag = defineCE(
	class extends LitElement {

		static get properties() {
			return {
				isValidationCustomValid: { type: Boolean },
				value: { type: String, reflect: true },
			};
		}

		constructor() {
			super();
			this.isValidationCustomValid = true;
		}

		render() {
			return html`
				<d2l-validation-custom for="my-ele" @d2l-validation-custom-validate=${this._validate} failure-text="External custom validation failed">
				</d2l-validation-custom>
				<d2l-test-form-element id="my-ele"></d2l-test-form-element>
			`;
		}

		async _validate(e) {
			e.detail.resolve(this.isValidationCustomValid);
		}

	}
);

const formFixture = `<${formTag}></${formTag}`;

describe('form-element', () => {

	let form, formElement;

	beforeEach(async() => {
		form = await fixture(formFixture);
		formElement = form.shadowRoot.querySelector('#my-ele');
	});

	describe('message', () => {

		it('should set validation message if validate has errors', async() => {
			await formElement.validate();
			expect(formElement.validationError).to.equal('Test form element is required.');
		});

		it('should remove message if validate has no errors', async() => {
			await formElement.validate();
			expect(formElement.validationError).to.equal('Test form element is required.');
			formElement.value = 'Non-empty';
			await formElement.validate();
			expect(formElement.validationError).to.null;
		});

	});

	describe('validate', () => {

		it('should validate internal validation-customs', async() => {
			formElement.isValidationCustomValid = false;
			const errors = await formElement.validate();
			expect(errors).to.include.members(['Internal custom validation failed']);
		});

		it('should validate external validation-customs', async() => {
			form.isValidationCustomValid = false;
			const errors = await formElement.validate();
			expect(errors).to.include.members(['External custom validation failed']);
		});

		it('should validate native element validity state', async() => {
			const errors = await formElement.validate();
			expect(errors).to.include.members(['Test form element is required.']);
		});

		it('should validate with default validity state message', async() => {
			formElement.value = 'Non-empty';
			formElement.setValidity({ badInput: true });
			const errors = await formElement.validate();
			expect(errors).to.include.members(['Test form element is invalid.']);
		});

		it('should validate with overridden validity state message', async() => {
			formElement.value = 'Non-empty';
			formElement.setValidity({ rangeOverflow: true });
			const errors = await formElement.validate();
			expect(errors).to.include.members(['Test form element failed with an overridden validation message']);
		});

		it('should validate with custom validity state message', async() => {
			formElement.value = 'Non-empty';
			formElement.setCustomValidity('Validation failed for custom validity');
			const errors = await formElement.validate();
			expect(errors).to.include.members(['Validation failed for custom validity']);
		});

		it('should pass validation when no errors', async() => {
			formElement.value = 'Non-empty';
			const errors = await formElement.validate();
			expect(errors).to.be.empty;
		});

	});

	describe('requestValidate', () => {

		it('should not validate if canceled', async() => {
			formElement.addEventListener('d2l-form-element-should-validate', e => e.preventDefault());
			await formElement.requestValidate();
			expect(formElement.validationError).to.be.null;
		});

	});

});
