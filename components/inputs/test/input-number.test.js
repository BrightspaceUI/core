import '../input-number.js';
import { aTimeout, defineCE, expect, fixture, html, oneEvent, waitUntil } from '@brightspace-ui/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { LitElement } from 'lit';
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

function dispatchEvent(elem, eventType) {
	const e = new Event(
		eventType,
		{ bubbles: true, composed: false }
	);
	elem.dispatchEvent(e);
}

function dispatchKeypressEvent(elem, key) {
	const event = new CustomEvent('keypress', {
		detail: 0,
		bubbles: true,
		cancelable: true,
		composed: true
	});
	event.key = key;
	elem.shadowRoot.querySelector('d2l-input-text').dispatchEvent(event);
	return event;
}

const inputWrapperTag = defineCE(
	class extends LitElement {
		static get properties() {
			return {
				number: { type: Number }
			};
		}
		constructor() {
			super();
			this.number = 1;

		}
		render() {
			return html`<d2l-input-number
			value="${this.number}"
			label="label"
			></d2l-input-number>`;
		}
	}
);

async function fixtureInit(f) {
	const elem = await fixture(f);
	await waitUntil(() => {
		const textInput = elem.shadowRoot.querySelector('d2l-input-text');
		if (!textInput) return false;
		const input = textInput.shadowRoot.querySelector('.d2l-input');
		if (!input) return false;
		return true;
	}, { interval: 10 });
	return elem;
}

function getInnerInputValue(elem) {
	return elem.shadowRoot.querySelector('d2l-input-text').value;
}

async function setInnerInputValue(elem, value) {
	const inputTextElement = elem.shadowRoot.querySelector('d2l-input-text');
	inputTextElement.value = value;
	setTimeout(() => dispatchEvent(inputTextElement, 'change'));
}

function setCursorPosition(elem, pos) {
	elem.shadowRoot.querySelector('d2l-input-text')
		.shadowRoot.querySelector('.d2l-input')
		.setSelectionRange(pos, pos);
}

function setSelectionRange(elem, start, end) {
	elem.shadowRoot.querySelector('d2l-input-text')
		.shadowRoot.querySelector('.d2l-input')
		.setSelectionRange(start, end);
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

		['autocomplete', 'max', 'min', 'placeholder', 'title', 'value'].forEach((name) => {
			it(`should default "${name}" property to 'undefined' when unset`, async() => {
				expect(elem[name]).to.equal(undefined);
			});
		});

		it('should default "formattedValue" property to empty when unset', () => {
			expect(elem._formattedValue).to.equal('');
		});

	});

	describe('min and max fraction digits', () => {

		it('should default "maxFractionDigits" to 3', async() => {
			const elem = await fixture(normalFixture);
			expect(elem.maxFractionDigits).to.equal(3);
		});

		it('should default "maxFractionDigits" to "minFractionDigits" if set', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" min-fraction-digits="5"></d2l-input-number>`);
			expect(elem.maxFractionDigits).to.equal(5);
		});

		it('should update "maxFractionDigits" to "minFractionDigits" if changed', async() => {
			const elem = await fixture(html`<d2l-input-number label="label"></d2l-input-number>`);
			elem.minFractionDigits = 6;
			expect(elem.maxFractionDigits).to.equal(6);
		});

		it('should default "minFractionDigits" to 0', async() => {
			const elem = await fixture(normalFixture);
			expect(elem.minFractionDigits).to.equal(0);
		});

		it('should throw if minFractionDigits is less than zero', async() => {
			const elem = await fixture(normalFixture);
			expect(() => elem.minFractionDigits = -1).to.throw(RangeError);
		});

		it('should throw if minFractionDigits is greater than 20', async() => {
			const elem = await fixture(normalFixture);
			expect(() => elem.minFractionDigits = 21).to.throw(RangeError);
		});

		it('should throw if maxFractionDigits is less than zero', async() => {
			const elem = await fixture(normalFixture);
			expect(() => elem.maxFractionDigits = -1).to.throw(RangeError);
		});

		it('should throw if maxFractionDigits is greater than 20', async() => {
			const elem = await fixture(normalFixture);
			expect(() => elem.maxFractionDigits = 21).to.throw(RangeError);
		});

		it('should throw if maxFractionDigits is less than minFractionDigits', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" min-fraction-digits="6"></d2l-input-number>`);
			expect(() => elem.maxFractionDigits = 5).to.throw(RangeError);
		});

		it('should round to 3 fraction digits by default', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value="0.555555"></d2l-input-number>`);
			expect(elem.value).to.equal(0.556);
			expect(getInnerInputValue(elem)).to.equal('0.556');
		});

		it('should round to specified max fraction digits', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value="0.555555" max-fraction-digits="4"></d2l-input-number>`);
			expect(elem.value).to.equal(0.5556);
			expect(getInnerInputValue(elem)).to.equal('0.5556');
		});

		it('should round down to the nearest integer', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value="15.2345" max-fraction-digits="0"></d2l-input-number>`);
			expect(elem.value).to.equal(15);
			expect(getInnerInputValue(elem)).to.equal('15');
		});

		it('should round up to the nearest integer', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value="15.512" max-fraction-digits="0"></d2l-input-number>`);
			expect(elem.value).to.equal(16);
			expect(getInnerInputValue(elem)).to.equal('16');
		});

		it('should preserve precision when max fraction digits increases', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value="0.555555" max-fraction-digits="4"></d2l-input-number>`);
			elem.maxFractionDigits = 5;
			expect(elem.value).to.equal(0.55556);
			expect(elem._formattedValue).to.equal('0.55556');
		});

		it('should round further when max fraction digits decreases', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value="0.555555" max-fraction-digits="4"></d2l-input-number>`);
			elem.maxFractionDigits = 2;
			expect(elem.value).to.equal(0.56);
			expect(elem._formattedValue).to.equal('0.56');
		});

		it('should have no minimum fraction digits by default', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value="1.00"></d2l-input-number>`);
			expect(elem.value).to.equal(1);
			expect(getInnerInputValue(elem)).to.equal('1');
		});

		it('should add minimum fraction digits when set', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value="1" min-fraction-digits="5"></d2l-input-number>`);
			expect(elem.value).to.equal(1);
			expect(getInnerInputValue(elem)).to.equal('1.00000');
		});

		it('should add fraction digits when min fraction digits changes', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value="1" min-fraction-digits="5"></d2l-input-number>`);
			elem.minFractionDigits = 6;
			expect(elem.value).to.equal(1);
			expect(elem._formattedValue).to.equal('1.000000');
		});

		it('should round negative numbers properly', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value="-0.55" max-fraction-digits="1"></d2l-input-number>`);
			expect(elem.value).to.equal(-0.6);
			expect(elem._formattedValue).to.equal('-0.6');
		});

		it('should handle large numbers with large precision', async() => {
			// Safari won't format numbers with more than 15 significant digits
			// Other browsers can handle no more than 17
			const elem = await fixture(html`<d2l-input-number label="label" value="1234567890.12345" max-fraction-digits="16"></d2l-input-number>`);
			expect(elem.value).to.equal(1234567890.12345);
			expect(elem._formattedValue).to.equal('1234567890.12345');
		});

	});

	describe('invalid values', () => {
		[undefined, null, '', NaN, 'helloworld123'].forEach((val) => {
			it(`should reset "${val}" to undefined`, async() => {
				const elem = await fixture(normalFixture);
				elem.value = val;
				expect(elem.value).to.equal(undefined);
				expect(elem._formattedValue).to.equal('');
			});
		});
	});

	describe('formatted value', () => {
		it('should not add group separators', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value="1000"></d2l-input-number>`);
			expect(elem.value).to.equal(1000);
			expect(getInnerInputValue(elem)).to.equal('1000');
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
			},
			{
				name: 'should be invalid if number is less than updated min',
				fixture: minFixture,
				value: 10,
				change: { prop: 'min', value: 15 },
				expectedError: 'Number must be greater than or equal to 15.'
			},
			{
				name: 'should be valid if number is greater than updated min',
				fixture: minFixture,
				value: 3,
				change: { prop: 'min', value: 0 },
				expectedError: ''
			},
			{
				name: 'should be invalid if number is greater than updated max',
				fixture: maxFixture,
				value: 8,
				change: { prop: 'max', value: 5 },
				expectedError: 'Number must be less than or equal to 5.'
			},
			{
				name: 'should be valid if number is less than updated max',
				fixture: maxFixture,
				value: 12,
				change: { prop: 'max', value: 15 },
				expectedError: ''
			},
			{
				name: 'should be invalid if number is equal to min and minExclusive added',
				fixture: minFixture,
				value: 5,
				change: { prop: 'minExclusive', value: true },
				expectedError: 'Number must be greater than 5.'
			},
			{
				name: 'should be valid if number is equal to min and minExclusive removed',
				fixture: minExclusiveFixture,
				value: 5,
				change: { prop: 'minExclusive', value: false },
				expectedError: ''
			},
			{
				name: 'should be invalid if number is equal to max and maxExclusive added',
				fixture: maxFixture,
				value: 10,
				change: { prop: 'maxExclusive', value: true },
				expectedError: 'Number must be less than 10.'
			},
			{
				name: 'should be valid if number is equal to max and maxExclusive removed',
				fixture: maxFixture,
				value: 10,
				change: { prop: 'maxExclusive', value: false },
				expectedError: ''
			}
		].forEach((test) => {
			it(test.name, async() => {
				const elem = await fixture(test.fixture);
				if (test.value) elem.value = test.value;
				await elem.updateComplete;
				if (test.change) {
					elem[test.change.prop] = test.change.value;
					await elem.updateComplete;
				}
				const errors = await elem.validate();
				if (test.expectedError) expect(errors).to.contain(test.expectedError);
				else expect(errors).to.be.empty;
				expect(elem.invalid).to.equal(!!test.expectedError);
			});
		});

		it('should be invalid when required and value is less than min', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" min="5" required value="0"></d2l-input-number>`);
			expect(elem.validationError).to.equal('Number must be greater than or equal to 5.');
			expect(elem.invalid).to.equal(true);
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

			setInnerInputValue(elem, '123');
			await oneEvent(elem, 'change');

			expect(elem.value).to.equal(123);
		});

		it('should not fire "change" event when underlying value doesn\'t change', async() => {
			const elem = await fixture(defaultValueFixture); // value = 1.1
			let fired = false;
			elem.addEventListener('change', () => { fired = true; });

			setInnerInputValue(elem, '1.1000');
			await aTimeout(1);

			expect(fired).to.be.false;

		});

		it('should have correct "invalid" state when change event fires', async() => {
			const elem = await fixture(minMaxFixture);
			setTimeout(() => setInnerInputValue(elem, '0'));
			await oneEvent(elem, 'invalid-change');
			expect(elem.invalid).to.be.true;
		});
	});

	describe('value attribute binding', () => {

		[0, 1].forEach((number) => {
			it(`setting wrapper to ${number} should set input-number value to ${number}`, async() => {
				const inputWrapper = `<${inputWrapperTag}></${inputWrapperTag}>`;
				const elem = await fixture(inputWrapper);
				elem.number = number;
				await elem.updateComplete;
				const inputVal = elem.shadowRoot.querySelector('d2l-input-number').value;

				expect(inputVal).to.equal(number);
			});
		});

		[undefined, null].forEach((number) => {
			it(`setting wrapper to ${number} should set input-number value to undefined`, async() => {
				const inputWrapper = `<${inputWrapperTag}></${inputWrapperTag}>`;
				const elem = await fixture(inputWrapper);
				elem.number = number;
				await elem.updateComplete;
				const inputVal = elem.shadowRoot.querySelector('d2l-input-number').value;

				expect(inputVal).to.equal(undefined);
			});
		});
	});

	describe('input correction', () => {

		['a', ' ', '+', '(', ')', '?'].forEach((key) => {
			it(`should suppress non-numeric character: "${key}"`, async() => {
				const elem = await fixtureInit(normalFixture);
				const event = dispatchKeypressEvent(elem, key);
				expect(event.defaultPrevented).to.be.true;
			});
		});

		['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((key) => {
			it(`should not suppress numeric character: "${key}"`, async() => {
				const elem = await fixtureInit(normalFixture);
				const event = dispatchKeypressEvent(elem, key);
				expect(event.defaultPrevented).to.be.false;
			});
		});

		it('should not suppress negative symbol at the beginning for "en"', async() => {
			const elem = await fixtureInit(normalFixture);
			setCursorPosition(elem, 0);
			const event = dispatchKeypressEvent(elem, '-');
			expect(event.defaultPrevented).to.be.false;
		});

		it('should not suppress negative symbol at the end for "ar"', async() => {
			documentLocaleSettings.language = 'ar';
			const elem = await fixtureInit(defaultValueFixture);
			await setCursorPosition(elem, 3);
			const event = dispatchKeypressEvent(elem, '-');
			expect(event.defaultPrevented).to.be.false;
		});

		it('should not suppress ENTER key so that input\'s change event can fire', async() => {
			const elem = await fixtureInit(normalFixture);
			const event = dispatchKeypressEvent(elem, 'Enter');
			expect(event.defaultPrevented).to.be.false;
		});

		it('should suppress negative symbol when cursor is not at beginning', async() => {
			const elem = await fixtureInit(defaultValueFixture);
			setCursorPosition(elem, 1);
			const event = dispatchKeypressEvent(elem, '-');
			expect(event.defaultPrevented).to.be.true;
		});

		it('should suppress decimal symbol if one already exists', async() => {
			const elem = await fixtureInit(html`<d2l-input-number label="label" value="1.2"></d2l-input-number>`);
			const event = dispatchKeypressEvent(elem, '.');
			expect(event.defaultPrevented).to.be.true;
			expect(elem._hintType).to.equal(1);
		});

		it('should suppress decimal symbol if selection range does not cover it', async() => {
			const elem = await fixtureInit(html`<d2l-input-number label="label" value="10.25"></d2l-input-number>`);
			setSelectionRange(elem, 0, 2);
			const event = dispatchKeypressEvent(elem, '.');
			expect(event.defaultPrevented).to.be.true;
			expect(elem._hintType).to.equal(1);
		});

		it('should not suppress decimal symbol if selection range covers it from the left', async() => {
			const elem = await fixtureInit(html`<d2l-input-number label="label" value="10.25"></d2l-input-number>`);
			setSelectionRange(elem, 0, 3);
			const event = dispatchKeypressEvent(elem, '.');
			expect(event.defaultPrevented).to.be.false;
		});

		it('should not suppress decimal symbol if selection range covers it from the right', async() => {
			const elem = await fixtureInit(html`<d2l-input-number label="label" value="10.25"></d2l-input-number>`);
			setSelectionRange(elem, 2, 5);
			const event = dispatchKeypressEvent(elem, '.');
			expect(event.defaultPrevented).to.be.false;
		});

		it('should suppress decimal symbol only integers are allowed', async() => {
			const elem = await fixtureInit(html`<d2l-input-number label="label" value="1" max-fraction-digits="0"></d2l-input-number>`);
			const event = dispatchKeypressEvent(elem, '.');
			expect(event.defaultPrevented).to.be.true;
			expect(elem._hintType).to.equal(4);
		});

		it('should suppress incorrect decimal symbol ","', async() => {
			const elem = await fixtureInit(html`<d2l-input-number label="label" value="1"></d2l-input-number>`);
			const event = dispatchKeypressEvent(elem, ',');
			expect(event.defaultPrevented).to.be.true;
			expect(elem._hintType).to.equal(3);
		});

		it('should not suppress correct decimal symbol "."', async() => {
			const elem = await fixtureInit(html`<d2l-input-number label="label" value="1"></d2l-input-number>`);
			const event = dispatchKeypressEvent(elem, '.');
			expect(event.defaultPrevented).to.be.false;
			expect(elem._hintType).to.equal(0);
		});

		it('should suppress incorrect decimal symbol "."', async() => {
			documentLocaleSettings.language = 'fr';
			const elem = await fixtureInit(html`<d2l-input-number label="label" value="1"></d2l-input-number>`);
			const event = dispatchKeypressEvent(elem, '.');
			expect(event.defaultPrevented).to.be.true;
			expect(elem._hintType).to.equal(2);
		});

		it('should not suppress correct decimal symbol ","', async() => {
			documentLocaleSettings.language = 'fr';
			const elem = await fixtureInit(html`<d2l-input-number label="label" value="1"></d2l-input-number>`);
			const event = dispatchKeypressEvent(elem, ',');
			expect(event.defaultPrevented).to.be.false;
			expect(elem._hintType).to.equal(0);
		});

		it('should reset hint after next keypress', async() => {
			const elem = await fixtureInit(html`<d2l-input-number label="label" value="1"></d2l-input-number>`);
			dispatchKeypressEvent(elem, ',');
			dispatchKeypressEvent(elem, '5');
			expect(elem._hintType).to.equal(0);
		});

	});

	describe('trailing zeroes', () => {

		const trailingZeroesFixture = html`<d2l-input-number label="label" value-trailing-zeroes="2001.00" trailing-zeroes></d2l-input-number>`;

		it('should default to empty', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" trailing-zeroes></d2l-input-number>`);
			expect(elem.value).to.be.undefined;
			expect(elem.valueTrailingZeroes).to.equal('');
			expect(getInnerInputValue(elem)).to.equal('');
		});

		it('should become empty when set to empty string', async() => {
			const elem = await fixture(trailingZeroesFixture);
			elem.valueTrailingZeroes = '';
			expect(elem.value).to.be.undefined;
			expect(elem.valueTrailingZeroes).to.equal('');
			await elem.updateComplete;
			expect(getInnerInputValue(elem)).to.equal('');
		});

		it('should preserve initial trailing zeroes', async() => {
			const elem = await fixture(trailingZeroesFixture);
			expect(elem.value).to.equal(2001);
			expect(elem.valueTrailingZeroes).to.equal('2001.00');
			expect(getInnerInputValue(elem)).to.equal('2001.00');
		});

		it('should cap initial trailing zeroes at default max-fraction-digits (3)', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value-trailing-zeroes="2001.00000" trailing-zeroes></d2l-input-number>`);
			expect(elem.value).to.equal(2001);
			expect(elem.valueTrailingZeroes).to.equal('2001.000');
			expect(getInnerInputValue(elem)).to.equal('2001.000');
		});

		it('should cap initial trailing zeroes at max-fraction-digits', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value-trailing-zeroes="2001.00000" trailing-zeroes max-fraction-digits="4"></d2l-input-number>`);
			expect(elem.value).to.equal(2001);
			expect(elem.valueTrailingZeroes).to.equal('2001.0000');
			expect(getInnerInputValue(elem)).to.equal('2001.0000');
		});

		it('should only add extra trailing zeroes to formatted value', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value-trailing-zeroes="2001.00" trailing-zeroes min-fraction-digits="4"></d2l-input-number>`);
			expect(elem.value).to.equal(2001);
			expect(elem.valueTrailingZeroes).to.equal('2001.00');
			expect(getInnerInputValue(elem)).to.equal('2001.0000');
		});

		it('should preserve trailing zeroes after user interaction', async() => {
			const elem = await fixture(trailingZeroesFixture);
			setInnerInputValue(elem, '3002.000');
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal(3002);
			expect(elem.valueTrailingZeroes).to.equal('3002.000');
			expect(elem._formattedValue).to.equal('3002.000');
		});

		it('should preserve trailing zeroes after user interaction with no initial value', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" trailing-zeroes></d2l-input-number>`);
			setInnerInputValue(elem, '1234.00');
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal(1234);
			expect(elem.valueTrailingZeroes).to.equal('1234.00');
			expect(elem._formattedValue).to.equal('1234.00');
		});

		it('should preserve trailing zeroes after setAttribute', async() => {
			const elem = await fixture(trailingZeroesFixture);
			elem.setAttribute('value-trailing-zeroes', '1234.2900');
			expect(elem.value).to.equal(1234.29);
			expect(elem.valueTrailingZeroes).to.equal('1234.290');
			await elem.updateComplete;
			expect(getInnerInputValue(elem)).to.equal('1234.290');
		});

		it('should preserve trailing zeroes after property setter', async() => {
			const elem = await fixture(trailingZeroesFixture);
			elem.valueTrailingZeroes = '1234.2900';
			expect(elem.value).to.equal(1234.29);
			expect(elem.valueTrailingZeroes).to.equal('1234.290');
			await elem.updateComplete;
			expect(getInnerInputValue(elem)).to.equal('1234.290');
		});

		it('should preserve trailing zeroes after property setter to negative value', async() => {
			const elem = await fixture(trailingZeroesFixture);
			elem.valueTrailingZeroes = '-1234.2900';
			expect(elem.value).to.equal(-1234.29);
			expect(elem.valueTrailingZeroes).to.equal('-1234.290');
			await elem.updateComplete;
			expect(getInnerInputValue(elem)).to.equal('-1234.290');
		});

		it('should handle no decimals trailing zeroes', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" trailing-zeroes value-trailing-zeroes="-9.000"></d2l-input-number>`);
			expect(elem.value).to.equal(-9);
			expect(elem.valueTrailingZeroes).to.equal('-9.000');
			expect(getInnerInputValue(elem)).to.equal('-9.000');
		});

		it('should handle some decimals trailing zeroes', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" trailing-zeroes value-trailing-zeroes="-9.100"></d2l-input-number>`);
			expect(elem.value).to.equal(-9.1);
			expect(elem.valueTrailingZeroes).to.equal('-9.100');
			expect(getInnerInputValue(elem)).to.equal('-9.100');
		});

		it('should fire "change" event when only decimals change', async() => {
			const elem = await fixture(trailingZeroesFixture);
			setInnerInputValue(elem, '2001.000');
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal(2001);
			expect(elem.valueTrailingZeroes).to.equal('2001.000');
			expect(elem._formattedValue).to.equal('2001.000');
		});

		it('should handle changing to a negative value', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" trailing-zeroes value-trailing-zeroes="3.140"></d2l-input-number>`);
			setInnerInputValue(elem, '-3.290');
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal(-3.29);
			expect(elem.valueTrailingZeroes).to.equal('-3.290');
			expect(getInnerInputValue(elem)).to.equal('-3.290');
		});

		it('should handle different locales', async() => {
			documentLocaleSettings.language = 'fr';
			const elem = await fixture(trailingZeroesFixture);
			expect(elem.value).to.equal(2001);
			expect(elem.valueTrailingZeroes).to.equal('2001.00');
			expect(elem._formattedValue).to.equal('2001,00');
		});

		it('should handle 7 decimals (which in JS use scientific notation)', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" trailing-zeroes value-trailing-zeroes="0.0000005" max-fraction-digits="7"></d2l-input-number>`);
			expect(elem.value).to.equal(0.0000005);
			expect(elem.valueTrailingZeroes).to.equal('0.0000005');
			expect(elem._formattedValue).to.equal('0.0000005');
		});

		[
			'12', '12.1', '12.10', '12.0', '12.00000',
			'1', '1.1', '1.10', '1.0', '1.00000',
			'-1', '-1.1', '-1.10', '-1.0', '-1.00000'
		].forEach((val) => {
			it(`should preserve ${val} when set initially`, async() => {
				const elem = await fixture(html`<d2l-input-number label="label" trailing-zeroes value-trailing-zeroes="${val}" max-fraction-digits="16"></d2l-input-number>`);
				expect(elem.value).to.equal(parseFloat(val));
				expect(elem.valueTrailingZeroes).to.equal(val);
				expect(elem._formattedValue).to.equal(val);
			});
		});

	});
});
