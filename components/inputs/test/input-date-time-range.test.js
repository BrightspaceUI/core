import '../input-date-time-range.js';
import { aTimeout, expect, fixture, oneEvent } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const basicFixture = '<d2l-input-date-time-range label="label text"></d2l-input-date-time-range>';
const minMaxFixture = '<d2l-input-date-time-range label="Assignment Dates" min-value="2018-08-27T12:30:00Z" max-value="2018-09-30T12:30:00Z"></d2l-input-date-time-range>';

const startSelector = 'd2l-input-date-time.d2l-input-date-time-range-start';
const endSelector = 'd2l-input-date-time.d2l-input-date-time-range-end';

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

describe('d2l-input-date-time-range', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-date-time-range');
		});

	});

	describe('values', () => {
		it('should fire "change" event when start value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, startSelector);
			inputElem.value = '2018-02-02T05:00:00.000Z';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.startValue).to.equal('2018-02-02T05:00:00.000Z');
		});
		it('should fire "change" event when end value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, endSelector);
			inputElem.value = '2020-12-02T15:00:00.000Z';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.endValue).to.equal('2020-12-02T15:00:00.000Z');
		});

		it('should default start and end values to undefined', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.startValue).to.equal(undefined);
			expect(elem.endValue).to.equal(undefined);
		});

		describe('validation', () => {
			it('should be valid if start date and no end date', async() => {
				const elem = await fixture(minMaxFixture);
				const inputElem = getChildElem(elem, startSelector);
				inputElem.value = '2018-09-01T12:00:00.000Z';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.startValue).to.equal('2018-09-01T12:00:00.000Z');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be valid if end date and no start date', async() => {
				const elem = await fixture(minMaxFixture);
				const inputElem = getChildElem(elem, endSelector);
				inputElem.value = '2018-08-27T12:31:00Z';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.endValue).to.equal('2018-08-27T12:31:00Z');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be valid if start date before end date', async() => {
				const elem = await fixture(minMaxFixture);
				await updateStartEnd(elem, '2018-08-27T12:31:00Z', '2018-08-27T12:32:00Z');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be invalid if start date equals end date', async() => {
				const elem = await fixture(minMaxFixture);
				await updateStartEnd(elem, '2018-08-27T12:32:00Z', '2018-08-27T12:32:00Z');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal('Start Date must be before End Date');
			});

			it('should be invalid if start date after end date', async() => {
				const elem = await fixture(minMaxFixture);
				await updateStartEnd(elem, '2018-08-31T12:32:00Z', '2018-08-29T12:32:00Z');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal('Start Date must be before End Date');
			});

			async function updateStartEnd(elem, startDate, endDate) {
				let firedCount = 0;
				elem.addEventListener('change', () => {
					firedCount++;
				});

				const inputElemStart = getChildElem(elem, startSelector);
				inputElemStart.value = startDate;
				setTimeout(() => dispatchEvent(inputElemStart, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.startValue).to.equal(startDate);

				const inputElemEnd = getChildElem(elem, endSelector);
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
