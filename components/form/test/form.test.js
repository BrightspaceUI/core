import '../../validation/validation-custom.js';
import '../form.js';
import './form-element.js';
import './nested-form.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

describe('d2l-form', () => {

	const _validateCheckbox = e => {
		e.detail.resolve(e.detail.forElement.checked);
	};

	describe('single form', () => {

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

	describe('nested form', () => {
		const _validateStory = e => {
			e.detail.resolve(e.detail.forElement.value === 'The PERFECT story');
		};

		const rootFormFixture = html`
			<d2l-form>
				<d2l-validation-custom for="mycheck" @d2l-validation-custom-validate=${_validateCheckbox} failure-text="The checkbox failed validation" >
				</d2l-validation-custom>
				<input type="checkbox" id="mycheck" name="checkers" value="red-black">
				<div>
					<d2l-form id="nested-form">
						<select aria-label="Home planet" name="home-planet" id="nested-home-planet" required>
							<option value="">--Please choose an option--</option>
							<option value="earth">Earth</option>
							<option value="other">Other</option>
						</select>
						<label>Story<input type="text" id="nested-story" name="story"></label>
						<d2l-validation-custom for="nested-story" @d2l-validation-custom-validate=${_validateStory} failure-text="Wrong story" >
						</d2l-validation-custom>
						<d2l-test-form-element id="nested-custom-ele"></d2l-test-form-element>
					</d2l-form>
				</div>
				<select aria-label="Pets" name="pets" id="pets" required>
					<option value="">--Please choose an option--</option>
					<option value="dog">Dog</option>
					<option value="cat">Cat</option>
					<option value="hamster">Hamster</option>
					<option value="parrot">Parrot</option>
					<option value="spider">Spider</option>
					<option value="goldfish">Goldfish</option>
				</select>
				<d2l-test-nested-form id="composed-nested-form"></d2l-test-nested-form>
				<input type="radio" id="myradio" name="optional-radio">
				<d2l-test-form-element id="custom-ele"></d2l-test-form-element>
			</d2l-form>
		`;

		let form;

		beforeEach(async() => {
			form = await fixture(rootFormFixture);
		});

		const fillForm = () => {
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
		};

		const fillNestedForm = () => {
			const nestedFormEle = form.querySelector('#nested-form');

			const homePlanet = nestedFormEle.querySelector('#nested-home-planet > option:nth-child(2)');
			homePlanet.selected = true;

			const story = nestedFormEle.querySelector('#nested-story');
			story.value = 'The PERFECT story';

			const formElement = nestedFormEle.querySelector('#nested-custom-ele');
			formElement.value = 'Non-empty';
			formElement.formValue = {
				'nested-key-1': 'nested-val-1',
				'nested-key-2': 'nested-val-2'
			};
		};

		describe('validate', () => {

			[
				{ noDirectNesting: false, noComposedNesting: false },
				{ noDirectNesting: true, noComposedNesting: false },
				{ noDirectNesting: false, noComposedNesting: true },
			].forEach(({ noDirectNesting, noComposedNesting }) => {
				it(`should validate nested forms in tree order with${noDirectNesting ? ' no ' : ' '}direct nesting and${noComposedNesting ? ' no ' : ' '}composed nesting`, async() => {

					const formElement = form.querySelector('#custom-ele');
					formElement.value = 'Non-empty';
					formElement.setValidity({ rangeOverflow: true });

					const nestedFormEle = form.querySelector('#nested-form');
					nestedFormEle.noNesting = noDirectNesting;

					const composedNestedFormEle = form.querySelector('#composed-nested-form');
					composedNestedFormEle.noNesting = noComposedNesting;
					const expectedErrors = [
						[form.querySelector('#mycheck'), ['The checkbox failed validation']],
						...(nestedFormEle.noNesting ? [] : [
							[nestedFormEle.querySelector('#nested-home-planet'), ['Home planet is required.']],
							[nestedFormEle.querySelector('#nested-story'), ['Wrong story']],
							[nestedFormEle.querySelector('#nested-custom-ele'), ['Test form element is required.']],
						]),
						[form.querySelector('#pets'), ['Pets is required.']],
						...(composedNestedFormEle.noNesting ? [] : [
							[composedNestedFormEle.shadowRoot.querySelector('#composed-nested-first-name'), ['First Name is required.']],
							[composedNestedFormEle.shadowRoot.querySelector('#composed-nested-pets'), ['Expected Hamster']],
							[composedNestedFormEle.shadowRoot.querySelector('#composed-nested-custom-ele'), ['Test form element is required.']],
						]),
						[formElement, ['Test form element failed with an overridden validation message']]
					];
					const errors = await form.validate();

					const actualErrors = [...errors.entries()];
					expect(actualErrors).to.deep.equal(expectedErrors);
				});
			});

		});

		describe('submit', () => {

			[
				{ noDirectNesting: false, noComposedNesting: false },
				{ noDirectNesting: true, noComposedNesting: false },
				{ noDirectNesting: false, noComposedNesting: true },
			].forEach(({ noDirectNesting, noComposedNesting }) => {
				it(`should not submit if there are errors in a nested form with${noDirectNesting ? ' no ' : ' '}direct nesting and${noComposedNesting ? ' no ' : ' '}composed nesting`, async() => {

					fillForm();

					const nestedForm = form.querySelector('#nested-form');
					nestedForm.noNesting = noDirectNesting;

					const composedNestedFormEle = form.querySelector('#composed-nested-form');
					const composedNestedForm = composedNestedFormEle.shadowRoot.querySelector('d2l-form');
					composedNestedForm.noNesting = noComposedNesting;

					let submitted = false;
					form.addEventListener('d2l-form-submit', () => submitted = true);
					nestedForm.addEventListener('d2l-form-submit', () => submitted = true);
					composedNestedForm.addEventListener('d2l-form-submit', () => submitted = true);
					await form.submit();
					expect(submitted).to.be.false;
				});
			});

			[
				{ noDirectNesting: false, noComposedNesting: false },
				{ noDirectNesting: true, noComposedNesting: false },
				{ noDirectNesting: false, noComposedNesting: true },
			].forEach(({ noDirectNesting, noComposedNesting }) => {
				it(`should submit all forms with form values with${noDirectNesting ? ' no ' : ' '}direct nesting and${noComposedNesting ? ' no ' : ' '}composed nesting`, async() => {

					const nestedForm = form.querySelector('#nested-form');
					nestedForm.noNesting = noDirectNesting;

					const composedNestedFormEle = form.querySelector('#composed-nested-form');
					const composedNestedForm = composedNestedFormEle.shadowRoot.querySelector('d2l-form');
					composedNestedFormEle.noNesting = noComposedNesting;

					if (!noDirectNesting) {
						fillNestedForm();
					}
					if (!noComposedNesting) {
						composedNestedFormEle.fill();
					}
					fillForm();

					const formPromise = new Promise(resolve => {
						form.addEventListener('d2l-form-submit', (e) => {
							const expectedFormData = {
								'checkers': 'red-black',
								'pets': 'hamster',
								'optional-radio': 'on',
								'key-1': 'val-1',
								'key-2': 'val-2'
							};
							const { formData } = e.detail;
							expect(formData).to.deep.equal(expectedFormData);
							resolve();
						});
					});
					const nestedFormPromise = new Promise(resolve => {
						if (noDirectNesting) {
							resolve();
						}
						nestedForm.addEventListener('d2l-form-submit', (e) => {
							const expectedFormData = {
								'home-planet': 'earth',
								'story': 'The PERFECT story',
								'nested-key-1': 'nested-val-1',
								'nested-key-2': 'nested-val-2',
							};
							const { formData } = e.detail;
							expect(formData).to.deep.equal(expectedFormData);
							resolve();
						});
					});
					const composedNestedFormPromise = new Promise(resolve => {
						if (noComposedNesting) {
							resolve();
						}
						composedNestedForm.addEventListener('d2l-form-submit', (e) => {
							const expectedFormData = {
								'first-name': 'John Doe',
								'pets': 'hamster',
								'composed-nested-key-1': 'val-1',
								'composed-nested-key-2': 'val-2'
							};
							const { formData } = e.detail;
							expect(formData).to.deep.equal(expectedFormData);
							resolve();
						});
					});
					form.submit();
					await Promise.all([formPromise, nestedFormPromise, composedNestedFormPromise]);
				});
			});

		});
	});

});
