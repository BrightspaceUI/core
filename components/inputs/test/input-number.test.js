import '../input-number.js';
import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const normalFixture = html`<d2l-input-number label="label"></d2l-input-number>`;
const defaultValueFixture = html`<d2l-input-number label="label" value="1.1"></d2l-input-number>`;
const requiredFixture = html`<d2l-input-number label="label" required></d2l-input-number>`;
const minMaxFixture = html`<d2l-input-number label="label" min="5" max="10"></d2l-input-number>`;
const minMaxExclusiveFixture = html`<d2l-input-number label="label" min="5" max="10" min-exclusive max-exclusive></d2l-input-number>`;
const minFixture = html`<d2l-input-number label="label" min="5"></d2l-input-number>`;
const minExclusiveFixture = html`<d2l-input-number label="label" min="5" min-exclusive></d2l-input-number>`;
const maxFixture = html`<d2l-input-number label="label" max="10"></d2l-input-number>`;
const maxExclusiveFixture = html`<d2l-input-number label="label" max="10" max-exclusive></d2l-input-number>`;
const minMaxFractionDigitsFixture = html`<d2l-input-number label="label" min-fraction-digits="2" max-fraction-digits="3"></d2l-input-number>`;
const integerFixture = html`<d2l-input-number label="label" max-fraction-digits="0"></d2l-input-number>`;

function dispatchEvent(elem, eventType) {
	const e = new Event(
		eventType,
		{ bubbles: true, composed: false }
	);
	elem.dispatchEvent(e);
}

function getInnerInputValue(elem) {
	return elem.shadowRoot.querySelector('d2l-input-text').value;
}

describe('d2l-input-number', () => {

	const documentLocaleSettings = getDocumentLocaleSettings();
	afterEach(() => {
		documentLocaleSettings.reset();
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-input-number');
		});
	});

	describe('default property values', () => {
		let elem;
		beforeEach(async() => {
			elem = await fixture(normalFixture);
		});

		['autofocus', 'disabled', 'labelHidden', 'required'].forEach((name) => {
			it(`should default "${name}" property to "false" when unset`, async() => {
				expect(elem[name]).to.be.false;
			});
		});

		['autocomplete', 'max', 'maxFractionDigits', 'min', 'minFractionDigits', 'placeholder', 'title', 'value'].forEach((name) => {
			it(`should default "${name}" property to 'undefined' when unset`, async() => {
				expect(elem.value).to.equal(undefined);
			});
		});

		it('should default "formattedValue" property to empty when unset', () => {
			expect(elem._formattedValue).to.equal('');
		});
	});

	describe('min and max fraction digits', () => {
		[
			{
				name: 'should round down to the nearest integer',
				fixture: integerFixture,
				value: 15.2345,
				expectedValue: 15,
				expectInnerValue: '15'
			},
			{
				name: 'should round up to the nearest integer',
				fixture: integerFixture,
				value: 15.6345,
				expectedValue: 16,
				expectInnerValue: '16'
			},
			{
				name: 'should automatically add zeroes to match min fraction digits',
				fixture: minMaxFractionDigitsFixture,
				value: 1,
				expectedValue: 1,
				expectInnerValue: '1.00'
			},
			{
				name: 'should automatically round up to match max fraction digits',
				fixture: minMaxFractionDigitsFixture,
				value: 1.2345,
				expectedValue: 1.235,
				expectInnerValue: '1.235'
			},
			{
				name: 'should automatically round down to match max fraction digits',
				fixture: minMaxFractionDigitsFixture,
				value: 1.2344,
				expectedValue: 1.234,
				expectInnerValue: '1.234'
			}
		].forEach((test) => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture);
				elem.value = test.value;
				await elem.updateComplete;
				expect(elem.value).to.equal(test.expectedValue);
				expect(getInnerInputValue(elem)).to.equal(test.expectInnerValue);
			});
		});
	});

	describe('invalid values', () => {
		it('should reset value', async() => {
			const elem = await fixture(normalFixture);
			elem.value = 'helloworld123';
			await elem.updateComplete;
			expect(elem.value).to.equal(undefined);
			expect(getInnerInputValue(elem)).to.equal('');
		});
	});

	describe('re-formatting values', () => {
		it('should add a comma for numbers in thousands using Intl library', async() => {
			const elem = await fixture(normalFixture);
			elem.value = 1000;
			await elem.updateComplete;
			expect(elem.value).to.equal(1000);
			expect(getInnerInputValue(elem)).to.equal('1,000');
		});

		it('should format/parse values that start with numbers using Intl library', async() => {
			const elem = await fixture(normalFixture);
			elem.value = '123abc';
			await elem.updateComplete;
			expect(elem.value).to.equal(123);
			expect(getInnerInputValue(elem)).to.equal('123');
		});
	});

	describe('validation', () => {
		[
			{
				name: 'should be valid when required has value',
				fixture: requiredFixture,
				value: 10,
				expectedError: ''
			},
			{
				name: 'should be invalid when empty and required',
				fixture: requiredFixture,
				value: null,
				expectedError: 'label is required.'
			},
			{
				name: 'should be valid if number is in range',
				fixture: minMaxFixture,
				value: 7,
				expectedError: ''
			},
			{
				name: 'should be invalid if number is out of range',
				fixture: minMaxFixture,
				value: 1,
				expectedError: 'Number must be greater than or equal to 5 and less than or equal to 10.'
			},
			{
				name: 'should be valid if number is higher than min',
				fixture: minFixture,
				value: 10,
				expectedError: ''
			},
			{
				name: 'should be invalid if number is lower than min',
				fixture: minFixture,
				value: 1,
				expectedError: 'Number must be greater than or equal to 5.'
			},
			{
				name: 'should be valid if number is lower than max',
				fixture: maxFixture,
				value: 1,
				expectedError: ''
			},
			{
				name: 'should be invalid if number is higher than max',
				fixture: maxFixture,
				value: 15,
				expectedError: 'Number must be less than or equal to 10.'
			},
			{
				name: 'should be invalid if number is equal to min',
				fixture: minMaxExclusiveFixture,
				value: 5,
				expectedError: 'Number must be greater than 5 and less than 10.'
			},
			{
				name: 'should be invalid if number is equal to max',
				fixture: minMaxExclusiveFixture,
				value: 10,
				expectedError: 'Number must be greater than 5 and less than 10.'
			},
			{
				name: 'should be invalid if number is equal to min',
				fixture: minExclusiveFixture,
				value: 5,
				expectedError: 'Number must be greater than 5.'
			},
			{
				name: 'should be invalid if number is equal to max',
				fixture: maxExclusiveFixture,
				value: 10,
				expectedError: 'Number must be less than 10.'
			}
		].forEach((test) => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture);
				if (test.value !== null) elem.value = test.value;
				await elem.updateComplete;
				const errors = await elem.validate();
				if (test.expectedError) expect(errors).to.contain(test.expectedError);
				else expect(errors).to.be.empty;
			});
		});
	});

	describe('events', () => {
		it('should not fire "change" event when property changes', async() => {
			const elem = await fixture(normalFixture);

			let fired = false;
			elem.addEventListener('change', () => { fired = true; });

			elem.value = 10;
			await elem.updateComplete;
			expect(fired).to.be.false;

			elem.setAttribute('value', 15);
			await elem.updateComplete;
			expect(fired).to.be.false;
		});

		it('should fire "change" event when underlying value changes', async() => {
			const elem = await fixture(defaultValueFixture); // value = 1.1
			await aTimeout(1);

			const inputTextElement = elem.shadowRoot.querySelector('d2l-input-text');
			inputTextElement.value = '123';
			dispatchEvent(inputTextElement, 'change');
			await oneEvent(elem, 'change');

			expect(elem.value).to.equal(123);
		});

		it('should not fire "change" event when underlying value doesn\'t change', async() => {
			const elem = await fixture(defaultValueFixture); // value = 1.1
			let fired = false;
			elem.addEventListener('change', () => { fired = true; });

			const inputTextElement = elem.shadowRoot.querySelector('d2l-input-text');
			inputTextElement.value = '1.1000';
			dispatchEvent(inputTextElement, 'change');
			await aTimeout(1);

			expect(fired).to.be.false;
		});
	});
});
