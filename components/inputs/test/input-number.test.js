import '../input-number.js';
import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const normalFixture = html`<d2l-input-number label="label"></d2l-input-number>`;
const defaultValueFixture = html`<d2l-input-number label="label" value="1.1"></d2l-input-number>`;
const requiredFixture = html`<d2l-input-number label="label" required></d2l-input-number>`;
const minMaxFixture = html`<d2l-input-number label="label" min="5" max="10"></d2l-input-number>`;
const minFixture = html`<d2l-input-number label="label" min="5"></d2l-input-number>`;
const maxFixture = html`<d2l-input-number label="label" max="10"></d2l-input-number>`;
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
		it('should round down to the nearest integer', async() => {
			const elem = await fixture(integerFixture);
			elem.value = 15.2345;
			await elem.updateComplete;
			expect(elem.value).to.equal(15);
			expect(getInnerInputValue(elem)).to.equal('15');
		});

		it('should round up to the nearest integer', async() => {
			const elem = await fixture(integerFixture);
			elem.value = 15.6345;
			await elem.updateComplete;
			expect(elem.value).to.equal(16);
			expect(getInnerInputValue(elem)).to.equal('16');
		});

		it('should automatically add zeroes to match min fraction digits', async() => {
			const elem = await fixture(minMaxFractionDigitsFixture);
			elem.value = 1;
			await elem.updateComplete;
			expect(elem.value).to.equal(1);
			expect(getInnerInputValue(elem)).to.equal('1.00');
		});

		it('should automatically round up to match max fraction digits', async() => {
			const elem = await fixture(minMaxFractionDigitsFixture);
			elem.value = 1.2345;
			await elem.updateComplete;
			expect(elem.value).to.equal(1.235);
			expect(getInnerInputValue(elem)).to.equal('1.235');
		});

		it('should automatically round down to match max fraction digits', async() => {
			const elem = await fixture(minMaxFractionDigitsFixture);
			elem.value = 1.2344;
			await elem.updateComplete;
			expect(elem.value).to.equal(1.234);
			expect(getInnerInputValue(elem)).to.equal('1.234');
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

		it('should update value when language changes', async() => {
			const elem = await fixture(html`<d2l-input-number label="label" value="2000.3"></d2l-input-number>`);
			setTimeout(() => documentLocaleSettings.language = 'fr');
			await oneEvent(elem, 'd2l-localize-behavior-language-changed');
			await elem.updateComplete;
			expect(getInnerInputValue(elem)).to.equal('2 000,3');
		});

		it('should not update empty value when language changes', async() => {
			const elem = await fixture(html`<d2l-input-number label="label"></d2l-input-number>`);
			setTimeout(() => documentLocaleSettings.language = 'fr');
			await oneEvent(elem, 'd2l-localize-behavior-language-changed');
			await elem.updateComplete;
			expect(getInnerInputValue(elem)).to.equal('');
		});
	});

	describe('validation', () => {
		it('should be valid when required has value', async() => {
			const elem = await fixture(requiredFixture);
			elem.value = 10;
			await elem.updateComplete;
			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be invalid when empty and required', async() => {
			const elem = await fixture(requiredFixture);
			await elem.updateComplete;
			const errors = await elem.validate();
			expect(errors).to.contain('label is required.');
		});

		it('should be valid if number is in range', async() => {
			const elem = await fixture(minMaxFixture);
			elem.value = 7;
			await elem.updateComplete;
			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be invalid if number is out of range', async() => {
			const elem = await fixture(minMaxFixture);
			elem.value = 1;
			await elem.updateComplete;
			const errors = await elem.validate();
			expect(errors).to.contain('Number must be between 5 and 10.');
		});

		it('should be valid if number is higher than min', async() => {
			const elem = await fixture(minFixture);
			elem.value = 10;
			elem.updateComplete;
			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be invalid if number is lower than min', async() => {
			const elem = await fixture(minFixture);
			elem.value = 1;
			await elem.updateComplete;
			const errors = await elem.validate();
			expect(errors).to.contain('Number must be higher than 5.');
		});

		it('should be valid if number is lower than max', async() => {
			const elem = await fixture(maxFixture);
			elem.value = 1;
			await elem.updateComplete;
			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be invalid if number is higher than max', async() => {
			const elem = await fixture(maxFixture);
			elem.value = 15;
			await elem.updateComplete;
			const errors = await elem.validate();
			expect(errors).to.contain('Number must be lower than 10.');
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
