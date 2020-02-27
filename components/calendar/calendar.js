import '../button/button-icon.js';
import { bodySmallStyles, heading4Styles } from '../typography/styles.js';
import { convertLocalToUTCDateTime, convertUTCToLocalDateTime, getDateTimeDescriptor } from '@brightspace-ui/intl/lib/dateTime.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { calendarStyles } from './calendar-styles.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';

const daysInWeek = 7;
const defaultHour = 12;
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

const descriptor = getDateTimeDescriptor();
const firstDayOfWeek = descriptor.calendar.firstDayOfWeek;
const daysOfWeekIndex = [];
for (let i = firstDayOfWeek; i < firstDayOfWeek + daysInWeek; i++) {
	daysOfWeekIndex.push(i % daysInWeek);
}

export function checkIfDatesEqual(date1, date2) {
	if (!date1 || !date2) return false;
	return date1.getTime() === date2.getTime();
}

export function getDatesInMonthArray(shownMonth, shownYear) {
	// checking for undefined because month can be 0
	if (shownMonth === undefined || !shownYear) return [];

	const dates = [];
	const numDays = getNumberOfDaysInMonth(shownMonth, shownYear);

	// populate first week of month
	const firstWeek = [];
	const numDaysFromPrevMonthToShow = getNumberOfDaysFromPrevMonthToShow(shownMonth, shownYear);

	if (numDaysFromPrevMonthToShow > 0) {
		const prevMonth = getPrevMonth(shownMonth);
		const prevMonthYear = (shownMonth === 0) ? (shownYear - 1) : shownYear;
		const numDaysLastMonth = getNumberOfDaysInMonth(prevMonth, prevMonthYear);
		for (let i = numDaysLastMonth - numDaysFromPrevMonthToShow + 1; i <= numDaysLastMonth; i++) {
			firstWeek.push(new Date(prevMonthYear, prevMonth, i, defaultHour, 0, 0));
		}
	}
	for (let j = 1; j <= daysInWeek - numDaysFromPrevMonthToShow; j++) {
		firstWeek.push(new Date(shownYear, shownMonth, j, defaultHour, 0, 0));
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
				day = new Date(nextMonthYear, nextMonth, nextMonthDay, defaultHour, 0, 0);
				nextMonthDay++;
			} else {
				day = new Date(shownYear, shownMonth, j, defaultHour, 0, 0);
			}
			week.push(day);
		}
		firstDateOfWeek = firstDateOfWeek + daysInWeek;
		dates.push(week);
	}

	return dates;
}

export function getNextMonth(month) {
	return (month === 11) ? 0 : (month + 1);
}

export function getNumberOfDaysFromPrevMonthToShow(month, year) {
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

export function getNumberOfDaysInMonth(month, year) {
	return new Date(year, month + 1, 0).getDate();
}

export function getNumberOfDaysToSameWeekPrevMonth(month, year) {
	const prevMonth = getPrevMonth(month);
	const prevMonthYear = prevMonth === 11 ? year - 1 : year;
	const numDaysPrevMonth = getNumberOfDaysInMonth(prevMonth, prevMonthYear);
	const numDaysFromPrevPrevMonthToShowPrevMonth = getNumberOfDaysFromPrevMonthToShow(prevMonth, prevMonthYear);
	const numWeeksPrevMonth = Math.ceil((numDaysFromPrevPrevMonthToShowPrevMonth + numDaysPrevMonth) / 7);

	const firstDayOfMonth = new Date(year, month, 1).getDay();
	const hasDaysFromPrevMonth = (firstDayOfMonth !== firstDayOfWeek);
	return daysInWeek * (numWeeksPrevMonth - ((hasDaysFromPrevMonth) ? 1 : 0));
}

export function getPrevMonth(month) {
	return (month === 0) ? 11 : (month - 1);
}

export function getToday() {
	const todayInUTC = new Date().toISOString();
	return parseDate(todayInUTC);
}

export function parseDate(val) {
	if (!val) return null;
	const re = /([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})/;
	const match = val.match(re);
	if (!match || match.length !== 7) {
		throw new Error('Invalid selected-value date input: Expected format is YYYY-MM-DDTHH:mm:ss.sssZ');
	}
	const dateTime = {
		year: parseInt(match[1]),
		month: parseInt(match[2]),
		date: parseInt(match[3]),
		hours: parseInt(match[4]),
		minutes: parseInt(match[5]),
		seconds: parseInt(match[6])
	};

	const valInLocalDateTime = convertUTCToLocalDateTime(dateTime);
	return new Date(valInLocalDateTime.year, valInLocalDateTime.month - 1, valInLocalDateTime.date, defaultHour, 0, 0);
}

class Calendar extends LocalizeStaticMixin(LitElement) {

	static get properties() {
		return {
			selectedValue: { type: String, attribute: 'selected-value' },
			summary: { type: String },
			_focusDate: { type: Object },
			_shownMonth: { type: Number }
		};
	}

	static get styles() {
		return [calendarStyles, bodySmallStyles, heading4Styles];
	}

	static get resources() {
		return {
			'ar': { show: '{month} إظهار' },
			'da': { show: 'Vis {month}' },
			'de': { show: '{month} anzeigen' },
			'en': { show: 'Show {month}' },
			'es': { show: 'Mostrar {month}' },
			'fr': { show: 'Afficher {month}' },
			'ja': { show: '{month} の表示' },
			'ko': { show: '{month} 표시' },
			'nl': { show: '{month} tonen' },
			'pt': { show: 'Mostrar {month}' },
			'sv': { show: 'Visa {month}' },
			'tr': { show: '{month} öğesini göster' },
			'zh': { show: '显示 {month}' },
			'zh-tw': { show: '顯示 {month}' }
		};
	}

	constructor() {
		super();

		this._labelId = getUniqueId();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._today = getToday();
		const date = this.selectedValue ? parseDate(this.selectedValue) : this._today;
		const focusDateDate = this.selectedValue ? date.getDate() : 1;
		this._focusDate = new Date(date.getFullYear(), date.getMonth(), focusDateDate, defaultHour, 0, 0);
		this._shownMonth = date.getMonth();
		this._shownYear = date.getFullYear();
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === '_shownMonth') {
				this._focusDateAddFocus();
			}
		});
	}

	render() {
		const weekdayHeaders = daysOfWeekIndex.map((index) => html`
			<th role="columnheader" abbr="${descriptor.calendar.days.long[index]}">
				<abbr class="d2l-body-small" title="${descriptor.calendar.days.long[index]}">
					${descriptor.calendar.days.short[index]}
				</abbr>
			</th>
		`);

		const dates = getDatesInMonthArray(this._shownMonth, this._shownYear);
		const dayRows = dates.map((week) => {
			const weekHtml = week.map((day) => {
				const classes = {
					'd2l-calendar-date': true,
					'd2l-calendar-date-selected': this.selectedValue ? checkIfDatesEqual(day, parseDate(this.selectedValue)) : false,
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

			return html`<tr>${weekHtml}</tr>`;
		});
		const heading = `${descriptor.calendar.months.long[this._shownMonth]} ${this._shownYear}`;
		return html`
			<div aria-labelledby="${this._labelId}" class="d2l-calendar">
				<table summary="${this.summary}" role="grid">
					<thead>
						<tr class="d2l-calendar-title">
							<td>
								<d2l-button-icon
									@click="${this._onPrevMonthButtonClick}"
									text="${this._computeText(getPrevMonth(this._shownMonth))}"
									icon="tier1:chevron-left">
								</d2l-button-icon>
							</td>
							<th colspan="5">
								<h2 class="d2l-heading-4" aria-live="polite" id="${this._labelId}">${heading}</h2>
							</th>
							<td>
								<d2l-button-icon
									@click="${this._onNextMonthButtonClick}"
									text="${this._computeText(getNextMonth(this._shownMonth))}"
									icon="tier1:chevron-right">
								</d2l-button-icon>
							</td>
						</tr>
						<tr>${weekdayHeaders}</tr>
					</thead>
					<tbody>
						${dayRows}
					</tbody>
				</table>
				<slot></slot>
			</div>
		`;
	}

	focus() {
		const firstButton = this.shadowRoot.querySelector('d2l-button-icon');
		if (firstButton) firstButton.focus();
	}

	_computeText(month) {
		return this.localize('show', {month: descriptor.calendar.months.long[month]});
	}

	_focusDateAddFocus() {
		const date = this._getFocusDateElement();
		if (date && this._keyboardTriggeredMonthChange) {
			date.focus();
			this._keyboardTriggeredMonthChange = false;
		}
	}

	_getFocusDateElement() {
		return this.shadowRoot.querySelector(`div[data-date="${this._focusDate.getDate()}"][data-month="${this._focusDate.getMonth()}"][data-year="${this._focusDate.getFullYear()}"]`);
	}

	_onDateSelected(e) {
		const selectedDate = e.composedPath()[0];
		const year = selectedDate.getAttribute('data-year');
		const month = selectedDate.getAttribute('data-month');
		const date = selectedDate.getAttribute('data-date');
		this._focusDate = new Date(year, month, date, defaultHour, 0, 0);

		const localDate = {
			year: parseInt(year),
			month: parseInt(month),
			date: parseInt(date),
			hours: 12,
			minutes: 0,
			seconds: 0
		};
		const dateInUTCDateTime = convertLocalToUTCDateTime(localDate);
		this.selectedValue = (new Date(Date.UTC(
			dateInUTCDateTime.year,
			dateInUTCDateTime.month,
			dateInUTCDateTime.date,
			dateInUTCDateTime.hours,
			dateInUTCDateTime.minutes,
			dateInUTCDateTime.seconds)
		)).toISOString();

		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: { date: this.selectedValue }
		};
		this.dispatchEvent(new CustomEvent('d2l-calendar-selected', eventDetails));
	}

	_onKeyDown(e) {
		const rootTarget = e.composedPath()[0];
		if (!rootTarget.classList.contains('d2l-calendar-date')) return;

		let preventDefault = false;
		let numDaysChange;

		switch (e.keyCode) {
			case keyCodes.ENTER:
			case keyCodes.SPACE:
				preventDefault = true;
				this._onDateSelected(e);
				break;
			case keyCodes.DOWN:
				numDaysChange = daysInWeek;
				preventDefault = true;
				break;
			case keyCodes.UP:
				numDaysChange = -daysInWeek;
				preventDefault = true;
				break;
			case keyCodes.LEFT:
				if (getComputedStyle(this).direction === 'rtl') {
					numDaysChange = 1;
				} else {
					numDaysChange = -1;
				}
				break;
			case keyCodes.RIGHT:
				if (getComputedStyle(this).direction === 'rtl') {
					numDaysChange = -1;
				} else {
					numDaysChange = 1;
				}
				break;
			case keyCodes.HOME: {
				const dayOfTheWeek = this._focusDate.getDay();
				if (getComputedStyle(this).direction === 'rtl') {
					numDaysChange = 6 - dayOfTheWeek + firstDayOfWeek;
					if (numDaysChange > 6) {
						numDaysChange -= daysInWeek;
					}
				} else {
					numDaysChange = dayOfTheWeek - firstDayOfWeek;
					if (numDaysChange < 0) {
						numDaysChange += daysInWeek;
					}
					numDaysChange *= -1;
				}
				preventDefault = true;
				break;
			} case keyCodes.END: {
				const dayOfTheWeek = this._focusDate.getDay();
				if (getComputedStyle(this).direction === 'rtl') {
					numDaysChange = dayOfTheWeek - firstDayOfWeek;
					if (numDaysChange < 0) {
						numDaysChange += daysInWeek;
					}
					numDaysChange *= -1;
				} else {
					numDaysChange = 6 - dayOfTheWeek + firstDayOfWeek;
					if (numDaysChange > 6) {
						numDaysChange -= daysInWeek;
					}
				}
				preventDefault = true;
				break;
			} case keyCodes.PAGEUP: {
				const diff = getNumberOfDaysToSameWeekPrevMonth(this._shownMonth, this._shownYear);

				this._focusDate.setDate(this._focusDate.getDate() - diff);
				this._keyboardTriggeredMonthChange = true;

				// handle when current month has more weeks than previous month and page up pressed from last week
				const newFocusDateMonth = this._focusDate.getMonth();
				if (newFocusDateMonth === this._shownMonth) this._focusDate.setDate(this._focusDate.getDate() - 7);

				this._focusDate = new Date(this._focusDate.getFullYear(), this._focusDate.getMonth(), this._focusDate.getDate(), defaultHour, 0, 0);

				this._updateShownMonthDecrease();
				preventDefault = true;
				break;
			} case keyCodes.PAGEDOWN: {
				const nextMonth = getNextMonth(this._shownMonth);
				const diff = getNumberOfDaysToSameWeekPrevMonth(nextMonth, this._shownYear);

				this._focusDate.setDate(this._focusDate.getDate() + diff);
				this._keyboardTriggeredMonthChange = true;

				// handle when current month has more weeks than next month and page down pressed from last week
				const newFocusDateMonth = this._focusDate.getMonth();
				if ((newFocusDateMonth - this._shownMonth) > 1
					|| (newFocusDateMonth === 1 && this._shownMonth === 11)
				) {
					this._focusDate.setDate(this._focusDate.getDate() - 7);
				}
				this._focusDate = new Date(this._focusDate.getFullYear(), this._focusDate.getMonth(), this._focusDate.getDate(), defaultHour, 0, 0);
				this._updateShownMonthIncrease();
				preventDefault = true;
				break;
			}
		}

		if (numDaysChange) {
			this._updateFocusDateOnKeyDown(numDaysChange);
		}

		if (preventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	_onNextMonthButtonClick() {
		this._updateShownMonthIncrease();
		this._updateFocusDateOnMonthButtonClick();
	}

	_onPrevMonthButtonClick() {
		this._updateShownMonthDecrease();
		this._updateFocusDateOnMonthButtonClick();
	}

	_updateFocusDateOnMonthButtonClick() {
		// if selectedValue is in the month, that should be the focus date,
		// else the 1st of the month should be
		const selectedValueDate = this.selectedValue ? parseDate(this.selectedValue) : null;
		if (selectedValueDate && selectedValueDate.getMonth() === this._shownMonth) {
			this._focusDate = new Date(selectedValueDate.getFullYear(), selectedValueDate.getMonth(), selectedValueDate.getDate(), defaultHour, 0, 0);
		} else {
			this._focusDate = new Date(this._shownYear, this._shownMonth, 1, defaultHour, 0, 0);
		}
	}

	_updateFocusDateOnKeyDown(numDays) {
		const oldFocusDate = new Date(this._focusDate);
		this._focusDate.setDate(this._focusDate.getDate() + numDays);
		this._focusDate = new Date(this._focusDate.getFullYear(), this._focusDate.getMonth(), this._focusDate.getDate(), defaultHour, 0, 0);
		this._keyboardTriggeredMonthChange = true;
		const date = this._getFocusDateElement();
		if (!date) {
			if (oldFocusDate < this._focusDate) {
				this._updateShownMonthIncrease();
			} else {
				this._updateShownMonthDecrease();
			}
		} else {
			this._focusDateAddFocus();
		}
	}

	_updateShownMonthDecrease() {
		if (this._shownMonth === 0) this._shownYear--;
		this._shownMonth = getPrevMonth(this._shownMonth);
	}

	_updateShownMonthIncrease() {
		if (this._shownMonth === 11) this._shownYear++;
		this._shownMonth = getNextMonth(this._shownMonth);
	}

}
customElements.define('d2l-calendar', Calendar);
