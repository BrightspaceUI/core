import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getDateTimeDescriptor, parseDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { heading4Styles } from '../typography/styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class Calendar extends RtlMixin(LitElement) {

	static get properties() {
		return {
			selectedValue: { type: String, attribute: 'selected-value' },
			summary: String,
			_firstDayOfWeek: Number,
			_selectedDate: Number,
			_selectedMonth: Number,
			_selectedYear: Number,
			_shownMonth: Number,
			_shownYear: Number
		};
	}

	static get styles() {
		return [heading4Styles, css`
				:host {
					border-radius: 4px;
					display: block;
				}

				table {
					border-collapse: separate;
					border-spacing: 0;
					table-layout: fixed;
					width: 100%;
				}

				th[role="columnheader"] {
					padding: 0.45rem 0;
				}

				th > abbr {
					color: var(--d2l-color-tungsten);
					display: block;
					font-size: 0.8rem;
					font-weight: normal;
					text-align: center;
					text-decoration: none;
				}

				thead {
					vertical-align: top;
				}

				.d2l-calendar-title {
					border-top-left-radius: 4px;
					border-top-right-radius: 4px;
					text-align: center;
				}

				.d2l-calendar-title .d2l-heading-4 {
					margin: 0.25rem 0 1.25rem 0;
				}

				.d2l-calendar-day {
					border: 1px solid transparent;
					cursor: pointer;
					font-size: 0.8rem;
					position: relative;
					text-align: center;
				}

				.d2l-calendar-day div {
					align-items: center;
					border-radius: 10px;
					display: flex;
					height: 2.5rem;
					justify-content: center;
					margin-left: auto;
					margin-right: auto;
					width: 2.5rem;
				}

				.d2l-calendar-day:hover div,
				.d2l-calendar-day:focus div {
					background-color: var(--d2l-color-celestine-plus-2);
					color: var(--d2l-color-ferrite);
					outline: none;
				}

				.d2l-calendar-day-selected div {
					background-color: var(--d2l-color-celestine);
					color: white;
				}

				.d2l-calendar-day-other-month {
					color: var(--d2l-color-chromite);
				}
			`];
	}

	constructor() {
		super();

		const descriptor = getDateTimeDescriptor();
		this._monthNames = descriptor.calendar.months.long;
		const weekdays = descriptor.calendar.days.long;
		const weekdaysShort = descriptor.calendar.days.short;
		this._firstDayOfWeek = descriptor.calendar.firstDayOfWeek;
		// this._firstDayOfWeek = 4;

		this._arrangedWeekdays = [];
		for (let i = this._firstDayOfWeek; i < this._firstDayOfWeek + 7; i++) {
			const index = i % 7;
			const day = {
				long: weekdays[index],
				short: weekdaysShort[index]
			};
			this._arrangedWeekdays.push(day);
		}
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		const selected = parseDate(this.selectedValue);
		this._selectedMonth = selected.getMonth();
		this._selectedDate = selected.getDate();
		this._selectedYear = selected.getFullYear();

		this._shownMonth = this._selectedMonth;
		this._shownYear = this._selectedYear;
	}

	render() {
		const weekdayHeaders = this._arrangedWeekdays.map((day) => html`
			<th role="columnheader" abbr="${day.long}">
				<abbr title="${day.long}">
					${day.short}
				</abbr>
			</th>
		`);

		const days = this._generateDaysInMonth();
		const dayRows = days.map((week) => {
			const weekHtml = week.map((day) => {
				const dayClass = {
					'd2l-calendar-day': true,
					'd2l-calendar-day-other-month': day.prevMonth || day.nextMonth,
					'd2l-calendar-day-selected': day.selected
				};
				return html`
					<td class=${classMap(dayClass)}><div>${day.date}</div></td>
				`;
			});
			return html`
				<tr>${weekHtml}</tr>
			`;
		});

		return html`
			<div aria-labelledby="${this.labelledById}" class="d2l-calendar">
				<table summary="${this.summary}" role="grid">
					<thead>
						<tr class="d2l-calendar-title">
							<td>
								L
							</td>
							<th colspan="5">
								<h2 class="d2l-heading-4">${this._monthNames[this._shownMonth]} ${this._shownYear}</h2>
							</th>
							<td>
								R
							</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							${weekdayHeaders}
						</tr>
						${dayRows}
					</tbody>
				</table>
				<slot></slot>
			</div>
		`;
	}

	_checkIfSelected(month, date, year) {
		return this._selectedMonth === month && this._selectedDate === date && this._selectedYear === year;
	}

	_createDateObject(date, prevMonth, nextMonth) {
		return {
			date: date,
			prevMonth: prevMonth,
			nextMonth: nextMonth,
			selected: this._checkIfSelected(this._shownMonth, date, this._shownYear)
		};
	}

	_generateDaysInMonth() {
		if (this._shownMonth === undefined || !this._shownYear) return [];

		const numDays = this._getNumberOfDaysInMonth(this._shownMonth, this._shownYear);
		const firstDay = new Date(this._shownYear, this._shownMonth, 1);

		const days = [];
		const firstWeek = [];
		let startDay = 1;
		let numDaysFromLastMonthToShowThisMonth = 0;

		// populate first week of month
		if (firstDay.getDay() !== this._firstDayOfWeek) {
			let lastMonth;
			if (this._shownMonth === 0) {
				lastMonth = 12;
			} else {
				lastMonth = this._shownMonth;
			}
			const numDaysLastMonth = this._getNumberOfDaysInMonth(lastMonth, this._shownYear);
			numDaysFromLastMonthToShowThisMonth = firstDay.getDay() - this._firstDayOfWeek;
			// handle multiple weeks last month -.-
			for (let i = numDaysLastMonth - numDaysFromLastMonthToShowThisMonth + 1; i <= numDaysLastMonth; i++) {
				firstWeek.push(this._createDateObject(i, true, false));
			}
		}
		for (let j = 1; j <= 7 - numDaysFromLastMonthToShowThisMonth; j++) {
			startDay = j + 1;
			firstWeek.push(this._createDateObject(j, false, false));
		}
		days.push(firstWeek);

		// remaining weeks
		let nextMonthDay = 1;
		for (let i = 1; i < Math.ceil(numDays / 7); i++) {
			const week = [];
			for (let j = startDay; j < startDay + 7; j++) {
				let day;
				if (j >= (numDays + 1)) {
					day = this._createDateObject(nextMonthDay, false, true);
					nextMonthDay++;
				} else {
					day = this._createDateObject(j, false, false);
				}

				week.push(day);
			}
			startDay = startDay + 7;
			days.push(week);
		}

		return days;
	}

	_getNumberOfDaysInMonth(month, year) {
		month++; // month index started at 0
		let days = 31;
		if (month === 2) {
			if ((year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) {
				days = 29;
			} else {
				days = 28;
			}
		} else if (month === 4 || month === 6 || month === 9 || month === 11) {
			days = 30;
		}
		return days;
	}

}
customElements.define('d2l-calendar', Calendar);
