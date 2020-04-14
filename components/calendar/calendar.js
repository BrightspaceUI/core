import '../button/button-icon.js';
import '../colors/colors.js';
import { bodySmallStyles, heading4Styles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { formatDateInISO, getDateFromDateObj, getDateFromISODate, getDateTimeDescriptorShared, getToday } from '../../helpers/dateTime.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

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
function getCalendarData(refresh) {
	if (!calendarData) {
		calendarData = {};
		calendarData.descriptor = getDateTimeDescriptorShared(refresh);
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

class Calendar extends LocalizeStaticMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			selectedValue: { type: String, attribute: 'selected-value' },
			summary: { type: String },
			_dialog: { type: Boolean },
			_focusDate: { type: Object },
			_monthNav: { type: String },
			_shownMonth: { type: Number }
		};
	}

	static get styles() {
		return [bodySmallStyles, heading4Styles, css`
			:host {
				display: block;
				min-width: 14rem;
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
				opacity: 0;
			}

			.d2l-calendar-next .d2l-calendar-title .d2l-heading-4 {
				padding-left: 20px;
				padding-right: 0;
			}

			.d2l-calendar-prev .d2l-calendar-title .d2l-heading-4 {
				padding-left: 0;
				padding-right: 20px;
			}

			.d2l-calendar-date div {
				align-items: center;
				background-color: white;
				border-radius: 0.3rem;
				color: var(--d2l-color-ferrite);
				cursor: pointer;
				display: flex;
				font-size: 0.8rem;
				height: calc(2rem - 6px);
				justify-content: center;
				margin-left: auto;
				margin-right: auto;
				opacity: 0;
				padding: 4px;
				position: relative;
				text-align: center;
				width: calc(2rem - 6px);
			}

			.d2l-calendar-next .d2l-calendar-date div {
				left: 10px;
			}

			.d2l-calendar-prev .d2l-calendar-date div {
				left: -10px;
			}

			.d2l-calendar-animating .d2l-calendar-title .d2l-heading-4,
			.d2l-calendar-animating .d2l-calendar-date div {
				opacity: 1;
				transition-duration: 200ms;
				transition-timing-function: ease-out;
				transition-property: opacity, transform;
			}

			.d2l-calendar-next .d2l-heading-4,
			.d2l-calendar-next .d2l-calendar-date div {
				transform: translateX(-10px);
			}

			.d2l-calendar-prev .d2l-heading-4,
			.d2l-calendar-prev .d2l-calendar-date div {
				transform: translateX(10px);
			}

			.d2l-calendar-date div:not(.d2l-calendar-date-selected):hover,
			.d2l-calendar-date div:not(.d2l-calendar-date-selected).d2l-calendar-date-hover {
				background-color: var(--d2l-color-gypsum);
			}

			.d2l-calendar-date:focus div:not(.d2l-calendar-date-selected):hover,
			.d2l-calendar-date:focus div:not(.d2l-calendar-date-selected).d2l-calendar-date-hover {
				box-shadow: 0 0 0 2px var(--d2l-color-gypsum), 0 0 0 4px var(--d2l-color-celestine);
				transition: none;
			}

			.d2l-calendar-date:focus {
				outline: none;
			}

			.d2l-calendar-date:focus div.d2l-calendar-date-inner {
				border-radius: 0.16rem;
				box-shadow: 0 0 0 2px white, 0 0 0 4px var(--d2l-color-celestine);
				padding: 0;
				transition: box-shadow 200ms ease-in;
			}

			.d2l-calendar-date div.d2l-calendar-date-selected {
				background-color: var(--d2l-color-celestine-plus-2);
				border: 1px solid var(--d2l-color-celestine);
				padding: 3px;
			}

			.d2l-calendar-date:focus div.d2l-calendar-date-selected {
				border-width: 0;
				box-shadow: 0 0 0 2px var(--d2l-color-celestine-plus-2), 0 0 0 4px var(--d2l-color-celestine);
			}

			.d2l-calendar-date div.d2l-calendar-date-today,
			.d2l-calendar-date div.d2l-calendar-date-selected {
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

		this._tableInfoId = getUniqueId();
		this._monthNav = 'initial';
		getCalendarData();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._today = getDateFromDateObj(getToday());
		const date = this.selectedValue ? getDateFromISODate(this.selectedValue) : this._today;
		this._focusDate = new Date(date);
		this._shownMonth = date.getMonth();
		this._shownYear = date.getFullYear();

		const dropdownContent = findComposedAncestor(
			this.parentNode,
			(node) => { return (node.tagName === 'D2L-DROPDOWN-CONTENT'); }
		);
		if (dropdownContent) this._dialog = true;

		this.addEventListener('d2l-localize-behavior-language-changed', () => {
			calendarData = null;
			getCalendarData(true);
			this.requestUpdate();
		});
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldVal, prop) => {
			if (prop === '_shownMonth' && this._keyboardTriggeredMonthChange) {
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
			<th
				abbr="${calendarData.descriptor.calendar.days.long[index]}"
				aria-label="${calendarData.descriptor.calendar.days.long[index]}"
				role="columnheader"
				scope="col">
				<abbr class="d2l-body-small" title="${calendarData.descriptor.calendar.days.long[index]}">
					${calendarData.descriptor.calendar.days.short[index]}
				</abbr>
			</th>
		`);

		const dates = getDatesInMonthArray(this._shownMonth, this._shownYear);
		const dayRows = dates.map((week) => {
			const weekHtml = week.map((day) => {
				const focused = checkIfDatesEqual(day, this._focusDate);
				const selected = this.selectedValue ? checkIfDatesEqual(day, getDateFromISODate(this.selectedValue)) : false;
				const classes = {
					'd2l-calendar-date-inner': true,
					'd2l-calendar-date-selected': selected,
					'd2l-calendar-date-today': checkIfDatesEqual(day, this._today)
				};
				const year = day.getFullYear();
				const month = day.getMonth();
				const date = day.getDate();
				return html`
					<td
						aria-label="${formatDate(day, {format: 'medium'})}"
						aria-selected="${selected}"
						class="d2l-calendar-date"
						@click="${this._onDateSelected}"
						data-date=${date}
						data-month=${month}
						data-year=${year}
						id="${this._tableInfoId}-${year}-${month}-${date}"
						@keydown="${this._onKeyDown}"
						role="gridcell"
						tabindex=${focused ? '0' : '-1'}>
						<div class="${classMap(classes)}">${date}</div>
					</td>`;
			});

			return html`<tr>${weekHtml}</tr>`;
		});
		const activeDate = `${this._tableInfoId}-${this._focusDate.getFullYear()}-${this._focusDate.getMonth()}-${this._focusDate.getDate()}`;
		const calendarClasses = {
			'd2l-calendar': true,
			'd2l-calendar-animating': (this._monthNav === 'next' || this._monthNav === 'prev' || this._monthNav === 'initial'),
			'd2l-calendar-initial-month': this._monthNav === 'initial',
			'd2l-calendar-next': this._monthNav === 'next',
			'd2l-calendar-prev': this._monthNav === 'prev'
		};
		const labelId = `${this._tableInfoId}-heading`;
		const labelledBy = this._dialog ? labelId : undefined;
		const heading = `${calendarData.descriptor.calendar.months.long[this._shownMonth]} ${this._shownYear}`;
		const role = this._dialog ? 'dialog' : undefined;
		return html`
			<div aria-labelledby="${ifDefined(labelledBy)}" class="${classMap(calendarClasses)}" role="${ifDefined(role)}">
				<div class="d2l-calendar-title">
					<d2l-button-icon
						@click="${this._onPrevMonthButtonClick}"
						text="${this._computeText(getPrevMonth(this._shownMonth))}"
						icon="tier1:chevron-left">
					</d2l-button-icon>
					<h2 aria-atomic="true" aria-live="polite" class="d2l-heading-4" id="${labelId}">${heading}</h2>
					<d2l-button-icon
						@click="${this._onNextMonthButtonClick}"
						text="${this._computeText(getNextMonth(this._shownMonth))}"
						icon="tier1:chevron-right">
					</d2l-button-icon>
				</div>
				<table
					aria-activedescendant="${activeDate}"
					aria-labelledby="${labelId}"
					aria-readonly="true"
					role="grid"
					summary="${ifDefined(this.summary)}">
					<thead>
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
		if (this._dialog) {
			this._focusDateAddFocus();
		} else {
			const button = this.shadowRoot.querySelector('d2l-button-icon');
			if (button) button.focus();
		}
	}

	_computeText(month) {
		return this.localize('show', {month: calendarData.descriptor.calendar.months.long[month]});
	}

	async _focusDateAddFocus() {
		const date = await this._getDateElement(this._focusDate);
		if (date) {
			date.focus();
			this._keyboardTriggeredMonthChange = false;
		}
	}

	async _getDateElement(date) {
		await this.updateComplete;
		return this.shadowRoot.querySelector(`td[data-date="${date.getDate()}"][data-month="${date.getMonth()}"][data-year="${date.getFullYear()}"]`);
	}

	_onDateSelected(e) {
		let selectedDate = e.composedPath()[0];
		if (selectedDate.tagName === 'DIV') selectedDate = selectedDate.parentNode;
		const year = selectedDate.getAttribute('data-year');
		const month = selectedDate.getAttribute('data-month');
		const date = selectedDate.getAttribute('data-date');

		this.selectedValue = formatDateInISO({year: year, month: (parseInt(month) + 1), date: date});

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
				if (this.dir === 'rtl') {
					numDaysChange = 1;
				} else {
					numDaysChange = -1;
				}
				preventDefault = true; // needed for voiceover in safari to properly read aria-label on dates
				break;
			case keyCodes.RIGHT:
				if (this.dir === 'rtl') {
					numDaysChange = -1;
				} else {
					numDaysChange = 1;
				}
				preventDefault = true; // needed for voiceover in safari to properly read aria-label on dates
				break;
			case keyCodes.HOME: {
				const dayOfTheWeek = this._focusDate.getDay();
				if (this.dir === 'rtl') {
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
				if (this.dir === 'rtl') {
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
		const selectedValueDate = this.selectedValue ? getDateFromISODate(this.selectedValue) : null;
		const dateElem = selectedValueDate ? await this._getDateElement(selectedValueDate) : null;
		if (dateElem) {
			this._focusDate = selectedValueDate;
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
		const date = await this._getDateElement(this._focusDate);
		if (!date) {
			this._keyboardTriggeredMonthChange = true;
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
		this._monthNav = undefined;
		setTimeout(() => {
			this._monthNav = (this.dir !== 'rtl') ? 'prev' : 'next';
		}, 100); // timeout for firefox
	}

	async _updateShownMonthIncrease() {
		if (this._shownMonth === 11) this._shownYear++;
		this._shownMonth = getNextMonth(this._shownMonth);
		this._monthNav = undefined;
		setTimeout(() => {
			this._monthNav = (this.dir !== 'rtl') ? 'next' : 'prev';
		}, 100); // timeout for firefox
	}

}
customElements.define('d2l-calendar', Calendar);
