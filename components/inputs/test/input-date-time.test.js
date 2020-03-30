import { expect, fixture, oneEvent } from '@open-wc/testing';
import { formatDateTimeInISO } from '../input-date-time.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

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

	describe('utility function', () => {
		describe('formatDateTimeInISO', () => {
			it('should return the correct date-time', () => {
				const date = {
					year: 2020,
					month: 3,
					date: 1,
					hours: 12,
					minutes: 24,
					seconds: 36
				};
				expect(formatDateTimeInISO(date)).to.equal('2020-03-01T12:24:36.000Z');
			});

			it('should return the correct date', () => {
				const date = {
					year: 2020,
					month: 12,
					date: 20,
					hours: 1,
					minutes: 2,
					seconds: 3
				};
				expect(formatDateTimeInISO(date)).to.equal('2020-12-20T01:02:03.000Z');
			});

			it('should throw when no input', () => {
				expect(() => {
					formatDateTimeInISO();
				}).to.throw('Invalid input: Expected input to be an object');
			});

			it('should throw when missing time data', () => {
				const date = {
					year: 2020,
					month: 12,
					date: 20
				};
				expect(() => {
					formatDateTimeInISO(date);
				}).to.throw();
			});

			it('should throw when missing date data', () => {
				const date = {
					hours: 1,
					minutes: 2,
					seconds: 3
				};
				expect(() => {
					formatDateTimeInISO(date);
				}).to.throw();
			});
		});
	});

	describe('value', () => {
		it('should fire "d2l-input-date-time-change" event when date value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-date');
			inputElem.value = '2018-02-02';
			setTimeout(() => dispatchEvent(inputElem, 'd2l-input-date-change'));
			await oneEvent(elem, 'd2l-input-date-time-change');
			expect(elem.value).to.equal('2018-02-02T05:00:00.000Z');
		});

		it('should fire "d2l-input-date-time-change" event with empty value when time value changes but no date', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-time');
			inputElem.value = '14:00:00';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'd2l-input-date-time-change');
			expect(elem.value).to.equal('');
		});

		it('should fire "d2l-input-date-time-change" event when time value changes and there is a date', async() => {
			const elem = await fixture('<d2l-input-date-time label="label text" value="2018-03-03T08:00:00.000Z"></d2l-input-date-time>');
			const inputElem = getChildElem(elem, 'd2l-input-time');
			inputElem.value = '14:00:00';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'd2l-input-date-time-change');
			expect(elem.value).to.equal('2018-03-03T19:00:00.000Z');
		});

		it('should default to undefined', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.value).to.equal(undefined);
		});

		it('should set value to empty when invalid initial value', async() => {
			const elem = await fixture('<d2l-input-date-time label="label text" value="2018-03-03"></d2l-input-date-time>');
			expect(elem.value).to.equal('');
		});

		describe('timezone', () => {
			it('should return expected day in Australia/Eucla timezone', async() => {
				documentLocaleSettings.timezone.identifier = 'Australia/Eucla';
				const elem = await fixture('<d2l-input-date-time label="label text" value="2018-03-03T08:00:00.000Z"></d2l-input-date-time>');
				const inputElem = getChildElem(elem, 'd2l-input-time');
				inputElem.value = '03:00:00';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'd2l-input-date-time-change');
				expect(elem.value).to.equal('2018-03-02T18:15:00.000Z');
				documentLocaleSettings.timezone.identifier = 'America/Toronto';
			});
		});

	});

});
