import '../button/button-icon.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { calendarStyles } from './calendar-styles.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getDateTimeDescriptor } from '@brightspace-ui/intl/lib/dateTime.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { heading4Styles } from '../typography/styles.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';

const daysInWeek = 7;
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

function checkIfDatesEqual(date1, date2) {
	date1.setHours(0, 0, 0, 0);
	date2.setHours(0, 0, 0, 0);
	return date1.getTime() === date2.getTime();
}

function getDatesInMonthArray(shownMonth, shownYear, firstDayOfWeek) {
	if (shownMonth === undefined || !shownYear) return [];

	const dates = [];
	const numDays = getNumberOfDaysInMonth(shownMonth, shownYear);

	// populate first week of month
	const firstWeek = [];
	const numDaysFromPrevMonthToShow = getNumberOfDaysFromPrevMonthToShow(shownMonth, shownYear, firstDayOfWeek);

	if (numDaysFromPrevMonthToShow > 0) {
		const prevMonth = getPrevMonth(shownMonth);
		const prevMonthYear = (shownMonth === 0) ? (shownYear - 1) : shownYear;
		const numDaysLastMonth = getNumberOfDaysInMonth(prevMonth, shownYear);
		for (let i = numDaysLastMonth - numDaysFromPrevMonthToShow + 1; i <= numDaysLastMonth; i++) {
			firstWeek.push(new Date(prevMonthYear, prevMonth, i));
		}
	}
	for (let j = 1; j <= daysInWeek - numDaysFromPrevMonthToShow; j++) {
		firstWeek.push(new Date(shownYear, shownMonth, j));
	}
	dates.push(firstWeek);

	// remaining weeks
	let nextMonthDay = 1;
	let firstDateOfWeek = daysInWeek - numDaysFromPrevMonthToShow + 1;
	const numWeeks = Math.ceil((numDaysFromPrevMonthToShow + numDays) / daysInWeek);
	const nextMonth =  getNextMonth(shownMonth);
	const nextMonthYear = (shownMonth === 11) ? (shownYear + 1) : shownYear;
	for (let i = 1; i < numWeeks; i++) {
		const week = [];
		for (let j = firstDateOfWeek; j < firstDateOfWeek + daysInWeek; j++) {
			let day;
			if (j > numDays) {
				day = new Date(nextMonthYear, nextMonth, nextMonthDay);
				nextMonthDay++;
			} else {
				day = new Date(shownYear, shownMonth, j);
			}
			week.push(day);
		}
		firstDateOfWeek = firstDateOfWeek + daysInWeek;
		dates.push(week);
	}

	return dates;
}

function getNextMonth(month) {
	return (month === 11) ? 0 : (month + 1);
}

function getNumberOfDaysFromPrevMonthToShow(month, year, firstDayOfWeek) {
	const firstDayOfMonth = new Date(year, month, 1).getDay();
	let numDaysFromLastMonthToShowThisMonth = 0;
	if (firstDayOfMonth !== firstDayOfWeek) {
		numDaysFromLastMonthToShowThisMonth = firstDayOfMonth - firstDayOfWeek;
		if (numDaysFromLastMonthToShowThisMonth < 0) {
			numDaysFromLastMonthToShowThisMonth += daysInWeek;
		}
	}
	return numDaysFromLastMonthToShowThisMonth;
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

function getNumberOfDaysToSameWeekPrevMonth(month, year, firstDayOfWeek) {
	const prevMonth = getPrevMonth(month);
	const prevMonthYear = prevMonth === 11 ? year - 1 : year;
	const numDaysPrevMonth = getNumberOfDaysInMonth(prevMonth, prevMonthYear);
	const numDaysFromPrevPrevMonthToShowPrevMonth = getNumberOfDaysFromPrevMonthToShow(prevMonth, prevMonthYear, firstDayOfWeek);
	const numWeeksPrevMonth = Math.ceil((numDaysFromPrevPrevMonthToShowPrevMonth + numDaysPrevMonth) / 7);

	const firstDayOfMonth = new Date(year, month, 1).getDay();
	const hasDaysFromPrevMonth = (firstDayOfMonth !== firstDayOfWeek);
	return daysInWeek * (numWeeksPrevMonth - ((hasDaysFromPrevMonth) ? 1 : 0));
}

function getPrevMonth(month) {
	return (month === 0) ? 11 : (month - 1);
}

class Calendar extends LocalizeStaticMixin(LitElement) {

	static get properties() {
		return {
			selectedValue: { type: String, attribute: 'selected-value' },
			summary: { type: String },
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

		this._daysOfWeekIndex = [];
		for (let i = this._descriptor.calendar.firstDayOfWeek; i < this._descriptor.calendar.firstDayOfWeek + daysInWeek; i++) {
			this._daysOfWeekIndex.push(i % daysInWeek);
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
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === '_shownMonth') {
				this._focusDateRemoveFocus();
				const numDaysInMonth = getNumberOfDaysInMonth(this._shownMonth, this._shownYear);
				if (this._focusDate.getDate() > (numDaysInMonth - 1)) this._focusDate.setDate(numDaysInMonth);
				this._focusDate.setMonth(this._shownMonth);
				this._focusDate.setFullYear(this._shownYear);
				this._focusDateAddFocus();
			}
		});
	}

	render() {
		const weekdayHeaders = this._daysOfWeekIndex.map((index) => html`
			<th role="columnheader" abbr="${this._descriptor.calendar.days.long[index]}">
				<abbr title="${this._descriptor.calendar.days.long[index]}">
					${this._descriptor.calendar.days.short[index]}
				</abbr>
			</th>
		`);

		const dates = getDatesInMonthArray(this._shownMonth, this._shownYear, this._descriptor.calendar.firstDayOfWeek);
		const dayRows = dates.map((week) => {
			const weekHtml = week.map((day) => {
				const classes = {
					'd2l-calendar-date': true,
					'd2l-calendar-date-other-month': day.getMonth() !== this._shownMonth,
					'd2l-calendar-date-selected': checkIfDatesEqual(day, this.selectedValue),
					'd2l-calendar-date-today': checkIfDatesEqual(day, this._today)
				};
				const focused = checkIfDatesEqual(day, this._focusDate);
				return html`
					<td>
						<div
							@click="${this._onDateSelected}"
							@keydown="${this._onKeyDown}"
							class=${classMap(classes)}
							data-date=${day.getDate()}
							data-month=${day.getMonth()}
							data-year=${day.getFullYear()}
							tabindex=${focused ? '0' : '-1'}>
							${day.getDate()}
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
								<d2l-button-icon
									@click="${this._showPrevMonth}"
									text="${this._computeText(getPrevMonth(this._shownMonth))}"
									icon="tier1:chevron-left">
								</d2l-button-icon>
							</td>
							<th colspan="5">
								<h2 class="d2l-heading-4" aria-live="polite" id="${this._dialogLabelId}">${heading}</h2>
							</th>
							<td>
								<d2l-button-icon
									@click="${this._showNextMonth}"
									text="${this._computeText(getNextMonth(this._shownMonth))}"
									icon="tier1:chevron-right">
								</d2l-button-icon>
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

	_computeText(month) {
		return this.localize('show', {month: this._descriptor.calendar.months.long[month]});
	}

	_focusDateAddFocus() {
		const date = this._getFocusDateElement();
		if (date) {
			date.setAttribute('tabindex', '0');
			if (this._keyboardTriggeredMonthChange) {
				date.focus();
				this._keyboardTriggeredMonthChange = false;
			}
		}
	}

	_focusDateRemoveFocus() {
		const date = this._getFocusDateElement();
		if (date) {
			date.setAttribute('tabindex', '-1');
		}
	}

	_getFocusDateElement() {
		return this.shadowRoot.querySelector(`div[data-date="${this._focusDate.getDate()}"][data-month="${this._focusDate.getMonth()}"][data-year="${this._focusDate.getFullYear()}"]`);
	}

	_onDateSelected(e) {
		this._focusDateRemoveFocus();
		const selectedDate = e.composedPath()[0];
		const year = selectedDate.getAttribute('data-year');
		const month = selectedDate.getAttribute('data-month');
		const date = selectedDate.getAttribute('data-date');
		this.selectedValue = new Date(year, month, date);
		this._focusDate = new Date(year, month, date);

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
				this._updateFocusDate(daysInWeek);
				preventDefault = true;
				break;
			case keyCodes.UP:
				this._updateFocusDate(-daysInWeek);
				preventDefault = true;
				break;
			case keyCodes.LEFT:
				if (getComputedStyle(this).direction === 'rtl') {
					this._updateFocusDate(1);
				} else {
					this._updateFocusDate(-1);
				}
				break;
			case keyCodes.RIGHT:
				if (getComputedStyle(this).direction === 'rtl') {
					this._updateFocusDate(-1);
				} else {
					this._updateFocusDate(1);
				}
				break;
			case keyCodes.HOME: {
				const dayOfTheWeek = this._focusDate.getDay();
				let diff;
				if (getComputedStyle(this).direction === 'rtl') {
					diff = 6 - dayOfTheWeek + this._descriptor.calendar.firstDayOfWeek;
					if (diff > 6) {
						diff -= daysInWeek;
					}
				} else {
					diff = dayOfTheWeek - this._descriptor.calendar.firstDayOfWeek;
					if (diff < 0) {
						diff += daysInWeek;
					}
					diff *= -1;
				}
				this._updateFocusDate(diff);
				preventDefault = true;
				break;
			} case keyCodes.END: {
				const dayOfTheWeek = this._focusDate.getDay();
				let diff;
				if (getComputedStyle(this).direction === 'rtl') {
					diff = dayOfTheWeek - this._descriptor.calendar.firstDayOfWeek;
					if (diff < 0) {
						diff += daysInWeek;
					}
					diff *= -1;
				} else {
					diff = 6 - dayOfTheWeek + this._descriptor.calendar.firstDayOfWeek;
					if (diff > 6) {
						diff -= daysInWeek;
					}
				}
				this._updateFocusDate(diff);
				preventDefault = true;
				break;
			} case keyCodes.PAGEUP: {
				if (e.shiftKey) {
					// Changes the grid of dates to the previous Year.
					// Sets focus on the same day of the same week. If that day does not exist, then moves focus to the same day of the previous or next week.
				}
				let diff = getNumberOfDaysToSameWeekPrevMonth(this._shownMonth, this._shownYear, this._descriptor.calendar.firstDayOfWeek);
				const numDaysLastMonth = getNumberOfDaysInMonth(getPrevMonth(this._shownMonth), this._shownYear);
				if (diff >= (numDaysLastMonth + this._focusDate.getDate())) diff -= daysInWeek;
				else if ((this._focusDate.getDate() - diff) > 0) diff += daysInWeek;

				this._updateFocusDate(-diff);
				preventDefault = true;
				break;
			} case keyCodes.PAGEDOWN: {
				if (e.shiftKey) {
					// Changes the grid of dates to the next Year.
					// Sets focus on the same day of the same week. If that day does not exist, then moves focus to the same day of the previous or next week.
				}
				const nextMonth = getNextMonth(this._shownMonth);
				let diff = getNumberOfDaysToSameWeekPrevMonth(nextMonth, this._shownYear, this._descriptor.calendar.firstDayOfWeek);
				const numDaysThisMonth = getNumberOfDaysInMonth(this._shownMonth, this._shownYear);
				const numDaysNextMonth = getNumberOfDaysInMonth(nextMonth, this._shownYear);
				if ((this._focusDate.getDate() + diff - numDaysThisMonth) > numDaysNextMonth) diff -= daysInWeek;
				else if ((this._focusDate.getDate() + diff) <= numDaysThisMonth) diff += daysInWeek;

				this._updateFocusDate(diff);
				preventDefault = true;
				break;
			}
		}

		if (preventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	_showNextMonth() {
		this._focusDateRemoveFocus();
		if (this._shownMonth === 11) this._shownYear++;
		this._shownMonth = getNextMonth(this._shownMonth);
	}

	_showPrevMonth() {
		this._focusDateRemoveFocus();
		if (this._shownMonth === 0) this._shownYear--;
		this._shownMonth = getPrevMonth(this._shownMonth);
	}

	_updateFocusDate(numDays) {
		this._focusDateRemoveFocus();
		this._focusDate.setDate(this._focusDate.getDate() + numDays);

		this._keyboardTriggeredMonthChange = true;
		if (this._focusDate.getFullYear() < this._shownYear || (this._focusDate.getMonth() < this._shownMonth && this._shownYear === this._focusDate.getFullYear())) {
			this._showPrevMonth();
		} else if (this._focusDate.getMonth() > this._shownMonth || (this._shownMonth === 11 && this._focusDate.getMonth() === 0)) {
			this._showNextMonth();
		} else {
			this._focusDateAddFocus();
		}
	}

}
customElements.define('d2l-calendar', Calendar);
