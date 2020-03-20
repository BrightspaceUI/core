import { aTimeout, expect, fixture, oneEvent } from '@open-wc/testing';
import { formatDateInISO, parseISODate } from '../input-date.js';

const basicFixture = '<d2l-input-date label="label text"></d2l-input-date>';
const labelHiddenFixture = '<d2l-input-date label="label text" label-hidden></d2l-input-date>';

function dispatchEvent(elem, eventType, composed) {
	const e = new Event(
		eventType,
		{ bubbles: true, cancelable: false, composed: composed }
	);
	elem.dispatchEvent(e);
}

function getInput(elem) {
	return elem.shadowRoot.querySelector('d2l-input-text');
}

describe('d2l-input-date', () => {

	describe('accessibility', () => {

		it('passes all axe tests', async() => {
			const elem = await fixture(basicFixture);
			await expect(elem).to.be.accessible();
		});

		it('passes all axe tests when label is hidden', async() => {
			const elem = await fixture(labelHiddenFixture);
			await expect(elem).to.be.accessible();
		});

		it('passes all axe tests when disabled', async() => {
			const elem = await fixture('<d2l-input-date label="label text" disabled></d2l-input-date>');
			await expect(elem).to.be.accessible();
		});

		it('passes all axe tests when focused', async() => {
			const elem = await fixture(basicFixture);
			setTimeout(() => getInput(elem).focus());
			await oneEvent(elem, 'focus');
			await expect(elem).to.be.accessible();
		});
	});

	describe('utility function', () => {
		describe('formatDateInISO', () => {
			it('should return the correct date', () => {
				const testDate = new Date(2020, 2, 1);
				expect(formatDateInISO(testDate)).to.equal('2020-03-01');
			});

			it('should return the correct date', () => {
				const testDate = new Date(2020, 9, 10);
				expect(formatDateInISO(testDate)).to.equal('2020-10-10');
			});
		});

		describe('parseISODate', () => {
			it('should return correct date when input is valid', () => {
				expect(parseISODate('2019-01-30')).to.deep.equal(new Date(2019, 0, 30));
			});

			it('should throw when invalid date format', () => {
				expect(() => {
					parseISODate('2019/01/30');
				}).to.throw('Invalid value: Expected format is YYYY-MM-DD');
			});
		});
	});

	describe('value', () => {
		const dateInput = '2/8/2019';

		it('should fire uncomposed "d2l-input-date-change" event when input value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getInput(elem);
			inputElem.value = dateInput;
			dispatchEvent(inputElem, 'change', false);
			await oneEvent(elem, 'd2l-input-date-change');
		});

		it('should not fire "d2l-input-date-change" event when input value is invalid', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getInput(elem);
			let fired = false;
			elem.addEventListener('d2l-input-date-change', () => {
				fired = true;
			});
			inputElem.value = 'invalid input text';
			dispatchEvent(inputElem, 'change', false);
			await aTimeout(1);
			expect(fired).to.be.false;
		});

		it('should change "value" property when input value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getInput(elem);
			inputElem.value = dateInput;
			dispatchEvent(inputElem, 'change', false);
			await oneEvent(elem, 'd2l-input-date-change');
			expect(elem.value).to.equal('2019-02-08');
		});

		it('should default to undefined', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.value).to.equal(undefined);
		});

	});

});
