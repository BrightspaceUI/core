import { checkIfDatesEqual,
	getDatesInMonthArray,
	getNextMonth,
	getNumberOfDaysFromPrevMonthToShow,
	getNumberOfDaysInMonth,
	getNumberOfDaysToSameWeekPrevMonth,
	getPrevMonth,
	parseDate
} from '../calendar.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const normalFixture = html`<d2l-calendar selected-value="2015-09-02T12:00Z"></d2l-calendar>`;

describe('d2l-calendar', () => {

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
			expect(detail.date).to.contain('2015-09-01T');
		});

		it('dispatches event when date in previous month clicked', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="31"][data-month="7"]');
			setTimeout(() => el.click());
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
			expect(detail.date).to.contain('2015-08-31T');
		});

		it('dispatches event when date in next month clicked', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="1"][data-month="9"]');
			setTimeout(() => el.click());
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
			expect(detail.date).to.contain('2015-10-01T');
		});

		it('dispatches event when enter key pressed on date', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="20"]');
			setTimeout(() => dispatchKeyEvent(el, 13));
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
			expect(detail.date).to.contain('2015-09-20T');
		});

		it('dispatches event when space key pressed on date', async() => {
			const calendar = await fixture(normalFixture);
			const el = calendar.shadowRoot.querySelector('div[data-date="2"]');
			setTimeout(() => dispatchKeyEvent(el, 32));
			const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
			expect(detail.date).to.contain('2015-09-02T');
		});

		function dispatchKeyEvent(el, key) {
			const eventObj = document.createEvent('Events');
			eventObj.initEvent('keydown', true, true);
			eventObj.which = key;
			eventObj.keyCode = key;
			el.dispatchEvent(eventObj);
		}
	});

	describe('utility functions', () => {

		describe('checkIfDatesEqual', () => {
			it('returns true if dates equal and times are not', () => {
				const date1 = new Date(2019, 1, 1, 12, 0, 0, 0);
				const date2 = new Date(2019, 1, 1, 7, 30, 0);
				expect(checkIfDatesEqual(date1, date2)).to.be.true;
			});

			it('returns false if dates not equal', () => {
				const date1 = new Date(2019, 1, 1, 12, 0, 0, 0);
				const date2 = new Date(2019, 1, 31, 7, 30, 0);
				expect(checkIfDatesEqual(date1, date2)).to.be.false;
			});

			it('returns false if date 1 is null', () => {
				const date1 = null;
				const date2 = new Date(2019, 1, 1, 7, 30, 0);
				expect(checkIfDatesEqual(date1, date2)).to.be.false;
			});

			it('returns false if date 2 is null', () => {
				const date1 = new Date(2019, 1, 1, 12, 0, 0, 0);
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

		describe('parseDate', () => {
			it('should return correct date if date and time provided', () => {
				expect(parseDate('2019-01-30T12:00Z')).to.deep.equal(new Date(2019, 0, 30, 0, 0, 0));
			});

			it('should return correct date if no time provided', () => {
				expect(parseDate('2019-01-30')).to.deep.equal(new Date(2019, 0, 30, 0, 0, 0));
			});
		});

	});

});
