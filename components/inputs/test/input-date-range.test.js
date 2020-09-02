import '../input-date-range.js';
import { aTimeout, expect, fixture, oneEvent } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import sinon from 'sinon';

const basicFixture = '<d2l-input-date-range label="label text"></d2l-input-date-range>';
const minMaxFixture = '<d2l-input-date-range label="label text" min-value="2020-01-01" max-value="2020-06-01"></d2l-input-date-range>';

function dispatchEvent(elem, eventType) {
	const e = new Event(
		eventType,
		{ bubbles: true, composed: false }
	);
	elem.dispatchEvent(e);
}

function getChildElem(elem, selector) {
	return elem.shadowRoot.querySelector(selector);
}

describe('d2l-input-date-range', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-date-range');
		});

	});

	describe('values', () => {
		it('should fire "change" event when start value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-date.d2l-input-date-range-start');
			inputElem.value = '2018-02-02';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.startValue).to.equal('2018-02-02');
		});
		it('should fire "change" event when end value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-date.d2l-input-date-range-end');
			inputElem.value = '2018-10-31';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.endValue).to.equal('2018-10-31');
		});

		it('should default start and end values to undefined', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.startValue).to.equal(undefined);
			expect(elem.endValue).to.equal(undefined);
		});

		describe('required', () => {
			let clock;

			before(() => {
				const newToday = new Date('2018-02-12T20:00:00Z');
				clock = sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });
			});

			after(() => {
				clock.restore();
			});

			it('should default to today and the next day', async() => {
				const elem = await fixture('<d2l-input-date-range label="Date" required></d2l-input-date-range>');
				await aTimeout(1);
				expect(elem.startValue).to.equal('2018-02-12');
				expect(elem.endValue).to.equal('2018-02-13');
			});

			it('should default to min and next day when today out of range', async() => {
				const elem = await fixture('<d2l-input-date-range label="Dates" min-value="2020-02-01" required></d2l-input-date-range>');
				await aTimeout(1);
				expect(elem.startValue).to.equal('2020-02-01');
				expect(elem.endValue).to.equal('2020-02-02');
			});

			it('should default to max - 1 and max when today out of range', async() => {
				const elem = await fixture('<d2l-input-date-range label="Dates" max-value="2015-02-01" required></d2l-input-date-range>');
				await aTimeout(1);
				expect(elem.startValue).to.equal('2015-01-31');
				expect(elem.endValue).to.equal('2015-02-01');
			});

			it('should default to today and next day when today in range', async() => {
				const elem = await fixture('<d2l-input-date-range label="Dates" min-value="2018-02-01" max-value="2020-01-01" required></d2l-input-date-range>');
				await aTimeout(1);
				expect(elem.startValue).to.equal('2018-02-12');
				expect(elem.endValue).to.equal('2018-02-13');
			});

			it('should default to start value and day after when startValue set', async() => {
				const elem = await fixture('<d2l-input-date-range label="Date" required start-value="2020-10-10"></d2l-input-date-range>');
				await aTimeout(1);
				expect(elem.startValue).to.equal('2020-10-10');
				expect(elem.endValue).to.equal('2020-10-11');
			});

			it('should default to end value and day before when endValue set', async() => {
				const elem = await fixture('<d2l-input-date-range label="Date" required end-value="2020-10-10"></d2l-input-date-range>');
				await aTimeout(1);
				expect(elem.startValue).to.equal('2020-10-09');
				expect(elem.endValue).to.equal('2020-10-10');
			});

			it('should default to startValue and endValue when set', async() => {
				const elem = await fixture('<d2l-input-date-range label="Date" required start-value="2018-01-01" end-value="2020-10-10"></d2l-input-date-range>');
				await aTimeout(1);
				expect(elem.startValue).to.equal('2018-01-01');
				expect(elem.endValue).to.equal('2020-10-10');
			});
		});

		describe('validation', () => {
			it('should be valid if start date and no end date', async() => {
				const elem = await fixture(minMaxFixture);
				const inputElem = getChildElem(elem, 'd2l-input-date.d2l-input-date-range-start');
				inputElem.value = '2020-03-31';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.startValue).to.equal('2020-03-31');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be valid if end date and no start date', async() => {
				const elem = await fixture(minMaxFixture);
				const inputElem = getChildElem(elem, 'd2l-input-date.d2l-input-date-range-end');
				inputElem.value = '2020-03-31';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.endValue).to.equal('2020-03-31');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be valid if start date before end date', async() => {
				const elem = await fixture(minMaxFixture);
				await updateStartEnd(elem, '2020-03-31', '2020-05-31');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be invalid if start date equals end date', async() => {
				const elem = await fixture(minMaxFixture);
				await updateStartEnd(elem, '2020-03-31', '2020-03-31');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal('Start Date must be before End Date');
			});

			it('should be invalid if start date after end date', async() => {
				const elem = await fixture(minMaxFixture);
				await updateStartEnd(elem, '2020-05-31', '2020-03-31');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal('Start Date must be before End Date');
			});

			async function updateStartEnd(elem, startDate, endDate) {
				let firedCount = 0;
				elem.addEventListener('change', () => {
					firedCount++;
				});

				const inputElemStart = getChildElem(elem, 'd2l-input-date.d2l-input-date-range-start');
				inputElemStart.value = startDate;
				setTimeout(() => dispatchEvent(inputElemStart, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.startValue).to.equal(startDate);

				const inputElemEnd = getChildElem(elem, 'd2l-input-date.d2l-input-date-range-end');
				inputElemEnd.value = endDate;
				setTimeout(() => dispatchEvent(inputElemEnd, 'change'));
				await oneEvent(inputElemEnd, 'change');
				expect(elem.endValue).to.equal(endDate);

				await aTimeout(1);
				expect(firedCount).to.equal(2);
			}

		});

	});

});
