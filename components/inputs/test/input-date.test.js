import { aTimeout, expect, fixture, oneEvent } from '@open-wc/testing';
import { formatISODateInUserCalDescriptor } from '../input-date.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import sinon from 'sinon';

const basicFixture = '<d2l-input-date label="label text"></d2l-input-date>';

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

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-date');
		});

	});

	describe('focus trap', () => {
		it('should set trap to true when dropdown open', async() => {
			const elem = await fixture(basicFixture);
			const dropdown = getChildElem(elem, 'd2l-dropdown');
			dropdown.toggleOpen();
			await oneEvent(dropdown, 'd2l-dropdown-open');
			const focusTrap = getChildElem(elem, 'd2l-focus-trap');
			await focusTrap.updateComplete;
			expect(focusTrap.trap).to.be.true;
		});

		it('should set trap to false when dropdown closed', async() => {
			const elem = await fixture(basicFixture);
			const dropdown = getChildElem(elem, 'd2l-dropdown');
			dropdown.toggleOpen();
			await oneEvent(dropdown, 'd2l-dropdown-open');
			dropdown.toggleOpen();
			await oneEvent(dropdown, 'd2l-dropdown-close');
			const focusTrap = getChildElem(elem, 'd2l-focus-trap');
			await focusTrap.updateComplete;
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

		it('should fire "change" event when input value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-text');
			inputElem.value = dateInput;
			dispatchEvent(inputElem, 'change', false);
			await oneEvent(elem, 'change');
		});

		it('should fire "change" event when calendar value selected', async() => {
			const elem = await fixture(basicFixture);
			const calendarElem = getChildElem(elem, 'd2l-calendar');
			calendarElem.selectedValue = '2018-03-24';
			setTimeout(() => dispatchEvent(calendarElem, 'd2l-calendar-selected', false));
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('2018-03-24');
		});

		it('should fire "change" event when "Set to Today" is clicked', async() => {
			const _setTimeout = setTimeout; // useFakeTimers causes setTimeout to not behave as expected
			const newToday = new Date('2018-02-12T20:00:00Z');
			const clock = sinon.useFakeTimers(newToday.getTime());

			const elem = await fixture(basicFixture);
			const button = getChildElem(elem, 'd2l-button-subtle[text="Set to Today"]');
			_setTimeout(() => button.click());
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('2018-02-12');

			clock.restore();
		});

		it('should fire "change" event when "Clear" is clicked', async() => {
			const elem = await fixture('<d2l-input-date label="label text" value="2019-02-01"></d2l-input-date>');
			const button = getChildElem(elem, 'd2l-button-subtle[text="Clear"]');
			setTimeout(() => button.click());
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('');
		});

		it('should fire "change" event when input-text value is changed to empty', async() => {
			const elem = await fixture('<d2l-input-date label="label text" value="2019-02-01"></d2l-input-date>');
			const inputElem = getChildElem(elem, 'd2l-input-text');
			inputElem.value = '';
			setTimeout(() => dispatchEvent(inputElem, 'change', false));
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('');
		});

		it('should not fire "change" event when input value is invalid', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-text');
			let fired = false;
			elem.addEventListener('change', () => {
				fired = true;
			});
			inputElem.value = 'invalid input text';
			dispatchEvent(inputElem, 'change', false);
			await aTimeout(1);
			expect(fired).to.be.false;
		});

		it('should not fire "change" event when input value does not change', async() => {
			const elem = await fixture(basicFixture);
			elem.value = '2019-01-01';
			const inputElem = getChildElem(elem, 'd2l-input-text');
			let fired = false;
			elem.addEventListener('change', () => {
				fired = true;
			});
			inputElem.value = '01/01/2019';
			dispatchEvent(inputElem, 'change', false);
			await aTimeout(1);
			expect(fired).to.be.false;
		});

		it('should change "value" property when input value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-text');
			inputElem.value = dateInput;
			dispatchEvent(inputElem, 'change', false);
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('2019-02-08');
		});

		it('should default to empty', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.value).to.equal('');
		});

	});

});
