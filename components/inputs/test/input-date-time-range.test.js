import { aTimeout, expect, fixture, oneEvent } from '@brightspace-ui/testing';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import { getShiftedEndDateTime } from '../input-date-time-range.js';
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

	describe('utility', () => {
		['America/Toronto', 'Australia/Eucla'].forEach((timezone) => {
			const inclusive = false;

			describe(`getShiftedEndDateTime in ${timezone}`, () => {

				before(async() => {
					documentLocaleSettings.timezone.identifier = timezone;
					await aTimeout(10); // Fixes flaky tests likely caused by timezone not yet being set
				});

				after(() => {
					documentLocaleSettings.timezone.identifier = 'America/Toronto';
				});

				it('should return correctly forward shifted end date when localized without Z', () => {
					const prevStartValue = '2020-10-15T04:00:00.000';
					const prevEnd = '2020-10-17T04:00:00.000';
					const start = '2020-10-16T04:00:00.000';
					const newEndValue = '2020-10-18T04:00:00.000';
					expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, inclusive, true)).to.equal(newEndValue);
				});

				it('should shift as expected when times are different but dates the same because of UTC', () => {
					let prevStartValue, start, prevEnd, newEndValue;

					if (timezone === 'America/Toronto') {
						prevStartValue = '2020-10-14T12:00:00.000Z';
						prevEnd = '2020-10-15T02:00:00.000Z';
						start = '2020-10-14T08:00:00.000Z';
						newEndValue = '2020-10-14T22:00:00.000Z';
					} else {
						prevStartValue = '2020-10-13T22:00:00.000Z';
						prevEnd = '2020-10-14T12:00:00.000Z';
						start = '2020-10-13T18:00:00.000Z';
						newEndValue = '2020-10-14T08:00:00.000Z';
					}
					expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, inclusive, false)).to.equal(newEndValue);
				});

				it('should not shift if start and end dates are different because of UTC time', () => {
					const prevStartValue = '2020-10-20T02:00:00.000Z';
					const start = '2020-10-20T03:00:00.000Z';
					let prevEnd;
					if (timezone === 'America/Toronto') {
						prevEnd = '2020-10-20T06:00:00.000Z';
					} else {
						prevEnd = '2020-10-20T20:00:00.000Z';
					}
					expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, inclusive, false)).to.equal(prevEnd);
				});

			});

			[true, false].forEach((localized) => {
				describe(`getShiftedEndDateTime in ${timezone} with localized ${localized}`, () => {

					beforeEach(async() => {
						documentLocaleSettings.timezone.identifier = timezone;
					});

					afterEach(() => {
						documentLocaleSettings.timezone.identifier = 'America/Toronto';
					});

					describe('date change', () => {
						it('should return correctly forward shifted end date', () => {
							const prevStartValue = '2020-10-15T04:00:00.000Z';
							const prevEnd = '2020-10-17T04:00:00.000Z';
							const start = '2020-10-16T04:00:00.000Z';
							const newEndValue = `2020-10-18T04:00:00.000${localized ? '' : 'Z'}`;
							expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, inclusive, localized)).to.equal(newEndValue);
						});

						it.skip('should return correctly backward shifted end date', () => {
							const prevStartValue = '2020-10-15T04:00:00.000Z';
							const prevEnd = '2020-10-17T04:00:00.000Z';
							const start = '2020-10-14T04:00:00.000Z';
							const newEndValue = `2020-10-16T04:00:00.000${localized ? '' : 'Z'}`;
							expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, inclusive, localized)).to.equal(newEndValue);
						});

						it('should return correctly shifted end date when initial dates were equal', () => {
							const prevStartValue = '2020-12-27T04:01:00.000Z';
							const prevEnd = '2020-12-27T12:00:00.000Z';
							const start = '2021-01-03T04:01:00.000Z';
							const newEndValue = `2021-01-03T12:00:00.000${localized ? '' : 'Z'}`;
							expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, inclusive, localized)).to.equal(newEndValue);
						});

						it('should return initial end date if prev start value was after end date', () => {
							const prevStartValue = '2020-10-15T04:00:00.000Z';
							const prevEnd = '2020-10-12T04:00:00.000Z';
							const start = '2020-10-11T04:00:00.000Z';
							expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, inclusive, localized)).to.equal(prevEnd);
						});

						it('should return initial end date if not inclusive and prev start value was equal to end date', () => {
							const prevStartValue = '2020-10-15T04:00:00.000Z';
							const prevEnd = '2020-10-15T04:00:00.000Z';
							const start = '2020-10-10T04:00:00.000Z';
							expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, inclusive, localized)).to.equal(prevEnd);
						});

						it('should return correctly shifted end date if inclusive and prev start value was equal to end date', () => {
							const prevStartValue = '2020-10-15T04:00:00.000Z';
							const prevEnd = '2020-10-15T04:00:00.000Z';
							const start = `2020-10-10T04:00:00.000${localized ? '' : 'Z'}`;
							expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, true, localized)).to.equal(start);
						});
					});

					describe('time change', () => {
						it('should not shift if start and end dates are different', () => {
							const prevStartValue = '2020-10-10T06:00:00.000Z';
							const prevEnd = '2020-10-15T06:00:00.000Z';
							const start = '2020-10-10T08:00:00.000Z';
							expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, inclusive, localized)).to.equal(prevEnd);
						});

						it('should shift forward as expected when times are different but dates the same', () => {
							const prevStartValue = '2020-10-15T06:00:00.000Z';
							const prevEnd = '2020-10-15T07:00:00.000Z';
							const start = '2020-10-15T08:00:00.000Z';
							const newEndValue = `2020-10-15T09:00:00.000${localized ? '' : 'Z'}`;
							expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, inclusive, localized)).to.equal(newEndValue);
						});

						it('should shift backward as expected when times are different but dates the same', () => {
							const prevStartValue = '2020-10-15T06:00:00.000Z';
							const prevEnd = '2020-10-15T07:00:00.000Z';
							const start = '2020-10-15T04:00:00.000Z';
							const newEndValue = `2020-10-15T05:00:00.000${localized ? '' : 'Z'}`;
							expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, inclusive, localized)).to.equal(newEndValue);
						});

						it('should not shift when previously same and not inclusive', () => {
							const prevStartValue = '2020-10-15T04:00:00.000Z';
							const prevEnd = '2020-10-15T04:00:00.000Z';
							const start = '2020-10-15T08:00:00.000Z';
							expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, false, localized)).to.equal(prevEnd);
						});

						it('should shift as expected when previously same and inclusive', () => {
							const prevStartValue = '2020-10-15T06:00:00.000Z';
							const prevEnd = '2020-10-15T06:00:00.000Z';
							const start = '2020-10-15T08:00:00.000Z';
							const newEndValue = `2020-10-15T08:00:00.000${localized ? '' : 'Z'}`;
							expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, true, localized)).to.equal(newEndValue);
						});

						it('should only shift at latest to 11:59 PM', () => {
							let prevStartValue, prevEnd, start, newEndValue;
							if (timezone === 'America/Toronto') {
								prevStartValue = '2020-10-15T06:00:00.000Z';
								prevEnd = '2020-10-15T20:00:00.000Z';
								start = '2020-10-15T14:00:00.000Z';
								newEndValue = localized ? '2020-10-15T23:59:00.000' : '2020-10-16T03:59:00.000Z';
							} else {
								prevStartValue = '2020-10-15T17:00:00.000Z';
								prevEnd = '2020-10-15T23:00:00.000Z';
								start = localized ? '2020-10-15T20:00:00.000Z' : '2020-10-16T10:15:00.000Z';
								newEndValue = localized ? '2020-10-15T23:59:00.000' : '2020-10-16T15:14:00.000Z';
							}

							expect(getShiftedEndDateTime(start, prevEnd, prevStartValue, inclusive, localized)).to.equal(newEndValue);
						});
					});
				});
			});
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
