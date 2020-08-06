import '../input-time-range.js';
import { aTimeout, expect, fixture, oneEvent } from '@open-wc/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

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

		it('should default start and end values to 12 am and 12:30 am', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.startValue).to.equal('00:00:00');
			expect(elem.endValue).to.equal('00:30:00');
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

		describe('initial values are corrected', () => {
			[
				{enforceTimeIntervals: true, validStart: true, validEnd: true},
				{enforceTimeIntervals: true, validStart: true, validEnd: false},
				{enforceTimeIntervals: true, validStart: false, validEnd: true},
				{enforceTimeIntervals: true, validStart: false, validEnd: false},
				{enforceTimeIntervals: false, validStart: true, validEnd: true},
				{enforceTimeIntervals: false, validStart: true, validEnd: false},
				{enforceTimeIntervals: false, validStart: false, validEnd: true},
				{enforceTimeIntervals: false, validStart: false, validEnd: false}
			].forEach((testCase) => {
				it(`when enforceTimeIntervals = ${testCase.enforceTimeIntervals}, valid start = ${testCase.validStart} and validEnd = ${testCase.validEnd}`, async() => {
					const startDate = testCase.validStart ? '12:15:00' : 'invalidStart';
					const endDate = testCase.validEnd ? '18:42:00' : 'invalidEnd';
					let expectedStartTime = '',
						expectedEndTime = '';
					if (testCase.validStart && testCase.enforceTimeIntervals) expectedStartTime = '12:20:00';
					else if (testCase.validStart) expectedStartTime = '12:15:00';
					else expectedStartTime = '00:00:00';

					if (testCase.validEnd && testCase.enforceTimeIntervals) expectedEndTime = '18:50:00';
					else if (testCase.validEnd) expectedEndTime = '18:42:00';
					else if (!testCase.validEnd) {
						if (testCase.validStart && !testCase.enforceTimeIntervals) expectedEndTime = '12:25:00';
						else if (testCase.validStart && testCase.enforceTimeIntervals) expectedEndTime = '12:30:00';
						else expectedEndTime = '00:10:00';
					}

					const caseFixture = `<d2l-input-time-range
						label="label text"
						start-value="${startDate}"
						end-value="${endDate}"
						time-interval="ten"
						${testCase.enforceTimeIntervals ? 'enforce-time-intervals' : null}
					></d2l-input-time-range>`;
					const elem = await fixture(caseFixture);
					expect(elem.startValue).to.equal(expectedStartTime);
					expect(elem.endValue).to.equal(expectedEndTime);
				});
			});
		});

		describe('validation', () => {
			it('should be valid if start time changed to value before default end time', async() => {
				const elem = await fixture(basicFixture);
				const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-start');
				inputElem.value = '00:15:00';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.startValue).to.equal('00:15:00');
				expect(elem.endValue).to.equal('00:30:00');
				expect(elem.invalid).to.be.false;
				expect(elem.validationError).to.be.null;
			});

			it('should be valid if end time changed to value after default start time', async() => {
				const elem = await fixture(basicFixture);
				const inputElem = getChildElem(elem, 'd2l-input-time.d2l-input-time-range-end');
				inputElem.value = '18:30:00';
				setTimeout(() => dispatchEvent(inputElem, 'change'));
				await oneEvent(elem, 'change');
				expect(elem.startValue).to.equal('00:00:00');
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
