import { aTimeout, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { formatDateInISOTime, getDateFromISOTime } from '../../../helpers/dateTime.js';
import { getDefaultTime } from '../input-time.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { getShiftedEndTime } from '../input-time-range.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import sinon from 'sinon';

const basicFixture = '<d2l-input-time-range label="label text"></d2l-input-time-range>';

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

describe('d2l-input-time-range', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-time-range');
		});

	});

	describe('utility', () => {
		describe('getShiftedEndTime', () => {
			it('should return correctly forward shifted end time if valid inputs', () => {
				const start = '12:00:00';
				const end = '13:00:00';
				const prevStartValue = '11:35:00';
				const newEndValue = '13:25:00';
				expect(getShiftedEndTime(start, end, prevStartValue)).to.equal(newEndValue);
			});

			it('should return correctly backward shifted end time if valid inputs', () => {
				const start = '08:00:00';
				const end = '12:00:00';
				const prevStartValue = '11:18:00';
				const newEndValue = '08:42:00';
				expect(getShiftedEndTime(start, end, prevStartValue)).to.equal(newEndValue);
			});

			it('should forward shift end time to 11:59 PM if shift would cause end time to go to next day', () => {
				const start = '23:00:00';
				const end = '13:00:00';
				const prevStartValue = '08:35:00';
				const newEndValue = '23:59:00';
				expect(getShiftedEndTime(start, end, prevStartValue)).to.equal(newEndValue);
			});

			it('should return initial end time if prev start value was after end time', () => {
				const start = '12:00:00';
				const end = '08:00:00';
				const prevStartValue = '11:35:00';
				expect(getShiftedEndTime(start, end, prevStartValue)).to.equal(end);
			});

			it('should return initial end time if not inclusive and prev start value was equal to end time', () => {
				const start = '08:30:00';
				const end = '11:35:00';
				const prevStartValue = '11:35:00';
				expect(getShiftedEndTime(start, end, prevStartValue)).to.equal(end);
			});

			it('should return correctly shifted end time if inclusive and prev start value was equal to end time', () => {
				const start = '08:30:00';
				const end = '11:35:00';
				const prevStartValue = '11:35:00';
				expect(getShiftedEndTime(start, end, prevStartValue, true)).to.equal(start);
			});
		});
	});

	describe('values', () => {
		it('should fire "change" event when start value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-start');
			inputElem.value = '01:30:00';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.startValue).to.equal('01:30:00');
		});

		it('should fire "change" event when end value changes', async() => {
			const elem = await fixture(basicFixture);
			const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-end');
			inputElem.value = '23:00:00';
			setTimeout(() => dispatchEvent(inputElem, 'change'));
			await oneEvent(elem, 'change');
			expect(elem.endValue).to.equal('23:00:00');
		});

		it('should default start and end values to next interval and interval', async() => {
			documentLocaleSettings.timezone.identifier = 'America/Toronto';
			const newToday = new Date('2018-02-12T11:33Z');
			const clock = sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });

			const elem = await fixture(basicFixture);
			expect(elem.startValue).to.equal('07:00:00');
			expect(elem.endValue).to.equal('07:30:00');

			clock.restore();
		});

		it('should default start and end values to next interval and interval when different timeInterval', async() => {
			const newToday = new Date('2018-02-12T11:33Z');
			const clock = sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });

			const elem = await fixture('<d2l-input-time-range label="label" time-interval="five"></d2l-input-time-range>');
			expect(elem.startValue).to.equal('06:35:00');
			expect(elem.endValue).to.equal('06:40:00');

			clock.restore();
		});

		it('should update startValue as expected when set through property', async() => {
			const elem = await fixture('<d2l-input-time-range label="label" time-interval="ten" enforce-time-intervals></d2l-input-time-range>');
			elem.startValue = '12:05:00';
			await elem.updateComplete;
			expect(elem.startValue).to.equal('12:10:00');
			const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-start');
			expect(inputElem.value).to.equal('12:10:00');
		});

		it('should update endValue as expected when set through property', async() => {
			const elem = await fixture('<d2l-input-time-range label="label" time-interval="sixty" enforce-time-intervals></d2l-input-time-range>');
			elem.endValue = '18:25:00';
			await elem.updateComplete;
			expect(elem.endValue).to.equal('19:00:00');
			const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-end');
			expect(inputElem.value).to.equal('19:00:00');
		});

		it('should update endValue as expected when set through property after an initial value was set', async() => {
			const elem = await fixture('<d2l-input-time-range label="label" time-interval="sixty" enforce-time-intervals start-value="12:35:00" end-value="18:22:00"></d2l-input-time-range>');
			elem.endValue = 'invalid!';
			await elem.updateComplete;
			expect(elem.endValue).to.equal('14:00:00');
			const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-end');
			expect(inputElem.value).to.equal('14:00:00');
		});

		describe('initial values are corrected', () => {
			[
				{ enforceTimeIntervals: true, validStart: true, validEnd: true },
				{ enforceTimeIntervals: true, validStart: true, validEnd: false },
				{ enforceTimeIntervals: true, validStart: false, validEnd: true },
				{ enforceTimeIntervals: true, validStart: false, validEnd: false },
				{ enforceTimeIntervals: false, validStart: true, validEnd: true },
				{ enforceTimeIntervals: false, validStart: true, validEnd: false },
				{ enforceTimeIntervals: false, validStart: false, validEnd: true },
				{ enforceTimeIntervals: false, validStart: false, validEnd: false }
			].forEach((testCase) => {
				it(`when enforceTimeIntervals = ${testCase.enforceTimeIntervals}, valid start = ${testCase.validStart} and valid end = ${testCase.validEnd}`, async() => {

					const defaultStartValue = formatDateInISOTime(getDefaultTime(undefined, testCase.enforceTimeIntervals, 'ten'));
					const defaultEndTime = getDateFromISOTime(defaultStartValue);
					defaultEndTime.setMinutes(defaultEndTime.getMinutes() + 10);
					const defaultEndValue = formatDateInISOTime(defaultEndTime);

					const startDate = testCase.validStart ? '12:15:00' : 'invalidStart';
					const endDate = testCase.validEnd ? '18:42:00' : 'invalidEnd';
					let expectedStartTime = '',
						expectedEndTime = '';
					if (testCase.validStart && testCase.enforceTimeIntervals) expectedStartTime = '12:20:00';
					else if (testCase.validStart) expectedStartTime = '12:15:00';
					else expectedStartTime = defaultStartValue;

					if (testCase.validEnd && testCase.enforceTimeIntervals) expectedEndTime = '18:50:00';
					else if (testCase.validEnd) expectedEndTime = '18:42:00';
					else if (!testCase.validEnd) {
						if (testCase.validStart && !testCase.enforceTimeIntervals) expectedEndTime = '12:25:00';
						else if (testCase.validStart && testCase.enforceTimeIntervals) expectedEndTime = '12:30:00';
						else expectedEndTime = defaultEndValue;
					}

					const caseFixture = html`<d2l-input-time-range
						?enforce-time-intervals="${testCase.enforceTimeIntervals}"
						label="label text"
						time-interval="ten"
						start-value="${startDate}"
						end-value="${endDate}"></d2l-input-time-range>`;
					const elem = await fixture(caseFixture);
					expect(elem.startValue).to.equal(expectedStartTime);
					expect(elem.endValue).to.equal(expectedEndTime);

					// Issue #1751: This test case is to test ordering start-value > time-interval > enforce-time-intervals
					const caseFixture2 = html`<d2l-input-time-range
						label="label text"
						start-value="${startDate}"
						end-value="${endDate}"
						time-interval="ten"
						?enforce-time-intervals="${testCase.enforceTimeIntervals}"></d2l-input-time-range>`;
					const elem2 = await fixture(caseFixture2);
					expect(elem2.startValue).to.equal(expectedStartTime);
					expect(elem2.endValue).to.equal(expectedEndTime);

					// Issue #1751: This test case is to test ordering enforce-time-intervals > start-value > time-interval
					const caseFixture3 = html`<d2l-input-time-range
						?enforce-time-intervals="${testCase.enforceTimeIntervals}"
						label="label text"
						start-value="${startDate}"
						end-value="${endDate}"
						time-interval="ten"></d2l-input-time-range>`;
					const elem3 = await fixture(caseFixture3);
					expect(elem3.startValue).to.equal(expectedStartTime);
					expect(elem3.endValue).to.equal(expectedEndTime);
				});
			});
		});

		describe('validation', () => {
			let clock;
			before(() => {
				const newToday = new Date('2018-07-12T11:33Z');
				clock = sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });
			});

			after(() => {
				clock.restore();
			});

			it('should be valid if start time changed to value before default end time', async() => {
				const elem = await fixture(basicFixture);
				const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-start');
				inputElem.value = '00:15:00';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.startValue).to.equal('00:15:00');
				expect(elem.endValue).to.equal('08:30:00');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be valid if end time changed to value after default start time', async() => {
				const elem = await fixture(basicFixture);
				const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-end');
				inputElem.value = '18:30:00';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.startValue).to.equal('08:00:00');
				expect(elem.endValue).to.equal('18:30:00');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be valid if start time and end time changed, and start time before end time', async() => {
				const elem = await fixture(basicFixture);
				await updateStartEnd(elem, '12:30:00', '16:25:00');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be invalid if start time equals end time', async() => {
				const elem = await fixture(basicFixture);
				await updateStartEnd(elem, '14:00:00', '14:00:00');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal('Start Time must be before End Time');
			});

			it('should be invalid if start time after end time', async() => {
				const elem = await fixture(basicFixture);
				await updateStartEnd(elem, '13:00:00', '11:10:12');
				expect(elem.invalid).to.be.true;
				expect(elem.validationError).to.equal('Start Time must be before End Time');
			});

			async function updateStartEnd(elem, startDate, endDate) {
				let firedCount = 0;
				elem.addEventListener('change', () => {
					firedCount++;
				});

				const inputElemStart = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-start');
				inputElemStart.value = startDate;
				setTimeout(() => dispatchEvent(inputElemStart, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.startValue).to.equal(startDate);

				const inputElemEnd = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-end');
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
