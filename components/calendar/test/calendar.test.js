import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { checkIfDatesEqual,
	getDatesInMonthArray,
	getNextMonth,
	getNumberOfDaysFromPrevMonthToShow,
	getNumberOfDaysInMonth,
	getNumberOfDaysToSameWeekPrevMonth,
	getPrevMonth,
	getToday,
	parseDate
} from '../calendar.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

const normalFixture = html`<d2l-calendar selected-value="2015-09-02T12:00:00Z"></d2l-calendar>`;
const defaultHour = 12;

describe('d2l-calendar', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	describe('accessibility', () => {
		it('passes all axe tests', async() => {
			const calendar = await fixture(normalFixture);
			await expect(calendar).to.be.accessible();
		});
	});

	describe('events', () => {
		it('dispatches event when date clicked', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="1"]');
			setTimeout(() => el.click());
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');

			expect(detail.date).to.equal('2015-09-01T16:00:00.000Z');
			expect(calendar.selectedValue).to.equal('2015-09-01T16:00:00.000Z');

			const expectedFocusDate = new Date(2015, 8, 1, 12, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('dispatches event when date in previous month clicked', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="31"][data-month="7"]');
			setTimeout(() => el.click());
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');

			expect(detail.date).to.equal('2015-08-31T16:00:00.000Z');
			expect(calendar.selectedValue).to.equal('2015-08-31T16:00:00.000Z');

			const expectedFocusDate = new Date(2015, 7, 31, 12, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('dispatches event when date in next month clicked', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="1"][data-month="9"]');
			setTimeout(() => el.click());
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');

			expect(detail.date).to.equal('2015-10-01T16:00:00.000Z');
			expect(calendar.selectedValue).to.equal('2015-10-01T16:00:00.000Z');

			const expectedFocusDate = new Date(2015, 9, 1, 12, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('dispatches event when enter key pressed on date', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="20"]');
			setTimeout(() => dispatchKeyEvent(el, 13));
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');

			expect(detail.date).to.equal('2015-09-20T16:00:00.000Z');
			expect(calendar.selectedValue).to.equal('2015-09-20T16:00:00.000Z');

			const expectedFocusDate = new Date(2015, 8, 20, 12, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('dispatches event when space key pressed on date', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 32));
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');

			expect(detail.date).to.equal('2015-09-02T16:00:00.000Z');
			expect(calendar.selectedValue).to.equal('2015-09-02T16:00:00.000Z');

			const expectedFocusDate = new Date(2015, 8, 2, 12, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('converts date to correct timezone', async() => {
			documentLocaleSettings.timezone.identifier = 'Pacific/Apia'; // 13 hour difference
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="2"]');
			setTimeout(() => el.click());
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');

			expect(detail.date).to.equal('2015-09-01T23:00:00.000Z');
			expect(calendar.selectedValue).to.equal('2015-09-01T23:00:00.000Z');

			const expectedFocusDate = new Date(2015, 8, 2, 12, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			documentLocaleSettings.timezone.identifier = 'America/Toronto';
		});
	});

	describe('focus date', () => {
		it('has initial correct _focusDate when on month with selected-value', async() => {
			const calendar = await fixture(normalFixture);
			const expectedFocusDate = new Date(2015, 8, 2, defaultHour, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('has initial correct _focusDate when on month with no selected-value', async() => {
			const newToday = new Date('2018-02-12T12:00Z');
			const clock = sinon.useFakeTimers(newToday.getTime());

			const calendar = await fixture(html`<d2l-calendar></d2l-calendar>`);
			const expectedFocusDate = new Date(2018, 1, 1, defaultHour, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);

			clock.restore();
		});

		it('has correct _focusDate when user uses right arrow from a focused date', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 39));
			await aTimeout(1);

			const expectedFocusDate = new Date(2015, 8, 3, defaultHour, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('has correct _focusDate when user uses left arrow from a focused date', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 37));
			await aTimeout(1);

			const expectedFocusDate = new Date(2015, 8, 1, defaultHour, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('has correct _focusDate when user changes month to next month using button', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show October"]');
			setTimeout(() => el.click());
			await oneEvent(el, 'click');

			const expectedFocusDate = new Date(2015, 9, 1, defaultHour, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(9);
		});

		it('has correct _focusDate when user changes month to previous month using button', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show August"]');
			setTimeout(() => el.click());
			await oneEvent(el, 'click');

			const expectedFocusDate = new Date(2015, 7, 1, defaultHour, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('has correct _focusDate when user changes to previous month using left arrow key 4 times', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 37));
			setTimeout(() => dispatchKeyEvent(el, 37));
			setTimeout(() => dispatchKeyEvent(el, 37));
			setTimeout(() => dispatchKeyEvent(el, 37));
			await aTimeout(1);

			const expectedFocusDate = new Date(2015, 7, 29, defaultHour, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(7);
		});

		it('has correct _focusDate when user changes to next month using right arrow key 4 times', async() => {
			const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-30T12:00:00Z"></d2l-calendar>`);
			const el = calendar.shadowRoot.querySelector('div[data-date="30"][data-month="8"]');
			setTimeout(() => dispatchKeyEvent(el, 39));
			setTimeout(() => dispatchKeyEvent(el, 39));
			setTimeout(() => dispatchKeyEvent(el, 39));
			setTimeout(() => dispatchKeyEvent(el, 39));
			await aTimeout(1);

			const expectedFocusDate = new Date(2015, 9, 4, defaultHour, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(9);
		});

		it('has correct _focusDate when user presses PAGEUP', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 33));
			await aTimeout(1);

			const expectedFocusDate = new Date(2015, 6, 29, defaultHour, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(7);
		});

		it('has correct _focusDate when user presses PAGEDOWN', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 34));
			await aTimeout(1);

			const expectedFocusDate = new Date(2015, 8, 30, defaultHour, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(9);
		});

		it('has correct _focusDate when user presses HOME', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 36));
			await aTimeout(1);

			const expectedFocusDate = new Date(2015, 7, 30, defaultHour, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(8);
		});

		it('has correct _focusDate when user presses END', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 35));
			await aTimeout(1);

			const expectedFocusDate = new Date(2015, 8, 5, defaultHour, 0, 0);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(8);
		});
	});

	describe('utility functions', () => {

		describe('checkIfDatesEqual', () => {
			it('returns true if dates and times are equal', () => {
				const date1 = new Date(2019, 1, 1, defaultHour, 0, 0);
				const date2 = new Date(2019, 1, 1, defaultHour, 0, 0);
				expect(checkIfDatesEqual(date1, date2)).to.be.true;
			});

			it('returns false if dates equal and times are not', () => {
				const date1 = new Date(2019, 1, 1, defaultHour, 0, 0, 0);
				const date2 = new Date(2019, 1, 1, 7, 30, 0);
				expect(checkIfDatesEqual(date1, date2)).to.be.false;
			});

			it('returns false if dates not equal', () => {
				const date1 = new Date(2019, 1, 1, defaultHour, 0, 0, 0);
				const date2 = new Date(2019, 1, 31, 7, 30, 0);
				expect(checkIfDatesEqual(date1, date2)).to.be.false;
			});

			it('returns false if date 1 is null', () => {
				const date1 = null;
				const date2 = new Date(2019, 1, 1, 7, 30, 0);
				expect(checkIfDatesEqual(date1, date2)).to.be.false;
			});

			it('returns false if date 2 is null', () => {
				const date1 = new Date(2019, 1, 1, defaultHour, 0, 0, 0);
				const date2 = null;
				expect(checkIfDatesEqual(date1, date2)).to.be.false;
			});
		});

		describe('getDatesInMonthArray', () => {
			it('returns empty array if month undefined', () => {
				expect(getDatesInMonthArray(undefined, 2020)).to.deep.equal([]);
			});

			it('returns empty array if year undefined', () => {
				expect(getDatesInMonthArray(1, undefined)).to.deep.equal([]);
			});

			it('returns expected array for Feb 2020 (days from prev month, no days from next month', () => {
				const dates = [[
					new Date(2020, 0, 26, defaultHour, 0, 0),
					new Date(2020, 0, 27, defaultHour, 0, 0),
					new Date(2020, 0, 28, defaultHour, 0, 0),
					new Date(2020, 0, 29, defaultHour, 0, 0),
					new Date(2020, 0, 30, defaultHour, 0, 0),
					new Date(2020, 0, 31, defaultHour, 0, 0),
					new Date(2020, 1, 1, defaultHour, 0, 0)
				], [
					new Date(2020, 1, 2, defaultHour, 0, 0),
					new Date(2020, 1, 3, defaultHour, 0, 0),
					new Date(2020, 1, 4, defaultHour, 0, 0),
					new Date(2020, 1, 5, defaultHour, 0, 0),
					new Date(2020, 1, 6, defaultHour, 0, 0),
					new Date(2020, 1, 7, defaultHour, 0, 0),
					new Date(2020, 1, 8, defaultHour, 0, 0)
				], [
					new Date(2020, 1, 9, defaultHour, 0, 0),
					new Date(2020, 1, 10, defaultHour, 0, 0),
					new Date(2020, 1, 11, defaultHour, 0, 0),
					new Date(2020, 1, defaultHour, 12, 0, 0),
					new Date(2020, 1, 13, defaultHour, 0, 0),
					new Date(2020, 1, 14, defaultHour, 0, 0),
					new Date(2020, 1, 15, defaultHour, 0, 0)
				], [
					new Date(2020, 1, 16, defaultHour, 0, 0),
					new Date(2020, 1, 17, defaultHour, 0, 0),
					new Date(2020, 1, 18, defaultHour, 0, 0),
					new Date(2020, 1, 19, defaultHour, 0, 0),
					new Date(2020, 1, 20, defaultHour, 0, 0),
					new Date(2020, 1, 21, defaultHour, 0, 0),
					new Date(2020, 1, 22, defaultHour, 0, 0)
				], [
					new Date(2020, 1, 23, defaultHour, 0, 0),
					new Date(2020, 1, 24, defaultHour, 0, 0),
					new Date(2020, 1, 25, defaultHour, 0, 0),
					new Date(2020, 1, 26, defaultHour, 0, 0),
					new Date(2020, 1, 27, defaultHour, 0, 0),
					new Date(2020, 1, 28, defaultHour, 0, 0),
					new Date(2020, 1, 29, defaultHour, 0, 0)
				]];
				expect(getDatesInMonthArray(1, 2020)).to.deep.equal(dates);
			});

			it('returns expected array for March 2020 (days from next month, no days from prev month)', () => {
				const dates = [[
					new Date(2020, 2, 1, defaultHour, 0, 0),
					new Date(2020, 2, 2, defaultHour, 0, 0),
					new Date(2020, 2, 3, defaultHour, 0, 0),
					new Date(2020, 2, 4, defaultHour, 0, 0),
					new Date(2020, 2, 5, defaultHour, 0, 0),
					new Date(2020, 2, 6, defaultHour, 0, 0),
					new Date(2020, 2, 7, defaultHour, 0, 0)
				], [
					new Date(2020, 2, 8, defaultHour, 0, 0),
					new Date(2020, 2, 9, defaultHour, 0, 0),
					new Date(2020, 2, 10, defaultHour, 0, 0),
					new Date(2020, 2, 11, defaultHour, 0, 0),
					new Date(2020, 2, defaultHour, 12, 0, 0),
					new Date(2020, 2, 13, defaultHour, 0, 0),
					new Date(2020, 2, 14, defaultHour, 0, 0)
				], [
					new Date(2020, 2, 15, defaultHour, 0, 0),
					new Date(2020, 2, 16, defaultHour, 0, 0),
					new Date(2020, 2, 17, defaultHour, 0, 0),
					new Date(2020, 2, 18, defaultHour, 0, 0),
					new Date(2020, 2, 19, defaultHour, 0, 0),
					new Date(2020, 2, 20, defaultHour, 0, 0),
					new Date(2020, 2, 21, defaultHour, 0, 0)
				], [
					new Date(2020, 2, 22, defaultHour, 0, 0),
					new Date(2020, 2, 23, defaultHour, 0, 0),
					new Date(2020, 2, 24, defaultHour, 0, 0),
					new Date(2020, 2, 25, defaultHour, 0, 0),
					new Date(2020, 2, 26, defaultHour, 0, 0),
					new Date(2020, 2, 27, defaultHour, 0, 0),
					new Date(2020, 2, 28, defaultHour, 0, 0)
				], [
					new Date(2020, 2, 29, defaultHour, 0, 0),
					new Date(2020, 2, 30, defaultHour, 0, 0),
					new Date(2020, 2, 31, defaultHour, 0, 0),
					new Date(2020, 3, 1, defaultHour, 0, 0),
					new Date(2020, 3, 2, defaultHour, 0, 0),
					new Date(2020, 3, 3, defaultHour, 0, 0),
					new Date(2020, 3, 4, defaultHour, 0, 0)
				]];
				expect(getDatesInMonthArray(2, 2020)).to.deep.equal(dates);
			});

			it('returns expected array for Jan 2021 (days from prev and next month and 6 weeks)', () => {
				const dates = [[
					new Date(2020, 11, 27, defaultHour, 0, 0),
					new Date(2020, 11, 28, defaultHour, 0, 0),
					new Date(2020, 11, 29, defaultHour, 0, 0),
					new Date(2020, 11, 30, defaultHour, 0, 0),
					new Date(2020, 11, 31, defaultHour, 0, 0),
					new Date(2021, 0, 1, defaultHour, 0, 0),
					new Date(2021, 0, 2, defaultHour, 0, 0)
				], [
					new Date(2021, 0, 3, defaultHour, 0, 0),
					new Date(2021, 0, 4, defaultHour, 0, 0),
					new Date(2021, 0, 5, defaultHour, 0, 0),
					new Date(2021, 0, 6, defaultHour, 0, 0),
					new Date(2021, 0, 7, defaultHour, 0, 0),
					new Date(2021, 0, 8, defaultHour, 0, 0),
					new Date(2021, 0, 9, defaultHour, 0, 0)
				], [
					new Date(2021, 0, 10, defaultHour, 0, 0),
					new Date(2021, 0, 11, defaultHour, 0, 0),
					new Date(2021, 0, defaultHour, 12, 0, 0),
					new Date(2021, 0, 13, defaultHour, 0, 0),
					new Date(2021, 0, 14, defaultHour, 0, 0),
					new Date(2021, 0, 15, defaultHour, 0, 0),
					new Date(2021, 0, 16, defaultHour, 0, 0)
				], [
					new Date(2021, 0, 17, defaultHour, 0, 0),
					new Date(2021, 0, 18, defaultHour, 0, 0),
					new Date(2021, 0, 19, defaultHour, 0, 0),
					new Date(2021, 0, 20, defaultHour, 0, 0),
					new Date(2021, 0, 21, defaultHour, 0, 0),
					new Date(2021, 0, 22, defaultHour, 0, 0),
					new Date(2021, 0, 23, defaultHour, 0, 0)
				], [
					new Date(2021, 0, 24, defaultHour, 0, 0),
					new Date(2021, 0, 25, defaultHour, 0, 0),
					new Date(2021, 0, 26, defaultHour, 0, 0),
					new Date(2021, 0, 27, defaultHour, 0, 0),
					new Date(2021, 0, 28, defaultHour, 0, 0),
					new Date(2021, 0, 29, defaultHour, 0, 0),
					new Date(2021, 0, 30, defaultHour, 0, 0)
				], [
					new Date(2021, 0, 31, defaultHour, 0, 0),
					new Date(2021, 1, 1, defaultHour, 0, 0),
					new Date(2021, 1, 2, defaultHour, 0, 0),
					new Date(2021, 1, 3, defaultHour, 0, 0),
					new Date(2021, 1, 4, defaultHour, 0, 0),
					new Date(2021, 1, 5, defaultHour, 0, 0),
					new Date(2021, 1, 6, defaultHour, 0, 0)
				]];
				expect(getDatesInMonthArray(0, 2021)).to.deep.equal(dates);
			});
		});

		describe('getNextMonth', () => {
			it('should return February as next month of January', () => {
				expect(getNextMonth(0)).to.equal(1);
			});

			it('should return January as next month of December', () => {
				expect(getNextMonth(11)).to.equal(0);
			});
		});

		describe('getNumberOfDaysFromPrevMonthToShow', () => {
			it('should return 6 for Feb 2020 with first day of week as Sun', () => {
				expect(getNumberOfDaysFromPrevMonthToShow(1, 2020)).to.equal(6);
			});

			it('should return 0 for March 2020 with first day of week as Sun', () => {
				expect(getNumberOfDaysFromPrevMonthToShow(2, 2020)).to.equal(0);
			});
		});

		describe('getNumberOfDaysInMonth', () => {
			it('should return 29 for Feb 2020', () => {
				expect(getNumberOfDaysInMonth(1, 2020)).to.equal(29);
			});

			it('should return 28 for Feb 2019', () => {
				expect(getNumberOfDaysInMonth(1, 2019)).to.equal(28);
			});

			it('should return 31 for Dec 2019', () => {
				expect(getNumberOfDaysInMonth(11, 2019)).to.equal(31);
			});

			it('should return 31 for Jan 2020', () => {
				expect(getNumberOfDaysInMonth(0, 2020)).to.equal(31);
			});
		});

		describe('getNumberOfDaysToSameWeekPrevMonth', () => {
			it('should return 28 between Feb and Jan 2020 (5 weeks displayed in each)', () => {
				expect(getNumberOfDaysToSameWeekPrevMonth(1, 2020, 0)).to.equal(28);
			});

			it('should return 28 between May and April 2020 (6 weeks in May, 5 in April)', () => {
				expect(getNumberOfDaysToSameWeekPrevMonth(4, 2020, 0)).to.equal(28);
			});

			it('should return 35 between June and May 2020 (5 weeks in June, 6 in May)', () => {
				expect(getNumberOfDaysToSameWeekPrevMonth(5, 2020, 0)).to.equal(35);
			});

			it('should return 35 between March and Feb 2020 (March has no days from last month)', () => {
				expect(getNumberOfDaysToSameWeekPrevMonth(2, 2020, 0)).to.equal(35);
			});
		});

		describe('getPrevMonth', () => {
			it('should return December as previous month of January', () => {
				expect(getPrevMonth(0)).to.equal(11);
			});

			it('should return November as previous month of December', () => {
				expect(getPrevMonth(11)).to.equal(10);
			});
		});

		describe('getToday', () => {
			let clock;
			beforeEach(() => {
				const newToday = new Date('2018-02-12T20:00:00Z');
				clock = sinon.useFakeTimers(newToday.getTime());
			});

			afterEach(() => {
				clock.restore();
				documentLocaleSettings.timezone.identifier = 'America/Toronto';
			});

			it('should return expected day in America/Toronto timezone', () => {
				expect(getToday()).to.deep.equal(new Date(2018, 1, 12, 12, 0, 0));
			});

			it('should return expected day in Australia/Eucla timezone', () => {
				documentLocaleSettings.timezone.identifier = 'Australia/Eucla';
				expect(getToday()).to.deep.equal(new Date(2018, 1, 13, 12, 0, 0));
			});
		});

		describe('parseDate', () => {
			it('should return correct date if date and time provided', () => {
				expect(parseDate('2019-01-30T12:00:00Z')).to.deep.equal(new Date(2019, 0, 30, defaultHour, 0, 0));
			});

			it('should throw when invalid date format', () => {
				expect(() => {
					parseDate('2019-02-30');
				}).to.throw('Invalid selected-value date input: Expected format is YYYY-MM-DDTHH:mm:ss.sssZ');
			});
		});

	});

	function dispatchKeyEvent(el, key) {
		const eventObj = document.createEvent('Events');
		eventObj.initEvent('keydown', true, true);
		eventObj.which = key;
		eventObj.keyCode = key;
		el.dispatchEvent(eventObj);
	}

});
