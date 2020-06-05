import { expect, fixture, html } from '@open-wc/testing';
import { isCustomElement, isCustomFormElement, isElement, isNativeFormElement } from '../form-helper.js';

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

const objectFixture = html`<object type="image/png" width="300" height="200"></object>`;

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
	<form action="" method="get">
		<div>
			<label for="name">Enter your name: </label>
			<input type="text" name="name" id="name" required>
		</div>
	</form>
`;

const d2lStatusIndicatorFixture = html`<d2l-status-indicator text="test subtle"></d2l-status-indicator>`;

const h1Fixture = html`<h1>Beetles</h1>`;

describe('form-helper', () => {

	describe('elements', () => {

		[
			{ tag: 'button', fixture: buttonFixture, expected: { isElement: true, isNativeFormElement: true, isCustomElement: false, isCustomFormElement: false } },
			{ tag: 'fieldset', fixture: fieldsetFixture, expected: { isElement: true, isNativeFormElement: true, isCustomElement: false, isCustomFormElement: false } },
			{ tag: 'input', fixture: inputFixture, expected: { isElement: true, isNativeFormElement: true, isCustomElement: false, isCustomFormElement: false } },
			{ tag: 'object', fixture: objectFixture, expected: { isElement: true, isNativeFormElement: true, isCustomElement: false, isCustomFormElement: false } },
			{ tag: 'output', fixture: outputFixture, expected: { isElement: true, isNativeFormElement: true, isCustomElement: false, isCustomFormElement: false } },
			{ tag: 'select', fixture: selectFixture, expected: { isElement: true, isNativeFormElement: true, isCustomElement: false, isCustomFormElement: false } },
			{ tag: 'textarea', fixture: textareaFixture, expected: { isElement: true, isNativeFormElement: true, isCustomElement: false, isCustomFormElement: false } },
			{ tag: 'div', fixture: divFixture, expected: { isElement: true, isNativeFormElement: false, isCustomElement: false, isCustomFormElement: false } },
			{ tag: 'label', fixture: labelFixture, expected: { isElement: true, isNativeFormElement: false, isCustomElement: false, isCustomFormElement: false }  },
			{ tag: 'form', fixture: formFixture, expected: { isElement: true, isNativeFormElement: false, isCustomElement: false, isCustomFormElement: false }  },
			{ tag: 'h1', fixture: h1Fixture, expected: { isElement: true, isNativeFormElement: false, isCustomElement: false, isCustomFormElement: false }  },
			{ tag: 'd2l-status-indicator', fixture: d2lStatusIndicatorFixture, expected: { isElement: true, isNativeFormElement: false, isCustomElement: true, isCustomFormElement: false } }
		].forEach(({ tag, fixture: eleFixture, expected}) => {

			describe(tag, () => {

				let ele;

				beforeEach(async() => {
					ele = await fixture(eleFixture);
				});

				it(`${tag} should ${expected.isElement ? '' : 'not '}be an element`, () => {
					expect(isElement(ele)).to.equal(expected.isElement);
				});

				it(`${tag} should ${expected.isNativeFormElement ? '' : 'not '}be a native form element`, () => {
					expect(isNativeFormElement(ele)).to.equal(expected.isNativeFormElement);
				});

				it(`${tag} should ${expected.isCustomElement ? '' : 'not '}be a custom element`, () => {
					expect(isCustomElement(ele)).to.equal(expected.isCustomElement);
				});

				it(`${tag} should ${expected.isCustomFormElement ? '' : 'not '}be a custom form element`, () => {
					expect(isCustomFormElement(ele)).to.equal(expected.isCustomFormElement);
				});

			});

		});

	});

});
