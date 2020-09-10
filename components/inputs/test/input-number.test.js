import '../input-number.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const normalFixture = html`<d2l-input-number label="label"></d2l-input-number>`;

function dispatchEvent(elem, eventType) {
	const e = new Event(
		eventType,
		{ bubbles: true, composed: false }
	);
	elem.dispatchEvent(e);
}

describe('d2l-input-number', () => {
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

		['autocomplete', 'max', 'maxFractionDigits', 'min', 'minFractionDigits', 'placeholder', 'value'].forEach((name) => {
			it(`should default "${name}" property to 'undefined' when unset`, async() => {
				expect(elem.value).to.equal(undefined);
			});
		});

		it('should default "formattedValue" property to empty when unset', () => {
			expect(elem._formattedValue).to.equal('');
		});
	});

	describe('validation', () => {
		it('should be valid when required has value', async() => {
			const elem = await fixture(normalFixture);
			elem.required = true;
			elem.value = 10;

			setTimeout(() => dispatchEvent(elem, 'change'));
			await oneEvent(elem, 'change');

			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be invalid when empty and required', async() => {
			const elem = await fixture(normalFixture);
			elem.required = true;

			setTimeout(() => dispatchEvent(elem, 'change'));
			await oneEvent(elem, 'change');

			const errors = await elem.validate();
			expect(errors).to.contain('label is required.');
		});

		it('should be valid if number is in range', async() => {
			const elem = await fixture(normalFixture);
			elem.min = 5;
			elem.max = 10;
			elem.value = 7;

			setTimeout(() => dispatchEvent(elem, 'change'));
			await oneEvent(elem, 'change');

			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be invalid if number is out of range', async() => {
			const elem = await fixture(normalFixture);
			elem.min = 5;
			elem.max = 10;
			elem.value = 1;

			setTimeout(() => dispatchEvent(elem, 'change'));
			await oneEvent(elem, 'change');

			const errors = await elem.validate();
			expect(errors).to.contain('Number must be between 5 and 10.');
		});

		it('should be valid if number is higher than min', async() => {
			const elem = await fixture(normalFixture);
			elem.min = 5;
			elem.value = 10;

			setTimeout(() => dispatchEvent(elem, 'change'));
			await oneEvent(elem, 'change');

			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be invalid if number is lower than min', async() => {
			const elem = await fixture(normalFixture);
			elem.min = 5;
			elem.value = 1;

			setTimeout(() => dispatchEvent(elem, 'change'));
			await oneEvent(elem, 'change');

			const errors = await elem.validate();
			expect(errors).to.contain('Number must be higher than 5.');
		});

		it('should be valid if number is lower than max', async() => {
			const elem = await fixture(normalFixture);
			elem.max = 5;
			elem.value = 1;

			setTimeout(() => dispatchEvent(elem, 'change'));
			await oneEvent(elem, 'change');

			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be invalid if number is higher than max', async() => {
			const elem = await fixture(normalFixture);
			elem.max = 5;
			elem.value = 10;

			setTimeout(() => dispatchEvent(elem, 'change'));
			await oneEvent(elem, 'change');

			const errors = await elem.validate();
			expect(errors).to.contain('Number must be lower than 5.');
		});
	});
});
