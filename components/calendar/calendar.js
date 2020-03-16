import '../button/button-icon.js';
import '../colors/colors.js';
import { bodySmallStyles, heading4Styles } from '../typography/styles.js';
import { convertUTCToLocalDateTime, formatDate, getDateTimeDescriptor } from '@brightspace-ui/intl/lib/dateTime.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
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

let calendarData;
function getCalendarData() {
	if (!calendarData) {
		calendarData = {};
		calendarData.descriptor = getDateTimeDescriptor();
		calendarData.firstDayOfWeek = calendarData.descriptor.calendar.firstDayOfWeek;
		calendarData.daysOfWeekIndex = [];
		for (let i = calendarData.firstDayOfWeek; i < calendarData.firstDayOfWeek + daysInWeek; i++) {
			calendarData.daysOfWeekIndex.push(i % daysInWeek);
		}
	}
	return calendarData;
}

export function checkIfDatesEqual(date1, date2) {
	if (!date1 || !date2) return false;
	return date1.getTime() === date2.getTime();
}

export function formatDateInISO(year, month, date) {
	month = parseInt(month) + 1;
	if (month < 10) month = `0${month}`;
	if (date < 10) date = `0${date}`;
	return `${year}-${month}-${date}`;
}

export function getDatesInMonthArray(shownMonth, shownYear) {
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

export function getNextMonth(month) {
	return (month === 11) ? 0 : (month + 1);
}

export function getNumberOfDaysFromPrevMonthToShow(month, year) {
	const firstDayOfMonth = new Date(year, month, 1).getDay();
	let numDaysFromLastMonthToShowThisMonth = 0;
	if (firstDayOfMonth !== calendarData.firstDayOfWeek) {
		numDaysFromLastMonthToShowThisMonth = firstDayOfMonth - calendarData.firstDayOfWeek;
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
	const hasDaysFromPrevMonth = (firstDayOfMonth !== calendarData.firstDayOfWeek);
	return daysInWeek * (numWeeksPrevMonth - ((hasDaysFromPrevMonth) ? 1 : 0));
}

export function getPrevMonth(month) {
	return (month === 0) ? 11 : (month - 1);
}

export function getToday() {
	const val = new Date().toISOString();
	const re = /([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})/;
	const match = val.match(re);
	const dateTime = {
		year: parseInt(match[1]),
		month: parseInt(match[2]),
		date: parseInt(match[3]),
		hours: parseInt(match[4]),
		minutes: parseInt(match[5]),
		seconds: parseInt(match[6])
	};

	const valInLocalDateTime = convertUTCToLocalDateTime(dateTime);
	return new Date(valInLocalDateTime.year, valInLocalDateTime.month - 1, valInLocalDateTime.date);
}

export function parseISODate(val) {
	if (!val) return null;
	const re = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;
	const match = val.match(re);
	if (!match || match.length !== 4) {
		throw new Error('Invalid selected-value date input: Expected format is YYYY-MM-DD');
	}

	return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
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
		return [bodySmallStyles, heading4Styles, css`
			:host {
				display: block;
				min-width: 16rem;
			}

			table {
				border-collapse: collapse;
				border-spacing: 0;
				table-layout: fixed;
				width: 100%;
			}

			th[role="columnheader"] {
				border-bottom: 1px solid var(--d2l-color-gypsum);
				padding-bottom: 0.6rem;
				padding-top: 0.3rem;
				text-align: center;
			}

			abbr {
				text-decoration: none;
			}

			tbody > tr:first-child div {
				margin-top: 0.3rem;
			}

			.d2l-calendar {
				border-radius: 4px;
			}

			.d2l-calendar-title {
				align-items: center;
				display: flex;
				justify-content: space-between;
			}

			.d2l-calendar-title .d2l-heading-4 {
				height: 100%;
				margin: 0;
			}

			.d2l-calendar-date {
				align-items: center;
				border: 2px solid transparent;
				border-radius: 0.3rem;
				color: var(--d2l-color-ferrite);
				cursor: pointer;
				display: flex;
				font-size: 0.8rem;
				height: 2rem;
				justify-content: center;
				margin-left: auto;
				margin-right: auto;
				position: relative;
				text-align: center;
				width: 2rem;
			}

			.d2l-calendar-date:hover:not(.d2l-calendar-date-selected),
			.d2l-calendar-date.d2l-calendar-date-hover:not(.d2l-calendar-date-selected) {
				background-color: var(--d2l-color-gypsum);
			}

			.d2l-calendar-date:focus {
				border: 2px solid var(--d2l-color-celestine);
				outline: none;
			}

			.d2l-calendar-date-selected {
				background-color: var(--d2l-color-celestine-plus-2);
				border: 1px solid var(--d2l-color-celestine);
			}

			.d2l-calendar-date-today,
			.d2l-calendar-date-selected {
				font-size: 1rem;
				font-weight: 700;
			}
		`];
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
		getCalendarData();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._today = getToday();
		const date = this.selectedValue ? parseISODate(this.selectedValue) : this._today;
		this._focusDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			this.selectedValue ? date.getDate() : 1
		);
		this._shownMonth = date.getMonth();
		this._shownYear = date.getFullYear();

		this.addEventListener('d2l-localize-behavior-language-changed', () => {
			calendarData = null;
			getCalendarData();
			this.requestUpdate();
		});
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === '_shownMonth') {
				this._focusDateAddFocus();
			} else if (prop === 'selectedValue') {
				this._updateFocusDate();
			}
		});
	}

	render() {
		if (this._shownMonth === undefined || !this._shownYear) {
			return html``;
		}

		const weekdayHeaders = calendarData.daysOfWeekIndex.map((index) => html`
			<th scope="col" role="columnheader" abbr="${calendarData.descriptor.calendar.days.long[index]}" id="${this._labelId}-weekday-${index}">
				<abbr class="d2l-body-small" title="${calendarData.descriptor.calendar.days.long[index]}">
					${calendarData.descriptor.calendar.days.short[index]}
				</abbr>
			</th>
		`);

		const dates = getDatesInMonthArray(this._shownMonth, this._shownYear);
		const dayRows = dates.map((week) => {
			const weekHtml = week.map((day, index) => {
				const focused = checkIfDatesEqual(day, this._focusDate);
				const selected = this.selectedValue ? checkIfDatesEqual(day, parseISODate(this.selectedValue)) : false;
				const classes = {
					'd2l-calendar-date': true,
					'd2l-calendar-date-selected': selected,
					'd2l-calendar-date-today': checkIfDatesEqual(day, this._today)
				};
				const year = day.getFullYear();
				const month = day.getMonth();
				const date = day.getDate();
				return html`
					<td>
						<div
							aria-label="${formatDate(day, {format: 'full'})}"
							aria-selected="${selected}"
							@click="${this._onDateSelected}"
							@keydown="${this._onKeyDown}"
							class=${classMap(classes)}
							data-date=${date}
							data-month=${month}
							data-year=${year}
							headers="${this._labelId}-weekday-${index}"
							id="${this._labelId}-${year}-${month}-${date}"
							role="gridcell"
							tabindex=${focused ? '0' : '-1'}>
							${date}
						</div>
					</td>`;
			});

			return html`<tr role="row">${weekHtml}</tr>`;
		});
		const heading = `${calendarData.descriptor.calendar.months.long[this._shownMonth]} ${this._shownYear}`;
		const active = `${this._labelId}-${this._focusDate.getFullYear()}-${this._focusDate.getMonth()}-${this._focusDate.getDate()}`;
		return html`
			<div aria-labelledby="${this._labelId}" class="d2l-calendar">
				<div class="d2l-calendar-title">
					<d2l-button-icon
						@click="${this._onPrevMonthButtonClick}"
						text="${this._computeText(getPrevMonth(this._shownMonth))}"
						icon="tier1:chevron-left">
					</d2l-button-icon>
					<h2 class="d2l-heading-4" aria-live="polite" id="${this._labelId}" aria-atomic="true">${heading}</h2>
					<d2l-button-icon
						@click="${this._onNextMonthButtonClick}"
						text="${this._computeText(getNextMonth(this._shownMonth))}"
						icon="tier1:chevron-right">
					</d2l-button-icon>
				</div>
				<table aria-labelledby="${this._labelId}" summary="${ifDefined(this.summary)}" role="grid" aria-activedescendant="${active}">
					<thead role="presentation" aria-hidden="false">
						<tr role="row">${weekdayHeaders}</tr>
					</thead>
					<tbody role="presentation">
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
		return this.localize('show', {month: calendarData.descriptor.calendar.months.long[month]});
	}

	async _focusDateAddFocus() {
		const date = await this._getDateElement(this._focusDate);
		if (date && this._keyboardTriggeredMonthChange) {
			date.focus();
			this._keyboardTriggeredMonthChange = false;
		}
	}

	async _getDateElement(date) {
		await this.updateComplete;
		return this.shadowRoot.querySelector(`div[data-date="${date.getDate()}"][data-month="${date.getMonth()}"][data-year="${date.getFullYear()}"]`);
	}

	_onDateSelected(e) {
		const selectedDate = e.composedPath()[0];
		const year = selectedDate.getAttribute('data-year');
		const month = selectedDate.getAttribute('data-month');
		const date = selectedDate.getAttribute('data-date');

		this.selectedValue = formatDateInISO(year, month, date);

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
					numDaysChange = 6 - dayOfTheWeek + calendarData.firstDayOfWeek;
					if (numDaysChange > 6) {
						numDaysChange -= daysInWeek;
					}
				} else {
					numDaysChange = dayOfTheWeek - calendarData.firstDayOfWeek;
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
					numDaysChange = dayOfTheWeek - calendarData.firstDayOfWeek;
					if (numDaysChange < 0) {
						numDaysChange += daysInWeek;
					}
					numDaysChange *= -1;
				} else {
					numDaysChange = 6 - dayOfTheWeek + calendarData.firstDayOfWeek;
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
				if (this._focusDate.getMonth() === this._shownMonth) this._focusDate.setDate(this._focusDate.getDate() - 7);

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
		this._updateFocusDate();
	}

	_onPrevMonthButtonClick() {
		this._updateShownMonthDecrease();
		this._updateFocusDate();
	}

	async _updateFocusDate() {
		const selectedValueDate = this.selectedValue ? parseISODate(this.selectedValue) : null;
		const dateElem = selectedValueDate ? await this._getDateElement(selectedValueDate) : null;
		if (dateElem) {
			this._focusDate = new Date(selectedValueDate.getFullYear(), selectedValueDate.getMonth(), selectedValueDate.getDate());
		} else {
			this._focusDate = new Date(this._shownYear, this._shownMonth, 1);
		}
	}

	async _updateFocusDateOnKeyDown(numDays) {
		const oldFocusDate = new Date(this._focusDate);
		this._focusDate = new Date(
			this._focusDate.getFullYear(),
			this._focusDate.getMonth(),
			this._focusDate.getDate() + numDays
		);
		this._keyboardTriggeredMonthChange = true;
		const date = await this._getDateElement(this._focusDate);
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
