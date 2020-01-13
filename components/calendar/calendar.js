import '../button/button-icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getDateTimeDescriptor, parseDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { heading4Styles } from '../typography/styles.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class Calendar extends LocalizeStaticMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			selectedValue: { type: String, attribute: 'selected-value' },
			summary: String,
			_firstDayOfWeek: Number,
			_nextMonth: Number,
			_prevMonth: Number,
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
					display: block;
					min-width: 350px;
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

				.d2l-calendar {
					border-radius: 4px;
				}

				.d2l-calendar-title {
					border-top-left-radius: 4px;
					border-top-right-radius: 4px;
					text-align: center;
				}

				.d2l-calendar-title .d2l-heading-4 {
					margin: 0.45rem 0 1.25rem 0;
				}

				.d2l-calendar-day {
					cursor: pointer;
					font-size: 0.8rem;
					position: relative;
					text-align: center;
				}

				.d2l-calendar-day div {
					align-items: center;
					border: 2.5px solid transparent;
					border-radius: 8px;
					color: var(--d2l-color-ferrite);
					display: flex;
					height: 2rem;
					justify-content: center;
					margin-left: auto;
					margin-right: auto;
					width: 2rem;
				}

				.d2l-calendar-day:focus {
					outline: none;
				}

				.d2l-calendar-day:hover div {
					background-color: var(--d2l-color-celestine-plus-2);
					color: var(--d2l-color-ferrite);
				}

				.d2l-calendar-day:focus div {
					background-color: white;
					border-color: var(--d2l-color-celestine);
					color: var(--d2l-color-ferrite);
				}

				.d2l-calendar-day-selected div {
					background-color: var(--d2l-color-celestine);
					color: white;
				}

				.d2l-calendar-day-other-month div,
				.d2l-calendar-day-other-month:hover div,
				.d2l-calendar-day-other-month:focus div {
					color: var(--d2l-color-chromite);
				}
			`];
	}

	static get resources() {
		return {
			'ar': { show: 'Show {month} ' },
			'en': { show: 'Show {month}' },
			'es': { show: 'Show {month} ' },
			'fr': { show: 'Show {month} ' },
			'ja': { show: 'Show {month} ' },
			'ko': { show: 'Show {month} ' },
			'nl': { show: 'Show {month} ' },
			'pt': { show: 'Show {month} ' },
			'sv': { show: 'Show {month} ' },
			'tr': { show: 'Show {month} ' },
			'zh': { show: 'Show {month} ' },
			'zh-tw': { show: 'Show {month} ' }
		};
	}

	constructor() {
		super();

		const descriptor = getDateTimeDescriptor();
		this._monthNames = descriptor.calendar.months.long;
		this._firstDayOfWeek = descriptor.calendar.firstDayOfWeek;
		const weekdays = descriptor.calendar.days.long;
		const weekdaysShort = descriptor.calendar.days.short;

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

		this.addEventListener('keydown', this._onKeyDown);

		const selected = parseDate(this.selectedValue);
		this._selectedMonth = selected.getMonth();
		this._selectedDate = selected.getDate();
		this._selectedYear = selected.getFullYear();

		this._shownMonth = this._selectedMonth;
		this._shownYear = this._selectedYear;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === '_shownMonth') {
				this._setNextPrevMonth();
				this._dates = this.shadowRoot.querySelectorAll('.d2l-calendar-day');
			}
		});
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
					<td
						@click="${this._onDateSelected}"
						data-date="${day.fullDate}"
						data-row="${day.row}"
						data-col="${day.col}"
						class=${classMap(dayClass)}
						tabindex="${day.date === 1 ? 0 : -1}">
						<div>${day.date}</div>
					</td>
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
								<d2l-button-icon @click="${this._showPrevMonth}" text="${this._computeText(this._prevMonth)}" icon="tier1:chevron-left"></d2l-button-icon>
							</td>
							<th colspan="5">
								<h2 class="d2l-heading-4">${this._monthNames[this._shownMonth]} ${this._shownYear}</h2>
							</th>
							<td>
								<d2l-button-icon @click="${this._showNextMonth}" text="${this._computeText(this._nextMonth)}" icon="tier1:chevron-right"></d2l-button-icon>
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

	_computeText(month) {
		return this.localize('show', {month: this._monthNames[month]});
	}

	_createDateObject(date, row, col, prevMonth, nextMonth) {
		let month = this._shownMonth;
		let year = this._shownYear;
		if (prevMonth) {
			month = this._prevMonth;
			if (this._shownMonth === 0) year = this._shownYear - 1;
		} else if (nextMonth) {
			month = this._nextMonth;
			if (this._shownMonth === 11) year = this._shownYear + 1;
		}
		const fullDate = `${month + 1}/${date}/${year}`;
		return {
			date: date,
			fullDate: fullDate,
			row: row,
			col: col,
			prevMonth: prevMonth,
			nextMonth: nextMonth,
			selected: this._checkIfSelected(this._shownMonth, date, this._shownYear)
		};
	}

	_focusOnDate(col, row) {
		const cell = this._getCell(col, row);
		cell.focus();
	}

	_generateDaysInMonth() {
		if (this._shownMonth === undefined || !this._shownYear) return [];

		const days = [];

		const numDays = this._getNumberOfDaysInMonth(this._shownMonth, this._shownYear);

		// populate first week of month
		const firstWeek = [];
		const firstDayOfMonth = new Date(this._shownYear, this._shownMonth, 1).getDay();
		let numDaysFromLastMonthToShowThisMonth = 0;
		let col = 0;
		if (firstDayOfMonth !== this._firstDayOfWeek) {
			const numDaysLastMonth = this._getNumberOfDaysInMonth(this._prevMonth, this._shownYear);
			numDaysFromLastMonthToShowThisMonth = firstDayOfMonth - this._firstDayOfWeek;
			if (numDaysFromLastMonthToShowThisMonth < 0) {
				numDaysFromLastMonthToShowThisMonth += 7;
			}
			for (let i = numDaysLastMonth - numDaysFromLastMonthToShowThisMonth + 1; i <= numDaysLastMonth; i++) {
				firstWeek.push(this._createDateObject(i, 0, col, true, false));
				col++;
			}
		}
		for (let j = 1; j <= 7 - numDaysFromLastMonthToShowThisMonth; j++) {
			firstWeek.push(this._createDateObject(j, 0, col, false, false));
			col++;
		}
		days.push(firstWeek);

		// remaining weeks
		let nextMonthDay = 1;
		let firstDateOfWeek = 7 - numDaysFromLastMonthToShowThisMonth + 1;
		for (let i = 1; i < this._getNumberOfWeeksInAMonth(this._shownMonth, this._shownYear); i++) {
			const week = [];
			col = 0;
			for (let j = firstDateOfWeek; j < firstDateOfWeek + 7; j++) {
				let day;
				if (j >= (numDays + 1)) {
					day = this._createDateObject(nextMonthDay, i, col, false, true);
					nextMonthDay++;
				} else {
					day = this._createDateObject(j, i, col, false, false);
				}
				col++;
				week.push(day);
			}
			firstDateOfWeek = firstDateOfWeek + 7;
			days.push(week);
		}

		return days;
	}

	_getCell(col, row) {
		return [].filter.call(this._dates, (element) => {
			return element.matches(`td[data-row="${row}"][data-col="${col}"]`);
		})[0];
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

	_getNumberOfWeeksInAMonth(month, year) {
		const numDays = this._getNumberOfDaysInMonth(month, year);
		return Math.ceil(numDays / 7);
	}

	_onDateSelected(e, dataDate) {
		const date = e.currentTarget.getAttribute('data-date') || dataDate;
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: { date: date }
		};
		this.dispatchEvent(new CustomEvent('d2l-calendar-selected', eventDetails));
	}

	_onKeyDown(e) {
		const rootTarget = e.composedPath()[0];
		if (!rootTarget.getAttribute('data-date')) return;

		const keyCodes = {
			DOWN: 40,
			ENTER: 13,
			ESCAPE: 27,
			LEFT: 37,
			SPACE: 32,
			RIGHT: 39,
			UP: 38
		};

		// RTL fix this
		// issue if there are multiple 1's in a month, who gets focus
		const col = parseInt(rootTarget.getAttribute('data-col'));
		const row = parseInt(rootTarget.getAttribute('data-row'));
		if (e.keyCode === keyCodes.DOWN || e.keyCode === keyCodes.UP) {
			e.preventDefault();
			e.stopPropagation();
			if (e.keyCode === keyCodes.DOWN) {
				let newRow = row + 1;
				const numWeeks = this._getNumberOfWeeksInAMonth(this._shownMonth, this._shownYear) - 1;
				if (newRow > numWeeks) {
					this._showNextMonth();
					newRow = 0;
				}
				this._focusOnDate(col, newRow);
			} else if (e.keyCode === keyCodes.UP) {
				let newRow = row - 1;
				if (newRow < 0) {
					this._showPrevMonth();
					newRow = this._getNumberOfWeeksInAMonth(this._shownMonth, this._shownYear) - 1;
				}
				this._focusOnDate(col, newRow);
			}
		} else if (e.keyCode === keyCodes.LEFT) {
			this._focusOnDate(col - 1, row);
		} else if (e.keyCode === keyCodes.RIGHT) {
			this._focusOnDate(col + 1, row);
		} else if (e.keyCode === keyCodes.ENTER || e.keyCode === keyCodes.SPACE) {
			e.stopPropagation();
			e.preventDefault();
			const cell = this._getCell(col, row);
			this._onDateSelected(e, cell.getAttribute('data-date'));
		}
	}

	_setNextPrevMonth() {
		if (this._shownMonth === 0) {
			this._prevMonth = 11;
			this._nextMonth = this._shownMonth + 1;
		} else if (this._shownMonth === 11) {
			this._prevMonth = this._shownMonth - 1;
			this._nextMonth = 0;
		} else {
			this._prevMonth = this._shownMonth - 1;
			this._nextMonth = this._shownMonth + 1;
		}
	}

	_showNextMonth() {
		if (this._shownMonth === 11) {
			this._shownYear++;
		}
		this._shownMonth = this._nextMonth;
	}

	_showPrevMonth() {
		if (this._shownMonth === 0) {
			this._shownYear--;
		}
		this._shownMonth = this._prevMonth;
	}

}
customElements.define('d2l-calendar', Calendar);
