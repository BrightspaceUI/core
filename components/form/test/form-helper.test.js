import './form-element.js';
import '../../status-indicator/status-indicator.js';
import '../../tooltip/tooltip.js';
import { defineCE, expect, fixture } from '@brightspace-ui/testing';
import { findFormElements, flattenMap, getFormElementData, isCustomElement, isCustomFormElement, isElement, isNativeFormElement, tryGetLabelText } from '../form-helper.js';
import { html, LitElement } from 'lit';

const buttonFixture = html`<button type="button">Add to favorites</button>`;

const fieldsetFixture = html`
	<fieldset>
		<legend>Choose your favorite monster</legend>

		<input type="radio" id="kraken" name="monster">
		<label for="kraken">Kraken</label><br/>

		<input type="radio" id="sasquatch" name="monster">
		<label for="sasquatch">Sasquatch</label><br/>

		<input type="radio" id="mothman" name="monster">
		<label for="mothman">Mothman</label>
  </fieldset>
`;

const inputFixture = html`<input type="text" id="name" name="name" required minlength="4" maxlength="8" size="10">`;

const objectFixture = html`<object name="image" type="image/png" width="300" height="200"></object>`;

const outputFixture = html`<output name="result">60</output>`;

const selectFixture = html`
	<select name="pets" id="pet-select">
		<option value="">--Please choose an option--</option>
		<option value="dog">Dog</option>
		<option value="cat">Cat</option>
		<option value="hamster">Hamster</option>
		<option value="parrot">Parrot</option>
		<option value="spider">Spider</option>
		<option value="goldfish">Goldfish</option>
	</select>
`;

const textareaFixture = html`<textarea id="story" name="story" rows="5" cols="33">It was a dark and stormy night...</textarea>`;

const divFixture = html`
	<div>
		<p>Beware of the leopard</p>
	</div>
`;

const labelFixture = html`
	<label>Do you like peas?
		<input type="checkbox" name="peas">
	</label>
`;

const formFixture = html`
	<form action="" method="GET">
		<div>
			<label for="name">Enter your name: </label>
			<input type="text" name="name" id="name" required>
		</div>
	</form>
`;

const d2lStatusIndicatorFixture = html`<d2l-status-indicator text="test subtle"></d2l-status-indicator>`;

const h1Fixture = html`<h1>Beetles</h1>`;

const formElementFixture = html`<d2l-test-form-element></d2l-test-form-element>`;

describe('form-helper', () => {

	describe('elements', () => {

		[
			{ tag: 'button', fixture: buttonFixture, expected: { isElement: true, isCustomElement: false, isNativeFormElement: true, isCustomFormElement: false } },
			{ tag: 'fieldset', fixture: fieldsetFixture, expected: { isElement: true, isCustomElement: false, isNativeFormElement: true, isCustomFormElement: false } },
			{ tag: 'input', fixture: inputFixture, expected: { isElement: true, isCustomElement: false, isNativeFormElement: true, isCustomFormElement: false } },
			{ tag: 'object', fixture: objectFixture, expected: { isElement: true, isCustomElement: false, isNativeFormElement: true, isCustomFormElement: false } },
			{ tag: 'output', fixture: outputFixture, expected: { isElement: true, isCustomElement: false, isNativeFormElement: true, isCustomFormElement: false } },
			{ tag: 'select', fixture: selectFixture, expected: { isElement: true, isCustomElement: false, isNativeFormElement: true, isCustomFormElement: false } },
			{ tag: 'textarea', fixture: textareaFixture, expected: { isElement: true, isCustomElement: false, isNativeFormElement: true, isCustomFormElement: false } },
			{ tag: 'div', fixture: divFixture, expected: { isElement: true, isCustomElement: false, isNativeFormElement: false, isCustomFormElement: false } },
			{ tag: 'label', fixture: labelFixture, expected: { isElement: true, isCustomElement: false, isNativeFormElement: false, isCustomFormElement: false } },
			{ tag: 'form', fixture: formFixture, expected: { isElement: true, isCustomElement: false, isNativeFormElement: false, isCustomFormElement: false } },
			{ tag: 'h1', fixture: h1Fixture, expected: { isElement: true, isCustomElement: false, isNativeFormElement: false, isCustomFormElement: false } },
			{ tag: 'd2l-status-indicator', fixture: d2lStatusIndicatorFixture, expected: { isElement: true, isCustomElement: true, isNativeFormElement: false, isCustomFormElement: false } },
			{ tag: 'd2l-test-form-element', fixture: formElementFixture, expected: { isElement: true, isCustomElement: true, isNativeFormElement: false, isCustomFormElement: true } }
		].forEach(({ tag, fixture: eleFixture, expected }) => {

			describe(tag, () => {

				let ele;

				beforeEach(async() => {
					ele = await fixture(eleFixture);
				});

				it(`${tag} should ${expected.isElement ? '' : 'not '}be an element`, () => {
					expect(isElement(ele)).to.equal(expected.isElement);
				});

				it(`${tag} should ${expected.isCustomElement ? '' : 'not '}be a custom element`, () => {
					expect(isCustomElement(ele)).to.equal(expected.isCustomElement);
				});

				it(`${tag} should ${expected.isNativeFormElement ? '' : 'not '}be a native form element`, () => {
					expect(isNativeFormElement(ele)).to.equal(expected.isNativeFormElement);
				});

				it(`${tag} should ${expected.isCustomFormElement ? '' : 'not '}be a custom form element`, () => {
					expect(isCustomFormElement(ele)).to.equal(expected.isCustomFormElement);
				});

			});

		});

	});

	describe('tryGetLabelText', () => {

		const composedLabelTag = defineCE(
			class extends LitElement {
				render() {
					return html`
						<div>
							<label for="target">Do you like peas?</label>
							<input id='target' type="checkbox" name="peas">
						</div>
					`;
				}
			}
		);

		const implicitLabelFixture = html`
			<label>Do you like peas?
				<input id='target' type="checkbox" name="peas">
			</label>
		`;

		const implicitLabelWithTooltipFixture = html`
			<label>Do you like peas?
				<input id='target' type="checkbox" name="peas">
				<d2l-tooltip for="target">Tooltip that shouldn't be included in label text</d2l-tooltip>
			</label>
		`;

		const explicitLabelFixture = html`
			<div>
				<label for="target">Do you like peas?</label>
				<input id='target' type="checkbox" name="peas">
			</div>
		`;

		const ariaLabelFixture = html`
			<div>
				<input aria-label="Do you like peas?" id='target' type="checkbox" name="peas">
			</div>
		`;

		const ariaLabelledByFixture = html`
			<div>
				<div id="label">Do you like peas?</div>
				<input aria-labelledby="label" id='target' type="checkbox" name="peas">
			</div>
		`;

		const titleLabelFixture = html`
			<div>
				<input title="Do you like peas?" id='target' type="checkbox" name="peas">
			</div>
		`;

		const buttonLabelFixture = html`
			<div>
				<button id='target' name="peas">Do you like peas?</button>
			</div>
		`;

		const inputButtonLabelFixture = html`
			<div>
				<input id='target' type="button" name="peas" value="Do you like peas?"/>
			</div>
		`;

		const submitButtonLabelFixture = html`
			<div>
				<input id='target' type="submit" name="peas" value="Do you like peas?"/>
			</div>
		`;

		const resetButtonLabelFixture = html`
			<div>
				<input id='target' type="reset" name="peas" value="Do you like peas?"/>
			</div>
		`;

		const imageLabelFixture = html`
			<div>
				<input id='target' type="image" name="peas" alt="Do you like peas?"/>
			</div>
		`;

		const emptyLabelFixture = html`
			<div>
				<label for="target">
				</label>
				<input id='target' type="checkbox" name="peas">
			</div>
		`;

		const composedLabelFixture = `<${composedLabelTag}><${composedLabelTag}/>`;

		[
			{ type: 'implicit', fixture: implicitLabelFixture },
			{ type: 'implicit with tooltip', fixture: implicitLabelWithTooltipFixture },
			{ type: 'explicit', fixture: explicitLabelFixture },
			{ type: 'aria-label', fixture: ariaLabelFixture },
			{ type: 'aria-labelledby', fixture: ariaLabelledByFixture },
			{ type: 'title', fixture: titleLabelFixture },
			{ type: 'button', fixture: buttonLabelFixture },
			{ type: 'button input', fixture: inputButtonLabelFixture },
			{ type: 'submit input', fixture: submitButtonLabelFixture },
			{ type: 'reset input', fixture: resetButtonLabelFixture },
			{ type: 'image input', fixture: imageLabelFixture },
		].forEach(({ type, fixture: eleFixture }) => {
			it(`should find an ${type} label`, async() => {
				const ele = await fixture(eleFixture);
				const target = ele.querySelector('#target');
				expect(tryGetLabelText(target)).to.equal('Do you like peas?');
			});
		});

		it('should find a composed label', async() => {
			const ele = await fixture(composedLabelFixture);
			const target = ele.shadowRoot.querySelector('#target');
			expect(tryGetLabelText(target)).to.equal('Do you like peas?');
		});

		[
			{ type: 'empty', fixture: emptyLabelFixture },
		].forEach(({ type, fixture: eleFixture }) => {
			it(`shouldn't find an ${type} label`, async() => {
				const ele = await fixture(eleFixture);
				const target = ele.querySelector('#target');
				expect(tryGetLabelText(target)).to.be.null;
			});
		});

	});

	describe('findFormElements', () => {

		const formElementsFixture = html`
			<div>
				<h1>My Form</h1>
				<fieldset id="ele-1">
					<legend>Choose your favorite monster</legend>
					<input id="ele-2" type="radio" name="monster" value="kraken">
					<br><label for="ele-2">Kraken</label><br/>
					<input id="ele-3" type="radio" name="monster" value="sasquatch">
					<br><label for="ele-3">Sasquatch</label><br/>
				</fieldset>
				<label for="ele-4">Checkers</label>
				<input id="ele-4" type="checkbox" name="checkers" value="red-black">
				<div>
					<label for="ele-5">Name</label>
					<input id="ele-5" type="text" name="name">
					<div>
						<select id="ele-6" name="pets" required>
							<option value="">--Please choose an option--</option>
							<option value="dog">Dog</option>
							<option value="cat">Cat</option>
							<option value="hamster">Hamster</option>
							<option value="parrot">Parrot</option>
							<option value="spider">Spider</option>
							<option value="goldfish">Goldfish</option>
						</select>
						<d2l-test-form-element id="ele-7"></d2l-test-form-element>
					</div>
				</div>
				<object id="ele-8" type="image/png" width="300" height="200"></object>
				<div id="fake-form-element"></div>
				<label>Email
					<input id="ele-9" type="email"/>
				</label>
				<div id="secondary">
					<h2>Secondary</h2>
					<label for="ele-10">Tell us your story</label>
					<textarea id="ele-10" title="my title" minlength="20" name="story">It was...</textarea>
					<div>
						<input id="ele-11" type="range" name="b" value="50" max="100" min="15" /> +
						<input id="ele-12" type="number" name="a" value="10" /> =
						<output id="ele-13" name="result" for="ele-11 ele-12">60</output>
					</div>
				</div>
				<button id="ele-14" type="submit" name="action">Update</button>
				<button id="ele-15" type="reset" name="action">Delete</button>
				<button id="ele-16" name="other" value="other">Other</button>
			</div>
		`;

		let root;
		beforeEach(async() => {
			root = await fixture(formElementsFixture);
		});

		it('should find all form elements', () => {
			const formElements = findFormElements(root);
			let id = 1;
			for (const formElement of formElements) {
				const expectedFormElement = root.querySelector(`#ele-${id}`);
				expect(formElement).to.equal(expectedFormElement);
				id += 1;
			}
		});

		it('should not find form elements inside elements that fail the visitChildrenPredicate', () => {
			const secondaryEle = root.querySelector('#secondary');
			const formElements = findFormElements(root, undefined, ele => ele !== secondaryEle);

			const ele10 = root.querySelector('#ele-10');
			const ele11 = root.querySelector('#ele-11');
			const ele12 = root.querySelector('#ele-12');
			const ele13 = root.querySelector('#ele-13');

			expect(formElements).to.not.include.members([ele10, ele11, ele12, ele13]);
		});

		it('should find elements that pass the isFormElementPredicate', () => {
			const fakeFormElement = root.querySelector('#fake-form-element');
			const formElements = findFormElements(root, ele => ele === fakeFormElement);

			expect(formElements).to.include.members([fakeFormElement]);
		});

	});

	describe('flattenMap', () => {

		it('should flatten errors', async() => {
			const errors = new Map();
			const pairs = [];

			const set = (map, key, value) => {
				if (!(value instanceof Map)) {
					pairs.push([key, value]);
				}
				map.set(key, value);
			};

			set(errors, 'a', 1);

			const subErrors1 = new Map();
			set(subErrors1, 'ba', 'a value');
			set(subErrors1, 'bb', { prop: 'my prop' });

			const subSubErrors1 = new Map();
			set(subSubErrors1, 'bca', 99);
			set(subSubErrors1, 'bcb', new Map());
			set(subErrors1, 'bc', subSubErrors1);

			set(errors, 'b', subErrors1);

			set(errors, 'c', [1, 2, 3, 4]);
			set(errors, 'd', 'another val');

			const subErrors2 = new Map();
			set(subErrors2, 'ea', ['x', 'y']);
			set(subErrors2, 'eb', 1024);
			set(errors, 'e', subErrors2);

			const flatErrors = flattenMap(errors);
			for (const [key, value] of pairs) {
				expect(flatErrors.get(key)).to.equal(value);
			}
		});

	});

	describe('getFormElementData', () => {

		describe('custom form element', () => {
			let formElement;
			beforeEach(async() => {
				formElement = await fixture(formElementFixture);
			});

			it('should not have any data by default', async() => {
				const eleData = getFormElementData(formElement);
				expect(eleData).to.be.empty;
			});

			it('should not have any data if disabled', async() => {
				formElement.disabled = true;
				formElement.name = 'my-key';
				formElement.setFormValue('my-value');
				const eleData = getFormElementData(formElement);
				expect(eleData).to.be.empty;
			});

			it('should use the name and formValue if it is a string', async() => {
				formElement.name = 'my-key';
				formElement.setFormValue('my-value');
				const eleData = getFormElementData(formElement);
				expect(eleData).to.deep.equal({ 'my-key': 'my-value' });
			});

			it('should use the formValue if it is an object', async() => {
				const formValue = {
					'my-key-1': 'my-val-1',
					'my-key-2': 'my-val-2'
				};
				formElement.setFormValue(formValue);
				const eleData = getFormElementData(formElement);
				expect(eleData).to.deep.equal(formValue);
			});
		});

		describe('native form element', () => {

			[
				{ name: 'should have data when the button is the submitter', isSubmitter: true },
				{ name: 'should have not data when the button is not the submitter', isSubmitter: false }
			].forEach(({ name, isSubmitter }) => {
				it(name, async() => {
					const container = await fixture(html`
							<div>
								<button id="pets" type="submit" name="pets" value="the value"></button>
								<button id="dogs" type="submit" name="dogs" value="other value"></button>
							</div>
					`);
					const clicked = container.querySelector('#pets');
					const submitter = isSubmitter ? clicked : container.querySelector('#dogs');
					const eleData = getFormElementData(clicked, submitter);
					if (isSubmitter) {
						expect(eleData).to.deep.equal({ pets: 'the value' });
					} else {
						expect(eleData).to.empty;
					}
				});
			});

			it('should get files for file inputs', async() => {
				const fileInput = await fixture(html`<input type="file" name="file-input"/>`);
				const eleData = getFormElementData(fileInput);
				expect(eleData).to.deep.equal({ ['file-input']: fileInput.files });
			});

			it('should get names and values', async() => {
				const form = await fixture(html`
					<form>
						<input type="text" name="input-without-value"/>
						<input type="text" name="input-with-value" value="input-value" />
						<input type="text" name="input-with-value-disabled" value="input value disabled" disabled />
						<textarea name="textarea-without-value"></textarea>
						<textarea name="textarea-with-value">textarea value</textarea>
						<textarea name="textarea-with-value-disabled" disabled>textarea value disabled</textarea>
						<object name="object-without-value" type="image/png" width="300" height="200"></object>
						<output name="output-without-value"></output>
						<output name="output-with-value">output value</output>
						<output name="output-with-value-disabled">output value disabled</output>
						<select name="select-disabled" disabled>
							<option value="">--Please choose an option--</option>
							<option value="spider">Spider</option>
							<option value="goldfish" selected>Goldfish</option>
						</select>
						<select name="select-selected">
							<option value="">--Please choose an option--</option>
							<option value="spider">Spider</option>
							<option value="goldfish" selected>Goldfish</option>
						</select>
						<select name="select-default">
							<option value="">--Please choose an option--</option>
							<option value="spider">Spider</option>
							<option value="goldfish">Goldfish</option>
						</select>
						<button name="button-with-value" type="submit" value="button value"></button>
						<button name="button-without-value" type="submit"></button>
						<input name="input-submit-with-value" type="submit" value="input-submit-value"/>
						<input name="input-submit-without-value" type="submit"/>
						<input name="input-reset-with-value" type="reset" value="input-reset-value"/>
						<input name="input-reset-without-value" type="reset"/>
						<input type="checkbox" name="checkbox-default-value-checked" checked />
						<input type="checkbox" name="checkbox-custom-value-checked" value="custom-value-checked" checked />
						<input type="checkbox" name="checkbox-default-value-checked-disabled" checked disabled />
						<input type="checkbox" name="checkbox-default-value" />
						<input type="checkbox" name="checkbox-custom-value" value="custom-value" />
						<input type="radio" name="radio-default-value-checked" checked />
						<input type="radio" name="radio-custom-value-checked" value="custom-value-checked" checked />
						<input type="radio" name="radio-default-value-checked-disabled" checked disabled />
						<input type="radio" name="radio-default-value" />
						<input type="radio" name="radio-custom-value" value="custom-value" />
					</form>
				`);

				const actualFormData = [...form.elements].reduce((acc, ele) => ({ ...acc, ...getFormElementData(ele) }), {});
				const expectedFormData = new FormData(form);

				let expectedEntries = 0;
				for (const entry of expectedFormData) {
					const key = entry[0];
					const value = entry[1];
					expect(actualFormData[key]).to.equal(value);
					expectedEntries += 1;
				}
				expect(Object.entries(actualFormData).length).to.equal(expectedEntries);
			});

		});

	});
});
