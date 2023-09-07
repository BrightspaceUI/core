import '../button/button-icon.js';
import '../colors/colors.js';
import { bodySmallStyles, heading4Styles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit';
import { formatDateInISO, getClosestValidDate, getDateFromDateObj, getDateFromISODate, getDateTimeDescriptorShared, getToday, isDateInRange } from '../../helpers/dateTime.js';
import { classMap } from 'lit/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

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
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/**
 * A component can be used to display a responsively sized calendar that allows for date selection.
 * @slot - Content displayed under the calendar (e.g., buttons)
 */
class Calendar extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Unique label text for calendar (necessary if multiple calendars on page)
			 * @type {string}
			 */
			label: { attribute: 'label', reflect: true, type: String },
			/**
			 * Maximum valid date that could be selected by a user
			 * @type {string}
			 */
			maxValue: { attribute: 'max-value', reflect: true, type: String },

			/**
			 * Minimum valid date that could be selected by a user
			 * @type {string}
			 */
			minValue: { attribute: 'min-value', reflect: true, type: String },

			/**
			 * Currently selected date
			 * @type {string}
			 */
			selectedValue: { type: String, attribute: 'selected-value' },

			/**
			 * Summary of the calendar for accessibility
			 * @type {string}
			 */
			summary: { type: String },
			_dialog: { type: Boolean },
			_focusDate: { type: Object },
			_isInitialFocusDate: { type: Boolean },
			_monthNav: { type: String },
			_shownMonth: { type: Number },
			_shownYear: { type: Number }
		};
	}

	static get styles() {
		return [bodySmallStyles, heading4Styles, offscreenStyles, css`
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

			th {
				border-bottom: 1px solid var(--d2l-color-gypsum);
				padding-bottom: 0.6rem;
				padding-top: 0.3rem;
				text-align: center;
			}

			abbr {
				text-decoration: none;
			}

			tbody > tr:first-child button {
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

			.d2l-calendar-next-updown .d2l-calendar-title .d2l-heading-4 {
				padding-bottom: 0;
				padding-top: 20px;
			}

			.d2l-calendar-prev-updown .d2l-calendar-title .d2l-heading-4 {
				padding-bottom: 20px;
				padding-top: 0;
			}

			.d2l-calendar-date {
				align-items: center;
				background-color: white;
				border-radius: 0.3rem;
				border-style: none;
				box-sizing: content-box;
				color: var(--d2l-color-ferrite);
				cursor: pointer;
				display: flex;
				font-family: inherit;
				font-size: 0.8rem;
				height: calc(2rem - 6px);
				justify-content: center;
				letter-spacing: inherit;
				line-height: inherit;
				margin-left: auto;
				margin-right: auto;
				opacity: 0;
				padding: 4px;
				position: relative;
				text-align: center;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
				width: calc(2rem - 6px);
			}

			.d2l-calendar-date::-moz-focus-inner {
				border: 0;
			}

			.d2l-calendar-date:disabled {
				cursor: not-allowed;
			}

			@media (prefers-reduced-motion: reduce) {
				.d2l-calendar-title .d2l-heading-4,
				.d2l-calendar-date {
					opacity: 1;
				}

				.d2l-calendar-date:disabled {
					opacity: 0.5;
				}
			}

			.d2l-calendar-next .d2l-calendar-date {
				left: 10px;
			}

			.d2l-calendar-next-updown .d2l-calendar-date {
				top: 10px;
			}

			.d2l-calendar-prev .d2l-calendar-date {
				left: -10px;
			}

			.d2l-calendar-prev-updown .d2l-calendar-date {
				top: -10px;
			}

			.d2l-calendar-animating .d2l-calendar-title .d2l-heading-4,
			.d2l-calendar-animating .d2l-calendar-date {
				opacity: 1;
				transition-duration: 200ms;
				transition-property: opacity, transform;
				transition-timing-function: ease-out;
			}

			.d2l-calendar-animating .d2l-calendar-date:disabled {
				opacity: 0.5;
			}

			.d2l-calendar-next .d2l-heading-4,
			.d2l-calendar-next .d2l-calendar-date {
				transform: translateX(-10px);
			}

			.d2l-calendar-next-updown .d2l-heading-4,
			.d2l-calendar-next-updown .d2l-calendar-date {
				transform: translateY(-10px);
			}

			.d2l-calendar-prev .d2l-heading-4,
			.d2l-calendar-prev .d2l-calendar-date {
				transform: translateX(10px);
			}

			.d2l-calendar-prev-updown .d2l-heading-4,
			.d2l-calendar-prev-updown .d2l-calendar-date {
				transform: translateY(10px);
			}

			.d2l-calendar-date:enabled:not(.d2l-calendar-date-selected):hover,
			.d2l-calendar-date:enabled:not(.d2l-calendar-date-selected).d2l-calendar-date-hover {
				background-color: var(--d2l-color-gypsum);
			}

			td:focus button:not(.d2l-calendar-date-selected):not(:disabled):hover,
			td:focus button:not(.d2l-calendar-date-selected):not(:disabled).d2l-calendar-date-hover {
				box-shadow: 0 0 0 2px var(--d2l-color-gypsum), 0 0 0 4px var(--d2l-color-celestine);
				transition: none;
			}

			td, .d2l-calendar-date:focus {
				outline: none;
			}

			td:focus .d2l-calendar-date:not(:disabled) {
				border-radius: 0.16rem;
				box-shadow: 0 0 0 2px white, 0 0 0 4px var(--d2l-color-celestine);
				padding: 0;
				transition: none;
			}

			td:focus .d2l-calendar-date.d2l-calendar-date-initial {
				transition: box-shadow 200ms ease-in;
			}

			@media (prefers-reduced-motion: reduce) {
				td:focus .d2l-calendar-date.d2l-calendar-date-initial {
					transition: none;
				}
			}

			.d2l-calendar-date.d2l-calendar-date-selected {
				background-color: var(--d2l-color-celestine-plus-2);
				border: 1px solid var(--d2l-color-celestine);
				padding: 2px;
			}

			.d2l-calendar-date.d2l-calendar-date-selected:disabled {
				background-color: white;
				border-style: none;
				color: rgba(73, 76, 78, 0.5);
			}

			td:focus .d2l-calendar-date.d2l-calendar-date-selected {
				border-width: 0;
				box-shadow: 0 0 0 2px var(--d2l-color-celestine-plus-2), 0 0 0 4px var(--d2l-color-celestine);
				padding: 0;
			}

			td:focus .d2l-calendar-date.d2l-calendar-date-selected:disabled {
				box-shadow: 0 0 0 2px white, 0 0 0 4px var(--d2l-color-celestine);
				opacity: 1;
			}

			.d2l-calendar-date.d2l-calendar-date-today,
			.d2l-calendar-date.d2l-calendar-date-selected:enabled {
				font-size: 1rem;
				font-weight: 700;
			}
		`];
	}

	constructor() {
		super();

		this._isInitialFocusDate = true;
		this._monthNav = 'initial';
		this._namespace = 'components.calendar';
		this._tableInfoId = getUniqueId();
		getCalendarData();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this.minValue && this.maxValue && (getDateFromISODate(this.minValue).getTime() > getDateFromISODate(this.maxValue).getTime())) {
			throw new RangeError('d2l-calendar component expects min-value to be before max-value');
		}

		const dropdownContent = findComposedAncestor(
			this.parentNode,
			(node) => { return (node.tagName === 'D2L-DROPDOWN-CONTENT'); }
		);
		if (dropdownContent) this._dialog = true;

		this.addEventListener('blur', () => this._isInitialFocusDate = true);

		this.addEventListener('d2l-localize-resources-change', () => {
			calendarData = null;
			getCalendarData(true);
			this.requestUpdate();
		});

		this._today = getDateFromDateObj(getToday());
		if (this.selectedValue) this._getInitialFocusDate();
		else this.reset();

	}

	render() {
		if (this._shownMonth === undefined || !this._shownYear) {
			return html``;
		}

		const weekdayHeaders = calendarData.daysOfWeekIndex.map((index) => html`
			<th>
				<abbr class="d2l-body-small" title="${calendarData.descriptor.calendar.days.long[index]}">
					${calendarData.descriptor.calendar.days.short[index]}
				</abbr>
			</th>
		`);

		const dates = getDatesInMonthArray(this._shownMonth, this._shownYear);
		const dayRows = dates.map((week) => {
			const weekHtml = week.map((day, index) => {
				const disabled = !isDateInRange(day, getDateFromISODate(this.minValue), getDateFromISODate(this.maxValue));
				const focused = checkIfDatesEqual(day, this._focusDate);
				const selected = this.selectedValue ? checkIfDatesEqual(day, getDateFromISODate(this.selectedValue)) : false;
				const classes = {
					'd2l-calendar-date': true,
					'd2l-calendar-date-initial': this._isInitialFocusDate,
					'd2l-calendar-date-selected': selected,
					'd2l-calendar-date-today': checkIfDatesEqual(day, this._today)
				};
				const year = day.getFullYear();
				const month = day.getMonth();
				const date = day.getDate();
				const weekday = calendarData.descriptor.calendar.days.long[calendarData.daysOfWeekIndex[index]];
				const description = `${weekday} ${date} ${formatDate(day, { format: 'monthYear' })}`;
				return html`
					<td
						aria-selected="${selected ? 'true' : 'false'}"
						data-date=${date}
						data-month=${month}
						data-year=${year}
						@keydown="${this._onKeyDown}"
						role="gridcell"
						tabindex=${focused ? '0' : '-1'}>
						<button
							aria-label="${description}"
							class="${classMap(classes)}"
							@click="${this._onDateSelected}"
							?disabled="${disabled}"
							tabindex="-1"
							type="button">
							${date}
						</button>
					</td>`;
			});

			return html`<tr>${weekHtml}</tr>`;
		});
		const summary = this.summary ? html`<caption class="d2l-offscreen">${this.summary}</caption>` : '';
		const calendarClasses = {
			'd2l-calendar': true,
			'd2l-calendar-animating': (this._monthNav === 'next' || this._monthNav === 'next-updown' || this._monthNav === 'prev' || this._monthNav === 'prev-updown' || this._monthNav === 'initial'),
			'd2l-calendar-initial-month': this._monthNav === 'initial',
			'd2l-calendar-next': this._monthNav === 'next',
			'd2l-calendar-next-updown': this._monthNav === 'next-updown',
			'd2l-calendar-prev': this._monthNav === 'prev',
			'd2l-calendar-prev-updown': this._monthNav === 'prev-updown'
		};
		const labelId = `${this._tableInfoId}-heading`;
		const heading = formatDate(new Date(this._shownYear, this._shownMonth, 1), { format: 'monthYear' });
		const regionLabel = this.label ? `${this.label}. ${heading}` : heading;
		const role = this._dialog ? 'dialog' : undefined;
		return html`
			<div role="region" aria-label="${regionLabel}">
				<div class="${classMap(calendarClasses)}" role="${ifDefined(role)}">
					<div role="application">
						<div class="d2l-calendar-title">
							<d2l-button-icon
								@click="${this._onPrevMonthButtonClick}"
								text="${this._computeText(getPrevMonth(this._shownMonth))}"
								icon="tier1:chevron-left">
							</d2l-button-icon>
							<div aria-atomic="true" aria-live="polite" class="d2l-heading-4" id="${labelId}">${heading}</div>
							<d2l-button-icon
								@click="${this._onNextMonthButtonClick}"
								text="${this._computeText(getNextMonth(this._shownMonth))}"
								icon="tier1:chevron-right">
							</d2l-button-icon>
						</div>
						<table aria-labelledby="${labelId}">
							${summary}
							<thead aria-hidden="true">
								<tr>${weekdayHeaders}</tr>
							</thead>
							<tbody>
								${dayRows}
							</tbody>
						</table>
					</div>
					<slot></slot>
				</div>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach(async(oldVal, prop) => {
			if ((prop === '_shownMonth' || prop === '_shownYear') && this._keyboardTriggeredMonthChange) {
				this._focusDateAddFocus();
			} else if (prop === 'selectedValue' && this.selectedValue) {
				const selectedDate = getDateFromISODate(this.selectedValue);
				if (!this._focusDate || !checkIfDatesEqual(this._focusDate, selectedDate)) {
					await this.updateComplete;
					await this._updateFocusDateOnChange();
				}
				this._dateSelected = false;
			}
		});
	}

	async focus() {
		if (this._dialog) {
			await this.updateComplete;
			this._focusDateAddFocus();
		} else {
			const button = this.shadowRoot && this.shadowRoot.querySelector('d2l-button-icon');
			if (button) button.focus();
		}
	}

	async reset(allowDisabled) {
		const date = this._getInitialFocusDate();
		await this._updateFocusDate(date, false, allowDisabled);
	}

	_computeText(month) {
		return this.localize(`${this._namespace}.show`, { month: calendarData.descriptor.calendar.months.long[month] });
	}

	async _focusDateAddFocus() {
		this._keyboardTriggeredMonthChange = false;
		if (!this._focusDate) return;
		const date = await this._getDateElement(this._focusDate);
		if (date) {
			date.focus();
		}
	}

	async _getDateElement(date) {
		await this.updateComplete;
		return this.shadowRoot && this.shadowRoot.querySelector(`td[data-date="${date.getDate()}"][data-month="${date.getMonth()}"][data-year="${date.getFullYear()}"]`);
	}

	_getInitialFocusDate() {
		let date;
		if (this.selectedValue) date = getDateFromISODate(this.selectedValue);
		else date = getDateFromISODate(getClosestValidDate(this.minValue, this.maxValue, false));
		this._shownMonth = date.getMonth();
		this._shownYear = date.getFullYear();
		return date;
	}

	_monthDecrease() {
		if (this._shownMonth === 0) this._shownYear--;
		this._shownMonth = getPrevMonth(this._shownMonth);
	}

	_monthIncrease() {
		if (this._shownMonth === 11) this._shownYear++;
		this._shownMonth = getNextMonth(this._shownMonth);
	}

	async _onDateSelected(e) {
		let selectedDate = e.composedPath()[0];
		if (selectedDate.tagName === 'BUTTON') selectedDate = selectedDate.parentNode;
		const year = selectedDate.getAttribute('data-year');
		const month = selectedDate.getAttribute('data-month');
		const date = selectedDate.getAttribute('data-date');

		this.selectedValue = formatDateInISO({ year: year, month: (parseInt(month) + 1), date: date });
		this._dateSelected = true;

		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: { date: this.selectedValue }
		};
		/** Dispatched when a date is selected through click, space, or enter. "e.detail.date" is in ISO 8601 calendar date format ("YYYY-MM-DD"). */
		this.dispatchEvent(new CustomEvent('d2l-calendar-selected', eventDetails));
	}

	async _onKeyDown(e) {
		const rootTarget = e.composedPath()[0];
		if (rootTarget.tagName !== 'TD') return;

		let preventDefault = false;

		switch (e.keyCode) {
			case keyCodes.ENTER:
			case keyCodes.SPACE:
				preventDefault = true;
				this._onDateSelected(e);
				break;
			case keyCodes.DOWN:
				preventDefault = true;
				await this._onKeyDownUpdateFocusDate(daysInWeek);
				break;
			case keyCodes.UP:
				preventDefault = true;
				await this._onKeyDownUpdateFocusDate(-daysInWeek);
				break;
			case keyCodes.LEFT:
				preventDefault = true; // needed for voiceover in safari to properly read aria-label on dates
				await this._onKeyDownUpdateFocusDate(this.dir === 'rtl' ? 1 : -1);
				break;
			case keyCodes.RIGHT:
				preventDefault = true; // needed for voiceover in safari to properly read aria-label on dates
				await this._onKeyDownUpdateFocusDate(this.dir === 'rtl' ? -1 : 1);
				break;
			case keyCodes.HOME: {
				preventDefault = true;
				let numDaysChange;
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
				const possibleFocusDate = new Date(
					this._focusDate.getFullYear(),
					this._focusDate.getMonth(),
					this._focusDate.getDate() + numDaysChange
				);
				await this._updateFocusDate(possibleFocusDate);
				await this._showFocusDateMonth(new Date(this._focusDate), true);
				break;
			} case keyCodes.END: {
				preventDefault = true;
				let numDaysChange;
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
				const possibleFocusDate = new Date(
					this._focusDate.getFullYear(),
					this._focusDate.getMonth(),
					this._focusDate.getDate() + numDaysChange
				);
				await this._updateFocusDate(possibleFocusDate, true);
				await this._showFocusDateMonth(new Date(this._focusDate), true);
				break;
			} case keyCodes.PAGEUP: {
				const diff = getNumberOfDaysToSameWeekPrevMonth(this._shownMonth, this._shownYear);

				const possibleFocusDate = new Date(this._focusDate);
				possibleFocusDate.setDate(possibleFocusDate.getDate() - diff);
				this._keyboardTriggeredMonthChange = true;

				// handle when current month has more weeks than previous month and page up pressed from last week
				if (possibleFocusDate.getMonth() === this._shownMonth) possibleFocusDate.setDate(possibleFocusDate.getDate() - 7);

				this._monthDecrease();
				this._triggerMonthChangeAnimations(false, true, true);
				const canUpdateFocusDate = await this._updateFocusDate(possibleFocusDate);
				if (!canUpdateFocusDate) this._focusDate = undefined;
				if (this._focusDate) this._focusDateAddFocus();
				else {
					const buttons = this.shadowRoot && this.shadowRoot.querySelectorAll('d2l-button-icon');
					if (buttons && buttons.length > 0) buttons[0].focus();
				}
				preventDefault = true;
				break;
			} case keyCodes.PAGEDOWN: {
				const nextMonth = getNextMonth(this._shownMonth);
				const diff = getNumberOfDaysToSameWeekPrevMonth(nextMonth, this._shownYear);

				const possibleFocusDate = new Date(this._focusDate);

				possibleFocusDate.setDate(possibleFocusDate.getDate() + diff);
				this._keyboardTriggeredMonthChange = true;

				// handle when current month has more weeks than next month and page down pressed from last week
				const newFocusDateMonth = possibleFocusDate.getMonth();
				if ((newFocusDateMonth - this._shownMonth) > 1
					|| (newFocusDateMonth === 1 && this._shownMonth === 11)
				) {
					possibleFocusDate.setDate(possibleFocusDate.getDate() - 7);
				}
				this._monthIncrease();
				this._triggerMonthChangeAnimations(true, true, true);
				const canUpdateFocusDate = await this._updateFocusDate(possibleFocusDate, true);
				if (!canUpdateFocusDate) this._focusDate = undefined;
				if (this._focusDate) this._focusDateAddFocus();
				else {
					const buttons = this.shadowRoot && this.shadowRoot.querySelectorAll('d2l-button-icon');
					if (buttons && buttons.length > 1) buttons[1].focus();
				}
				preventDefault = true;
				break;
			}
		}

		if (preventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	async _onKeyDownUpdateFocusDate(numDaysChange) {
		const possibleFocusDate = new Date(
			this._focusDate.getFullYear(),
			this._focusDate.getMonth(),
			this._focusDate.getDate() + numDaysChange
		);
		const oldFocusDate = new Date(this._focusDate);
		if (!isDateInRange(possibleFocusDate, getDateFromISODate(this.minValue), getDateFromISODate(this.maxValue))) {
			// if date is not in range but we are in a dialog, _focusDate should become min or max date if possible
			if (!this._dialog) return;

			if (numDaysChange > 0 && getDateFromISODate(this.minValue) > possibleFocusDate) this._focusDate = getDateFromISODate(this.minValue);
			else if (numDaysChange < 0 && getDateFromISODate(this.maxValue) < possibleFocusDate) this._focusDate = getDateFromISODate(this.maxValue);
			else return;
			this._keyboardTriggeredMonthChange = true;
			if (this._focusDate.getMonth() !== this._shownMonth || this._focusDate.getFullYear() !== this._shownYear) {
				this._shownMonth = this._focusDate.getMonth();
				this._shownYear = this._focusDate.getFullYear();
				this._triggerMonthChangeAnimations(oldFocusDate < possibleFocusDate, true, Math.abs(numDaysChange) !== 1);
			} else await this._focusDateAddFocus();
			return;
		}
		else this._focusDate = possibleFocusDate;
		await this._showFocusDateMonth(oldFocusDate, Math.abs(numDaysChange) !== 1);
	}

	async _onNextMonthButtonClick() {
		this._monthIncrease();
		this._triggerMonthChangeAnimations(true);
		await this._updateFocusDateOnChange();
	}

	async _onPrevMonthButtonClick() {
		this._monthDecrease();
		this._triggerMonthChangeAnimations(false);
		await this._updateFocusDateOnChange();
	}

	async _showFocusDateMonth(prevFocusDate, upDownAnimation) {
		this._isInitialFocusDate = false;
		const date = await this._getDateElement(this._focusDate);
		if (!date) {
			this._keyboardTriggeredMonthChange = true;
			let increase;
			if (prevFocusDate < this._focusDate) {
				increase = true;
				this._monthIncrease();
			} else {
				increase = false;
				this._monthDecrease();
			}
			this._triggerMonthChangeAnimations(increase, true, upDownAnimation);
		} else {
			this._focusDateAddFocus();
		}
	}

	_triggerMonthChangeAnimations(increase, keyboardTriggered, transitionUpDown) {
		this._monthNav = undefined;
		increase = this.dir === 'rtl' ? !increase : increase;
		if (!keyboardTriggered) this._isInitialFocusDate = true;
		if (!reduceMotion) {
			setTimeout(() => {
				this._monthNav = `${increase ? 'next' : 'prev'}${transitionUpDown ? '-updown' : ''}`;
			}, 100); // timeout for firefox
		}
	}

	async _updateFocusDate(possibleFocusDate, latestPossibleFocusDate, allowDisabled) {
		const possibleFocusDateInRange = isDateInRange(possibleFocusDate, getDateFromISODate(this.minValue), getDateFromISODate(this.maxValue));
		if ((!this.minValue && !this.maxValue) || possibleFocusDateInRange || allowDisabled) {
			this._focusDate = possibleFocusDate;
			return true;
		}

		await this.updateComplete; // for case of keyboard navigation where second month contains no enabled dates
		if (this.shadowRoot && this.shadowRoot.querySelector('.d2l-calendar-date:enabled')) {
			const validDates = this.shadowRoot.querySelectorAll('.d2l-calendar-date:enabled');
			const focusDate = validDates[latestPossibleFocusDate ? (validDates.length - 1) : 0].parentNode;
			const year = focusDate.getAttribute('data-year');
			const month = focusDate.getAttribute('data-month');
			const date = focusDate.getAttribute('data-date');
			this._focusDate = new Date(year, month, date);
			return true;
		} else {
			return false;
		}
	}

	async _updateFocusDateOnChange() {
		const selectedValueDate = this.selectedValue ? getDateFromISODate(this.selectedValue) : null;
		const dateElem = selectedValueDate ? await this._getDateElement(selectedValueDate) : null;
		await this._updateFocusDate(dateElem ? selectedValueDate : new Date(this._shownYear, this._shownMonth, 1));

		if (this._dateSelected) {
			this._focusDateAddFocus();
			this._dateSelected = false;
		}
	}

}
customElements.define('d2l-calendar', Calendar);
