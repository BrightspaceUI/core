import { aTimeout, expect, fixture, oneEvent } from '@open-wc/testing';
import { formatISODateInUserCalDescriptor } from '../input-date.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

const basicFixture = '<d2l-input-date label="label text"></d2l-input-date>';
const labelHiddenFixture = '<d2l-input-date label="label text" label-hidden></d2l-input-date>';

function dispatchEvent(elem, eventType, composed) {
	const e = new Event(
		eventType,
		{ bubbles: true, composed: composed }
	);
	elem.dispatchEvent(e);
}

function getChildElem(elem, selector) {
	return elem.shadowRoot.querySelector(selector);
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
			setTimeout(() => getChildElem(elem, 'd2l-input-text').focus());
			await oneEvent(elem, 'focus');
			await expect(elem).to.be.accessible();
		});
	});

	describe('focus trap', () => {
		it('should set trap to true when dropdown open', async() => {
			const elem = await fixture(basicFixture);
			const dropdown = getChildElem(elem, 'd2l-dropdown');
			dropdown.toggleOpen();
			await aTimeout(1);
			const focusTrap = getChildElem(elem, 'd2l-focus-trap');
			expect(focusTrap.trap).to.be.true;
		});

		it('should set trap to false when dropdown closed', async() => {
			const elem = await fixture(basicFixture);
			const dropdown = getChildElem(elem, 'd2l-dropdown');
			dropdown.toggleOpen();
			await aTimeout(1);
			dropdown.toggleOpen();
			await aTimeout(1);
			const focusTrap = getChildElem(elem, 'd2l-focus-trap');
			expect(focusTrap.trap).to.be.false;
		});
	});

	describe('utility functions', () => {
		describe('formatISODateInUserCalDescriptor', () => {
			it('should return correct date when input is valid', () => {
				expect(formatISODateInUserCalDescriptor('2019-01-30')).to.equal('1/30/2019');
			});
		});
	});

	describe('value', () => {
		const dateInput = '2/8/2019';

		it('should fire "d2l-input-date-change" event when input value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-text');
			inputElem.value = dateInput;
			dispatchEvent(inputElem, 'change', false);
			await oneEvent(elem, 'd2l-input-date-change');
		});

		it('should fire "d2l-input-date-change" event when calendar value selected', async() => {
			const elem = await fixture(basicFixture);
			const calendarElem = getChildElem(elem, 'd2l-calendar');
			calendarElem.selectedValue = '2018-03-24';
			setTimeout(() => dispatchEvent(calendarElem, 'd2l-calendar-selected', false));
			await oneEvent(elem, 'd2l-input-date-change');
			expect(elem.value).to.equal('2018-03-24');
		});

		it('should fire "d2l-input-date-change" event when "Set to Today" is clicked', async() => {
			const _setTimeout = setTimeout; // useFakeTimers causes setTimeout to not behave as expected
			const newToday = new Date('2018-02-12T20:00:00Z');
			const clock = sinon.useFakeTimers(newToday.getTime());

			const elem = await fixture(basicFixture);
			const button = getChildElem(elem, 'd2l-button-subtle[text="Set to Today"]');
			_setTimeout(() => button.click());
			await oneEvent(elem, 'd2l-input-date-change');
			expect(elem.value).to.equal('2018-02-12');

			clock.restore();
		});

		it('should fire "d2l-input-date-change" event when "Clear" is clicked', async() => {
			const elem = await fixture(basicFixture);
			const button = getChildElem(elem, 'd2l-button-subtle[text="Clear"]');
			setTimeout(() => button.click());
			await oneEvent(elem, 'd2l-input-date-change');
			expect(elem.value).to.equal('');
		});

		it('should fire "d2l-input-date-change" event when input-text value is changed to empty', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-text');
			inputElem.value = '';
			setTimeout(() => dispatchEvent(inputElem, 'change', false));
			await oneEvent(elem, 'd2l-input-date-change');
			expect(elem.value).to.equal('');
		});

		it('should not fire "d2l-input-date-change" event when input value is invalid', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-text');
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
			const inputElem = getChildElem(elem, 'd2l-input-text');
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
