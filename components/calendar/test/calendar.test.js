import { aTimeout, expect, fixture, html, oneEvent, runConstructor, waitUntil } from '@brightspace-ui/testing';
import { checkIfDatesEqual,
	getDatesInMonthArray,
	getNextMonth,
	getNumberOfDaysFromPrevMonthToShow,
	getNumberOfDaysInMonth,
	getNumberOfDaysToSameWeekPrevMonth,
	getPrevMonth
} from '../calendar.js';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';
import sinon from 'sinon';

const normalFixture = html`<d2l-calendar selected-value="2015-09-02"></d2l-calendar>`;

describe('d2l-calendar', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-calendar');
		});
	});

	describe('events', () => {
		it('dispatches event when date clicked', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('td[data-date="1"] button');
			setTimeout(() => el.click());
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
			await aTimeout(1);

			expect(detail.date).to.equal('2015-09-01');
			expect(calendar.selectedValue).to.equal('2015-09-01');

			const expectedFocusDate = new Date(2015, 8, 1);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('dispatches event when date in previous month clicked', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('td[data-date="31"][data-month="7"] button');
			setTimeout(() => el.click());
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
			await aTimeout(1);

			expect(detail.date).to.equal('2015-08-31');
			expect(calendar.selectedValue).to.equal('2015-08-31');

			const expectedFocusDate = new Date(2015, 7, 31);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('dispatches event when date in next month clicked', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('td[data-date="1"][data-month="9"] button');
			setTimeout(() => el.click());
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
			await aTimeout(1);

			expect(detail.date).to.equal('2015-10-01');
			expect(calendar.selectedValue).to.equal('2015-10-01');

			const expectedFocusDate = new Date(2015, 9, 1);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('dispatches event when enter key pressed on date', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('td[data-date="20"]');
			setTimeout(() => dispatchKeyEvent(el, 13));
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
			await aTimeout(1);

			expect(detail.date).to.equal('2015-09-20');
			expect(calendar.selectedValue).to.equal('2015-09-20');

			const expectedFocusDate = new Date(2015, 8, 20);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('dispatches event when space key pressed on date', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('td[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 32));
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
			await aTimeout(1);

			expect(detail.date).to.equal('2015-09-02');
			expect(calendar.selectedValue).to.equal('2015-09-02');

			const expectedFocusDate = new Date(2015, 8, 2);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});
	});

	describe('focus date', () => {
		it('has initial correct _focusDate when on month with selected-value', async() => {
			const calendar = await fixture(normalFixture);
			await waitUntil(() => calendar._focusDate, 'Focus date was never set');
			const expectedFocusDate = new Date(2015, 8, 2);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('updates _focusDate when selected-value changes', async() => {
			const calendar = await fixture(normalFixture);
			calendar.selectedValue = '2015-09-10';
			await aTimeout(1);
			expect(calendar._focusDate).to.deep.equal(new Date(2015, 8, 10));
		});

		it('has initial correct _focusDate when on month with no selected-value', async() => {
			const newToday = new Date('2018-02-12T12:00Z');
			const clock = sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });

			const calendar = await fixture(html`<d2l-calendar></d2l-calendar>`);
			await waitUntil(() => calendar._focusDate, 'Focus date was never set');
			const expectedFocusDate = new Date(2018, 1, 12);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);

			clock.restore();
		});

		it('has initial correct _focusDate when on month with min-value', async() => {
			const newToday = new Date('2018-02-12T12:00Z');
			const clock = sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });

			const calendar = await fixture(html`<d2l-calendar min-value="2018-02-13"></d2l-calendar>`);
			await waitUntil(() => calendar._focusDate, 'Focus date was never set');
			const expectedFocusDate = new Date(2018, 1, 13);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);

			clock.restore();
		});

		it('has correct _focusDate when user uses right arrow from a focused date', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('td[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 39));
			await oneEvent(el, 'keydown');
			await calendar.updateComplete;

			const expectedFocusDate = new Date(2015, 8, 3);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('has correct _focusDate when user uses left arrow from a focused date', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('td[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 37));
			await oneEvent(el, 'keydown');
			await calendar.updateComplete;

			const expectedFocusDate = new Date(2015, 8, 1);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
		});

		it('has correct _focusDate when user changes month to next month using button', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show October"]');
			setTimeout(() => el.click());
			await oneEvent(el, 'click');
			await aTimeout(1);

			const expectedFocusDate = new Date(2015, 9, 1);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(9);
		});

		it('has correct _focusDate when user changes month to previous month using button', async() => {
			const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-15"></d2l-calendar>`);
			const el = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show August"]');
			setTimeout(() => el.click());
			await oneEvent(el, 'click');
			await aTimeout(1);

			const expectedFocusDate = new Date(2015, 7, 1);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(7);
		});

		it('has correct _focusDate when user changes month to previous month then back to month with today', async() => {
			const newToday = new Date('2018-05-10T12:00Z');
			const clock = sinon.useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });

			const calendar = await fixture(html`<d2l-calendar></d2l-calendar>`);
			await waitUntil(() => calendar._focusDate, 'Focus date was never set');
			const expectedFocusDate1 = new Date(2018, 4, 10);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate1);

			const el = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show April"]');
			setTimeout(() => el.click());
			await oneEvent(el, 'click');
			await aTimeout(1);

			const el2 = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show May"]');
			setTimeout(() => el2.click());
			await oneEvent(el2, 'click');
			await aTimeout(1);

			const expectedFocusDate2 = new Date(2018, 4, 1);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate2);

			clock.restore();
		});

		it('has correct _focusDate when user changes month to previous month that contains the selected date from a different month', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show August"]');
			setTimeout(() => el.click());
			await oneEvent(el, 'click');
			await calendar.updateComplete;

			const expectedFocusDate = new Date(2015, 8, 2);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(7);
		});

		it('has correct _focusDate when user changes to previous month using left arrow key 4 times', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('td[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 37));
			setTimeout(() => dispatchKeyEvent(el, 37));
			setTimeout(() => dispatchKeyEvent(el, 37));
			setTimeout(() => dispatchKeyEvent(el, 37));
			await oneEvent(el, 'keydown');
			await aTimeout(2);

			const expectedFocusDate = new Date(2015, 7, 29);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(7);
		});

		it('has correct _focusDate when user changes to next month using right arrow key 4 times', async() => {
			const calendar = await fixture(html`<d2l-calendar selected-value="2015-09-30"></d2l-calendar>`);
			const el = calendar.shadowRoot.querySelector('td[data-date="30"][data-month="8"]');
			setTimeout(() => dispatchKeyEvent(el, 39));
			setTimeout(() => dispatchKeyEvent(el, 39));
			setTimeout(() => dispatchKeyEvent(el, 39));
			setTimeout(() => dispatchKeyEvent(el, 39));
			await oneEvent(el, 'keydown');
			await aTimeout(2);

			const expectedFocusDate = new Date(2015, 9, 4);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(9);
		});

		it('has correct _focusDate when user presses PAGEUP', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('td[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 33));
			await oneEvent(el, 'keydown');
			await calendar.updateComplete;

			const expectedFocusDate = new Date(2015, 6, 29);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(7);
		});

		it('has correct _focusDate when user presses PAGEDOWN', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('td[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 34));
			await oneEvent(el, 'keydown');
			await calendar.updateComplete;

			const expectedFocusDate = new Date(2015, 8, 30);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(9);
		});

		it('has correct _focusDate when user presses HOME', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('td[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 36));
			await oneEvent(el, 'keydown');
			await calendar.updateComplete;

			const expectedFocusDate = new Date(2015, 7, 30);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(8);
		});

		it('has correct _focusDate when user presses END', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('td[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 35));
			await oneEvent(el, 'keydown');
			await calendar.updateComplete;

			const expectedFocusDate = new Date(2015, 8, 5);
			expect(calendar._focusDate).to.deep.equal(expectedFocusDate);
			expect(calendar._shownMonth).to.equal(8);
		});
	});

	describe('utility functions', () => {

		describe('checkIfDatesEqual', () => {
			it('returns true if dates and times are equal', () => {
				const date1 = new Date(2019, 1, 1);
				const date2 = new Date(2019, 1, 1);
				expect(checkIfDatesEqual(date1, date2)).to.be.true;
			});

			it('returns false if dates equal and times are not', () => {
				const date1 = new Date(2019, 1, 1, 0);
				const date2 = new Date(2019, 1, 1, 7, 30, 0);
				expect(checkIfDatesEqual(date1, date2)).to.be.false;
			});

			it('returns false if dates not equal', () => {
				const date1 = new Date(2019, 1, 1, 0);
				const date2 = new Date(2019, 1, 31, 7, 30, 0);
				expect(checkIfDatesEqual(date1, date2)).to.be.false;
			});

			it('returns false if date 1 is null', () => {
				const date1 = null;
				const date2 = new Date(2019, 1, 1, 7, 30, 0);
				expect(checkIfDatesEqual(date1, date2)).to.be.false;
			});

			it('returns false if date 2 is null', () => {
				const date1 = new Date(2019, 1, 1, 0);
				const date2 = null;
				expect(checkIfDatesEqual(date1, date2)).to.be.false;
			});
		});

		describe('getDatesInMonthArray', () => {
			it('returns expected array for Feb 2020 (days from prev month, no days from next month', () => {
				const dates = [[
					new Date(2020, 0, 26),
					new Date(2020, 0, 27),
					new Date(2020, 0, 28),
					new Date(2020, 0, 29),
					new Date(2020, 0, 30),
					new Date(2020, 0, 31),
					new Date(2020, 1, 1)
				], [
					new Date(2020, 1, 2),
					new Date(2020, 1, 3),
					new Date(2020, 1, 4),
					new Date(2020, 1, 5),
					new Date(2020, 1, 6),
					new Date(2020, 1, 7),
					new Date(2020, 1, 8)
				], [
					new Date(2020, 1, 9),
					new Date(2020, 1, 10),
					new Date(2020, 1, 11),
					new Date(2020, 1, 12),
					new Date(2020, 1, 13),
					new Date(2020, 1, 14),
					new Date(2020, 1, 15)
				], [
					new Date(2020, 1, 16),
					new Date(2020, 1, 17),
					new Date(2020, 1, 18),
					new Date(2020, 1, 19),
					new Date(2020, 1, 20),
					new Date(2020, 1, 21),
					new Date(2020, 1, 22)
				], [
					new Date(2020, 1, 23),
					new Date(2020, 1, 24),
					new Date(2020, 1, 25),
					new Date(2020, 1, 26),
					new Date(2020, 1, 27),
					new Date(2020, 1, 28),
					new Date(2020, 1, 29)
				]];
				expect(getDatesInMonthArray(1, 2020)).to.deep.equal(dates);
			});

			it('returns expected array for March 2020 (days from next month, no days from prev month)', () => {
				const dates = [[
					new Date(2020, 2, 1),
					new Date(2020, 2, 2),
					new Date(2020, 2, 3),
					new Date(2020, 2, 4),
					new Date(2020, 2, 5),
					new Date(2020, 2, 6),
					new Date(2020, 2, 7)
				], [
					new Date(2020, 2, 8),
					new Date(2020, 2, 9),
					new Date(2020, 2, 10),
					new Date(2020, 2, 11),
					new Date(2020, 2, 12),
					new Date(2020, 2, 13),
					new Date(2020, 2, 14)
				], [
					new Date(2020, 2, 15),
					new Date(2020, 2, 16),
					new Date(2020, 2, 17),
					new Date(2020, 2, 18),
					new Date(2020, 2, 19),
					new Date(2020, 2, 20),
					new Date(2020, 2, 21)
				], [
					new Date(2020, 2, 22),
					new Date(2020, 2, 23),
					new Date(2020, 2, 24),
					new Date(2020, 2, 25),
					new Date(2020, 2, 26),
					new Date(2020, 2, 27),
					new Date(2020, 2, 28)
				], [
					new Date(2020, 2, 29),
					new Date(2020, 2, 30),
					new Date(2020, 2, 31),
					new Date(2020, 3, 1),
					new Date(2020, 3, 2),
					new Date(2020, 3, 3),
					new Date(2020, 3, 4)
				]];
				expect(getDatesInMonthArray(2, 2020)).to.deep.equal(dates);
			});

			it('returns expected array for Jan 2021 (days from prev and next month and 6 weeks)', () => {
				const dates = [[
					new Date(2020, 11, 27),
					new Date(2020, 11, 28),
					new Date(2020, 11, 29),
					new Date(2020, 11, 30),
					new Date(2020, 11, 31),
					new Date(2021, 0, 1),
					new Date(2021, 0, 2)
				], [
					new Date(2021, 0, 3),
					new Date(2021, 0, 4),
					new Date(2021, 0, 5),
					new Date(2021, 0, 6),
					new Date(2021, 0, 7),
					new Date(2021, 0, 8),
					new Date(2021, 0, 9)
				], [
					new Date(2021, 0, 10),
					new Date(2021, 0, 11),
					new Date(2021, 0, 12),
					new Date(2021, 0, 13),
					new Date(2021, 0, 14),
					new Date(2021, 0, 15),
					new Date(2021, 0, 16)
				], [
					new Date(2021, 0, 17),
					new Date(2021, 0, 18),
					new Date(2021, 0, 19),
					new Date(2021, 0, 20),
					new Date(2021, 0, 21),
					new Date(2021, 0, 22),
					new Date(2021, 0, 23)
				], [
					new Date(2021, 0, 24),
					new Date(2021, 0, 25),
					new Date(2021, 0, 26),
					new Date(2021, 0, 27),
					new Date(2021, 0, 28),
					new Date(2021, 0, 29),
					new Date(2021, 0, 30)
				], [
					new Date(2021, 0, 31),
					new Date(2021, 1, 1),
					new Date(2021, 1, 2),
					new Date(2021, 1, 3),
					new Date(2021, 1, 4),
					new Date(2021, 1, 5),
					new Date(2021, 1, 6)
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
	});

	function dispatchKeyEvent(el, key) {
		const eventObj = document.createEvent('Events');
		eventObj.initEvent('keydown', true, true);
		eventObj.which = key;
		eventObj.keyCode = key;
		el.dispatchEvent(eventObj);
	}

});
