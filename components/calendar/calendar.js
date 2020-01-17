import '../button/button-icon.js';
import './calendar-date.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getDateTimeDescriptor, parseDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { heading4Styles } from '../typography/styles.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class Calendar extends LocalizeStaticMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			selectedValue: { type: String, attribute: 'selected-value' },
			summary: { type: String },
			_dates: { type: Array },
			_firstDayOfWeek: { type: Number },
			_focusDate: { type: Object },
			_nextMonth: { type: Number },
			_prevMonth: { type: Number },
			_selectedDate: { type: Object },
			_shownMonth: { type: Number },
			_shownYear: { type: Number }
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

		this._dialogLabelId = getUniqueId();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('keydown', this._onKeyDown);
		this.addEventListener('d2l-calendar-selected', (e) => {
			this._selectedDate = e.detail.date;
		});

		let selected;
		if (this.selectedValue) {
			selected = parseDate(this.selectedValue);
		} else {
			selected = new Date();
		}

		this._selectedDate = {
			month: selected.getMonth(),
			date: selected.getDate(),
			year: selected.getFullYear()
		};

		this._shownMonth = this._selectedDate.month;
		this._shownYear = this._selectedDate.year;

		let focusDay = 1;
		if (this._selectedDate.month === this._shownMonth) focusDay = this._selectedDate.date;
		this._focusDate = {
			date: focusDay,
			month: this._shownMonth,
			year: this._shownYear
		};
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === '_selectedDate') {
				this._generateDaysInMonth();
			}
			if (prop === '_shownMonth') {
				this._onMonthChange();
				this._generateDaysInMonth();
				this.updateComplete.then(() => {
					this.updateComplete.then(() => {
						this._getNodeAndAddFocus(this._keyboardTriggeredMonthChange);
						this._keyboardTriggeredMonthChange = false;
					});
				});
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

		let dayRows;
		if (this._dates) {
			dayRows = this._dates.map((week) => {
				const weekHtml = week.map((day) => {
					return html`
						<td>
							<d2l-calendar-date
								month=${day.month}
								date=${day.date}
								year=${day.year}
								?selected=${day.selected}
								?other-month=${day.otherMonth}
								?focused=${day.focused}>
							</d2l-calendar-date>
						</td>`;
				});

				return html`
					<tr>${weekHtml}</tr>
				`;
			});
		}
		const heading = `${this._monthNames[this._shownMonth]} ${this._shownYear}`;
		return html`
			<div aria-labelledby="${this._dialogLabelId}" class="d2l-calendar">
				<table summary="${this.summary}" role="grid">
					<thead>
						<tr class="d2l-calendar-title">
							<td>
								<d2l-button-icon @click="${this._showPrevMonth}" text="${this._computeText(this._prevMonth)}" icon="tier1:chevron-left"></d2l-button-icon>
							</td>
							<th colspan="5">
								<h2 class="d2l-heading-4" aria-live="polite" id="${this._dialogLabelId}">${heading}</h2>
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

	_changeFocusDate(numDays) {
		this._getNodeAndRemoveFocus();

		const d =  new Date(this._focusDate.year, this._focusDate.month, this._focusDate.date);
		d.setDate(d.getDate() + numDays);

		this._focusDate = {
			date: d.getDate(),
			month: d.getMonth(),
			year: d.getFullYear()
		};

		this._keyboardTriggeredMonthChange = true;
		if (this._focusDate.year < this._shownYear || this._focusDate.month < this._shownMonth) {
			this._showPrevMonth();
		} else if (this._focusDate.month > this._shownMonth || (this._shownMonth === 11 && this._focusDate.month === 0)) {
			this._showNextMonth();
		} else {
			this._getNodeAndAddFocus(this._keyboardTriggeredMonthChange);
			this._keyboardTriggeredMonthChange = false;
		}
	}

	_checkIfDatesEqual(month, date, year, comparisonDate) {
		return comparisonDate.month === month
			&& comparisonDate.date === date
			&& comparisonDate.year === year;
	}

	_computeText(month) {
		return this.localize('show', {month: this._monthNames[month]});
	}

	_createDateObject(date, prevMonth, nextMonth) {
		let month = this._shownMonth;
		let year = this._shownYear;
		if (prevMonth) {
			month = this._prevMonth;
			if (this._shownMonth === 0) year = this._shownYear - 1;
		} else if (nextMonth) {
			month = this._nextMonth;
			if (this._shownMonth === 11) year = this._shownYear + 1;
		}

		return {
			date: date,
			month: month,
			year: year,
			otherMonth: prevMonth || nextMonth,
			selected: this._checkIfDatesEqual(month, date, year, this._selectedDate),
			focused: this._checkIfDatesEqual(month, date, year, this._focusDate)
		};
	}

	_generateDaysInMonth() {
		if (this._shownMonth === undefined || !this._shownYear) return [];

		this._dates = [];

		const numDays = this._getNumberOfDaysInMonth(this._shownMonth, this._shownYear);

		// populate first week of month
		const firstWeek = [];
		const firstDayOfMonth = new Date(this._shownYear, this._shownMonth, 1).getDay();
		let numDaysFromLastMonthToShowThisMonth = 0;

		if (firstDayOfMonth !== this._firstDayOfWeek) {
			const numDaysLastMonth = this._getNumberOfDaysInMonth(this._prevMonth, this._shownYear);
			numDaysFromLastMonthToShowThisMonth = firstDayOfMonth - this._firstDayOfWeek;
			if (numDaysFromLastMonthToShowThisMonth < 0) {
				numDaysFromLastMonthToShowThisMonth += 7;
			}
			for (let i = numDaysLastMonth - numDaysFromLastMonthToShowThisMonth + 1; i <= numDaysLastMonth; i++) {
				firstWeek.push(this._createDateObject(i, true, false));
			}
		}
		for (let j = 1; j <= 7 - numDaysFromLastMonthToShowThisMonth; j++) {
			firstWeek.push(this._createDateObject(j, false, false));
		}
		this._dates.push(firstWeek);

		// remaining weeks
		let nextMonthDay = 1;
		let firstDateOfWeek = 7 - numDaysFromLastMonthToShowThisMonth + 1;
		this._numWeeks = Math.ceil((numDaysFromLastMonthToShowThisMonth + numDays) / 7);
		for (let i = 1; i < this._numWeeks; i++) {
			const week = [];
			for (let j = firstDateOfWeek; j < firstDateOfWeek + 7; j++) {
				let day;
				if (j >= (numDays + 1)) {
					day = this._createDateObject(nextMonthDay, false, true);
					nextMonthDay++;
				} else {
					day = this._createDateObject(j, false, false);
				}
				week.push(day);
			}
			firstDateOfWeek = firstDateOfWeek + 7;
			this._dates.push(week);
		}

		return this._dates;
	}

	_getCalendarDateByDate(month, date, year) {
		return this.shadowRoot.querySelector(`d2l-calendar-date[date="${date}"][month="${month}"][year="${year}"]`);
	}

	_getNodeAndAddFocus(keyboardTriggeredFocus) {
		const node = this._getCalendarDateByDate(this._focusDate.month, this._focusDate.date, this._focusDate.year);
		if (node) {
			node.setAttribute('focused', true);
			if (keyboardTriggeredFocus) {
				node.focus();
			}
		}
	}

	_getNodeAndRemoveFocus() {
		const node = this._getCalendarDateByDate(this._focusDate.month, this._focusDate.date, this._focusDate.year);
		if (node) {
			node.removeAttribute('focused');
		}
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

	_onKeyDown(e) {
		const rootTarget = e.composedPath()[0];
		if (rootTarget.tagName !== 'D2L-CALENDAR-DATE') return;

		const keyCodes = {
			DOWN: 40,
			END: 35,
			ENTER: 13,
			ESCAPE: 27,
			HOME: 36,
			LEFT: 37,
			PAGEUP: 33,
			PAGEDOWN: 34,
			SPACE: 32,
			RIGHT: 39,
			UP: 38
		};

		let preventDefault = false;

		switch (e.keyCode) {
			case keyCodes.DOWN:
				this._changeFocusDate(7);
				preventDefault = true;
				break;
			case keyCodes.UP:
				this._changeFocusDate(-7);
				preventDefault = true;
				break;
			case keyCodes.LEFT:
				this._changeFocusDate(-1);
				break;
			case keyCodes.RIGHT:
				this._changeFocusDate(1);
				break;
			case keyCodes.HOME: {
				const dayOfTheWeek = new Date(this._focusDate.year, this._focusDate.month, this._focusDate.date).getDay();
				let diff = dayOfTheWeek - this._firstDayOfWeek;
				if (diff < 0) {
					diff += 7;
				}
				this._changeFocusDate(-diff);
				break;
			} case keyCodes.END: {
				const dayOfTheWeek2 = new Date(this._focusDate.year, this._focusDate.month, this._focusDate.date).getDay();
				let diff = 6 - dayOfTheWeek2 + this._firstDayOfWeek;
				if (diff > 6) {
					diff -= 7;
				}
				this._changeFocusDate(diff);
				preventDefault = true;
				break;
			} case keyCodes.PAGEUP:
				if (e.shiftKey) {
					// Changes the grid of dates to the previous Year.
					// Sets focus on the same day of the same week. If that day does not exist, then moves focus to the same day of the previous or next week.
				}
				this._changeFocusDate(this._numWeeks * -7);
				preventDefault = true;
				break;
			case keyCodes.PAGEDOWN:
				if (e.shiftKey) {
					// Changes the grid of dates to the next Year.
					// Sets focus on the same day of the same week. If that day does not exist, then moves focus to the same day of the previous or next week.
				}
				this._changeFocusDate(this._numWeeks * 7);
				preventDefault = true;
				break;
		}

		if (preventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	_onMonthChange() {
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
		this._getNodeAndRemoveFocus();

		this._focusDate.month = this._shownMonth;
		this._focusDate.year = this._shownYear;

		const numDaysInMonth = this._getNumberOfDaysInMonth(this._shownMonth, this._shownYear);
		if (this._focusDate.date > (numDaysInMonth - 1)) this._focusDate.date = numDaysInMonth;
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
