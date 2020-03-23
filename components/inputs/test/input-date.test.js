import { aTimeout, expect, fixture, oneEvent } from '@open-wc/testing';
import { formatDateInISO, formatISODateInUserCalDescriptor } from '../input-date.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

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
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

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

	describe('focus trap', () => {
		it('should set trap to true when dropdown open', async() => {
			const elem = await fixture(basicFixture);
			const dropdown = elem.shadowRoot.querySelector('d2l-dropdown');
			dropdown.toggleOpen();
			await aTimeout(1);
			const focusTrap = elem.shadowRoot.querySelector('d2l-focus-trap');
			expect(focusTrap.trap).to.be.true;
		});

		it('should set trap to false when dropdown closed', async() => {
			const elem = await fixture(basicFixture);
			const dropdown = elem.shadowRoot.querySelector('d2l-dropdown');
			dropdown.toggleOpen();
			await aTimeout(1);
			dropdown.toggleOpen();
			await aTimeout(1);
			const focusTrap = elem.shadowRoot.querySelector('d2l-focus-trap');
			expect(focusTrap.trap).to.be.false;
		});
	});

	describe('utility functions', () => {
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

		describe('formatISODateInUserCalDescriptor', () => {
			it('should return correct date when input is valid', () => {
				expect(formatISODateInUserCalDescriptor('2019-01-30')).to.equal('1/30/2019');
			});

			it('should throw when invalid date format', () => {
				expect(() => {
					formatISODateInUserCalDescriptor('2019/01/30');
				}).to.throw('Invalid value: Expected format is YYYY-MM-DD');
			});
		});
	});

	describe('value', () => {
		const dateInput = '2/8/2019';

		it('should fire "d2l-input-date-change" event when input value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getInput(elem);
			inputElem.value = dateInput;
			dispatchEvent(inputElem, 'change', false);
			await oneEvent(elem, 'd2l-input-date-change');
		});

		it('should fire "d2l-input-date-change" event when "Set to Today" is clicked', async() => {
			const newToday = new Date('2018-02-12T20:00:00Z');
			const clock = sinon.useFakeTimers(newToday.getTime());

			const elem = await fixture(basicFixture);
			let fired = false;
			elem.addEventListener('d2l-input-date-change', () => {
				fired = true;
			});
			const button = elem.shadowRoot.querySelector('d2l-button-subtle[text="Set to Today"]');
			button.click();
			expect(elem.value).to.equal('2018-02-12');
			expect(fired).to.be.true;

			clock.restore();
		});

		it('should fire "d2l-input-date-change" event when "Clear" is clicked', async() => {
			const elem = await fixture(basicFixture);
			let fired = false;
			elem.addEventListener('d2l-input-date-change', () => {
				fired = true;
			});
			const button = elem.shadowRoot.querySelector('d2l-button-subtle[text="Clear"]');
			button.click();
			expect(elem.value).to.equal('');
			expect(fired).to.be.true;
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
