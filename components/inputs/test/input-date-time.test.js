import '../input-date-time.js';
import { expect, fixture, oneEvent } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

const basicFixture = '<d2l-input-date-time label="label text"></d2l-input-date-time>';

function dispatchEvent(elem, eventType) {
	const e = new Event(
		eventType,
		{ bubbles: true, composed: true }
	);
	elem.dispatchEvent(e);
}

function getChildElem(elem, selector) {
	return elem.shadowRoot.querySelector(selector);
}

describe('d2l-input-date-time', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	describe('accessibility', () => {

		it('passes all axe tests', async() => {
			const elem = await fixture(basicFixture);
			await expect(elem).to.be.accessible();
		});

		it('passes all axe tests when label is hidden', async() => {
			const elem = await fixture('<d2l-input-date-time label="label text" label-hidden></d2l-input-date-time>');
			await expect(elem).to.be.accessible();
		});

		it('passes all axe tests when disabled', async() => {
			const elem = await fixture('<d2l-input-date-time label="label text" disabled></d2l-input-date-time>');
			await expect(elem).to.be.accessible();
		});

		it('passes all axe tests when focused', async() => {
			const elem = await fixture(basicFixture);
			setTimeout(() => elem.focus());
			await oneEvent(elem, 'focus');
			await expect(elem).to.be.accessible();
		});
	});

	describe('value', () => {
		let _setTimeout, clock;

		before(() => {
			_setTimeout = setTimeout; // useFakeTimers causes setTimeout to not behave as expected
			const newToday = new Date('2018-02-12T20:00:00Z'); // need to set because timezone because daylight savings
			clock = sinon.useFakeTimers(newToday.getTime());
		});

		after(() => {
			clock.restore();
		});

		it('should fire "d2l-input-date-time-change" event when date value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-date');
			inputElem.value = '2018-02-02';
			_setTimeout(() => dispatchEvent(inputElem, 'd2l-input-date-change'));
			await oneEvent(elem, 'd2l-input-date-time-change');
			expect(elem.value).to.equal('2018-02-02T05:00:00.000Z');
		});

		it('should fire "d2l-input-date-time-change" event with empty value when time value changes but no date', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-time');
			inputElem.value = '14:00:00';
			_setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'd2l-input-date-time-change');
			expect(elem.value).to.equal('');
		});

		it('should fire "d2l-input-date-time-change" event when time value changes and there is a date', async() => {
			const elem = await fixture('<d2l-input-date-time label="label text" value="2018-03-03T08:00:00.000Z"></d2l-input-date-time>');
			const inputElem = getChildElem(elem, 'd2l-input-time');
			inputElem.value = '14:00:00';
			_setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'd2l-input-date-time-change');
			expect(elem.value).to.equal('2018-03-03T19:00:00.000Z');
		});

		it('should default to undefined', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.value).to.equal(undefined);
		});

		describe('timezone', () => {
			it('should return expected day in Australia/Eucla timezone', async() => {
				documentLocaleSettings.timezone.identifier = 'Australia/Eucla';
				const elem = await fixture('<d2l-input-date-time label="label text" value="2018-03-03T08:00:00.000Z"></d2l-input-date-time>');
				const inputElem = getChildElem(elem, 'd2l-input-time');
				inputElem.value = '03:00:00';
				_setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'd2l-input-date-time-change');
				expect(elem.value).to.equal('2018-03-02T18:15:00.000Z');
				documentLocaleSettings.timezone.identifier = 'America/Toronto';
			});
		});

	});

});
