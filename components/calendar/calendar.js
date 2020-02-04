import '../button/button-icon.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { calendarStyles } from './calendar-styles.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getDateTimeDescriptor } from '@brightspace-ui/intl/lib/dateTime.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { heading4Styles } from '../typography/styles.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';

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

function checkIfDatesEqual(month, date, year, comparisonDate) {
	return comparisonDate.getMonth() === month
		&& comparisonDate.getDate() === date
		&& comparisonDate.getFullYear() === year;
}

function createDateObject(date, inPrevMonth, inNextMonth, shownMonth, shownYear, prevMonth, nextMonth) {
	let month = shownMonth;
	let year = shownYear;
	if (inPrevMonth) {
		month = prevMonth;
		if (shownMonth === 0) year = shownYear - 1;
	} else if (inNextMonth) {
		month = nextMonth;
		if (shownMonth === 11) year = shownYear + 1;
	}

	return {
		date: date,
		month: month,
		year: year,
		otherMonth: inPrevMonth || inNextMonth
	};
}

function generateDaysInMonth(shownMonth, shownYear, prevMonth, nextMonth, firstDayOfWeek) {
	if (shownMonth === undefined || !shownYear) return [];

	const dates = [];
	const numDays = getNumberOfDaysInMonth(shownMonth, shownYear);

	// populate first week of month
	const firstWeek = [];
	const firstDayOfMonth = new Date(shownYear, shownMonth, 1).getDay();
	let numDaysFromLastMonthToShowThisMonth = 0;

	if (firstDayOfMonth !== firstDayOfWeek) {
		const numDaysLastMonth = getNumberOfDaysInMonth(prevMonth, shownYear);
		numDaysFromLastMonthToShowThisMonth = firstDayOfMonth - firstDayOfWeek;
		if (numDaysFromLastMonthToShowThisMonth < 0) {
			numDaysFromLastMonthToShowThisMonth += 7;
		}
		for (let i = numDaysLastMonth - numDaysFromLastMonthToShowThisMonth + 1; i <= numDaysLastMonth; i++) {
			firstWeek.push(createDateObject(i, true, false, shownMonth, shownYear, prevMonth, nextMonth));
		}
	}
	for (let j = 1; j <= 7 - numDaysFromLastMonthToShowThisMonth; j++) {
		firstWeek.push(createDateObject(j, false, false, shownMonth, shownYear, prevMonth, nextMonth));
	}
	dates.push(firstWeek);

	// remaining weeks
	let nextMonthDay = 1;
	let firstDateOfWeek = 7 - numDaysFromLastMonthToShowThisMonth + 1;
	for (let i = 1; i < Math.ceil((numDaysFromLastMonthToShowThisMonth + numDays) / 7); i++) {
		const week = [];
		for (let j = firstDateOfWeek; j < firstDateOfWeek + 7; j++) {
			let day;
			if (j >= (numDays + 1)) {
				day = createDateObject(nextMonthDay, false, true, shownMonth, shownYear, prevMonth, nextMonth);
				nextMonthDay++;
			} else {
				day = createDateObject(j, false, false, shownMonth, shownYear, prevMonth, nextMonth);
			}
			week.push(day);
		}
		firstDateOfWeek = firstDateOfWeek + 7;
		dates.push(week);
	}

	return dates;
}

function getNumberOfDaysInMonth(month, year) {
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

class Calendar extends LocalizeStaticMixin(LitElement) {

	static get properties() {
		return {
			selectedValue: { type: String, attribute: 'selected-value' },
			summary: { type: String },
			_focusDate: { type: Date },
			_shownMonth: { type: Number }
		};
	}

	static get styles() {
		return [calendarStyles, heading4Styles];
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

		this._descriptor = getDateTimeDescriptor();
		const weekdays = this._descriptor.calendar.days.long;
		const weekdaysShort = this._descriptor.calendar.days.short;

		this._arrangedWeekdays = [];
		for (let i = this._descriptor.calendar.firstDayOfWeek; i < this._descriptor.calendar.firstDayOfWeek + 7; i++) {
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

		this.selectedValue = this.selectedValue ? new Date(this.selectedValue) : new Date();

		this._focusDate = new Date(this.selectedValue.getFullYear(), this.selectedValue.getMonth(), this.selectedValue.getDate());
		this._shownMonth = this.selectedValue.getMonth();
		this._shownYear = this.selectedValue.getFullYear();
		this._today = new Date();

		this._setPrevNextMonth();
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === '_shownMonth') {
				this._onMonthChange();
				this._getNodeAndAddFocus(this._keyboardTriggeredMonthChange);
				this._keyboardTriggeredMonthChange = false;
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

		const dates = generateDaysInMonth(this._shownMonth, this._shownYear, this._prevMonth, this._nextMonth, this._descriptor.calendar.firstDayOfWeek);
		const dayRows = dates.map((week) => {
			const weekHtml = week.map((day) => {
				const classes = {
					'd2l-calendar-date': true,
					'd2l-calendar-date-other-month': day.otherMonth,
					'd2l-calendar-date-selected': checkIfDatesEqual(day.month, day.date, day.year, this.selectedValue),
					'd2l-calendar-date-today': checkIfDatesEqual(day.month, day.date, day.year, this._today)
				};
				const focused = checkIfDatesEqual(day.month, day.date, day.year, this._focusDate);
				return html`
					<td>
						<div
							@click="${this._onDateSelected}"
							@keydown="${this._onKeyDown}"
							class=${classMap(classes)}
							data-date=${day.date}
							data-month=${day.month}
							data-year=${day.year}
							tabindex=${focused ? '0' : '-1'}>
							${day.date}
						</div>
					</td>`;
			});

			return html`
				<tr>${weekHtml}</tr>
			`;
		});
		const heading = `${this._descriptor.calendar.months.long[this._shownMonth]} ${this._shownYear}`;
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
		this._focusDate.setDate(this._focusDate.getDate() + numDays);

		this._keyboardTriggeredMonthChange = true;
		if (this._focusDate.getFullYear() < this._shownYear || this._focusDate.getMonth() < this._shownMonth) {
			this._showPrevMonth();
		} else if (this._focusDate.getMonth() > this._shownMonth || (this._shownMonth === 11 && this._focusDate.getMonth() === 0)) {
			this._showNextMonth();
		} else {
			this._getNodeAndAddFocus(this._keyboardTriggeredMonthChange);
			this._keyboardTriggeredMonthChange = false;
		}
	}

	_computeText(month) {
		return this.localize('show', {month: this._descriptor.calendar.months.long[month]});
	}

	_getCalendarDateByDate(date) {
		return this.shadowRoot.querySelector(`div[data-date="${date.getDate()}"][data-month="${date.getMonth()}"][data-year="${date.getFullYear()}"]`);
	}

	_getNodeAndAddFocus(keyboardTriggeredFocus) {
		const node = this._getCalendarDateByDate(this._focusDate);
		if (node) {
			node.setAttribute('tabindex', '0');
			if (keyboardTriggeredFocus) {
				node.focus();
			}
		}
	}

	_getNodeAndRemoveFocus() {
		const node = this._getCalendarDateByDate(this._focusDate);
		if (node) {
			node.setAttribute('tabindex', '-1');
		}
	}

	_onDateSelected(e) {
		this._getNodeAndRemoveFocus();
		const selectedDate = e.composedPath()[0];
		const year = selectedDate.getAttribute('data-year');
		const month = selectedDate.getAttribute('data-month');
		const date = selectedDate.getAttribute('data-date');
		this.selectedValue = new Date(year, month, date);
		this._focusDate = new Date(this.selectedValue.getFullYear(), this.selectedValue.getMonth(), this.selectedValue.getDate());

		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: { date: `${year}-${parseInt(month) + 1}-${date}` }
		};
		this.dispatchEvent(new CustomEvent('d2l-calendar-selected', eventDetails));
	}

	_onKeyDown(e) {
		const rootTarget = e.composedPath()[0];
		if (!rootTarget.classList.contains('d2l-calendar-date')) return;

		let preventDefault = false;

		switch (e.keyCode) {
			case keyCodes.ENTER:
			case keyCodes.SPACE:
				preventDefault = true;
				this._onDateSelected(e);
				break;
			case keyCodes.DOWN:
				this._changeFocusDate(7);
				preventDefault = true;
				break;
			case keyCodes.UP:
				this._changeFocusDate(-7);
				preventDefault = true;
				break;
			case keyCodes.LEFT:
				if (getComputedStyle(this).direction === 'rtl') {
					this._changeFocusDate(1);
				} else {
					this._changeFocusDate(-1);
				}
				break;
			case keyCodes.RIGHT:
				if (getComputedStyle(this).direction === 'rtl') {
					this._changeFocusDate(-1);
				} else {
					this._changeFocusDate(1);
				}
				break;
			case keyCodes.HOME: {
				const dayOfTheWeek = this._focusDate.getDay();
				let diff;
				if (getComputedStyle(this).direction === 'rtl') {
					diff = 6 - dayOfTheWeek + this._descriptor.calendar.firstDayOfWeek;
					if (diff > 6) {
						diff -= 7;
					}
				} else {
					diff = dayOfTheWeek - this._descriptor.calendar.firstDayOfWeek;
					if (diff < 0) {
						diff += 7;
					}
					diff *= -1;
				}
				this._changeFocusDate(diff);
				preventDefault = true;
				break;
			} case keyCodes.END: {
				const dayOfTheWeek = this._focusDate.getDay();
				let diff;
				if (getComputedStyle(this).direction === 'rtl') {
					diff = dayOfTheWeek - this._descriptor.calendar.firstDayOfWeek;
					if (diff < 0) {
						diff += 7;
					}
					diff *= -1;
				} else {
					diff = 6 - dayOfTheWeek + this._descriptor.calendar.firstDayOfWeek;
					if (diff > 6) {
						diff -= 7;
					}
				}
				this._changeFocusDate(diff);
				preventDefault = true;
				break;
			} case keyCodes.PAGEUP: {
				if (e.shiftKey) {
					// Changes the grid of dates to the previous Year.
					// Sets focus on the same day of the same week. If that day does not exist, then moves focus to the same day of the previous or next week.
				}
				// Sets focus on the same day of the same week. If that day does not exist, then moves focus to the same day of the previous or next week.
				break;
			} case keyCodes.PAGEDOWN: {
				if (e.shiftKey) {
					// Changes the grid of dates to the next Year.
					// Sets focus on the same day of the same week. If that day does not exist, then moves focus to the same day of the previous or next week.
				}
				// Sets focus on the same day of the same week. If that day does not exist, then moves focus to the same day of the previous or next week.
				break;
			}
		}

		if (preventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	_onMonthChange() {
		const numDaysInMonth = getNumberOfDaysInMonth(this._shownMonth, this._shownYear);
		let date = this._focusDate.getDate();
		if (date > (numDaysInMonth - 1)) date = numDaysInMonth;
		this._focusDate = new Date(this._shownYear, this._shownMonth, date);
	}

	_setPrevNextMonth() {
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
		this._getNodeAndRemoveFocus();
		if (this._shownMonth === 11) {
			this._shownYear++;
		}
		this._shownMonth = this._nextMonth;
		this._setPrevNextMonth();
	}

	_showPrevMonth() {
		this._getNodeAndRemoveFocus();
		if (this._shownMonth === 0) {
			this._shownYear--;
		}
		this._shownMonth = this._prevMonth;
		this._setPrevNextMonth();
	}

}
customElements.define('d2l-calendar', Calendar);
