import { aTimeout, expect, fixture, oneEvent } from '@open-wc/testing';
import { _formatLocalDateTimeInISO } from '../input-date-time.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const basicFixture = '<d2l-input-date-time label="label text"></d2l-input-date-time>';
const minMaxFixture = '<d2l-input-date-time label="label text" min-value="2018-08-27T03:30:00Z" max-value="2018-09-30T17:30:00Z"></d2l-input-date-time>';
const minMaxLocalizedFixture = '<d2l-input-date-time label="label text" localized min-value="2018-08-27T03:30:00" max-value="2018-09-30T17:30:00"></d2l-input-date-time>';

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

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-date-time');
		});

	});

	describe('min and max value', () => {
		it('should set correct min and max on d2l-input-date', async() => {
			await aTimeout(5); // Fixes flaky test potentially caused by timezone not yet being set
			const elem = await fixture(minMaxFixture);
			const inputElem = getChildElem(elem, 'd2l-input-date');
			expect(inputElem.minValue).to.equal('2018-08-26');
			expect(inputElem.maxValue).to.equal('2018-09-30');
		});

		it('should set correct min and max on d2l-input-date in Australia/Eucla timezone', async() => {
			documentLocaleSettings.timezone.identifier = 'Australia/Eucla';
			const elem = await fixture(minMaxFixture);
			const inputElem = getChildElem(elem, 'd2l-input-date');
			expect(inputElem.minValue).to.equal('2018-08-27');
			expect(inputElem.maxValue).to.equal('2018-10-01');
			documentLocaleSettings.timezone.identifier = 'America/Toronto';
		});

		describe('localized', () => {
			const expectedStart = 'Aug 27, 2018 3:30 AM';
			const expectedEnd = 'Sep 30, 2018 5:30 PM';

			it('should set correct min and max on d2l-input-date', async() => {
				const elem = await fixture(minMaxLocalizedFixture);
				const inputElem = getChildElem(elem, 'd2l-input-date');
				expect(inputElem.minValue).to.equal('2018-08-27T03:30:00');
				expect(inputElem.maxValue).to.equal('2018-09-30T17:30:00');
			});

			it('should change value if min and max value and typed date before minValue', async() => {
				const elem = await fixture(minMaxLocalizedFixture);
				const inputElem = getChildElem(elem, 'd2l-input-date');
				inputElem.value = '2018-02-02';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				await oneEvent(elem, 'invalid-change');
				expect(elem.value).to.equal('2018-02-02T00:01:00.000');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal(`Date must be between ${expectedStart} and ${expectedEnd}`);
			});

			it('should change value if min and max value and typed date within range', async() => {
				const elem = await fixture(minMaxLocalizedFixture);
				const inputElem = getChildElem(elem, 'd2l-input-date');
				inputElem.value = '2018-09-30';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				await elem.updateComplete;
				const inputTimeElem = getChildElem(elem, 'd2l-input-time');
				inputTimeElem.value = '17:29:00';
				setTimeout(() => dispatchEvent(inputTimeElem, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.value).to.equal('2018-09-30T17:29:00.000');
				expect(elem.invalid).to.be.false;
			});
		});

		describe('validation', () => {
			const expectedStart = 'Aug 26, 2018 11:30 PM';
			const expectedEnd = 'Sep 30, 2018 1:30 PM';

			it('should change value if min and max value and typed date before minValue', async() => {
				const elem = await fixture(minMaxFixture);
				const inputElem = getChildElem(elem, 'd2l-input-date');
				inputElem.value = '2018-02-02';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				await oneEvent(elem, 'invalid-change');
				expect(elem.value).to.equal('2018-02-02T05:01:00.000Z');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal(`Date must be between ${expectedStart} and ${expectedEnd}`);
			});

			it('should change value if min and max value and typed date after maxValue', async() => {
				const elem = await fixture(minMaxFixture);
				const inputElem = getChildElem(elem, 'd2l-input-date');
				inputElem.value = '2020-02-02';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				await oneEvent(elem, 'invalid-change');
				expect(elem.value).to.equal('2020-02-02T05:01:00.000Z');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal(`Date must be between ${expectedStart} and ${expectedEnd}`);
			});

			it('should change value if min value and typed date before minValue', async() => {
				const elem = await fixture('<d2l-input-date-time label="label text" min-value="2018-08-27T03:30:00Z"></d2l-input-date-time>');
				const inputDateElem = getChildElem(elem, 'd2l-input-date');
				inputDateElem.value = '2018-08-26';
				setTimeout(() => dispatchEvent(inputDateElem, 'change'));
				await oneEvent(elem, 'change');
				await oneEvent(elem, 'invalid-change');
				const inputTimeElem = getChildElem(elem, 'd2l-input-time');
				inputTimeElem.value = '23:29:00';
				setTimeout(() => dispatchEvent(inputTimeElem, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.value).to.equal('2018-08-27T03:29:00.000Z');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal(`Date must be after ${expectedStart}`);
			});

			it('should change value if max value and typed date after maxValue', async() => {
				const elem = await fixture('<d2l-input-date-time label="label text" max-value="2018-09-30T17:30:00Z"></d2l-input-date-time>');
				const inputDateElem = getChildElem(elem, 'd2l-input-date');
				inputDateElem.value = '2018-09-30';
				setTimeout(() => dispatchEvent(inputDateElem, 'change'));
				await oneEvent(elem, 'change');
				await elem.updateComplete;
				const inputTimeElem = getChildElem(elem, 'd2l-input-time');
				inputTimeElem.value = '13:31:00';
				setTimeout(() => dispatchEvent(inputTimeElem, 'change'));
				await oneEvent(elem, 'change');
				await oneEvent(elem, 'invalid-change');
				expect(elem.value).to.equal('2018-09-30T17:31:00.000Z');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal(`Date must be before ${expectedEnd}`);
			});
		});
	});

	describe('value', () => {
		it('should fire "change" event when date value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-date');
			inputElem.value = '2018-02-02';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('2018-02-02T05:01:00.000Z');
		});

		it('should fire "change" event when time value changes and there is a date', async() => {
			const elem = await fixture('<d2l-input-date-time label="label text" value="2018-03-03T08:00:00.000Z"></d2l-input-date-time>');
			const inputElem = getChildElem(elem, 'd2l-input-time');
			inputElem.value = '14:00:00';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('2018-03-03T19:00:00.000Z');
		});

		it('should default to undefined', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.value).to.equal(undefined);
		});

		it('should default to custom time', async() => {
			const elem = await fixture('<d2l-input-date-time label="label text" time-default-value="12:34:56"></d2l-input-date-time>');
			const inputElem = getChildElem(elem, 'd2l-input-date');
			inputElem.value = '2018-02-02';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('2018-02-02T17:34:56.000Z');
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
				await oneEvent(elem, 'change');
				expect(elem.value).to.equal('2018-03-02T18:15:00.000Z');
				documentLocaleSettings.timezone.identifier = 'America/Toronto';
			});
		});

	});

	describe('utility', () => {
		describe('_formatLocalDateTimeInISO', () => {
			it('should merge date and time into ISO string', () => {
				const date = '2018-01-01';
				const time = '12:22:00';

				expect(_formatLocalDateTimeInISO(date, time)).to.equal('2018-01-01T12:22:00.000');
			});
		});
	});

});
