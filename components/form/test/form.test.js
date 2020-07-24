import '../../validation/validation-custom.js';
import '../form.js';
import './form-element.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit-element/lit-element.js';

describe('form-element', () => {

	const _validateCheckbox = e => {
		e.detail.resolve(e.detail.forElement.checked);
	};

	const formFixture = html`
		<d2l-form>
			<d2l-validation-custom for="mycheck" @d2l-validation-custom-validate=${_validateCheckbox} failure-text="The checkbox failed validation" >
			</d2l-validation-custom>
			<input type="checkbox" id="mycheck" name="checkers" value="red-black">
			<input type="file" name="optional-file">
			<select aria-label="Pets" name="pets" id="pets" required>
				<option value="">--Please choose an option--</option>
				<option value="dog">Dog</option>
				<option value="cat">Cat</option>
				<option value="hamster">Hamster</option>
				<option value="parrot">Parrot</option>
				<option value="spider">Spider</option>
				<option value="goldfish">Goldfish</option>
			</select>
			<input type="radio" id="myradio" name="optional-radio">
			<label for="name">Name</label>
			<d2l-test-form-element id="custom-ele"></d2l-test-form-element>
		</d2l-form>
	`;

	let form;

	beforeEach(async() => {
		form = await fixture(formFixture);
	});

	describe('validate', () => {

		it('should validate validation-customs', async() => {
			const errors = await form.validate();
			expect(errors).to.include.members(['The checkbox failed validation']);
		});

		it('should validate native form elements', async() => {
			const errors = await form.validate();
			expect(errors).to.include.members(['Pets is required.']);
		});

		it('should validate custom form elements', async() => {
			const formElement = form.querySelector('#custom-ele');
			formElement.value = 'Non-empty';
			formElement.setValidity({ rangeOverflow: true });
			const errors = await form.validate();
			expect(errors).to.include.members(['Test form element failed with an overridden validation message']);
		});

	});

	describe('submit', () => {

		it('should not submit if there are errors', async() => {

			let submitted = false;
			form.addEventListener('d2l-form-submit', () => submitted = true);
			await form.submit();
			expect(submitted).to.be.false;
		});

		it('should submit with form values', done => {

			const mycheck = form.querySelector('#mycheck');
			mycheck.checked = true;

			const pets = form.querySelector('#pets > option:nth-child(4)');
			pets.selected = true;

			const formElement = form.querySelector('#custom-ele');
			formElement.value = 'Non-empty';
			formElement.formValue = {
				'key-1': 'val-1',
				'key-2': 'val-2'
			};

			const myradio = form.querySelector('#myradio');
			myradio.checked = true;

			form.addEventListener('d2l-form-submit', (e) => {
				e.preventDefault();
				const { formData } = e.detail;
				expect(formData.checkers).to.equal('red-black');
				expect(formData.pets).to.equal('hamster');
				expect(formData['key-1']).to.equal('val-1');
				expect(formData['key-2']).to.equal('val-2');
				expect(formData['optional-file']).to.be.empty;
				expect(formData['optional-radio']).to.equal('on');
				done();
			});
			form.submit();
		});

	});

});
