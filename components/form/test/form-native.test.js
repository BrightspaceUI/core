import '../../validation/validation-custom.js';
import '../form-native.js';
import './form-element.js';
import { expect, fixture, runConstructor } from '@brightspace-ui/testing';
import { html } from 'lit';

describe('d2l-form-native', () => {

	const _validateCheckbox = e => {
		e.detail.resolve(e.detail.forElement.checked);
	};

	const formFixture = html`
		<d2l-form-native>
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
			<d2l-test-form-element id="custom-ele"></d2l-test-form-element>
		</d2l-form-native>
	`;

	let form;

	beforeEach(async() => {
		form = await fixture(formFixture);
	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-form-native');
		});

	});

	describe('validate', () => {

		it('should validate validation-customs', async() => {
			const errors = await form.validate();
			const ele = form.querySelector('#mycheck');
			expect(errors.get(ele)).to.include.members(['The checkbox failed validation']);
		});

		it('should validate native form elements', async() => {
			const errors = await form.validate();
			const ele = form.querySelector('#pets');
			expect(errors.get(ele)).to.include.members(['Pets is required.']);
		});

		it('should validate custom form elements', async() => {
			const formElement = form.querySelector('#custom-ele');
			formElement.value = 'Non-empty';
			formElement.setValidity({ rangeOverflow: true });
			const errors = await form.validate();
			expect(errors.get(formElement)).to.include.members(['Test form element failed with an overridden validation message']);
		});

	});

	describe('submit', () => {

		it('should not submit if there are errors', async() => {

			let submitted = false;
			form.addEventListener('submit', () => submitted = true);
			await form.submit();
			expect(submitted).to.be.false;
		});

		it('should submit with form values', async() => {

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

			const submitPromise = new Promise(resolve => {
				form.addEventListener('submit', (e) => {
					e.preventDefault();
					resolve();
				});
			});
			const formDataPromise = new Promise(resolve => {
				form.addEventListener('formdata', (e) => {
					const { formData } = e.detail;
					expect(formData.get('checkers')).to.equal('red-black');
					expect(formData.get('pets')).to.equal('hamster');
					expect(formData.get('key-1')).to.equal('val-1');
					expect(formData.get('key-2')).to.equal('val-2');
					expect(formData.get('optional-radio')).to.equal('on');
					resolve();
				});
			});
			form.submit();
			await Promise.all([submitPromise, formDataPromise]);
		});

	});

});
